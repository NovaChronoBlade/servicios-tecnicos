import { Test, TestingModule } from '@nestjs/testing';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';

describe('PagosService', () => {
  let service: PagosService;
  let prisma: Partial<PrismaService>;
  let paymentGateway: { charge: jest.Mock };

  beforeEach(async () => {
    prisma = {
      $queryRaw: jest.fn(),
      $executeRaw: jest.fn(),
    } as any;
    paymentGateway = {
      charge: jest.fn().mockResolvedValue({
        approved: true,
        estado: 'pagado',
        numero_referencia: 'REF-TEST',
        provider: 'mock',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagosService,
        { provide: PrismaService, useValue: prisma },
        { provide: PaymentGatewayService, useValue: paymentGateway },
      ],
    }).compile();

    service = module.get<PagosService>(PagosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('throws NotFoundException when solicitud not found', async () => {
    (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([]);
    const dto: CreatePagoDto = {
      id_ss: 'SS-1',
      monto: 100,
      metodo_pago: 'tarjeta',
    };
    await expect(service.createPago(dto, 'cli-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws Unauthorized when cliente no coincide', async () => {
    (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([
      { id_ss: 'SS-1', estado: 'pendiente', id_cliente: 'otro-cli', precio_servicio: 100 },
    ]);
    const dto: CreatePagoDto = {
      id_ss: 'SS-1',
      monto: 100,
      metodo_pago: 'tarjeta',
    };
    await expect(service.createPago(dto, 'cli-1')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects completed requests and duplicate payments', async () => {
    const dto: CreatePagoDto = {
      id_ss: 'SS-1',
      monto: 100,
      metodo_pago: 'tarjeta',
    };

    (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([
      { id_ss: 'SS-1', estado: 'completado', id_cliente: 'cli-1', precio_servicio: 100 },
    ]);
    await expect(service.createPago(dto, 'cli-1')).rejects.toThrow(
      BadRequestException,
    );

    (prisma.$queryRaw as jest.Mock)
      .mockResolvedValueOnce([
        { id_ss: 'SS-1', estado: 'pendiente', id_cliente: 'cli-1', precio_servicio: 100 },
      ])
      .mockResolvedValueOnce([{ id_pago: 'PAG-1' }]);
    await expect(service.createPago(dto, 'cli-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('creates pago when data valid', async () => {
    (prisma.$queryRaw as jest.Mock)
      .mockResolvedValueOnce([
        { id_ss: 'SS-1', estado: 'pendiente', id_cliente: 'cli-1', precio_servicio: 150.5 },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          id_pago: 'PAG-1',
          id_ss: 'SS-1',
          monto: 150.5,
          metodo_pago: 'tarjeta',
          estado: 'pagado',
          numero_referencia: 'REF-TEST',
        },
      ]);

    (prisma.$executeRaw as jest.Mock).mockResolvedValue(undefined);

    const dto: CreatePagoDto = {
      id_ss: 'SS-1',
      monto: 150.5,
      metodo_pago: 'tarjeta',
      token_pago: 'tok_test',
    };

    const result = await service.createPago(dto, 'cli-1');
    expect(paymentGateway.charge).toHaveBeenCalledWith(
      expect.objectContaining({
        id_ss: 'SS-1',
        id_cliente: 'cli-1',
        token_pago: 'tok_test',
        moneda: 'COP',
      }),
    );
    expect(result.id_pago).toBe('PAG-1');
    expect(result.id_ss).toBe('SS-1');
    expect(result.monto).toBe(150.5);
    expect(result.estado).toBe('pagado');
    expect(result.numero_referencia).toBe('REF-TEST');
    expect(result.pasarela).toEqual({ provider: 'mock', approved: true });
    expect(prisma.$executeRaw).toHaveBeenCalledTimes(2);
  });

  it('finds payments by id, solicitud and cliente', async () => {
    (prisma.$queryRaw as jest.Mock)
      .mockResolvedValueOnce([{ id_pago: 'PAG-1' }])
      .mockResolvedValueOnce([{ id_pago: 'PAG-SS' }])
      .mockResolvedValueOnce([{ id_pago: 'PAG-CLI' }]);

    await expect(service.findById('PAG-1')).resolves.toEqual({
      id_pago: 'PAG-1',
    });
    await expect(service.findBySolicitud('SS-1')).resolves.toEqual([
      { id_pago: 'PAG-SS' },
    ]);
    await expect(service.findByCliente('cli-1')).resolves.toEqual([
      { id_pago: 'PAG-CLI' },
    ]);
  });

  it('throws NotFoundException when payment does not exist', async () => {
    (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([]);

    await expect(service.findById('PAG-NO')).rejects.toThrow(NotFoundException);
  });

  it('updates payment status with valid transitions and refunds', async () => {
    (prisma.$queryRaw as jest.Mock)
      .mockResolvedValueOnce([{ id_pago: 'PAG-1', estado: 'pendiente' }])
      .mockResolvedValueOnce([{ id_pago: 'PAG-1', estado: 'pagado' }])
      .mockResolvedValueOnce([{ id_pago: 'PAG-1', estado: 'pagado' }])
      .mockResolvedValueOnce([{ id_pago: 'PAG-1', estado: 'reembolsado' }]);
    (prisma.$executeRaw as jest.Mock).mockResolvedValue(undefined);

    await expect(service.updateEstadoPago('PAG-1', 'pagado')).resolves.toEqual({
      id_pago: 'PAG-1',
      estado: 'pagado',
    });

    await expect(service.reembolsar('PAG-1')).resolves.toEqual({
      id_pago: 'PAG-1',
      estado: 'reembolsado',
    });
  });

  it('rejects invalid payment transitions', async () => {
    (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([
      { id_pago: 'PAG-1', estado: 'pendiente' },
    ]);

    await expect(
      service.updateEstadoPago('PAG-1', 'rechazado'),
    ).rejects.toThrow(BadRequestException);

    (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([
      { id_pago: 'PAG-1', estado: 'pendiente' },
    ]);

    await expect(
      service.updateEstadoPago('PAG-1', 'reembolsado'),
    ).rejects.toThrow(BadRequestException);
  });
});
