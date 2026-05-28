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

  private generarIdPago(): string {
    return `PAG-${uuidv4().split('-')[0].toUpperCase()}`;
  }

  async createPago(createPagoDto: CreatePagoDto, id_cliente: string) {
    const { id_ss, monto, metodo_pago } = createPagoDto;
    // Verificar solicitud
    const solicitudes = await this.prisma.$queryRaw`
			SELECT id_ss, estado, id_cliente, id_servicio
			FROM solicitud_servicios
			WHERE id_ss = ${id_ss}
			LIMIT 1
		`;
    const solicitud = Array.isArray(solicitudes) ? solicitudes[0] : null;
    if (!solicitud)
      throw new NotFoundException(`Solicitud '${id_ss}' no encontrada`);

    if (solicitud.id_cliente !== id_cliente) {
      throw new UnauthorizedException(
        'Solo el cliente propietario puede realizar el pago',
      );
    }

    if (solicitud.estado === 'completado') {
      throw new BadRequestException(
        'No se puede pagar una solicitud completada',
      );
    }

    // Verificar que no exista pago previo
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
			SELECT id_pago, id_ss, monto, metodo_pago, estado, fecha_pago
			FROM pagos WHERE id_pago = ${id_pago} LIMIT 1
		`;

    const pago = Array.isArray(pagos) ? pagos[0] : null;
    if (!pago) throw new NotFoundException(`Pago '${id_pago}' no encontrado`);
    return pago;
  }

  async updateEstadoPago(id_pago: string, nuevoEstado: string) {
    const pago = await this.findById(id_pago);

    if (pago.estado === nuevoEstado) return pago;

    // Validaciones simples: evitar pagos duplicados en estado 'pagado'
    if (pago.estado === 'pagado' && nuevoEstado === 'pagado') {
      throw new BadRequestException('El pago ya está marcado como pagado');
    }

    await this.prisma.$executeRaw`
			UPDATE pagos SET estado = ${nuevoEstado} WHERE id_pago = ${id_pago}
		`;

    return this.findById(id_pago);
  }
}
