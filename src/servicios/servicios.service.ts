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

@Injectable()
export class ServiciosService {
  constructor(private prisma: PrismaService) {}

  // ----------------------------------------------------------------
  // Crear un nuevo servicio
  // ----------------------------------------------------------------
  async create(createServicioDto: CreateServicioDto) {
    const { nombre, descripcion, precio } = createServicioDto;

    const id_servicio = this.generarIdServicio();

    await this.prisma.$executeRaw`
      INSERT INTO servicios (id_servicio, nombre, descripcion, precio)
      VALUES (${id_servicio}, ${nombre}, ${descripcion}, ${precio})
    `;

    return { id_servicio, nombre, descripcion, precio };
  }

  // ----------------------------------------------------------------
  // Obtener todos los servicios
  // ----------------------------------------------------------------
  async findAll() {
    const servicios = await this.prisma.$queryRaw`
      SELECT id_servicio, nombre, descripcion, precio
      FROM servicios
      ORDER BY nombre ASC
    `;

    return servicios;
  }

  // ----------------------------------------------------------------
  // Obtener un servicio por ID
  // ----------------------------------------------------------------
  async findOne(id: string) {
    const servicios = await this.prisma.$queryRaw`
      SELECT id_servicio, nombre, descripcion, precio
      FROM servicios
      WHERE id_servicio = ${id}
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

    const { nombre, descripcion, precio } = updateServicioDto;

    if (!nombre && !descripcion && precio === undefined) {
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
      if (precio < 0) {
        throw new BadRequestException('El precio no puede ser negativo');
      }
      await this.prisma.$executeRaw`
        UPDATE servicios SET precio = ${precio} WHERE id_servicio = ${id}
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
      DELETE FROM servicios WHERE id_servicio = ${id}
    `;

    return { message: `Servicio '${id}' eliminado exitosamente` };
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
      SELECT id_servicio, nombre, descripcion, precio
      FROM servicios
      WHERE precio BETWEEN ${precioMin} AND ${precioMax}
      ORDER BY precio ASC
    `;

    return servicios;
  }

  // ----------------------------------------------------------------
  // Helper: generar ID único para servicio
  // ----------------------------------------------------------------
  private generarIdServicio(): string {
    const shortId = uuidv4().split('-')[0].toUpperCase();
    return `SRV-${shortId}`;
  }
}
