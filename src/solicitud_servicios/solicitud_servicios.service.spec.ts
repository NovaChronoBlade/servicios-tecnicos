import { Test, TestingModule } from '@nestjs/testing';
import { SolicitudServiciosService } from './solicitud_servicios.service';

describe('SolicitudServiciosService', () => {
  let service: SolicitudServiciosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SolicitudServiciosService],
    }).compile();

    service = module.get<SolicitudServiciosService>(SolicitudServiciosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
