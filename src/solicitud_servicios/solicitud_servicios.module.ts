import { Module } from '@nestjs/common';
import { SolicitudServiciosService } from './solicitud_servicios.service';
import { SolicitudServiciosController } from './solicitud_servicios.controller';
import { DireccionesModule } from 'src/direcciones/direcciones.module';

@Module({
  imports: [DireccionesModule],
  controllers: [SolicitudServiciosController],
  providers: [SolicitudServiciosService],
})
export class SolicitudServiciosModule {}
