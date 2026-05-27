import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolEnum } from 'src/auth/enums/rol.enum';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { CreateCategoriaServicioDto } from './dto/create-categoria-servicio.dto';

@UseGuards(JwtAuthGuard)
@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  // ------------------------------------------------------------
  // Crear servicio
  // ------------------------------------------------------------
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  create(@Body() createServicioDto: CreateServicioDto) {
    return this.serviciosService.create(createServicioDto);
  }

  // ------------------------------------------------------------
  // Obtener todos los servicios
  // ------------------------------------------------------------
  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.serviciosService.findAll(page, limit);
  }

  // ------------------------------------------------------------
  // Crear categoria de servicio
  // ------------------------------------------------------------
  @Post('categorias')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  createCategoria(@Body() createCategoriaDto: CreateCategoriaServicioDto) {
    return this.serviciosService.createCategoria(createCategoriaDto);
  }

  // ------------------------------------------------------------
  // Obtener categorias de servicios
  // ------------------------------------------------------------
  @Get('categorias')
  findCategorias() {
    return this.serviciosService.findCategorias();
  }

  // ------------------------------------------------------------
  // Buscar servicios por nombre
  // ------------------------------------------------------------
  @Get('buscar')
  buscarPorNombre(
    @Query('nombre') nombre: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.serviciosService.buscarPorNombre(nombre, page, limit);
  }

  // ------------------------------------------------------------
  // Buscar servicios por rango de precio
  // ------------------------------------------------------------
  @Get('rango-precio')
  findByRangoPrecio(@Query('min') min: string, @Query('max') max: string) {
    return this.serviciosService.findByRangoPrecio(Number(min), Number(max));
  }

  // ------------------------------------------------------------
  // Obtener un servicio por ID
  // ------------------------------------------------------------
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviciosService.findOne(id);
  }

  // ------------------------------------------------------------
  // Actualizar servicio
  // ------------------------------------------------------------
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateServicioDto: UpdateServicioDto,
  ) {
    return this.serviciosService.update(id, updateServicioDto);
  }

  // ------------------------------------------------------------
  // Eliminar servicio
  // ------------------------------------------------------------
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.serviciosService.remove(id);
  }

  // ------------------------------------------------------------
  // Activar servicio
  // ------------------------------------------------------------
  @Patch(':id/activar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  activar(@Param('id') id: string) {
    return this.serviciosService.cambiarActivo(id, true);
  }
}
