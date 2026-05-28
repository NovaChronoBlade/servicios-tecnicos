import { BadGatewayException, BadRequestException } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';

describe('PaymentGatewayService', () => {
  const originalEnv = process.env;
  const request = {
    id_pago: 'PAG-1',
    id_ss: 'SS-1',
    id_cliente: 'USR-CLI-1',
    monto: 89000,
    moneda: 'COP',
    metodo_pago: 'tarjeta',
    token_pago: 'tok_test',
  };

  beforeEach(() => {
    jest.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('approves payments with the local mock gateway', async () => {
    process.env.PAYMENT_GATEWAY_MODE = 'mock';
    const service = new PaymentGatewayService();

    await expect(service.charge(request)).resolves.toMatchObject({
      approved: true,
      estado: 'pagado',
      provider: 'mock',
    });
  });

  it('requires a URL for the HTTP gateway mode', async () => {
    process.env.PAYMENT_GATEWAY_MODE = 'http';
    delete process.env.PAYMENT_GATEWAY_URL;
    const service = new PaymentGatewayService();

    await expect(service.charge(request)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('sends charges to the configured HTTP gateway', async () => {
    process.env.PAYMENT_GATEWAY_MODE = 'http';
    process.env.PAYMENT_GATEWAY_URL = 'https://gateway.test/payments';
    process.env.PAYMENT_GATEWAY_API_KEY = 'secret';
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue(
        JSON.stringify({
          status: 'approved',
          transaction_id: 'TX-123',
        }),
      ),
    } as any);
    const service = new PaymentGatewayService();

    await expect(service.charge(request)).resolves.toEqual({
      approved: true,
      estado: 'pagado',
      numero_referencia: 'TX-123',
      provider: 'http',
      raw: { status: 'approved', transaction_id: 'TX-123' },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://gateway.test/payments',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          authorization: 'Bearer secret',
        }),
      }),
    );
  });

  it('maps gateway failures to BadGatewayException', async () => {
    process.env.PAYMENT_GATEWAY_MODE = 'http';
    process.env.PAYMENT_GATEWAY_URL = 'https://gateway.test/payments';
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      text: jest.fn().mockResolvedValue('{"error":"declined"}'),
    } as any);
    const service = new PaymentGatewayService();

    await expect(service.charge(request)).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });
});
