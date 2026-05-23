import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, RolesGuard],
})
export class UsuariosModule {}
