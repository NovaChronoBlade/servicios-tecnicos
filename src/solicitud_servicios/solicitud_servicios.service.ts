import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { CreateSolicitudServicioDto } from './dto/create-solicitud_servicio.dto';

// Estados válidos según el CHECK constraint de la BD
const ESTADOS_VALIDOS = [
  'pendiente',
  'aceptado',
  'en_curso',
  'completado',
  'cancelado',
] as const;

type EstadoSolicitud = (typeof ESTADOS_VALIDOS)[number];

@Injectable()
export class SolicitudServiciosService {
  constructor(private prisma: PrismaService) {}

  // ----------------------------------------------------------------
  // Crear una nueva solicitud de servicio
  // ----------------------------------------------------------------
  async create(createSolicitudDto: CreateSolicitudServicioDto) {
    const { id_cliente, id_tecnico, id_servicio, id_direccion } =
      createSolicitudDto;

    const id_ss = this.generarIdSolicitud();

    await this.prisma.$executeRaw`
      INSERT INTO solicitud_servicios
        (id_ss, id_cliente, id_tecnico, id_servicio, id_direccion, estado)
      VALUES
        (${id_ss}, ${id_cliente}, ${id_tecnico ?? null}, ${id_servicio}, ${id_direccion}, 'pendiente')
    `;

    return { id_ss, ...createSolicitudDto, estado: 'pendiente' };
  }

  // ----------------------------------------------------------------
  // Obtener todas las solicitudes
  // ----------------------------------------------------------------
  async findAll() {
    const solicitudes = await this.prisma.$queryRaw`
      SELECT
        ss.id_ss,
        ss.estado,
        ss.fecha,
        ss.id_cliente,
        ss.id_tecnico,
        ss.id_servicio,
        ss.id_direccion,
        u_cli.nombre  AS nombre_cliente,
        u_tec.nombre  AS nombre_tecnico,
        s.nombre      AS nombre_servicio,
        s.precio      AS precio_servicio
      FROM solicitud_servicios ss
      JOIN usuarios u_cli     ON u_cli.id_usuario  = ss.id_cliente
      LEFT JOIN usuarios u_tec ON u_tec.id_usuario  = ss.id_tecnico
      JOIN servicios s         ON s.id_servicio     = ss.id_servicio
      ORDER BY ss.fecha DESC
    `;

    return solicitudes;
  }

  // ----------------------------------------------------------------
  // Obtener una solicitud por ID
  // ----------------------------------------------------------------
  async findOne(id: string) {
    const solicitudes = await this.prisma.$queryRaw`
      SELECT
        ss.id_ss,
        ss.estado,
        ss.fecha,
        ss.id_cliente,
        ss.id_tecnico,
        ss.id_servicio,
        ss.id_direccion,
        u_cli.nombre  AS nombre_cliente,
        u_tec.nombre  AS nombre_tecnico,
        s.nombre      AS nombre_servicio,
        s.precio      AS precio_servicio
      FROM solicitud_servicios ss
      JOIN usuarios u_cli      ON u_cli.id_usuario = ss.id_cliente
      LEFT JOIN usuarios u_tec ON u_tec.id_usuario = ss.id_tecnico
      JOIN servicios s         ON s.id_servicio    = ss.id_servicio
      WHERE ss.id_ss = ${id}
      LIMIT 1
    `;

    const solicitud = Array.isArray(solicitudes) ? solicitudes[0] : null;
    if (!solicitud)
      throw new NotFoundException(`Solicitud '${id}' no encontrada`);

    return solicitud;
  }

  // ----------------------------------------------------------------
  // Actualizar el estado de una solicitud
  // ----------------------------------------------------------------
  async updateEstado(id: string, nuevoEstado: string) {
    await this.findOne(id); // lanza NotFoundException si no existe

    if (!ESTADOS_VALIDOS.includes(nuevoEstado as EstadoSolicitud)) {
      throw new BadRequestException(
        `Estado inválido. Los estados permitidos son: ${ESTADOS_VALIDOS.join(', ')}`,
      );
    }

    await this.prisma.$executeRaw`
      UPDATE solicitud_servicios
      SET estado = ${nuevoEstado}
      WHERE id_ss = ${id}
    `;

    return this.findOne(id);
  }

  // ----------------------------------------------------------------
  // Obtener todas las solicitudes de un cliente
  // ----------------------------------------------------------------
  async findByCliente(id_cliente: string) {
    const solicitudes = await this.prisma.$queryRaw`
      SELECT
        ss.id_ss,
        ss.estado,
        ss.fecha,
        ss.id_tecnico,
        s.nombre  AS nombre_servicio,
        s.precio  AS precio_servicio
      FROM solicitud_servicios ss
      JOIN servicios s ON s.id_servicio = ss.id_servicio
      WHERE ss.id_cliente = ${id_cliente}
      ORDER BY ss.fecha DESC
    `;

    return solicitudes;
  }

  // ----------------------------------------------------------------
  // Obtener todas las solicitudes asignadas a un técnico
  // ----------------------------------------------------------------
  async findByTecnico(id_tecnico: string) {
    const solicitudes = await this.prisma.$queryRaw`
      SELECT
        ss.id_ss,
        ss.estado,
        ss.fecha,
        ss.id_cliente,
        u_cli.nombre  AS nombre_cliente,
        s.nombre      AS nombre_servicio,
        d.direccion   AS direccion_servicio,
        d.tipo_edificio
      FROM solicitud_servicios ss
      JOIN usuarios u_cli ON u_cli.id_usuario  = ss.id_cliente
      JOIN servicios s    ON s.id_servicio     = ss.id_servicio
      JOIN direcciones d  ON d.id_direccion    = ss.id_direccion
      WHERE ss.id_tecnico = ${id_tecnico}
      ORDER BY ss.fecha DESC
    `;

    return solicitudes;
  }

  // ----------------------------------------------------------------
  // Obtener solicitudes por estado
  // ----------------------------------------------------------------
  async findByEstado(estado: string) {
    if (!ESTADOS_VALIDOS.includes(estado as EstadoSolicitud)) {
      throw new BadRequestException(
        `Estado inválido. Los estados permitidos son: ${ESTADOS_VALIDOS.join(', ')}`,
      );
    }

    const solicitudes = await this.prisma.$queryRaw`
      SELECT
        ss.id_ss,
        ss.estado,
        ss.fecha,
        ss.id_cliente,
        ss.id_tecnico,
        s.nombre AS nombre_servicio
      FROM solicitud_servicios ss
      JOIN servicios s ON s.id_servicio = ss.id_servicio
      WHERE ss.estado = ${estado}
      ORDER BY ss.fecha DESC
    `;

    return solicitudes;
  }

  // ----------------------------------------------------------------
  // Asignar un técnico a una solicitud
  // ----------------------------------------------------------------
  async asignarTecnico(id_ss: string, id_tecnico: string) {
    const solicitud = await this.findOne(id_ss);

    if (solicitud.estado !== 'pendiente') {
      throw new BadRequestException(
        `Solo se puede asignar técnico a solicitudes en estado 'pendiente'. Estado actual: '${solicitud.estado}'`,
      );
    }

    await this.prisma.$executeRaw`
      UPDATE solicitud_servicios
      SET id_tecnico = ${id_tecnico}, estado = 'aceptado'
      WHERE id_ss = ${id_ss}
    `;

    return this.findOne(id_ss);
  }

  // ----------------------------------------------------------------
  // Helper: generar ID único para la solicitud
  // ----------------------------------------------------------------
  private generarIdSolicitud(): string {
    const shortId = uuidv4().split('-')[0].toUpperCase();
    return `SS-${shortId}`;
  }
}
