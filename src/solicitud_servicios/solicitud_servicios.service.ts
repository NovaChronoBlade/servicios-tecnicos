import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateSolicitudServicioDto } from './dto/create-solicitud-servicio.dto';
import { CheckoutSolicitudServicioDto } from './dto/checkout-solicitud-servicio.dto';
import { DireccionesService } from 'src/direcciones/direcciones.service';
import { RolEnum } from 'src/auth/enums/rol.enum';
import { PaymentGatewayService } from 'src/pagos/payment-gateway.service';
import {
  canTransitionSolicitud,
  ESTADOS_SOLICITUD,
  EstadoSolicitud,
  normalizeEstadoSolicitud,
} from './solicitud-estados';

type Actor = {
  userId?: string;
  rol?: RolEnum | string;
};

type SolicitudesFilters = {
  page?: string;
  limit?: string;
  estado?: string;
  id_tecnico?: string;
  desde?: string;
};

type ServicioPrecio = {
  id_servicio: string;
  nombre: string;
  precio: number | string;
};

const SOLICITUD_SELECT = `
  SELECT
    ss.id_ss,
    ss.estado,
    ss.confirmacion_cliente,
    ss.confirmacion_tecnico,
    ss.motivo_cancelacion,
    ss.fecha,
    ss.fecha_programada,
    ss.fecha_aceptacion,
    ss.fecha_finalizacion,
    ss.id_cliente,
    ss.id_tecnico,
    ss.id_servicio,
    ss.id_direccion,
    u_cli.nombre AS nombre_cliente,
    u_cli.telefono AS telefono_cliente,
    u_tec.nombre AS nombre_tecnico,
    u_tec.correo AS correo_tecnico,
    u_tec.telefono AS telefono_tecnico,
    dt.especialidad AS tecnico_especialidad,
    dt.disponible AS tecnico_disponible,
    dt.calificacion_promedio AS tecnico_calificacion_promedio,
    s.nombre AS nombre_servicio,
    s.precio AS precio_servicio,
    d.direccion AS direccion_servicio,
    d.tipo_edificio,
    d.informacion AS informacion_direccion,
    d.nota AS nota_direccion,
    p.id_pago,
    p.metodo_pago,
    p.estado AS estado_pago,
    p.numero_referencia
  FROM solicitud_servicios ss
  JOIN usuarios u_cli ON u_cli.id_usuario = ss.id_cliente
  LEFT JOIN usuarios u_tec ON u_tec.id_usuario = ss.id_tecnico
  LEFT JOIN detalles_tecnicos dt ON dt.id_usuario = ss.id_tecnico
  JOIN servicios s ON s.id_servicio = ss.id_servicio
  JOIN direcciones d ON d.id_direccion = ss.id_direccion
  LEFT JOIN pagos p ON p.id_ss = ss.id_ss
`;

@Injectable()
export class SolicitudServiciosService {
  constructor(
    private prisma: PrismaService,
    private readonly direccionesService: DireccionesService,
    @Optional()
    private readonly paymentGateway?: PaymentGatewayService,
  ) {}

  async create(
    createSolicitudDto: CreateSolicitudServicioDto,
    actor?: Actor,
  ) {
    const {
      id_cliente,
      id_tecnico,
      id_servicio,
      id_direccion,
      fecha_programada,
    } = createSolicitudDto;

    this.assertClienteActor(id_cliente, actor);
    await this.assertDireccionDelCliente(id_direccion, id_cliente);
    await this.assertServicioActivo(id_servicio);

    const estado: EstadoSolicitud = id_tecnico ? 'asignado' : 'pendiente';
    if (id_tecnico) {
      await this.assertTecnicoAsignable(id_tecnico, true);
    }

    const id_ss = this.generarIdSolicitud();

    await this.prisma.$executeRaw`
      INSERT INTO solicitud_servicios
        (id_ss, id_cliente, id_tecnico, id_servicio, id_direccion, estado, fecha_programada)
      VALUES
        (${id_ss}, ${id_cliente}, ${id_tecnico ?? null}, ${id_servicio}, ${id_direccion}, ${estado}, ${fecha_programada ? new Date(fecha_programada) : null})
    `;

    if (id_tecnico) {
      await this.marcarTecnicoDisponible(id_tecnico, false);
    }

    return this.findOne(id_ss);
  }

  async checkout(checkoutDto: CheckoutSolicitudServicioDto, actor?: Actor) {
    if (!this.paymentGateway) {
      throw new BadRequestException('La pasarela de pago no esta configurada');
    }

    const {
      id_cliente,
      id_tecnico,
      id_servicio,
      id_direccion,
      fecha_programada,
      metodo_pago,
      token_pago,
      moneda = 'COP',
    } = checkoutDto;

    this.assertClienteActor(id_cliente, actor);
    await this.assertDireccionDelCliente(id_direccion, id_cliente);
    await this.assertTecnicoAsignable(id_tecnico, true);
    const servicio = await this.assertServicioActivo(id_servicio);
    const monto = Number(servicio.precio);

    const id_ss = this.generarIdSolicitud();
    const id_pago = this.generarIdPago();

    const gatewayResult = await this.paymentGateway.charge({
      id_pago,
      id_ss,
      id_cliente,
      monto,
      moneda,
      metodo_pago,
      token_pago,
    });

    if (!gatewayResult.approved || gatewayResult.estado !== 'pagado') {
      throw new BadRequestException(
        'El pago no fue aprobado. La solicitud no fue creada.',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      const reserved = await tx.$executeRaw`
        UPDATE detalles_tecnicos
        SET disponible = false
        WHERE id_usuario = ${id_tecnico}
          AND disponible = true
      `;

      if (Number(reserved) !== 1) {
        throw new BadRequestException(
          'El tecnico seleccionado ya no esta disponible',
        );
      }

      await tx.$executeRaw`
        INSERT INTO solicitud_servicios
          (id_ss, id_cliente, id_tecnico, id_servicio, id_direccion, estado, fecha_programada)
        VALUES
          (${id_ss}, ${id_cliente}, ${id_tecnico}, ${id_servicio}, ${id_direccion}, 'asignado', ${fecha_programada ? new Date(fecha_programada) : null})
      `;

      await tx.$executeRaw`
        INSERT INTO pagos
          (id_pago, id_ss, monto, metodo_pago, estado, numero_referencia)
        VALUES
          (${id_pago}, ${id_ss}, ${monto}, ${metodo_pago}, 'pagado', ${gatewayResult.numero_referencia})
      `;
    });

    return {
      solicitud: await this.findOne(id_ss),
      pago: {
        id_pago,
        id_ss,
        monto,
        metodo_pago,
        estado: 'pagado',
        numero_referencia: gatewayResult.numero_referencia,
        pasarela: {
          provider: gatewayResult.provider,
          approved: gatewayResult.approved,
        },
      },
    };
  }

  async findAll(filters: SolicitudesFilters = {}) {
    const { take, skip, currentPage } = this.getPagination(
      filters.page,
      filters.limit,
    );
    const { whereSql, params } = this.buildFilters(filters);
    const solicitudes = await this.prisma.$queryRawUnsafe(
      `
      ${SOLICITUD_SELECT}
      ${whereSql}
      ORDER BY ss.fecha DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `,
      ...params,
      take,
      skip,
    );

    const totalResult = await this.prisma.$queryRawUnsafe(
      `
      SELECT COUNT(*)::int AS total
      FROM solicitud_servicios ss
      ${whereSql}
    `,
      ...params,
    );
    const total = Array.isArray(totalResult) ? (totalResult[0]?.total ?? 0) : 0;

    return {
      data: solicitudes,
      pagination: { page: currentPage, limit: take, total },
    };
  }

  async findOne(id: string, actor?: Actor) {
    const solicitudes = await this.prisma.$queryRawUnsafe(
      `
      ${SOLICITUD_SELECT}
      WHERE ss.id_ss = $1
      LIMIT 1
    `,
      id,
    );

    const solicitud = Array.isArray(solicitudes) ? solicitudes[0] : null;
    if (!solicitud) {
      throw new NotFoundException(`Solicitud '${id}' no encontrada`);
    }

    if (actor) {
      this.assertActorCanViewSolicitud(solicitud, actor);
    }

    return solicitud;
  }

  async updateEstado(id: string, nuevoEstadoRaw: string, actor?: Actor) {
    const solicitud = await this.findOne(id);
    const nuevoEstado = normalizeEstadoSolicitud(nuevoEstadoRaw);
    const estadoActual = normalizeEstadoSolicitud(solicitud.estado);

    if (estadoActual === nuevoEstado) {
      return solicitud;
    }

    if (!canTransitionSolicitud(estadoActual, nuevoEstado)) {
      throw new BadRequestException(
        `Transicion invalida: no se puede pasar de '${estadoActual}' a '${nuevoEstado}'`,
      );
    }

    if (actor?.rol === RolEnum.TECNICO) {
      if (!solicitud.id_tecnico || solicitud.id_tecnico !== actor.userId) {
        throw new UnauthorizedException(
          'Solo el tecnico asignado puede actualizar esta solicitud',
        );
      }

      if (nuevoEstado === 'completado') {
        throw new BadRequestException(
          'El cierre final debe confirmarlo el cliente',
        );
      }
    }

    if (nuevoEstado === 'aceptado' && !solicitud.id_tecnico) {
      throw new BadRequestException(
        'No se puede aceptar una solicitud sin tecnico asignado',
      );
    }

    if (nuevoEstado === 'en_curso' && !solicitud.id_tecnico) {
      throw new BadRequestException(
        'No se puede iniciar una solicitud sin tecnico asignado',
      );
    }

    if (nuevoEstado === 'completado') {
      await this.completarSolicitud(id, solicitud.id_tecnico);
      return this.findOne(id);
    }

    await this.prisma.$executeRaw`
      UPDATE solicitud_servicios
      SET
        estado = ${nuevoEstado},
        fecha_aceptacion = CASE
          WHEN ${nuevoEstado} = 'aceptado' AND fecha_aceptacion IS NULL THEN NOW()
          ELSE fecha_aceptacion
        END
      WHERE id_ss = ${id}
    `;

    return this.findOne(id);
  }

  async findByCliente(id_cliente: string, actor?: Actor) {
    this.assertSelfOrAdmin(id_cliente, actor, 'cliente');

    return this.prisma.$queryRawUnsafe(
      `
      ${SOLICITUD_SELECT}
      WHERE ss.id_cliente = $1
      ORDER BY ss.fecha DESC
    `,
      id_cliente,
    );
  }

  async findPendientesDisponibles() {
    return this.prisma.$queryRawUnsafe(`
      ${SOLICITUD_SELECT}
      WHERE ss.estado = 'pendiente'
        AND ss.id_tecnico IS NULL
      ORDER BY ss.fecha DESC
    `);
  }

  async findByTecnico(id_tecnico: string, actor?: Actor) {
    this.assertSelfOrAdmin(id_tecnico, actor, 'tecnico');

    return this.prisma.$queryRawUnsafe(
      `
      ${SOLICITUD_SELECT}
      WHERE ss.id_tecnico = $1
      ORDER BY ss.fecha DESC
    `,
      id_tecnico,
    );
  }

  async findByEstado(estadoRaw: string) {
    const estado = normalizeEstadoSolicitud(estadoRaw);

    return this.prisma.$queryRawUnsafe(
      `
      ${SOLICITUD_SELECT}
      WHERE ss.estado = $1
      ORDER BY ss.fecha DESC
    `,
      estado,
    );
  }

  async asignarTecnico(id_ss: string, id_tecnico: string, actor?: Actor) {
    const solicitud = await this.findOne(id_ss);
    const estadoActual = normalizeEstadoSolicitud(solicitud.estado);

    if (solicitud.id_tecnico && solicitud.id_tecnico !== id_tecnico) {
      throw new BadRequestException(
        'La solicitud ya tiene un tecnico asignado',
      );
    }

    const actorRol = actor?.rol;
    const actorId = actor?.userId;
    if (actorRol !== RolEnum.ADMIN && actorId !== id_tecnico) {
      throw new UnauthorizedException(
        'No tiene permisos para asignar este tecnico',
      );
    }

    if (estadoActual === 'asignado') {
      if (solicitud.id_tecnico !== id_tecnico) {
        throw new BadRequestException(
          'La solicitud ya esta asignada a otro tecnico',
        );
      }

      await this.prisma.$executeRaw`
        UPDATE solicitud_servicios
        SET estado = 'aceptado',
            fecha_aceptacion = COALESCE(fecha_aceptacion, NOW())
        WHERE id_ss = ${id_ss}
      `;

      return this.findOne(id_ss);
    }

    if (estadoActual !== 'pendiente') {
      throw new BadRequestException(
        `Solo se puede asignar tecnico a solicitudes pendientes. Estado actual: '${solicitud.estado}'`,
      );
    }

    await this.assertTecnicoAsignable(id_tecnico, true);

    const nextEstado: EstadoSolicitud =
      actorRol === RolEnum.ADMIN ? 'asignado' : 'aceptado';

    await this.prisma.$executeRaw`
      UPDATE solicitud_servicios
      SET
        id_tecnico = ${id_tecnico},
        estado = ${nextEstado},
        fecha_aceptacion = CASE
          WHEN ${nextEstado} = 'aceptado' THEN NOW()
          ELSE fecha_aceptacion
        END
      WHERE id_ss = ${id_ss}
        AND id_tecnico IS NULL
    `;

    await this.marcarTecnicoDisponible(id_tecnico, false);

    return this.findOne(id_ss);
  }

  async cancelar(
    id_ss: string,
    motivo_cancelacion: string,
    actor?: Actor,
  ) {
    const solicitud = await this.findOne(id_ss);
    const estadoActual = normalizeEstadoSolicitud(solicitud.estado);

    if (estadoActual === 'completado' || estadoActual === 'cancelado') {
      throw new BadRequestException(
        `No se puede cancelar una solicitud en estado '${solicitud.estado}'`,
      );
    }

    const actorRol = actor?.rol;
    const actorId = actor?.userId;
    const esPropietario =
      actorId === solicitud.id_cliente || actorId === solicitud.id_tecnico;

    if (actorRol !== RolEnum.ADMIN && !esPropietario) {
      throw new UnauthorizedException(
        'No tiene permisos para cancelar esta solicitud',
      );
    }

    await this.prisma.$executeRaw`
      UPDATE solicitud_servicios
      SET estado = 'cancelado', motivo_cancelacion = ${motivo_cancelacion}
      WHERE id_ss = ${id_ss}
    `;

    if (solicitud.id_tecnico) {
      await this.marcarTecnicoDisponible(solicitud.id_tecnico, true);
    }

    return this.findOne(id_ss);
  }

  async reasignarTecnico(id_ss: string, nuevo_id_tecnico: string) {
    const solicitud = await this.findOne(id_ss);
    const estadoActual = normalizeEstadoSolicitud(solicitud.estado);

    if (estadoActual !== 'asignado') {
      throw new BadRequestException(
        `Solo se puede reasignar antes de que el tecnico acepte. Estado actual: '${solicitud.estado}'`,
      );
    }

    if (solicitud.id_tecnico === nuevo_id_tecnico) {
      throw new BadRequestException(
        'La solicitud ya esta asignada a ese tecnico',
      );
    }

    await this.assertTecnicoAsignable(nuevo_id_tecnico, true);

    await this.prisma.$executeRaw`
      UPDATE solicitud_servicios
      SET id_tecnico = ${nuevo_id_tecnico},
          fecha_aceptacion = NULL
      WHERE id_ss = ${id_ss}
    `;

    if (solicitud.id_tecnico) {
      await this.marcarTecnicoDisponible(solicitud.id_tecnico, true);
    }

    await this.marcarTecnicoDisponible(nuevo_id_tecnico, false);

    return this.findOne(id_ss);
  }

  async confirmarPorCliente(id_ss: string, actorId: string) {
    const solicitud = await this.findOne(id_ss);

    if (solicitud.id_cliente !== actorId) {
      throw new UnauthorizedException(
        'Solo el cliente propietario puede finalizar la solicitud',
      );
    }

    if (!solicitud.id_tecnico) {
      throw new BadRequestException(
        'No se puede finalizar una solicitud sin tecnico asignado',
      );
    }

    if (normalizeEstadoSolicitud(solicitud.estado) !== 'en_curso') {
      throw new BadRequestException(
        `Solo se puede finalizar una solicitud en estado 'en_curso'. Estado actual: '${solicitud.estado}'`,
      );
    }

    await this.completarSolicitud(id_ss, solicitud.id_tecnico, true);

    return this.findOne(id_ss);
  }

  async confirmarPorTecnico(id_ss: string, actorId: string) {
    const solicitud = await this.findOne(id_ss);

    if (solicitud.id_tecnico !== actorId) {
      throw new UnauthorizedException(
        'Solo el tecnico asignado puede confirmar',
      );
    }

    const estadoActual = normalizeEstadoSolicitud(solicitud.estado);
    if (estadoActual === 'cancelado' || estadoActual === 'completado') {
      throw new BadRequestException(
        `No se puede confirmar una solicitud en estado '${solicitud.estado}'`,
      );
    }

    if (estadoActual !== 'en_curso') {
      throw new BadRequestException(
        'El tecnico solo puede reportar cierre cuando la solicitud esta en curso',
      );
    }

    await this.prisma.$executeRaw`
      UPDATE solicitud_servicios
      SET confirmacion_tecnico = true
      WHERE id_ss = ${id_ss}
    `;

    return this.findOne(id_ss);
  }

  private async completarSolicitud(
    id_ss: string,
    id_tecnico?: string | null,
    confirmarCliente = false,
  ) {
    if (!id_tecnico) {
      throw new BadRequestException(
        'No se puede completar una solicitud sin tecnico asignado',
      );
    }

    await this.prisma.$executeRaw`
      UPDATE solicitud_servicios
      SET
        estado = 'completado',
        confirmacion_cliente = CASE
          WHEN ${confirmarCliente} = true THEN true
          ELSE confirmacion_cliente
        END,
        fecha_finalizacion = COALESCE(fecha_finalizacion, NOW())
      WHERE id_ss = ${id_ss}
    `;

    await this.marcarTecnicoDisponible(id_tecnico, true);
  }

  private async assertDireccionDelCliente(
    id_direccion: string,
    id_cliente: string,
  ) {
    const direccionPertenece = await this.direccionesService.belongsToUser(
      id_direccion,
      id_cliente,
    );
    if (!direccionPertenece) {
      throw new BadRequestException(
        'La direccion seleccionada no pertenece al cliente',
      );
    }
  }

  private assertClienteActor(id_cliente: string, actor?: Actor) {
    if (actor?.rol !== RolEnum.ADMIN && actor?.userId !== id_cliente) {
      throw new UnauthorizedException(
        'Solo el cliente propietario puede crear esta solicitud',
      );
    }
  }

  private assertSelfOrAdmin(id_usuario: string, actor?: Actor, owner = 'usuario') {
    if (!actor) {
      return;
    }

    if (actor?.rol === RolEnum.ADMIN) {
      return;
    }

    if (!actor?.userId || actor.userId !== id_usuario) {
      throw new UnauthorizedException(
        `Solo el ${owner} propietario puede consultar esta informacion`,
      );
    }
  }

  private assertActorCanViewSolicitud(solicitud: any, actor: Actor) {
    if (actor.rol === RolEnum.ADMIN) {
      return;
    }

    const isOwner =
      actor.userId === solicitud.id_cliente ||
      actor.userId === solicitud.id_tecnico;

    if (!isOwner) {
      throw new UnauthorizedException(
        'No tiene permisos para consultar esta solicitud',
      );
    }
  }

  private async assertServicioActivo(id_servicio: string) {
    const servicios = await this.prisma.$queryRaw`
      SELECT id_servicio, nombre, precio, activo
      FROM servicios
      WHERE id_servicio = ${id_servicio}
      LIMIT 1
    `;
    const servicio = Array.isArray(servicios)
      ? (servicios[0] as ServicioPrecio & { activo?: boolean })
      : null;

    if (!servicio) {
      throw new NotFoundException(`Servicio '${id_servicio}' no encontrado`);
    }

    if (servicio.activo === false) {
      throw new BadRequestException('El servicio seleccionado no esta activo');
    }

    return servicio;
  }

  private async assertTecnicoAsignable(
    id_tecnico: string,
    requireAvailable: boolean,
  ) {
    const tecnicos = await this.prisma.$queryRaw`
      SELECT
        u.id_usuario,
        u.rol,
        u.activo,
        dt.disponible
      FROM usuarios u
      JOIN detalles_tecnicos dt ON dt.id_usuario = u.id_usuario
      WHERE u.id_usuario = ${id_tecnico}
      LIMIT 1
    `;
    const tecnico = Array.isArray(tecnicos) ? tecnicos[0] : null;

    if (!tecnico) {
      throw new NotFoundException(
        `Datos tecnicos del tecnico '${id_tecnico}' no encontrados`,
      );
    }

    if (tecnico.rol !== RolEnum.TECNICO || tecnico.activo !== true) {
      throw new BadRequestException(
        'El usuario seleccionado no es un tecnico activo',
      );
    }

    if (requireAvailable && tecnico.disponible !== true) {
      throw new BadRequestException(
        'El tecnico seleccionado no esta disponible',
      );
    }

    return tecnico;
  }

  private async marcarTecnicoDisponible(id_tecnico: string, disponible: boolean) {
    await this.prisma.$executeRaw`
      UPDATE detalles_tecnicos
      SET disponible = ${disponible}
      WHERE id_usuario = ${id_tecnico}
    `;
  }

  private generarIdSolicitud(): string {
    const shortId = uuidv4().split('-')[0].toUpperCase();
    return `SS-${shortId}`;
  }

  private generarIdPago(): string {
    return `PAG-${uuidv4().split('-')[0].toUpperCase()}`;
  }

  private getPagination(page?: string, limit?: string) {
    const currentPage = Math.max(Number(page) || 1, 1);
    const take = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (currentPage - 1) * take;

    return { currentPage, take, skip };
  }

  private buildFilters(filters: SolicitudesFilters) {
    const clauses: string[] = [];
    const params: unknown[] = [];

    if (filters.estado) {
      params.push(normalizeEstadoSolicitud(filters.estado));
      clauses.push(`ss.estado = $${params.length}`);
    }

    if (filters.id_tecnico) {
      params.push(filters.id_tecnico);
      clauses.push(`ss.id_tecnico = $${params.length}`);
    }

    if (filters.desde) {
      const desde = new Date(filters.desde);
      if (Number.isNaN(desde.getTime())) {
        throw new BadRequestException('La fecha desde no es valida');
      }
      params.push(desde);
      clauses.push(`ss.fecha >= $${params.length}`);
    }

    return {
      whereSql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
      params,
    };
  }

  getEstadosValidos() {
    return ESTADOS_SOLICITUD;
  }
}
