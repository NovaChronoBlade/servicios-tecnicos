import { Test, TestingModule } from '@nestjs/testing';
import { SolicitudServiciosService } from './solicitud_servicios.service';
import { PrismaService } from 'src/prisma.service';

describe('SolicitudServiciosService', () => {
  let service: SolicitudServiciosService;
  let prismaMock: Partial<PrismaService>;

  beforeEach(async () => {
    prismaMock = { $queryRaw: jest.fn(), $executeRaw: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [SolicitudServiciosService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    service = module.get<SolicitudServiciosService>(SolicitudServiciosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findPendientesDisponibles returns pending unassigned requests', async () => {
    (prismaMock.$queryRaw as jest.Mock).mockResolvedValueOnce([
      {
        id_ss: 'SS-1',
        estado: 'pendiente',
        id_tecnico: null,
        nombre_servicio: 'Servicio X',
      },
    ]);

    const result = await service.findPendientesDisponibles();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id_ss: 'SS-1',
      estado: 'pendiente',
      id_tecnico: null,
    });
  });
});
