import { Module } from '@nestjs/common';
import { SolicitudServiciosService } from './solicitud_servicios.service';
import { SolicitudServiciosController } from './solicitud_servicios.controller';
import { DireccionesModule } from 'src/direcciones/direcciones.module';
import { PagosModule } from 'src/pagos/pagos.module';

@Module({
  imports: [DireccionesModule, PagosModule],
  controllers: [SolicitudServiciosController],
  providers: [SolicitudServiciosService],
})
export class SolicitudServiciosModule {}
