import { Module } from '@nestjs/common';
import { SolicitudServiciosService } from './solicitud_servicios.service';
import { SolicitudServiciosController } from './solicitud_servicios.controller';

@Module({
  controllers: [SolicitudServiciosController],
  providers: [SolicitudServiciosService],
})
export class SolicitudServiciosModule {}
