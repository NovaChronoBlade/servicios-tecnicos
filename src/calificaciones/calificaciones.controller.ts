import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CalificacionesService } from './calificaciones.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolEnum } from 'src/auth/enums/rol.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';

@UseGuards(JwtAuthGuard)
@Controller('calificaciones')
export class CalificacionesController {
  constructor(private readonly calificacionesService: CalificacionesService) {}
  // ------------------------------------------------------------
  // Crear una calificación
  // ------------------------------------------------------------
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  create(@Body() createCalificacionDto: CreateCalificacionDto) {
    return this.calificacionesService.create(createCalificacionDto);
  }

  // ------------------------------------------------------------
  // Obtener una calificación por ID
  // ------------------------------------------------------------
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calificacionesService.findOne(id);
  }

  // ------------------------------------------------------------
  // Obtener calificaciones de un técnico
  // ------------------------------------------------------------
  @Get('tecnico/:id_tecnico')
  findByTecnico(@Param('id_tecnico') id_tecnico: string) {
    return this.calificacionesService.findByTecnico(id_tecnico);
  }

  // ------------------------------------------------------------
  // Obtener promedio de un técnico
  // ------------------------------------------------------------
  @Get('tecnico/:id_tecnico/promedio')
  getPromedioPorTecnico(@Param('id_tecnico') id_tecnico: string) {
    return this.calificacionesService.getPromedioPorTecnico(id_tecnico);
  }

  // ------------------------------------------------------------
  // Obtener calificaciones hechas por un cliente
  // ------------------------------------------------------------
  @Get('cliente/:id_cliente')
  findByCliente(@Param('id_cliente') id_cliente: string) {
    return this.calificacionesService.findByCliente(id_cliente);
  }
}
