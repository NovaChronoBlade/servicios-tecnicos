import { Test, TestingModule } from '@nestjs/testing';
import { SolicitudServiciosController } from './solicitud_servicios.controller';
import { SolicitudServiciosService } from './solicitud_servicios.service';
import { PrismaService } from 'src/prisma.service';
import { DireccionesService } from 'src/direcciones/direcciones.service';

describe('SolicitudServiciosController', () => {
  let controller: SolicitudServiciosController;
  let prismaMock: Partial<PrismaService>;
  let direccionesMock: Partial<DireccionesService>;

  beforeEach(async () => {
    prismaMock = { $queryRaw: jest.fn(), $executeRaw: jest.fn() } as any;
    direccionesMock = { belongsToUser: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolicitudServiciosController],
      providers: [
        SolicitudServiciosService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: DireccionesService, useValue: direccionesMock },
      ],
    }).compile();

    controller = module.get<SolicitudServiciosController>(
      SolicitudServiciosController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
