import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { CalificacionesModule } from './calificaciones/calificaciones.module';
import { ServiciosModule } from './servicios/servicios.module';
import { SolicitudServiciosModule } from './solicitud_servicios/solicitud_servicios.module';
import { PagosModule } from './pagos/pagos.module';
import { DireccionesModule } from './direcciones/direcciones.module';

@Module({
  imports: [PrismaModule, UsuariosModule, AuthModule, CalificacionesModule, ServiciosModule, SolicitudServiciosModule, PagosModule, DireccionesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
