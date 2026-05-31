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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateDetallesTecnicosDto } from './dto/create-detallesTecnicos.dto';
import { UpdateDetallesTecnicosDto } from './dto/update-detallesTecnicos.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolEnum } from 'src/auth/enums/rol.enum';

@UseGuards(JwtAuthGuard)
@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  /**
   * Lista usuarios con paginacion y filtros de rol/estado.
   * Query params: page, limit, rol, activo.
   * Respuesta: lista paginada de usuarios sin contrasena.
   */
  @Get()
  @ApiOperation({ summary: 'Listar usuarios' })
  @ApiResponse({ status: 200, description: 'Usuarios encontrados' })
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

  /**
   * Lista tecnicos activos con filtros de disponibilidad.
   * Query params: page, limit, disponible.
   * Respuesta: lista paginada de tecnicos.
   */
  @Get('tecnicos')
  @ApiOperation({ summary: 'Listar tecnicos disponibles para clientes/admin' })
  @ApiResponse({ status: 200, description: 'Tecnicos encontrados' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  findTecnicos(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('disponible') disponible?: string,
  ) {
    return this.usuariosService.findTecnicos({ page, limit, disponible });
  }

  @Get('me/detalles-tecnicos')
  @ApiOperation({ summary: 'Obtener datos tecnicos del tecnico autenticado' })
  @ApiResponse({ status: 200, description: 'Datos tecnicos encontrados' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  findMisDetallesTecnicos(@Request() req) {
    return this.usuariosService.findDetallesTecnicosPerfil(
      req.user.userId,
      req.user,
    );
  }

  @Get(':id/detalles-tecnicos')
  @ApiOperation({ summary: 'Obtener datos tecnicos por usuario' })
  @ApiResponse({ status: 200, description: 'Datos tecnicos encontrados' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  findDetallesTecnicos(@Param('id') id: string, @Request() req) {
    return this.usuariosService.findDetallesTecnicosPerfil(id, req.user);
  }

  /**
   * Obtiene el perfil publico de un usuario.
   * Parametros: id del usuario.
   * Respuesta: datos publicos del usuario.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener perfil de usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({
    status: 403,
    description: 'El actor no puede consultar este usuario',
  })
  findOne(@Param('id') id: string, @Request() req) {
    return this.usuariosService.findPerfil(id, req.user);
  }

  /**
   * Actualiza el perfil propio o de un usuario si el actor es administrador.
   * Parametros: id del usuario.
   * Body: campos permitidos del perfil.
   * Respuesta: perfil actualizado.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar perfil de usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Request() req,
  ) {
    return this.usuariosService.updatePerfil(id, updateUsuarioDto, req.user);
  }

  /**
   * Desactiva una cuenta de usuario.
   * Parametros: id del usuario.
   * Respuesta: mensaje de confirmacion.
   */
  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario desactivado' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  desactivar(@Param('id') id: string) {
    return this.usuariosService.desactivar(id);
  }

  /**
   * Crea los datos tecnicos de un usuario tecnico.
   * Parametros: id_tecnico.
   * Body: especialidad, licencia y disponibilidad.
   * Respuesta: datos tecnicos creados.
   */
  @Post(':id_tecnico/datos-tecnicos')
  @ApiOperation({ summary: 'Agregar datos tecnicos' })
  @ApiResponse({ status: 201, description: 'Datos tecnicos agregados' })
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

  /**
   * Actualiza los datos tecnicos de un usuario tecnico.
   * Parametros: id del tecnico.
   * Body: campos tecnicos a modificar.
   * Respuesta: datos tecnicos actualizados.
   */
  @Patch(':id/detalles-tecnicos')
  @ApiOperation({ summary: 'Actualizar datos tecnicos' })
  @ApiResponse({ status: 200, description: 'Datos tecnicos actualizados' })
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
