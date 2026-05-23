import { Test, TestingModule } from '@nestjs/testing';
import { SolicitudServiciosController } from './solicitud_servicios.controller';
import { SolicitudServiciosService } from './solicitud_servicios.service';

describe('SolicitudServiciosController', () => {
  let controller: SolicitudServiciosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolicitudServiciosController],
      providers: [SolicitudServiciosService],
    }).compile();

    controller = module.get<SolicitudServiciosController>(SolicitudServiciosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
