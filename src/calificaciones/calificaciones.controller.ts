import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CalificacionesService } from './calificaciones.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolEnum } from 'src/auth/enums/rol.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Calificaciones')
@ApiBearerAuth()
@Controller('calificaciones')
export class CalificacionesController {
  constructor(private readonly calificacionesService: CalificacionesService) {}

  /**
   * Crea una calificacion para una solicitud completada.
   * Body: id_tecnico, id_cliente, id_ss, puntuacion y comentario opcional.
   * Respuesta: calificacion creada.
   */
  @Post()
  @ApiOperation({ summary: 'Crear calificacion' })
  @ApiResponse({ status: 201, description: 'Calificacion creada' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  create(@Body() createCalificacionDto: CreateCalificacionDto) {
    return this.calificacionesService.create(createCalificacionDto);
  }

  /**
   * Lista las calificaciones recibidas por un tecnico.
   * Parametros: id_tecnico.
   * Respuesta: calificaciones del tecnico.
   */
  @Get('tecnico/:id_tecnico')
  @ApiOperation({ summary: 'Listar calificaciones por tecnico' })
  @ApiResponse({ status: 200, description: 'Calificaciones encontradas' })
  findByTecnico(@Param('id_tecnico') id_tecnico: string) {
    return this.calificacionesService.findByTecnico(id_tecnico);
  }

  /**
   * Obtiene el promedio de calificacion de un tecnico.
   * Parametros: id_tecnico.
   * Respuesta: promedio y datos agregados.
   */
  @Get('tecnico/:id_tecnico/promedio')
  @ApiOperation({ summary: 'Obtener promedio por tecnico' })
  @ApiResponse({ status: 200, description: 'Promedio encontrado' })
  getPromedioPorTecnico(@Param('id_tecnico') id_tecnico: string) {
    return this.calificacionesService.getPromedioPorTecnico(id_tecnico);
  }

  /**
   * Lista las calificaciones realizadas por un cliente.
   * Parametros: id_cliente.
   * Respuesta: calificaciones del cliente.
   */
  @Get('cliente/:id_cliente')
  @ApiOperation({ summary: 'Listar calificaciones por cliente' })
  @ApiResponse({ status: 200, description: 'Calificaciones encontradas' })
  findByCliente(@Param('id_cliente') id_cliente: string) {
    return this.calificacionesService.findByCliente(id_cliente);
  }

  /**
   * Obtiene una calificacion por id.
   * Parametros: id de calificacion.
   * Respuesta: calificacion encontrada.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener calificacion por id' })
  @ApiResponse({ status: 200, description: 'Calificacion encontrada' })
  findOne(@Param('id') id: string) {
    return this.calificacionesService.findOne(id);
  }
}
