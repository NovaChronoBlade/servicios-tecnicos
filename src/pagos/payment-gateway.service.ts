import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type PaymentGatewayChargeRequest = {
  id_pago: string;
  id_ss: string;
  id_cliente: string;
  monto: number;
  moneda: string;
  metodo_pago: string;
  token_pago?: string;
};

export type PaymentGatewayChargeResult = {
  approved: boolean;
  estado: 'pendiente' | 'pagado';
  numero_referencia: string;
  provider: string;
  raw?: unknown;
};

@Injectable()
export class PaymentGatewayService {
  async charge(
    request: PaymentGatewayChargeRequest,
  ): Promise<PaymentGatewayChargeResult> {
    const mode = (process.env.PAYMENT_GATEWAY_MODE ?? 'mock').toLowerCase();

    if (mode === 'http') {
      return this.chargeWithHttpGateway(request);
    }

    return {
      approved: true,
      estado: 'pagado',
      numero_referencia: this.generateReference('MOCK'),
      provider: 'mock',
    };
  }

  private async chargeWithHttpGateway(
    request: PaymentGatewayChargeRequest,
  ): Promise<PaymentGatewayChargeResult> {
    const url = process.env.PAYMENT_GATEWAY_URL;
    if (!url) {
      throw new BadRequestException(
        'PAYMENT_GATEWAY_URL es requerido cuando PAYMENT_GATEWAY_MODE=http',
      );
    }

    const controller = new AbortController();
    const timeoutMs = Number(process.env.PAYMENT_GATEWAY_TIMEOUT_MS) || 10000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const headers: Record<string, string> = {
        'content-type': 'application/json',
      };
      if (process.env.PAYMENT_GATEWAY_API_KEY) {
        headers.authorization = `Bearer ${process.env.PAYMENT_GATEWAY_API_KEY}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        signal: controller.signal,
        body: JSON.stringify({
          reference: request.id_pago,
          service_request_id: request.id_ss,
          customer_id: request.id_cliente,
          amount: request.monto,
          currency: request.moneda,
          payment_method: request.metodo_pago,
          payment_token: request.token_pago,
        }),
      });

      const body = await this.readGatewayBody(response);
      if (!response.ok) {
        throw new BadGatewayException(
          'La pasarela de pago rechazo la solicitud',
        );
      }

      const status = String(
        body?.status ?? body?.estado ?? body?.payment_status ?? '',
      ).toLowerCase();
      const approved =
        body?.approved === true ||
        body?.aprobado === true ||
        ['approved', 'paid', 'pagado', 'succeeded', 'success'].includes(status);

      const numeroReferencia = String(
        body?.reference ??
          body?.numero_referencia ??
          body?.transaction_id ??
          body?.id ??
          this.generateReference('GW'),
      );

      return {
        approved,
        estado: approved ? 'pagado' : 'pendiente',
        numero_referencia: numeroReferencia,
        provider: 'http',
        raw: body,
      };
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      throw new BadGatewayException(
        'No fue posible comunicarse con la pasarela de pago',
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  private async readGatewayBody(response: Response) {
    const text = await response.text();
    if (!text) return {};

    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  }

  private generateReference(prefix: string) {
    return `${prefix}-${uuidv4().split('-')[0].toUpperCase()}`;
  }
}
