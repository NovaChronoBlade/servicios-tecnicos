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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolEnum } from 'src/auth/enums/rol.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateDisponibilidadDto } from './dto/create-disponibilidad.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';
import { DisponibilidadService } from './disponibilidad.service';

@ApiTags('Disponibilidad')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('disponibilidad')
export class DisponibilidadController {
  constructor(private readonly disponibilidadService: DisponibilidadService) {}

  @Get('me')
  @ApiOperation({ summary: 'Listar disponibilidad del tecnico autenticado' })
  @ApiResponse({ status: 200, description: 'Bloques encontrados' })
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  findMine(@Request() req) {
    return this.disponibilidadService.findByTecnico(req.user.userId, req.user);
  }

  @Post('me')
  @ApiOperation({ summary: 'Crear bloque de disponibilidad propio' })
  @ApiResponse({ status: 201, description: 'Bloque creado' })
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  createMine(@Body() dto: CreateDisponibilidadDto, @Request() req) {
    return this.disponibilidadService.create(req.user.userId, dto, req.user);
  }

  @Get('tecnico/:id_tecnico')
  @ApiOperation({ summary: 'Listar disponibilidad de un tecnico' })
  @ApiResponse({ status: 200, description: 'Bloques encontrados' })
  @Roles(RolEnum.CLIENTE, RolEnum.TECNICO, RolEnum.ADMIN)
  findByTecnico(@Param('id_tecnico') idTecnico: string, @Request() req) {
    return this.disponibilidadService.findByTecnico(idTecnico, req.user);
  }

  @Post('tecnico/:id_tecnico')
  @ApiOperation({ summary: 'Crear bloque de disponibilidad por tecnico' })
  @ApiResponse({ status: 201, description: 'Bloque creado' })
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  createForTecnico(
    @Param('id_tecnico') idTecnico: string,
    @Body() dto: CreateDisponibilidadDto,
    @Request() req,
  ) {
    return this.disponibilidadService.create(idTecnico, dto, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar bloque de disponibilidad' })
  @ApiResponse({ status: 200, description: 'Bloque actualizado' })
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDisponibilidadDto,
    @Request() req,
  ) {
    return this.disponibilidadService.update(id, dto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar bloque de disponibilidad' })
  @ApiResponse({ status: 200, description: 'Bloque eliminado' })
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.disponibilidadService.remove(id, req.user);
  }
}
