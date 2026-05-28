import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DireccionesService } from './direcciones.service';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolEnum } from 'src/auth/enums/rol.enum';

@UseGuards(JwtAuthGuard)
@ApiTags('Direcciones')
@ApiBearerAuth()
@Controller('direcciones')
export class DireccionesController {
  constructor(private readonly direccionesService: DireccionesService) {}

  /**
   * Crea una direccion para el usuario autenticado o para otro usuario si es admin.
   * Body: direccion, tipo de edificio, informacion adicional, nota y es_default.
   * Respuesta: direccion creada.
   */
  @Post()
  @ApiOperation({ summary: 'Crear direccion' })
  @ApiResponse({ status: 201, description: 'Direccion creada' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  create(@Body() createDireccionDto: CreateDireccionDto, @Request() req) {
    return this.direccionesService.create(createDireccionDto, req.user);
  }

  /**
   * Lista direcciones visibles para el actor autenticado.
   * Parametros: ninguno.
   * Respuesta: direcciones propias o todas si el actor es admin.
   */
  @Get()
  @ApiOperation({ summary: 'Listar direcciones' })
  @ApiResponse({ status: 200, description: 'Direcciones encontradas' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  findAll(@Request() req) {
    return this.direccionesService.findAll(req.user);
  }

  /**
   * Lista direcciones de un usuario especifico.
   * Parametros: id_usuario.
   * Respuesta: direcciones del usuario si el actor tiene permiso.
   */
  @Get('usuario/:id_usuario')
  @ApiOperation({ summary: 'Listar direcciones por usuario' })
  @ApiResponse({ status: 200, description: 'Direcciones encontradas' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  findByUsuario(@Param('id_usuario') id_usuario: string, @Request() req) {
    return this.direccionesService.findByUsuario(id_usuario, req.user);
  }

  /**
   * Obtiene una direccion por id.
   * Parametros: id de direccion.
   * Respuesta: direccion encontrada.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener direccion por id' })
  @ApiResponse({ status: 200, description: 'Direccion encontrada' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.direccionesService.findOne(id, req.user);
  }

  /**
   * Actualiza una direccion propia o de cualquier usuario si el actor es admin.
   * Parametros: id de direccion.
   * Body: campos modificables de direccion.
   * Respuesta: direccion actualizada.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar direccion' })
  @ApiResponse({ status: 200, description: 'Direccion actualizada' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateDireccionDto: UpdateDireccionDto,
    @Request() req,
  ) {
    return this.direccionesService.update(id, updateDireccionDto, req.user);
  }

  /**
   * Elimina una direccion.
   * Parametros: id de direccion.
   * Respuesta: mensaje de confirmacion.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar direccion' })
  @ApiResponse({ status: 200, description: 'Direccion eliminada' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.direccionesService.remove(id, req.user);
  }
}
