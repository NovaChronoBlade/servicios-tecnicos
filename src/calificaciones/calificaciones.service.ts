import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';

@Injectable()
export class CalificacionesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCalificacionDto: CreateCalificacionDto,
    actor?: { userId?: string; rol?: string },
  ) {
    const { id_tecnico, id_cliente, id_ss, puntuacion, comentario } =
      createCalificacionDto;

    if (puntuacion < 1 || puntuacion > 5) {
      throw new BadRequestException('La puntuacion debe estar entre 1 y 5');
    }

    const solicitudes = await this.prisma.$queryRaw`
      SELECT id_ss, estado, id_cliente, id_tecnico
      FROM solicitud_servicios
      WHERE id_ss = ${id_ss}
      LIMIT 1
    `;
    const solicitud = Array.isArray(solicitudes) ? solicitudes[0] : null;

    if (!solicitud) {
      throw new NotFoundException(`Solicitud '${id_ss}' no encontrada`);
    }

    if (solicitud.estado !== 'completado') {
      throw new BadRequestException(
        `Solo se puede calificar una solicitud con estado 'completado'. Estado actual: '${solicitud.estado}'`,
      );
    }

    if (
      solicitud.id_cliente !== id_cliente ||
      solicitud.id_tecnico !== id_tecnico
    ) {
      throw new BadRequestException(
        'La calificacion debe coincidir con el cliente y tecnico de la solicitud',
      );
    }

    if (actor?.rol !== 'admin' && actor?.userId !== solicitud.id_cliente) {
      throw new BadRequestException(
        'El cliente solo puede calificar solicitudes propias',
      );
    }

    const calExistente = await this.prisma.$queryRaw`
      SELECT id_calificacion FROM calificaciones
      WHERE id_ss = ${id_ss}
      LIMIT 1
    `;
    if (Array.isArray(calExistente) && calExistente.length > 0) {
      throw new BadRequestException(
        `La solicitud '${id_ss}' ya tiene una calificacion registrada`,
      );
    }

    const id_calificacion = this.generarIdCalificacion();

    await this.prisma.$executeRaw`
      INSERT INTO calificaciones
        (id_calificacion, id_tecnico, id_cliente, id_ss, puntuacion, comentario)
      VALUES
        (${id_calificacion}, ${id_tecnico}, ${id_cliente}, ${id_ss}, ${puntuacion}, ${comentario ?? null})
    `;

    await this.actualizarPromedioTecnico(id_tecnico);

    return {
      id_calificacion,
      id_tecnico,
      id_cliente,
      id_ss,
      puntuacion,
      comentario: comentario ?? null,
    };
  }

  async findOne(id: string) {
    const calificaciones = await this.prisma.$queryRaw`
      SELECT
        c.id_calificacion,
        c.puntuacion,
        c.comentario,
        c.fecha_calificacion,
        c.id_ss,
        u_tec.nombre AS nombre_tecnico,
        u_cli.nombre AS nombre_cliente
      FROM calificaciones c
      JOIN usuarios u_tec ON u_tec.id_usuario = c.id_tecnico
      JOIN usuarios u_cli ON u_cli.id_usuario = c.id_cliente
      WHERE c.id_calificacion = ${id}
      LIMIT 1
    `;

    const calificacion = Array.isArray(calificaciones)
      ? calificaciones[0]
      : null;
    if (!calificacion) {
      throw new NotFoundException(`Calificacion '${id}' no encontrada`);
    }

    return calificacion;
  }

  async findByTecnico(id_tecnico: string, page?: string, limit?: string) {
    const { take, skip, currentPage } = this.getPagination(page, limit);
    const calificaciones = await this.prisma.$queryRaw`
      SELECT
        c.id_calificacion,
        c.puntuacion,
        c.comentario,
        c.fecha_calificacion,
        c.id_ss,
        u_cli.nombre AS nombre_cliente
      FROM calificaciones c
      JOIN usuarios u_cli ON u_cli.id_usuario = c.id_cliente
      WHERE c.id_tecnico = ${id_tecnico}
      ORDER BY c.fecha_calificacion DESC
      LIMIT ${take} OFFSET ${skip}
    `;

    const totalResult = await this.prisma.$queryRaw`
      SELECT COUNT(*)::int AS total
      FROM calificaciones
      WHERE id_tecnico = ${id_tecnico}
    `;
    const total = Array.isArray(totalResult) ? totalResult[0]?.total ?? 0 : 0;

    return {
      data: calificaciones,
      pagination: { page: currentPage, limit: take, total },
    };
  }

  async getPromedioPorTecnico(id_tecnico: string) {
    const resultado = await this.prisma.$queryRaw`
      SELECT
        u.nombre                        AS nombre_tecnico,
        dt.especialidad,
        COUNT(c.id_calificacion)::int   AS total_calificaciones,
        ROUND(AVG(c.puntuacion), 2)     AS promedio
      FROM usuarios u
      JOIN detalles_tecnicos dt ON dt.id_usuario  = u.id_usuario
      LEFT JOIN calificaciones c ON c.id_tecnico  = u.id_usuario
      WHERE u.id_usuario = ${id_tecnico}
      GROUP BY u.nombre, dt.especialidad
      LIMIT 1
    `;

    const promedio = Array.isArray(resultado) ? resultado[0] : null;
    if (!promedio) {
      throw new NotFoundException(`Tecnico '${id_tecnico}' no encontrado`);
    }

    return promedio;
  }

  async findByCliente(id_cliente: string, page?: string, limit?: string) {
    const { take, skip, currentPage } = this.getPagination(page, limit);
    const calificaciones = await this.prisma.$queryRaw`
      SELECT
        c.id_calificacion,
        c.puntuacion,
        c.comentario,
        c.fecha_calificacion,
        c.id_ss,
        u_tec.nombre AS nombre_tecnico
      FROM calificaciones c
      JOIN usuarios u_tec ON u_tec.id_usuario = c.id_tecnico
      WHERE c.id_cliente = ${id_cliente}
      ORDER BY c.fecha_calificacion DESC
      LIMIT ${take} OFFSET ${skip}
    `;

    const totalResult = await this.prisma.$queryRaw`
      SELECT COUNT(*)::int AS total
      FROM calificaciones
      WHERE id_cliente = ${id_cliente}
    `;
    const total = Array.isArray(totalResult) ? totalResult[0]?.total ?? 0 : 0;

    return {
      data: calificaciones,
      pagination: { page: currentPage, limit: take, total },
    };
  }

  async getTopTecnicos(limit?: string) {
    const take = Math.min(Math.max(Number(limit) || 10, 1), 100);

    return this.prisma.$queryRaw`
      SELECT
        u.id_usuario AS id_tecnico,
        u.nombre AS nombre_tecnico,
        dt.especialidad,
        dt.disponible,
        COUNT(c.id_calificacion)::int AS total_calificaciones,
        COALESCE(ROUND(AVG(c.puntuacion), 2), 0) AS promedio
      FROM usuarios u
      JOIN detalles_tecnicos dt ON dt.id_usuario = u.id_usuario
      LEFT JOIN calificaciones c ON c.id_tecnico = u.id_usuario
      WHERE u.rol = 'tecnico'
      GROUP BY u.id_usuario, u.nombre, dt.especialidad, dt.disponible
      ORDER BY promedio DESC, total_calificaciones DESC, u.nombre ASC
      LIMIT ${take}
    `;
  }

  private async actualizarPromedioTecnico(id_tecnico: string): Promise<void> {
    await this.prisma.$executeRaw`
      UPDATE detalles_tecnicos
      SET calificacion_promedio = (
        SELECT ROUND(AVG(puntuacion::numeric), 2)
        FROM calificaciones
        WHERE id_tecnico = ${id_tecnico}
      )
      WHERE id_usuario = ${id_tecnico}
    `;
  }

  private generarIdCalificacion(): string {
    const shortId = uuidv4().split('-')[0].toUpperCase();
    return `CAL-${shortId}`;
  }

  private getPagination(page?: string, limit?: string) {
    const currentPage = Math.max(Number(page) || 1, 1);
    const take = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (currentPage - 1) * take;

    return { currentPage, take, skip };
  }
}
