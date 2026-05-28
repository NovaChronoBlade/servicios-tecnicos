import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PagosService {
  constructor(private prisma: PrismaService) {}

  async createPago(createPagoDto: CreatePagoDto, id_cliente: string) {
    const { id_ss, monto, metodo_pago } = createPagoDto;

    const solicitudes = await this.prisma.$queryRaw`
      SELECT id_ss, estado, id_cliente, id_servicio
      FROM solicitud_servicios
      WHERE id_ss = ${id_ss}
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

    if (solicitud.estado === 'completado') {
      throw new BadRequestException('No se puede pagar una solicitud completada');
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

    return { id_pago, id_ss, monto, metodo_pago, estado: 'pendiente' };
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

  async findBySolicitud(id_ss: string) {
    return this.prisma.$queryRaw`
      SELECT id_pago, id_ss, monto, metodo_pago, estado, numero_referencia, fecha_pago
      FROM pagos
      WHERE id_ss = ${id_ss}
      ORDER BY fecha_pago DESC
    `;
  }

  async findByCliente(id_cliente: string) {
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
}
