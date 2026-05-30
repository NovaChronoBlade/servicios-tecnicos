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
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoEstadoDto } from './dto/update-pago-estado.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolEnum } from 'src/auth/enums/rol.enum';

@ApiTags('Pagos')
@ApiBearerAuth()
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  /**
   * Crea un pago asociado a una solicitud del cliente autenticado.
   * Body: id_ss, monto y metodo_pago.
   * Respuesta: pago creado en estado pendiente.
   */
  @Post()
  @ApiOperation({ summary: 'Crear pago' })
  @ApiResponse({ status: 201, description: 'Pago creado' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  create(@Body() createPagoDto: CreatePagoDto, @Request() req) {
    return this.pagosService.createPago(createPagoDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pagos para administradores' })
  @ApiResponse({ status: 200, description: 'Pagos encontrados' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.pagosService.findAll({ page, limit });
  }

  @Get('solicitud/:id_ss')
  @UseGuards(JwtAuthGuard)
  findBySolicitud(@Param('id_ss') id_ss: string) {
    return this.pagosService.findBySolicitud(id_ss);
  }

  @Get('cliente/:id_cliente')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  findByCliente(@Param('id_cliente') id_cliente: string) {
    return this.pagosService.findByCliente(id_cliente);
  }

  /**
   * Obtiene un pago por id.
   * Parametros: id del pago.
   * Respuesta: pago encontrado.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener pago por id' })
  @ApiResponse({ status: 200, description: 'Pago encontrado' })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.pagosService.findById(id);
  }

  /**
   * Actualiza el estado de un pago.
   * Parametros: id del pago.
   * Body: estado nuevo.
   * Respuesta: pago actualizado.
   */
  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado de pago' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  updateEstado(
    @Param('id') id: string,
    @Body() updateDto: UpdatePagoEstadoDto,
  ) {
    return this.pagosService.updateEstadoPago(id, updateDto.estado);
  }

  @Patch(':id/reembolsar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  reembolsar(@Param('id') id: string) {
    return this.pagosService.reembolsar(id);
  }
}
