import { Test, TestingModule } from '@nestjs/testing';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  createPrismaServiceMock,
  PrismaServiceMock,
} from 'src/common/testing/prisma-service.mock';

describe('PagosService', () => {
  let service: PagosService;
  let prisma: PrismaServiceMock;

  beforeEach(async () => {
    prisma = createPrismaServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [PagosService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PagosService>(PagosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('throws NotFoundException when solicitud not found', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([]);
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
    prisma.$queryRaw.mockResolvedValueOnce([
      { id_ss: 'SS-1', estado: 'pendiente', id_cliente: 'otro-cli' },
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

  it('rejects completed or already paid requests', async () => {
    const dto: CreatePagoDto = {
      id_ss: 'SS-1',
      monto: 100,
      metodo_pago: 'tarjeta',
    };

    prisma.$queryRaw.mockResolvedValueOnce([
      { id_ss: 'SS-1', estado: 'completado', id_cliente: 'cli-1' },
    ]);

    await expect(service.createPago(dto, 'cli-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );

    prisma.$queryRaw
      .mockResolvedValueOnce([
        { id_ss: 'SS-1', estado: 'pendiente', id_cliente: 'cli-1' },
      ])
      .mockResolvedValueOnce([{ id_pago: 'PAG-1' }]);

    await expect(service.createPago(dto, 'cli-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('creates pago when data valid', async () => {
    prisma.$queryRaw
      .mockResolvedValueOnce([
        { id_ss: 'SS-1', estado: 'pendiente', id_cliente: 'cli-1' },
      ]) // solicitud
      .mockResolvedValueOnce([]); // pagosExist

    prisma.$executeRaw.mockResolvedValueOnce(undefined);

    const dto: CreatePagoDto = {
      id_ss: 'SS-1',
      monto: 150.5,
      metodo_pago: 'tarjeta',
    };

    const result = await service.createPago(dto, 'cli-1');
    expect(result).toHaveProperty('id_pago');
    expect(result.id_ss).toBe('SS-1');
    expect(result.monto).toBe(150.5);
    expect(result.estado).toBe('pendiente');
  });

  it('findById returns a payment or throws NotFoundException', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([{ id_pago: 'PAG-1' }]);

    await expect(service.findById('PAG-1')).resolves.toEqual({
      id_pago: 'PAG-1',
    });

    prisma.$queryRaw.mockResolvedValueOnce([]);

    await expect(service.findById('PAG-NO')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updateEstadoPago returns unchanged payments and persists changes', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([
      { id_pago: 'PAG-1', estado: 'pendiente' },
    ]);

    await expect(
      service.updateEstadoPago('PAG-1', 'pendiente'),
    ).resolves.toEqual({
      id_pago: 'PAG-1',
      estado: 'pendiente',
    });

    prisma.$queryRaw
      .mockResolvedValueOnce([{ id_pago: 'PAG-1', estado: 'pendiente' }])
      .mockResolvedValueOnce([{ id_pago: 'PAG-1', estado: 'pagado' }]);
    prisma.$executeRaw.mockResolvedValue(1);

    await expect(service.updateEstadoPago('PAG-1', 'pagado')).resolves.toEqual({
      id_pago: 'PAG-1',
      estado: 'pagado',
    });
  });
});
