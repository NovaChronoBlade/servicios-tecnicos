import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RolEnum } from 'src/auth/enums/rol.enum';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateDisponibilidadDto } from './dto/create-disponibilidad.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';

type Actor = {
  userId?: string;
  rol?: RolEnum | string;
};

@Injectable()
export class DisponibilidadService {
  constructor(private prisma: PrismaService) {}

  async findByTecnico(idTecnico: string, actor?: Actor) {
    this.assertCanRead(idTecnico, actor);

    return this.prisma.$queryRaw`
      SELECT
        id_disponibilidad,
        id_tecnico,
        dia_semana,
        to_char(hora_inicio, 'HH24:MI') AS hora_inicio,
        to_char(hora_fin, 'HH24:MI') AS hora_fin,
        activo,
        nota,
        created_at,
        updated_at
      FROM disponibilidad_tecnicos
      WHERE id_tecnico = ${idTecnico}
      ORDER BY dia_semana ASC, hora_inicio ASC
    `;
  }

  async create(
    idTecnico: string,
    createDto: CreateDisponibilidadDto,
    actor?: Actor,
  ) {
    this.assertSelfOrAdmin(idTecnico, actor);
    await this.assertTecnicoExists(idTecnico);
    this.assertValidTimeRange(createDto.hora_inicio, createDto.hora_fin);

    const idDisponibilidad = this.generateId();

    await this.prisma.$executeRaw`
      INSERT INTO disponibilidad_tecnicos (
        id_disponibilidad,
        id_tecnico,
        dia_semana,
        hora_inicio,
        hora_fin,
        activo,
        nota
      )
      VALUES (
        ${idDisponibilidad},
        ${idTecnico},
        ${createDto.dia_semana},
        ${createDto.hora_inicio}::time,
        ${createDto.hora_fin}::time,
        ${createDto.activo ?? true},
        ${createDto.nota ?? null}
      )
    `;

    return this.findOne(idDisponibilidad, actor);
  }

  async update(
    idDisponibilidad: string,
    updateDto: UpdateDisponibilidadDto,
    actor?: Actor,
  ) {
    const current = await this.findOne(idDisponibilidad, actor);
    this.assertSelfOrAdmin(current.id_tecnico, actor);

    const nextInicio = updateDto.hora_inicio ?? current.hora_inicio;
    const nextFin = updateDto.hora_fin ?? current.hora_fin;
    this.assertValidTimeRange(nextInicio, nextFin);

    await this.prisma.$executeRaw`
      UPDATE disponibilidad_tecnicos
      SET
        dia_semana = ${updateDto.dia_semana ?? current.dia_semana},
        hora_inicio = ${nextInicio}::time,
        hora_fin = ${nextFin}::time,
        activo = ${updateDto.activo ?? current.activo},
        nota = ${updateDto.nota ?? current.nota},
        updated_at = NOW()
      WHERE id_disponibilidad = ${idDisponibilidad}
    `;

    return this.findOne(idDisponibilidad, actor);
  }

  async remove(idDisponibilidad: string, actor?: Actor) {
    const current = await this.findOne(idDisponibilidad, actor);
    this.assertSelfOrAdmin(current.id_tecnico, actor);

    await this.prisma.$executeRaw`
      DELETE FROM disponibilidad_tecnicos
      WHERE id_disponibilidad = ${idDisponibilidad}
    `;

    return { message: `Bloque '${idDisponibilidad}' eliminado exitosamente` };
  }

  private async findOne(idDisponibilidad: string, actor?: Actor) {
    const bloques = await this.prisma.$queryRaw`
      SELECT
        id_disponibilidad,
        id_tecnico,
        dia_semana,
        to_char(hora_inicio, 'HH24:MI') AS hora_inicio,
        to_char(hora_fin, 'HH24:MI') AS hora_fin,
        activo,
        nota,
        created_at,
        updated_at
      FROM disponibilidad_tecnicos
      WHERE id_disponibilidad = ${idDisponibilidad}
      LIMIT 1
    `;

    const bloque = Array.isArray(bloques) ? bloques[0] : null;
    if (!bloque) {
      throw new NotFoundException(
        `Bloque de disponibilidad '${idDisponibilidad}' no encontrado`,
      );
    }

    this.assertCanRead(bloque.id_tecnico, actor);
    return bloque;
  }

  private async assertTecnicoExists(idTecnico: string) {
    const tecnicos = await this.prisma.$queryRaw`
      SELECT u.id_usuario
      FROM usuarios u
      JOIN detalles_tecnicos dt ON dt.id_usuario = u.id_usuario
      WHERE u.id_usuario = ${idTecnico}
        AND u.rol IN ('tecnico', 'admin')
      LIMIT 1
    `;

    if (!Array.isArray(tecnicos) || tecnicos.length === 0) {
      throw new NotFoundException(
        `Tecnico '${idTecnico}' no encontrado o sin datos tecnicos`,
      );
    }
  }

  private assertCanRead(idTecnico: string, actor?: Actor) {
    if (actor?.rol === RolEnum.ADMIN || actor?.rol === RolEnum.CLIENTE) {
      return;
    }

    this.assertSelfOrAdmin(idTecnico, actor);
  }

  private assertSelfOrAdmin(idTecnico: string, actor?: Actor) {
    if (actor?.rol === RolEnum.ADMIN) {
      return;
    }

    if (!actor?.userId || actor.userId !== idTecnico) {
      throw new ForbiddenException(
        'Solo el propio tecnico o un administrador puede modificar la disponibilidad',
      );
    }
  }

  private assertValidTimeRange(horaInicio: string, horaFin: string) {
    if (horaInicio >= horaFin) {
      throw new BadRequestException(
        'La hora de inicio debe ser menor que la hora de fin',
      );
    }
  }

  private generateId() {
    return `DISP-${uuidv4().split('-')[0].toUpperCase()}`;
  }
}
