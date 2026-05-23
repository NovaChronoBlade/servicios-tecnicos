import { Controller } from '@nestjs/common';
import { SolicitudServiciosService } from './solicitud_servicios.service';

@Controller('solicitud-servicios')
export class SolicitudServiciosController {
  constructor(private readonly solicitudServiciosService: SolicitudServiciosService) {}
}
