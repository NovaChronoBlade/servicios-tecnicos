import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { RolEnum } from 'src/auth/enums/rol.enum';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';

type Actor = {
  userId?: string;
  rol?: RolEnum | string;
};

@Injectable()
export class DireccionesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDireccionDto: CreateDireccionDto, actor: Actor) {
    const id_usuario = this.resolveOwnerId(
      createDireccionDto.id_usuario,
      actor,
    );
    const id_direccion = this.generarIdDireccion();
    const es_default = createDireccionDto.es_default ?? false;

    if (es_default) {
      await this.clearDefaultForUser(id_usuario);
    }

    await this.prisma.$executeRaw`
      INSERT INTO direcciones (
        id_direccion,
        id_usuario,
        direccion,
        tipo_edificio,
        informacion,
        nota,
        es_default
      )
      VALUES (
        ${id_direccion},
        ${id_usuario},
        ${createDireccionDto.direccion},
        ${createDireccionDto.tipo_edificio},
        ${createDireccionDto.informacion ?? null},
        ${createDireccionDto.nota ?? null},
        ${es_default}
      )
    `;

    return {
      id_direccion,
      id_usuario,
      direccion: createDireccionDto.direccion,
      tipo_edificio: createDireccionDto.tipo_edificio,
      informacion: createDireccionDto.informacion ?? null,
      nota: createDireccionDto.nota ?? null,
      es_default,
    };
  }

  async findAll(actor: Actor) {
    const isAdmin = actor.rol === RolEnum.ADMIN;

    return isAdmin
      ? this.prisma.$queryRaw`
          SELECT
            d.id_direccion,
            d.id_usuario,
            d.direccion,
            d.tipo_edificio,
            d.informacion,
            d.nota,
            d.es_default
          FROM direcciones d
          ORDER BY d.es_default DESC, d.id_direccion DESC
        `
      : this.prisma.$queryRaw`
          SELECT
            d.id_direccion,
            d.id_usuario,
            d.direccion,
            d.tipo_edificio,
            d.informacion,
            d.nota,
            d.es_default
          FROM direcciones d
          WHERE d.id_usuario = ${actor.userId}
          ORDER BY d.es_default DESC, d.id_direccion DESC
        `;
  }

  async findOne(id_direccion: string, actor: Actor) {
    const direcciones = await this.prisma.$queryRaw`
      SELECT
        d.id_direccion,
        d.id_usuario,
        d.direccion,
        d.tipo_edificio,
        d.informacion,
        d.nota,
        d.es_default
      FROM direcciones d
      WHERE d.id_direccion = ${id_direccion}
      LIMIT 1
    `;

    const direccion = Array.isArray(direcciones) ? direcciones[0] : null;
    if (!direccion) {
      throw new NotFoundException(`Direccion '${id_direccion}' no encontrada`);
    }

    this.assertOwnership(direccion.id_usuario, actor);
    return direccion;
  }

  async findByUsuario(id_usuario: string, actor: Actor) {
    this.assertCanAccessUser(id_usuario, actor);

    return this.prisma.$queryRaw`
      SELECT
        d.id_direccion,
        d.id_usuario,
        d.direccion,
        d.tipo_edificio,
        d.informacion,
        d.nota,
        d.es_default
      FROM direcciones d
      WHERE d.id_usuario = ${id_usuario}
      ORDER BY d.es_default DESC, d.id_direccion DESC
    `;
  }

  async update(
    id_direccion: string,
    updateDireccionDto: UpdateDireccionDto,
    actor: Actor,
  ) {
    const direccionActual = await this.findOne(id_direccion, actor);

    if (
      updateDireccionDto.direccion === undefined &&
      updateDireccionDto.tipo_edificio === undefined &&
      updateDireccionDto.informacion === undefined &&
      updateDireccionDto.nota === undefined &&
      updateDireccionDto.es_default === undefined
    ) {
      throw new BadRequestException(
        'Debe enviar al menos un campo para actualizar',
      );
    }

    if (updateDireccionDto.es_default === true) {
      await this.clearDefaultForUser(direccionActual.id_usuario);
    }

    await this.prisma.$executeRaw`
      UPDATE direcciones
      SET
        direccion = ${updateDireccionDto.direccion ?? direccionActual.direccion},
        tipo_edificio = ${updateDireccionDto.tipo_edificio ?? direccionActual.tipo_edificio},
        informacion = ${
          updateDireccionDto.informacion ?? direccionActual.informacion ?? null
        },
        nota = ${updateDireccionDto.nota ?? direccionActual.nota ?? null},
        es_default = ${
          updateDireccionDto.es_default ?? direccionActual.es_default
        }
      WHERE id_direccion = ${id_direccion}
    `;

    return this.findOne(id_direccion, actor);
  }

  async remove(id_direccion: string, actor: Actor) {
    const direccion = await this.findOne(id_direccion, actor);

    await this.prisma.$executeRaw`
      DELETE FROM direcciones
      WHERE id_direccion = ${id_direccion}
    `;

    return {
      message: `Direccion ${direccion.id_direccion} eliminada exitosamente`,
    };
  }

  async belongsToUser(id_direccion: string, id_usuario: string) {
    const direcciones = await this.prisma.$queryRaw`
      SELECT id_direccion
      FROM direcciones
      WHERE id_direccion = ${id_direccion}
        AND id_usuario = ${id_usuario}
      LIMIT 1
    `;

    return Array.isArray(direcciones) && direcciones.length > 0;
  }

  private async clearDefaultForUser(id_usuario: string) {
    await this.prisma.$executeRaw`
      UPDATE direcciones
      SET es_default = false
      WHERE id_usuario = ${id_usuario}
    `;
  }

  private resolveOwnerId(id_usuario: string | undefined, actor: Actor) {
    if (!actor.userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    if (actor.rol === RolEnum.ADMIN) {
      return id_usuario ?? actor.userId;
    }

    if (id_usuario && id_usuario !== actor.userId) {
      throw new UnauthorizedException(
        'No puede crear direcciones para otro usuario',
      );
    }

    return actor.userId;
  }

  private assertOwnership(id_usuario: string, actor: Actor) {
    if (actor.rol === RolEnum.ADMIN) {
      return;
    }

    if (actor.userId !== id_usuario) {
      throw new UnauthorizedException(
        'No tiene permisos para acceder a esta direccion',
      );
    }
  }

  private assertCanAccessUser(id_usuario: string, actor: Actor) {
    if (actor.rol === RolEnum.ADMIN) {
      return;
    }

    if (actor.userId !== id_usuario) {
      throw new UnauthorizedException(
        'No tiene permisos para ver estas direcciones',
      );
    }
  }

  private generarIdDireccion(): string {
    return `DIR-${uuidv4().split('-')[0].toUpperCase()}`;
  }
}
