import { Test, TestingModule } from '@nestjs/testing';
import { DireccionesService } from './direcciones.service';
import { PrismaService } from 'src/prisma.service';

describe('DireccionesService', () => {
  let service: DireccionesService;
  let prisma: Partial<PrismaService>;

  beforeEach(async () => {
    prisma = {
      $queryRaw: jest.fn(),
      $executeRaw: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DireccionesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<DireccionesService>(DireccionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
