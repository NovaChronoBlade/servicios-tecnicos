import { Test, TestingModule } from '@nestjs/testing';
import { DireccionesController } from './direcciones.controller';
import { DireccionesService } from './direcciones.service';
import { PrismaService } from 'src/prisma.service';

describe('DireccionesController', () => {
  let controller: DireccionesController;

  beforeEach(async () => {
    const prisma: Partial<PrismaService> = {
      $queryRaw: jest.fn(),
      $executeRaw: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DireccionesController],
      providers: [
        DireccionesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    controller = module.get<DireccionesController>(DireccionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
