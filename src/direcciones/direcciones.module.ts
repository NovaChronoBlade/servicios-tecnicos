import { Module } from '@nestjs/common';
import { DireccionesService } from './direcciones.service';
import { DireccionesController } from './direcciones.controller';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Module({
  controllers: [DireccionesController],
  providers: [DireccionesService, RolesGuard, JwtAuthGuard],
  exports: [DireccionesService],
})
export class DireccionesModule {}
