import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { CreateCategoriaServicioDto } from './dto/create-categoria-servicio.dto';

@Injectable()
export class ServiciosService {
  constructor(private prisma: PrismaService) {}

  // ----------------------------------------------------------------
  // Crear un nuevo servicio
  // ----------------------------------------------------------------
  async create(createServicioDto: CreateServicioDto) {
    const {
      nombre,
      descripcion,
      precio,
      activo = true,
      id_categoria,
    } = createServicioDto;

    if (precio < 0.01) {
      throw new BadRequestException('El precio minimo debe ser 0.01');
    }

    const id_servicio = this.generarIdServicio();

    await this.prisma.$executeRaw`
      INSERT INTO servicios (id_servicio, nombre, descripcion, precio, activo, id_categoria)
      VALUES (${id_servicio}, ${nombre}, ${descripcion}, ${precio}, ${activo}, ${id_categoria ?? null})
    `;

    return { id_servicio, nombre, descripcion, precio, activo, id_categoria };
  }

  // ----------------------------------------------------------------
  // Obtener todos los servicios
  // ----------------------------------------------------------------
  async findAll(page?: string, limit?: string) {
    const { take, skip, currentPage } = this.getPagination(page, limit);

    const servicios = await this.prisma.$queryRaw`
      SELECT
        s.id_servicio,
        s.nombre,
        s.descripcion,
        s.precio,
        s.activo,
        s.id_categoria,
        c.nombre AS nombre_categoria
      FROM servicios s
      LEFT JOIN categorias_servicios c ON c.id_categoria = s.id_categoria
      ORDER BY s.nombre ASC
      LIMIT ${take} OFFSET ${skip}
    `;

    const totalResult = await this.prisma.$queryRaw`
      SELECT COUNT(*)::int AS total FROM servicios
    `;
    const total = Array.isArray(totalResult) ? (totalResult[0]?.total ?? 0) : 0;

    return {
      data: servicios,
      pagination: { page: currentPage, limit: take, total },
    };
  }

  // ----------------------------------------------------------------
  // Obtener un servicio por ID
  // ----------------------------------------------------------------
  async findOne(id: string) {
    const servicios = await this.prisma.$queryRaw`
      SELECT
        s.id_servicio,
        s.nombre,
        s.descripcion,
        s.precio,
        s.activo,
        s.id_categoria,
        c.nombre AS nombre_categoria
      FROM servicios s
      LEFT JOIN categorias_servicios c ON c.id_categoria = s.id_categoria
      WHERE s.id_servicio = ${id}
      LIMIT 1
    `;

    const servicio = Array.isArray(servicios) ? servicios[0] : null;
    if (!servicio)
      throw new NotFoundException(ERROR_MESSAGES.servicio.noEncontrado(id));

    return servicio;
  }

  // ----------------------------------------------------------------
  // Actualizar un servicio existente
  // ----------------------------------------------------------------
  async update(id: string, updateServicioDto: UpdateServicioDto) {
    await this.findOne(id); // lanza NotFoundException si no existe

    const { nombre, descripcion, precio, activo, id_categoria } =
      updateServicioDto;

    if (
      !nombre &&
      !descripcion &&
      precio === undefined &&
      activo === undefined &&
      id_categoria === undefined
    ) {
      throw new BadRequestException(
        'Debe enviar al menos un campo para actualizar',
      );
    }

    if (nombre !== undefined) {
      await this.prisma.$executeRaw`
        UPDATE servicios SET nombre = ${nombre} WHERE id_servicio = ${id}
      `;
    }

    if (descripcion !== undefined) {
      await this.prisma.$executeRaw`
        UPDATE servicios SET descripcion = ${descripcion} WHERE id_servicio = ${id}
      `;
    }

    if (precio !== undefined) {
      if (precio < 0.01) {
        throw new BadRequestException('El precio minimo debe ser 0.01');
      }
      await this.prisma.$executeRaw`
        UPDATE servicios SET precio = ${precio} WHERE id_servicio = ${id}
      `;
    }

    if (activo !== undefined) {
      await this.prisma.$executeRaw`
        UPDATE servicios SET activo = ${activo} WHERE id_servicio = ${id}
      `;
    }

    if (id_categoria !== undefined) {
      await this.prisma.$executeRaw`
        UPDATE servicios SET id_categoria = ${id_categoria} WHERE id_servicio = ${id}
      `;
    }

    return this.findOne(id);
  }

  // ----------------------------------------------------------------
  // Eliminar un servicio
  // ----------------------------------------------------------------
  async remove(id: string) {
    await this.findOne(id); // lanza NotFoundException si no existe

    await this.prisma.$executeRaw`
      UPDATE servicios SET activo = false WHERE id_servicio = ${id}
    `;

    return { message: `Servicio '${id}' desactivado exitosamente` };
  }

  // ----------------------------------------------------------------
  // Buscar servicios por rango de precio
  // ----------------------------------------------------------------
  async findByRangoPrecio(precioMin: number, precioMax: number) {
    if (precioMin > precioMax) {
      throw new BadRequestException(
        'El precio mínimo no puede ser mayor al precio máximo',
      );
    }

    const servicios = await this.prisma.$queryRaw`
      SELECT id_servicio, nombre, descripcion, precio, activo, id_categoria
      FROM servicios
      WHERE precio BETWEEN ${precioMin} AND ${precioMax}
      ORDER BY precio ASC
    `;

    return servicios;
  }

  // ----------------------------------------------------------------
  // Buscar servicios por nombre con paginacion
  // ----------------------------------------------------------------
  async buscarPorNombre(nombre: string, page?: string, limit?: string) {
    if (!nombre?.trim()) {
      throw new BadRequestException('Debe enviar un nombre para buscar');
    }

    const { take, skip, currentPage } = this.getPagination(page, limit);
    const patron = `%${nombre.trim()}%`;

    const servicios = await this.prisma.$queryRaw`
      SELECT
        s.id_servicio,
        s.nombre,
        s.descripcion,
        s.precio,
        s.activo,
        s.id_categoria,
        c.nombre AS nombre_categoria
      FROM servicios s
      LEFT JOIN categorias_servicios c ON c.id_categoria = s.id_categoria
      WHERE s.nombre ILIKE ${patron}
      ORDER BY s.nombre ASC
      LIMIT ${take} OFFSET ${skip}
    `;

    const totalResult = await this.prisma.$queryRaw`
      SELECT COUNT(*)::int AS total
      FROM servicios
      WHERE nombre ILIKE ${patron}
    `;
    const total = Array.isArray(totalResult) ? (totalResult[0]?.total ?? 0) : 0;

    return {
      data: servicios,
      pagination: { page: currentPage, limit: take, total },
    };
  }

  async cambiarActivo(id: string, activo: boolean) {
    await this.findOne(id);

    await this.prisma.$executeRaw`
      UPDATE servicios SET activo = ${activo} WHERE id_servicio = ${id}
    `;

    return this.findOne(id);
  }

  async createCategoria(createCategoriaDto: CreateCategoriaServicioDto) {
    const { nombre, descripcion, activo = true } = createCategoriaDto;
    const id_categoria = this.generarIdCategoria();

    await this.prisma.$executeRaw`
      INSERT INTO categorias_servicios (id_categoria, nombre, descripcion, activo)
      VALUES (${id_categoria}, ${nombre}, ${descripcion ?? null}, ${activo})
    `;

    return { id_categoria, nombre, descripcion: descripcion ?? null, activo };
  }

  async findCategorias() {
    return this.prisma.$queryRaw`
      SELECT id_categoria, nombre, descripcion, activo
      FROM categorias_servicios
      ORDER BY nombre ASC
    `;
  }

  // ----------------------------------------------------------------
  // Helper: generar ID único para servicio
  // ----------------------------------------------------------------
  private generarIdServicio(): string {
    const shortId = uuidv4().split('-')[0].toUpperCase();
    return `SRV-${shortId}`;
  }

  private generarIdCategoria(): string {
    const shortId = uuidv4().split('-')[0].toUpperCase();
    return `CAT-${shortId}`;
  }

  private getPagination(page?: string, limit?: string) {
    const currentPage = Math.max(Number(page) || 1, 1);
    const take = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (currentPage - 1) * take;

    return { currentPage, take, skip };
  }
}
