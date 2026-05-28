import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';

import { CreateSolicitudServicioDto } from './dto/create-solicitud-servicio.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolEnum } from 'src/auth/enums/rol.enum';
import { SolicitudServiciosService } from './solicitud_servicios.service';

@Controller('solicitudes-servicio')
export class SolicitudServiciosController {
  constructor(
    private readonly solicitudServiciosService: SolicitudServiciosService,
  ) {}

  // ------------------------------------------------------------
  // Crear solicitud
  // ------------------------------------------------------------
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  create(
    @Body()
    createSolicitudDto: CreateSolicitudServicioDto,
    @Request() req,
  ) {
    return this.solicitudServiciosService.create(createSolicitudDto, req.user);
  }

  // ------------------------------------------------------------
  // Obtener todas las solicitudes
  // ------------------------------------------------------------
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  findAll() {
    return this.solicitudServiciosService.findAll();
  }

  // ------------------------------------------------------------
  // Obtener solicitudes por estado
  // ------------------------------------------------------------
  @Get('estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  findByEstado(@Query('estado') estado: string) {
    return this.solicitudServiciosService.findByEstado(estado);
  }

  // ------------------------------------------------------------
  // Obtener solicitudes de un cliente
  // ------------------------------------------------------------
  @Get('cliente/:id_cliente')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  findByCliente(@Param('id_cliente') id_cliente: string) {
    return this.solicitudServiciosService.findByCliente(id_cliente);
  }

  // ------------------------------------------------------------
  // Obtener solicitudes de un técnico
  // ------------------------------------------------------------
  @Get('tecnico/:id_tecnico')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  findByTecnico(@Param('id_tecnico') id_tecnico: string) {
    return this.solicitudServiciosService.findByTecnico(id_tecnico);
  }

  // ------------------------------------------------------------
  // Obtener solicitudes pendientes disponibles para técnicos
  // ------------------------------------------------------------
  @Get('pendientes-disponibles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  findPendientesDisponibles() {
    return this.solicitudServiciosService.findPendientesDisponibles();
  }

  // ------------------------------------------------------------
  // Obtener solicitud por ID
  // ------------------------------------------------------------
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.solicitudServiciosService.findOne(id);
  }

  // ------------------------------------------------------------
  // Actualizar estado de solicitud
  // ------------------------------------------------------------
  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  updateEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.solicitudServiciosService.updateEstado(id, estado);
  }

  // ------------------------------------------------------------
  // Asignar técnico a solicitud
  // ------------------------------------------------------------
  @Patch(':id/asignar-tecnico/:id_tecnico')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  asignarTecnico(
    @Param('id') id: string,
    @Param('id_tecnico') id_tecnico: string,
    @Request() req,
  ) {
    return this.solicitudServiciosService.asignarTecnico(id, id_tecnico, req.user);
  }

  // ------------------------------------------------------------
  // Confirmación de finalización por cliente
  // ------------------------------------------------------------
  @Patch(':id/confirmar/cliente')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE)
  confirmarCliente(@Param('id') id: string, @Request() req) {
    return this.solicitudServiciosService.confirmarPorCliente(id, req.user.userId);
  }

  // ------------------------------------------------------------
  // Confirmación de finalización por técnico
  // ------------------------------------------------------------
  @Patch(':id/confirmar/tecnico')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO)
  confirmarTecnico(@Param('id') id: string, @Request() req) {
    return this.solicitudServiciosService.confirmarPorTecnico(id, req.user.userId);
  }
}
