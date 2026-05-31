import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { v4 as uuidv4 } from 'uuid';
import { PaymentGatewayService } from './payment-gateway.service';
import { RolEnum } from 'src/auth/enums/rol.enum';

type Actor = {
  userId?: string;
  rol?: RolEnum | string;
};

@Injectable()
export class PagosService {
  constructor(
    private prisma: PrismaService,
    private readonly paymentGateway: PaymentGatewayService,
  ) {}

  async createPago(createPagoDto: CreatePagoDto, id_cliente: string) {
    const {
      id_ss,
      monto,
      metodo_pago,
      token_pago,
      moneda = 'COP',
    } = createPagoDto;

    const solicitudes = await this.prisma.$queryRaw`
      SELECT ss.id_ss, ss.estado, ss.id_cliente, ss.id_servicio, s.precio AS precio_servicio
      FROM solicitud_servicios ss
      JOIN servicios s ON s.id_servicio = ss.id_servicio
      WHERE ss.id_ss = ${id_ss}
      LIMIT 1
    `;
    const solicitud = Array.isArray(solicitudes) ? solicitudes[0] : null;
    if (!solicitud) {
      throw new NotFoundException(`Solicitud '${id_ss}' no encontrada`);
    }

    if (solicitud.id_cliente !== id_cliente) {
      throw new UnauthorizedException(
        'Solo el cliente propietario puede realizar el pago',
      );
    }

    if (solicitud.estado === 'completado' || solicitud.estado === 'cancelado') {
      throw new BadRequestException(
        `No se puede pagar una solicitud en estado '${solicitud.estado}'`,
      );
    }

    if (Number(monto) !== Number(solicitud.precio_servicio)) {
      throw new BadRequestException(
        'El monto del pago no coincide con el precio del servicio',
      );
    }

    const pagosExist = await this.prisma.$queryRaw`
      SELECT id_pago FROM pagos WHERE id_ss = ${id_ss} LIMIT 1
    `;
    if (Array.isArray(pagosExist) && pagosExist.length > 0) {
      throw new BadRequestException(
        `La solicitud '${id_ss}' ya tiene un pago registrado`,
      );
    }

    const id_pago = this.generarIdPago();

    await this.prisma.$executeRaw`
      INSERT INTO pagos (id_pago, id_ss, monto, metodo_pago, estado)
      VALUES (${id_pago}, ${id_ss}, ${monto}, ${metodo_pago}, 'pendiente')
    `;

    const gatewayResult = await this.paymentGateway.charge({
      id_pago,
      id_ss,
      id_cliente,
      monto,
      moneda,
      metodo_pago,
      token_pago,
    });

    await this.prisma.$executeRaw`
      UPDATE pagos
      SET
        estado = ${gatewayResult.estado},
        numero_referencia = ${gatewayResult.numero_referencia}
      WHERE id_pago = ${id_pago}
    `;

    return {
      ...(await this.findById(id_pago)),
      pasarela: {
        provider: gatewayResult.provider,
        approved: gatewayResult.approved,
      },
    };
  }

  async findById(id_pago: string) {
    const pagos = await this.prisma.$queryRaw`
      SELECT id_pago, id_ss, monto, metodo_pago, estado, numero_referencia, fecha_pago
      FROM pagos WHERE id_pago = ${id_pago} LIMIT 1
    `;

    const pago = Array.isArray(pagos) ? pagos[0] : null;
    if (!pago) throw new NotFoundException(`Pago '${id_pago}' no encontrado`);
    return pago;
  }

  async findAll(filters: { page?: string; limit?: string } = {}) {
    const { take, skip, currentPage } = this.getPagination(
      filters.page,
      filters.limit,
    );

    const pagos = await this.prisma.$queryRaw`
      SELECT
        p.id_pago,
        p.id_ss,
        p.monto,
        p.metodo_pago,
        p.estado,
        p.numero_referencia,
        p.fecha_pago,
        ss.id_cliente,
        ss.id_tecnico,
        ss.id_servicio,
        u_cli.nombre AS nombre_cliente,
        u_tec.nombre AS nombre_tecnico,
        s.nombre AS nombre_servicio
      FROM pagos p
      JOIN solicitud_servicios ss ON ss.id_ss = p.id_ss
      JOIN usuarios u_cli ON u_cli.id_usuario = ss.id_cliente
      LEFT JOIN usuarios u_tec ON u_tec.id_usuario = ss.id_tecnico
      JOIN servicios s ON s.id_servicio = ss.id_servicio
      ORDER BY p.fecha_pago DESC
      LIMIT ${take} OFFSET ${skip}
    `;

    const totalResult = await this.prisma.$queryRaw`
      SELECT COUNT(*)::int AS total FROM pagos
    `;
    const total = Array.isArray(totalResult) ? (totalResult[0]?.total ?? 0) : 0;

    return {
      data: pagos,
      pagination: { page: currentPage, limit: take, total },
    };
  }

  async findBySolicitud(id_ss: string) {
    return this.prisma.$queryRaw`
      SELECT id_pago, id_ss, monto, metodo_pago, estado, numero_referencia, fecha_pago
      FROM pagos
      WHERE id_ss = ${id_ss}
      ORDER BY fecha_pago DESC
    `;
  }

  async findByCliente(id_cliente: string, actor?: Actor) {
    if (actor && actor.rol !== RolEnum.ADMIN && actor.userId !== id_cliente) {
      throw new UnauthorizedException(
        'Solo el cliente propietario puede consultar estos pagos',
      );
    }

    return this.prisma.$queryRaw`
      SELECT
        p.id_pago,
        p.id_ss,
        p.monto,
        p.metodo_pago,
        p.estado,
        p.numero_referencia,
        p.fecha_pago,
        ss.id_servicio,
        s.nombre AS nombre_servicio
      FROM pagos p
      JOIN solicitud_servicios ss ON ss.id_ss = p.id_ss
      JOIN servicios s ON s.id_servicio = ss.id_servicio
      WHERE ss.id_cliente = ${id_cliente}
      ORDER BY p.fecha_pago DESC
    `;
  }

  async updateEstadoPago(id_pago: string, nuevoEstado: string) {
    const pago = await this.findById(id_pago);

    if (pago.estado === nuevoEstado) return pago;

    const transiciones: Record<string, string[]> = {
      pendiente: ['pagado'],
      pagado: ['reembolsado'],
      reembolsado: [],
    };

    if (!Object.keys(transiciones).includes(nuevoEstado)) {
      throw new BadRequestException(
        "Estado invalido. Use: 'pendiente', 'pagado' o 'reembolsado'",
      );
    }

    const permitidos = transiciones[pago.estado] ?? [];
    if (!permitidos.includes(nuevoEstado)) {
      throw new BadRequestException(
        `Transicion invalida: no se puede pasar de '${pago.estado}' a '${nuevoEstado}'`,
      );
    }

    const numeroReferencia =
      nuevoEstado === 'pagado'
        ? (pago.numero_referencia ?? this.generarNumeroReferencia())
        : pago.numero_referencia;

    await this.prisma.$executeRaw`
      UPDATE pagos
      SET estado = ${nuevoEstado}, numero_referencia = ${numeroReferencia}
      WHERE id_pago = ${id_pago}
    `;

    return this.findById(id_pago);
  }

  async reembolsar(id_pago: string) {
    return this.updateEstadoPago(id_pago, 'reembolsado');
  }

  private generarIdPago(): string {
    return `PAG-${uuidv4().split('-')[0].toUpperCase()}`;
  }

  private generarNumeroReferencia(): string {
    return `REF-${uuidv4().split('-')[0].toUpperCase()}`;
  }

  private getPagination(page?: string, limit?: string) {
    const currentPage = Math.max(Number(page) || 1, 1);
    const take = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (currentPage - 1) * take;

    return { currentPage, take, skip };
  }
}
