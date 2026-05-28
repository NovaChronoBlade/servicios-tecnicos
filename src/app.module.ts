import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
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
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get<string>('LOG_LEVEL', 'info'),
          redact: ['req.headers.authorization', 'req.headers.cookie'],
        },
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          name: 'default',
          ttl: 60000,
          limit: 100,
        },
        {
          name: 'login',
          ttl: configService.get<number>('LOGIN_THROTTLE_TTL', 60000),
          limit: configService.get<number>('LOGIN_THROTTLE_LIMIT', 5),
        },
      ],
    }),
    PrismaModule,
    UsuariosModule,
    AuthModule,
    CalificacionesModule,
    ServiciosModule,
    SolicitudServiciosModule,
    PagosModule,
    DireccionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
