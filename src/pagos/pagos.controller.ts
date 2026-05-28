import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoEstadoDto } from './dto/update-pago-estado.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolEnum } from 'src/auth/enums/rol.enum';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.CLIENTE, RolEnum.ADMIN)
  create(@Body() createPagoDto: CreatePagoDto, @Request() req) {
    return this.pagosService.createPago(createPagoDto, req.user.userId);
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.pagosService.findById(id);
  }

  @Patch(':id/estado')
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
