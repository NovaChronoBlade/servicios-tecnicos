import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma.service';
import { RolEnum } from 'src/auth/enums/rol.enum';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { CreateDetallesTecnicosDto } from './dto/create-detallesTecnicos.dto';
import { UpdateDetallesTecnicosDto } from './dto/update-detallesTecnicos.dto';

type Actor = {
  userId?: string;
  rol?: RolEnum | string;
};

type UsuarioFilters = {
  page?: string;
  limit?: string;
  rol?: string;
  activo?: string;
};

type TecnicosFilters = {
  page?: string;
  limit?: string;
  disponible?: string;
};

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const {
      documento,
      fecha_nacimiento,
      nombre,
      correo,
      contrasena,
      telefono,
      rol,
    } = createUsuarioDto;

    const id_usuario = this.generarIdUsuario(rol ?? RolEnum.CLIENTE);

    await this.prisma.$executeRaw`
      INSERT INTO usuarios (id_usuario, documento, fecha_nacimiento, nombre, correo, contrasena, telefono, rol)
      VALUES (${id_usuario}, ${documento}, ${fecha_nacimiento}::date, ${nombre}, ${correo}, ${contrasena}, ${telefono}, ${rol})
    `;

    return { id_usuario, ...createUsuarioDto };
  }

  async findAll(filters: UsuarioFilters = {}) {
    const { take, skip, currentPage } = this.getPagination(
      filters.page,
      filters.limit,
    );
    const { whereSql, params } = this.buildUsuarioFilters(filters);

    const usuarios = await this.prisma.$queryRawUnsafe(
      `
      SELECT
        id_usuario,
        documento,
        fecha_nacimiento,
        nombre,
        correo,
        telefono,
        rol,
        activo
      FROM usuarios
      ${whereSql}
      ORDER BY nombre ASC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `,
      ...params,
      take,
      skip,
    );

    const totalResult = await this.prisma.$queryRawUnsafe(
      `
      SELECT COUNT(*)::int AS total
      FROM usuarios
      ${whereSql}
    `,
      ...params,
    );
    const total = Array.isArray(totalResult) ? (totalResult[0]?.total ?? 0) : 0;

    return {
      data: usuarios,
      pagination: { page: currentPage, limit: take, total },
    };
  }

  async findPerfil(id: string, actor: Actor) {
    this.assertSelfOrAdmin(id, actor);
    return this.findOnePublic(id);
  }

  async findTecnicos(filters: TecnicosFilters = {}) {
    const { take, skip, currentPage } = this.getPagination(
      filters.page,
      filters.limit,
    );
    const disponible = this.parseOptionalBoolean(filters.disponible);

    const whereDisponibilidad =
      disponible === undefined ? '' : 'AND dt.disponible = $1';
    const params = disponible === undefined ? [] : [disponible];

    const tecnicos = await this.prisma.$queryRawUnsafe(
      `
      SELECT
        u.id_usuario,
        u.nombre,
        u.correo,
        u.telefono,
        u.activo,
        dt.especialidad,
        dt.licencia_profesional,
        dt.disponible,
        dt.calificacion_promedio
      FROM usuarios u
      JOIN detalles_tecnicos dt ON dt.id_usuario = u.id_usuario
      WHERE u.rol = 'tecnico'
        AND u.activo = true
        ${whereDisponibilidad}
      ORDER BY dt.calificacion_promedio DESC, u.nombre ASC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `,
      ...params,
      take,
      skip,
    );

    const totalResult = await this.prisma.$queryRawUnsafe(
      `
      SELECT COUNT(*)::int AS total
      FROM usuarios u
      JOIN detalles_tecnicos dt ON dt.id_usuario = u.id_usuario
      WHERE u.rol = 'tecnico'
        AND u.activo = true
        ${whereDisponibilidad}
    `,
      ...params,
    );
    const total = Array.isArray(totalResult) ? (totalResult[0]?.total ?? 0) : 0;

    return {
      data: tecnicos,
      pagination: { page: currentPage, limit: take, total },
    };
  }

  async updatePerfil(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
    actor: Actor,
  ) {
    this.assertSelfOrAdmin(id, actor);
    await this.findOne(id);

    const camposPermitidos = {
      nombre: updateUsuarioDto.nombre,
      fecha_nacimiento: updateUsuarioDto.fecha_nacimiento,
      correo: updateUsuarioDto.correo,
      telefono: updateUsuarioDto.telefono,
    };

    if (Object.values(camposPermitidos).every((value) => value === undefined)) {
      throw new BadRequestException(
        'Debe enviar al menos un campo permitido para actualizar',
      );
    }

    if (camposPermitidos.nombre !== undefined) {
      await this.prisma.$executeRaw`
        UPDATE usuarios SET nombre = ${camposPermitidos.nombre}
        WHERE id_usuario = ${id}
      `;
    }

    if (camposPermitidos.fecha_nacimiento !== undefined) {
      await this.prisma.$executeRaw`
        UPDATE usuarios SET fecha_nacimiento = ${camposPermitidos.fecha_nacimiento}::date
        WHERE id_usuario = ${id}
      `;
    }

    if (camposPermitidos.correo !== undefined) {
      await this.prisma.$executeRaw`
        UPDATE usuarios SET correo = ${camposPermitidos.correo}
        WHERE id_usuario = ${id}
      `;
    }

    if (camposPermitidos.telefono !== undefined) {
      await this.prisma.$executeRaw`
        UPDATE usuarios SET telefono = ${camposPermitidos.telefono}
        WHERE id_usuario = ${id}
      `;
    }

    return this.findOnePublic(id);
  }

  async desactivar(id: string) {
    await this.findOne(id);

    await this.prisma.$executeRaw`
      UPDATE usuarios
      SET activo = false
      WHERE id_usuario = ${id}
    `;

    return { message: `Usuario ${id} desactivado exitosamente` };
  }

  async agregarDatosTecnicos(
    agregarDetallesTecnicosDto: CreateDetallesTecnicosDto,
    id_tecnico: string,
    actor?: Actor,
  ) {
    this.assertSelfOrAdmin(id_tecnico, actor);
    const tecnico = await this.findOne(id_tecnico);

    if (tecnico.rol !== RolEnum.TECNICO && tecnico.rol !== RolEnum.ADMIN) {
      throw new BadRequestException(
        ERROR_MESSAGES.usuario.rolInvalido(id_tecnico, RolEnum.TECNICO),
      );
    }

    const detallesExistentes = await this.prisma.$queryRaw`
      SELECT id_usuario
      FROM detalles_tecnicos
      WHERE id_usuario = ${id_tecnico}
      LIMIT 1
    `;
    if (Array.isArray(detallesExistentes) && detallesExistentes.length > 0) {
      throw new BadRequestException(
        `El tecnico '${id_tecnico}' ya tiene datos tecnicos registrados`,
      );
    }

    const {
      especialidad,
      licencia_profesional,
      disponible = true,
      calificacion_promedio = 0,
    } = agregarDetallesTecnicosDto;

    await this.prisma.$executeRaw`
      INSERT INTO detalles_tecnicos (
        id_usuario,
        especialidad,
        licencia_profesional,
        disponible,
        calificacion_promedio
      )
      VALUES (
        ${id_tecnico},
        ${especialidad},
        ${licencia_profesional},
        ${disponible},
        ${calificacion_promedio}
      )
    `;

    return {
      message: `Datos tecnicos agregados para el tecnico ${id_tecnico}`,
      id_tecnico,
      especialidad,
      licencia_profesional,
      disponible,
      calificacion_promedio,
    };
  }

  async updateDetallesTecnicos(
    id_tecnico: string,
    updateDetallesTecnicosDto: UpdateDetallesTecnicosDto,
    actor?: Actor,
  ) {
    this.assertSelfOrAdmin(id_tecnico, actor);
    await this.findOne(id_tecnico);

    const detalles = await this.findDetallesTecnicos(id_tecnico);
    const {
      especialidad,
      licencia_profesional,
      disponible,
      calificacion_promedio,
    } = updateDetallesTecnicosDto;

    if (
      especialidad === undefined &&
      licencia_profesional === undefined &&
      disponible === undefined &&
      calificacion_promedio === undefined
    ) {
      throw new BadRequestException(
        'Debe enviar al menos un campo de datos tecnicos para actualizar',
      );
    }

    await this.prisma.$executeRaw`
      UPDATE detalles_tecnicos
      SET
        especialidad = ${especialidad ?? detalles.especialidad},
        licencia_profesional = ${licencia_profesional ?? detalles.licencia_profesional},
        disponible = ${disponible ?? detalles.disponible},
        calificacion_promedio = ${calificacion_promedio ?? detalles.calificacion_promedio}
      WHERE id_usuario = ${id_tecnico}
    `;

    return this.findDetallesTecnicos(id_tecnico);
  }

  async findOne(id: string) {
    const usuarios = await this.prisma.$queryRaw`
      SELECT * FROM usuarios
      WHERE id_usuario = ${id}
      LIMIT 1
    `;

    const usuario = Array.isArray(usuarios) ? usuarios[0] : null;
    if (!usuario)
      throw new NotFoundException(ERROR_MESSAGES.usuario.noEncontrado(id));

    return usuario;
  }

  async findOnePublic(id: string) {
    const usuarios = await this.prisma.$queryRaw`
      SELECT
        id_usuario,
        documento,
        fecha_nacimiento,
        nombre,
        correo,
        telefono,
        rol,
        activo
      FROM usuarios
      WHERE id_usuario = ${id}
      LIMIT 1
    `;

    const usuario = Array.isArray(usuarios) ? usuarios[0] : null;
    if (!usuario)
      throw new NotFoundException(ERROR_MESSAGES.usuario.noEncontrado(id));

    return usuario;
  }

  async remove(id: string) {
    return this.desactivar(id);
  }

  async findByCorreo(correo: string) {
    const usuarios = await this.prisma.$queryRaw`
        SELECT *
        FROM usuarios
        WHERE correo = ${correo}
        LIMIT 1
      `;

    return Array.isArray(usuarios) ? (usuarios[0] ?? null) : null;
  }

  async findByDocumento(documento: string) {
    const usuarios = await this.prisma.$queryRaw`
        SELECT *
        FROM usuarios
        WHERE documento = ${documento}
        LIMIT 1
      `;

    return Array.isArray(usuarios) ? (usuarios[0] ?? null) : null;
  }

  async findByTelefono(telefono: string) {
    const usuarios = await this.prisma.$queryRaw`
        SELECT *
        FROM usuarios
        WHERE telefono = ${telefono}
        LIMIT 1
      `;
    return Array.isArray(usuarios) ? (usuarios[0] ?? null) : null;
  }

  private async findDetallesTecnicos(id_tecnico: string) {
    const detalles = await this.prisma.$queryRaw`
      SELECT
        id_usuario,
        especialidad,
        licencia_profesional,
        disponible,
        calificacion_promedio
      FROM detalles_tecnicos
      WHERE id_usuario = ${id_tecnico}
      LIMIT 1
    `;

    const detalle = Array.isArray(detalles) ? detalles[0] : null;
    if (!detalle) {
      throw new NotFoundException(
        `Datos tecnicos del tecnico '${id_tecnico}' no encontrados`,
      );
    }

    return detalle;
  }

  private assertSelfOrAdmin(id_usuario: string, actor?: Actor) {
    if (actor?.rol === RolEnum.ADMIN) {
      return;
    }

    if (!actor?.userId || actor.userId !== id_usuario) {
      throw new ForbiddenException(
        'Solo el propio usuario o un administrador puede realizar esta accion',
      );
    }
  }

  private buildUsuarioFilters(filters: UsuarioFilters) {
    const clauses: string[] = [];
    const params: unknown[] = [];

    if (filters.rol) {
      if (!Object.values(RolEnum).includes(filters.rol as RolEnum)) {
        throw new BadRequestException(
          `Rol invalido. Roles permitidos: ${Object.values(RolEnum).join(', ')}`,
        );
      }
      params.push(filters.rol);
      clauses.push(`rol = $${params.length}`);
    }

    const activo = this.parseOptionalBoolean(filters.activo);
    if (activo !== undefined) {
      params.push(activo);
      clauses.push(`activo = $${params.length}`);
    }

    return {
      whereSql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
      params,
    };
  }

  private parseOptionalBoolean(value?: string) {
    if (value === undefined) return undefined;
    if (value === 'true') return true;
    if (value === 'false') return false;

    throw new BadRequestException('El valor booleano debe ser true o false');
  }

  private getPagination(page?: string, limit?: string) {
    const currentPage = Math.max(Number(page) || 1, 1);
    const take = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (currentPage - 1) * take;

    return { currentPage, take, skip };
  }

  private generarIdUsuario(rol: RolEnum): string {
    const prefijos = {
      [RolEnum.CLIENTE]: 'USR-CLI',
      [RolEnum.TECNICO]: 'USR-TEC',
      [RolEnum.ADMIN]: 'USR-ADM',
    };
    const shortId = uuidv4().split('-')[0];
    return `${prefijos[rol]}-${shortId}`;
  }
}
