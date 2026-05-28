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
import { CreateSolicitudServicioDto } from './dto/create-solicitud-servicio.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolEnum } from 'src/auth/enums/rol.enum';
import { SolicitudServiciosService } from './solicitud_servicios.service';

@ApiTags('Solicitudes de servicio')
@ApiBearerAuth()
@Controller('solicitudes-servicio')
export class SolicitudServiciosController {
  constructor(
    private readonly solicitudServiciosService: SolicitudServiciosService,
  ) {}

  /**
   * Crea una nueva solicitud de servicio para el cliente autenticado.
   * Body: id_cliente, id_servicio, id_direccion e id_tecnico opcional.
   * Respuesta: solicitud creada en estado pendiente.
   */
  @Post()
  @ApiOperation({ summary: 'Crear solicitud de servicio' })
  @ApiResponse({ status: 201, description: 'Solicitud creada' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  create(
    @Body() createSolicitudDto: CreateSolicitudServicioDto,
    @Request() req,
  ) {
    return this.solicitudServiciosService.create(createSolicitudDto, req.user);
  }

  /**
   * Lista todas las solicitudes para administradores.
   * Parametros: ninguno.
   * Respuesta: solicitudes con cliente, tecnico y servicio.
   */
  @Get()
  @ApiOperation({ summary: 'Listar solicitudes' })
  @ApiResponse({ status: 200, description: 'Solicitudes encontradas' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  findAll() {
    return this.solicitudServiciosService.findAll();
  }

  /**
   * Filtra solicitudes por estado.
   * Query params: estado.
   * Respuesta: solicitudes que coinciden con el estado.
   */
  @Get('estado')
  @ApiOperation({ summary: 'Listar solicitudes por estado' })
  @ApiResponse({ status: 200, description: 'Solicitudes encontradas' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  findByEstado(@Query('estado') estado: string) {
    return this.solicitudServiciosService.findByEstado(estado);
  }

  /**
   * Lista solicitudes hechas por un cliente.
   * Parametros: id_cliente.
   * Respuesta: solicitudes del cliente.
   */
  @Get('cliente/:id_cliente')
  @ApiOperation({ summary: 'Listar solicitudes por cliente' })
  @ApiResponse({ status: 200, description: 'Solicitudes encontradas' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  findByCliente(@Param('id_cliente') id_cliente: string) {
    return this.solicitudServiciosService.findByCliente(id_cliente);
  }

  /**
   * Lista solicitudes asignadas a un tecnico.
   * Parametros: id_tecnico.
   * Respuesta: solicitudes del tecnico.
   */
  @Get('tecnico/:id_tecnico')
  @ApiOperation({ summary: 'Listar solicitudes por tecnico' })
  @ApiResponse({ status: 200, description: 'Solicitudes encontradas' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  findByTecnico(@Param('id_tecnico') id_tecnico: string) {
    return this.solicitudServiciosService.findByTecnico(id_tecnico);
  }

  /**
   * Lista solicitudes pendientes sin tecnico asignado.
   * Parametros: ninguno.
   * Respuesta: solicitudes disponibles para tecnicos.
   */
  @Get('pendientes-disponibles')
  @ApiOperation({ summary: 'Listar solicitudes pendientes disponibles' })
  @ApiResponse({ status: 200, description: 'Solicitudes encontradas' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  findPendientesDisponibles() {
    return this.solicitudServiciosService.findPendientesDisponibles();
  }

  /**
   * Obtiene una solicitud por id.
   * Parametros: id de solicitud.
   * Respuesta: solicitud encontrada.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener solicitud por id' })
  @ApiResponse({ status: 200, description: 'Solicitud encontrada' })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.solicitudServiciosService.findOne(id);
  }

  /**
   * Actualiza el estado de una solicitud respetando transiciones validas.
   * Parametros: id de solicitud.
   * Body: estado nuevo.
   * Respuesta: solicitud actualizada.
   */
  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado de solicitud' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  updateEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.solicitudServiciosService.updateEstado(id, estado);
  }

  /**
   * Asigna un tecnico a una solicitud pendiente.
   * Parametros: id de solicitud e id_tecnico.
   * Respuesta: solicitud aceptada y asignada.
   */
  @Patch(':id/asignar-tecnico/:id_tecnico')
  @ApiOperation({ summary: 'Asignar tecnico' })
  @ApiResponse({ status: 200, description: 'Tecnico asignado' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  asignarTecnico(
    @Param('id') id: string,
    @Param('id_tecnico') id_tecnico: string,
    @Request() req,
  ) {
    return this.solicitudServiciosService.asignarTecnico(
      id,
      id_tecnico,
      req.user,
    );
  }

  /**
   * Confirma la finalizacion de una solicitud por parte del cliente.
   * Parametros: id de solicitud.
   * Respuesta: solicitud con confirmacion de cliente.
   */
  @Patch(':id/confirmar/cliente')
  @ApiOperation({ summary: 'Confirmar finalizacion como cliente' })
  @ApiResponse({ status: 200, description: 'Confirmacion registrada' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE)
  confirmarCliente(@Param('id') id: string, @Request() req) {
    return this.solicitudServiciosService.confirmarPorCliente(
      id,
      req.user.userId,
    );
  }

  /**
   * Confirma la finalizacion de una solicitud por parte del tecnico.
   * Parametros: id de solicitud.
   * Respuesta: solicitud con confirmacion de tecnico.
   */
  @Patch(':id/confirmar/tecnico')
  @ApiOperation({ summary: 'Confirmar finalizacion como tecnico' })
  @ApiResponse({ status: 200, description: 'Confirmacion registrada' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO)
  confirmarTecnico(@Param('id') id: string, @Request() req) {
    return this.solicitudServiciosService.confirmarPorTecnico(
      id,
      req.user.userId,
    );
  }
}
