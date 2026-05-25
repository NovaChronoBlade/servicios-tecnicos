import { Test, TestingModule } from '@nestjs/testing';
import { ServiciosService } from './servicios.service';
import { PrismaService } from 'src/prisma.service';

describe('ServiciosService', () => {
  let service: ServiciosService;
  let prismaMock: Partial<PrismaService>;

  beforeEach(async () => {
    prismaMock = { $queryRaw: jest.fn(), $executeRaw: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiciosService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    service = module.get<ServiciosService>(ServiciosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
