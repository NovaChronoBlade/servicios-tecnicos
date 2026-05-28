import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { CreateSolicitudServicioDto } from './dto/create-solicitud-servicio.dto';
import { DireccionesService } from 'src/direcciones/direcciones.service';
import { RolEnum } from 'src/auth/enums/rol.enum';

// Estados válidos según el CHECK constraint de la BD
const ESTADOS_VALIDOS = [
  'pendiente',
  'aceptado',
  'en_curso',
  'completado',
  'cancelado',
] as const;

type EstadoSolicitud = (typeof ESTADOS_VALIDOS)[number];

// Transiciones permitidas desde cada estado
const TRANSICIONES: Record<EstadoSolicitud, EstadoSolicitud[]> = {
  pendiente: ['aceptado', 'cancelado'],
  aceptado: ['en_curso', 'cancelado'],
  en_curso: ['completado', 'cancelado'],
  completado: [],
  cancelado: [],
};

@Injectable()
export class SolicitudServiciosService {
  constructor(
    private prisma: PrismaService,
    private readonly direccionesService: DireccionesService,
  ) {}

  // ----------------------------------------------------------------
  // Crear una nueva solicitud de servicio
  // ----------------------------------------------------------------
  async create(
    createSolicitudDto: CreateSolicitudServicioDto,
    actor?: { userId?: string; rol?: string },
  ) {
    const { id_cliente, id_tecnico, id_servicio, id_direccion } =
      createSolicitudDto;

    if (actor?.rol !== RolEnum.ADMIN && actor?.userId !== id_cliente) {
      throw new UnauthorizedException(
        'Solo el cliente propietario puede crear esta solicitud',
      );
    }

    const direccionPertenece = await this.direccionesService.belongsToUser(
      id_direccion,
      id_cliente,
    );
    if (!direccionPertenece) {
      throw new BadRequestException(
        'La direccion seleccionada no pertenece al cliente',
      );
    }

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
        ss.confirmacion_cliente,
        ss.confirmacion_tecnico,
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
        ss.confirmacion_cliente,
        ss.confirmacion_tecnico,
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
    const solicitud = await this.findOne(id); // lanza NotFoundException si no existe

    if (!ESTADOS_VALIDOS.includes(nuevoEstado as EstadoSolicitud)) {
      throw new BadRequestException(
        `Estado inválido. Los estados permitidos son: ${ESTADOS_VALIDOS.join(', ')}`,
      );
    }

    const estadoActual = solicitud.estado as EstadoSolicitud;
    if (estadoActual === (nuevoEstado as EstadoSolicitud)) {
      return solicitud; // no hay cambio
    }

    const permitidos = TRANSICIONES[estadoActual];
    if (!permitidos.includes(nuevoEstado as EstadoSolicitud)) {
      throw new BadRequestException(
        `Transición inválida: no se puede pasar de '${estadoActual}' a '${nuevoEstado}'`,
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
  // Obtener solicitudes pendientes disponibles para técnicos
  // ----------------------------------------------------------------
  async findPendientesDisponibles() {
    const solicitudes = await this.prisma.$queryRaw`
      SELECT
        ss.id_ss,
        ss.estado,
        ss.fecha,
        ss.id_cliente,
        u_cli.nombre  AS nombre_cliente,
        s.nombre      AS nombre_servicio,
        s.precio      AS precio_servicio,
        d.direccion   AS direccion_servicio,
        d.tipo_edificio
      FROM solicitud_servicios ss
      JOIN usuarios u_cli ON u_cli.id_usuario = ss.id_cliente
      JOIN servicios s    ON s.id_servicio = ss.id_servicio
      JOIN direcciones d  ON d.id_direccion = ss.id_direccion
      WHERE ss.estado = 'pendiente'
        AND ss.id_tecnico IS NULL
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
  async asignarTecnico(id_ss: string, id_tecnico: string, actor?: { userId?: string; rol?: string }) {
    const solicitud = await this.findOne(id_ss);

    if (solicitud.estado !== 'pendiente') {
      throw new BadRequestException(
        `Solo se puede asignar técnico a solicitudes en estado 'pendiente'. Estado actual: '${solicitud.estado}'`,
      );
    }

    // Permisos: solo ADMIN o el técnico que se está asignando pueden realizar la asignación
    const actorRol = actor?.rol;
    const actorId = actor?.userId;
    if (actorRol !== 'admin' && actorId !== id_tecnico) {
      throw new UnauthorizedException('No tiene permisos para asignar este técnico');
    }

    await this.prisma.$executeRaw`
      UPDATE solicitud_servicios
      SET id_tecnico = ${id_tecnico}, estado = 'aceptado'
      WHERE id_ss = ${id_ss}
    `;

    // Marcar técnico como no disponible
    await this.prisma.$executeRaw`
      UPDATE detalles_tecnicos
      SET disponible = false
      WHERE id_usuario = ${id_tecnico}
    `;

    return this.findOne(id_ss);
  }

  // Confirmación por parte del cliente
  async confirmarPorCliente(id_ss: string, actorId: string) {
    const solicitud = await this.findOne(id_ss);

    if (solicitud.id_cliente !== actorId) {
      throw new UnauthorizedException('Solo el cliente propietario puede confirmar');
    }

    if (solicitud.estado === 'cancelado') {
      throw new BadRequestException('No se puede confirmar una solicitud cancelada');
    }

    await this.prisma.$executeRaw`
      UPDATE solicitud_servicios
      SET confirmacion_cliente = true
      WHERE id_ss = ${id_ss}
    `;

    // Si ambos confirmaron, completar la solicitud
    const updated = await this.findOne(id_ss);
    if (updated.confirmacion_cliente && updated.confirmacion_tecnico) {
      await this.updateEstado(id_ss, 'completado');
      // liberar disponibilidad del técnico
      if (updated.id_tecnico) {
        await this.prisma.$executeRaw`
          UPDATE detalles_tecnicos
          SET disponible = true
          WHERE id_usuario = ${updated.id_tecnico}
        `;
      }
    }

    return this.findOne(id_ss);
  }

  // Confirmación por parte del técnico
  async confirmarPorTecnico(id_ss: string, actorId: string) {
    const solicitud = await this.findOne(id_ss);

    if (solicitud.id_tecnico !== actorId) {
      throw new UnauthorizedException('Solo el técnico asignado puede confirmar');
    }

    if (solicitud.estado === 'cancelado') {
      throw new BadRequestException('No se puede confirmar una solicitud cancelada');
    }

    await this.prisma.$executeRaw`
      UPDATE solicitud_servicios
      SET confirmacion_tecnico = true
      WHERE id_ss = ${id_ss}
    `;

    const updated = await this.findOne(id_ss);
    if (updated.confirmacion_cliente && updated.confirmacion_tecnico) {
      await this.updateEstado(id_ss, 'completado');
      // liberar disponibilidad del técnico
      if (updated.id_tecnico) {
        await this.prisma.$executeRaw`
          UPDATE detalles_tecnicos
          SET disponible = true
          WHERE id_usuario = ${updated.id_tecnico}
        `;
      }
    }

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
