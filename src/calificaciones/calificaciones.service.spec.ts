import { Test, TestingModule } from '@nestjs/testing';
import { CalificacionesService } from './calificaciones.service';
import { PrismaService } from 'src/prisma.service';

describe('CalificacionesService', () => {
  let service: CalificacionesService;
  let prismaMock: Partial<PrismaService>;

  beforeEach(async () => {
    prismaMock = { $queryRaw: jest.fn(), $executeRaw: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalificacionesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<CalificacionesService>(CalificacionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
