import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateDetallesTecnicosDto } from './dto/create-detallesTecnicos.dto';
import { UpdateDetallesTecnicosDto } from './dto/update-detallesTecnicos.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolEnum } from 'src/auth/enums/rol.enum';

@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('rol') rol?: string,
    @Query('activo') activo?: string,
  ) {
    return this.usuariosService.findAll({ page, limit, rol, activo });
  }

  @Get('tecnicos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  findTecnicos(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('disponible') disponible?: string,
  ) {
    return this.usuariosService.findTecnicos({ page, limit, disponible });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.usuariosService.findPerfil(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Request() req,
  ) {
    return this.usuariosService.updatePerfil(id, updateUsuarioDto, req.user);
  }

  @Patch(':id/desactivar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  desactivar(@Param('id') id: string) {
    return this.usuariosService.desactivar(id);
  }

  @Post(':id_tecnico/datos-tecnicos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  agregarDatosTecnicos(
    @Param('id_tecnico') idTecnico: string,
    @Body() createDetallesTecnicosDto: CreateDetallesTecnicosDto,
    @Request() req,
  ) {
    return this.usuariosService.agregarDatosTecnicos(
      createDetallesTecnicosDto,
      idTecnico,
      req.user,
    );
  }

  @Patch(':id/detalles-tecnicos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  updateDetallesTecnicos(
    @Param('id') id: string,
    @Body() updateDetallesTecnicosDto: UpdateDetallesTecnicosDto,
    @Request() req,
  ) {
    return this.usuariosService.updateDetallesTecnicos(
      id,
      updateDetallesTecnicosDto,
      req.user,
    );
  }
}
