import {
  Body,
  Controller,
  Get,
  Param,
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

  @Post()
  @ApiOperation({ summary: 'Crear calificacion' })
  @ApiResponse({ status: 201, description: 'Calificacion creada' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  create(@Body() createCalificacionDto: CreateCalificacionDto, @Request() req) {
    return this.calificacionesService.create(createCalificacionDto, req.user);
  }

  @Get('top-tecnicos')
  getTopTecnicos(@Query('limit') limit?: string) {
    return this.calificacionesService.getTopTecnicos(limit);
  }

  @Get('tecnico/:id_tecnico')
  @ApiOperation({ summary: 'Listar calificaciones por tecnico' })
  @ApiResponse({ status: 200, description: 'Calificaciones encontradas' })
  findByTecnico(
    @Param('id_tecnico') id_tecnico: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.calificacionesService.findByTecnico(id_tecnico, page, limit);
  }

  @Get('tecnico/:id_tecnico/promedio')
  @ApiOperation({ summary: 'Obtener promedio por tecnico' })
  @ApiResponse({ status: 200, description: 'Promedio encontrado' })
  getPromedioPorTecnico(@Param('id_tecnico') id_tecnico: string) {
    return this.calificacionesService.getPromedioPorTecnico(id_tecnico);
  }

  @Get('cliente/:id_cliente')
  @ApiOperation({ summary: 'Listar calificaciones por cliente' })
  @ApiResponse({ status: 200, description: 'Calificaciones encontradas' })
  findByCliente(
    @Param('id_cliente') id_cliente: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.calificacionesService.findByCliente(id_cliente, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener calificacion por id' })
  @ApiResponse({ status: 200, description: 'Calificacion encontrada' })
  findOne(@Param('id') id: string) {
    return this.calificacionesService.findOne(id);
  }
}
