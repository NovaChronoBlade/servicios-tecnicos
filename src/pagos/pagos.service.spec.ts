import { Test, TestingModule } from '@nestjs/testing';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { PrismaService } from 'src/prisma.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('PagosService', () => {
  let service: PagosService;
  let prisma: Partial<PrismaService>;

  beforeEach(async () => {
    prisma = {
      $queryRaw: jest.fn(),
      $executeRaw: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagosService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PagosService>(PagosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('throws NotFoundException when solicitud not found', async () => {
    (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([]);
    const dto: CreatePagoDto = { id_ss: 'SS-1', monto: 100, metodo_pago: 'tarjeta' };
    await expect(service.createPago(dto, 'cli-1')).rejects.toThrow(NotFoundException);
  });

  it('throws Unauthorized when cliente no coincide', async () => {
    (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([{ id_ss: 'SS-1', estado: 'pendiente', id_cliente: 'otro-cli' }]);
    const dto: CreatePagoDto = { id_ss: 'SS-1', monto: 100, metodo_pago: 'tarjeta' };
    await expect(service.createPago(dto, 'cli-1')).rejects.toThrow(UnauthorizedException);
  });

  it('creates pago when data valid', async () => {
    (prisma.$queryRaw as jest.Mock)
      .mockResolvedValueOnce([{ id_ss: 'SS-1', estado: 'pendiente', id_cliente: 'cli-1' }]) // solicitud
      .mockResolvedValueOnce([]); // pagosExist

    (prisma.$executeRaw as jest.Mock).mockResolvedValueOnce(undefined);

    const dto: CreatePagoDto = { id_ss: 'SS-1', monto: 150.5, metodo_pago: 'tarjeta' };

    const result = await service.createPago(dto, 'cli-1');
    expect(result).toHaveProperty('id_pago');
    expect(result.id_ss).toBe('SS-1');
    expect(result.monto).toBe(150.5);
    expect(result.estado).toBe('pendiente');
  });
});
