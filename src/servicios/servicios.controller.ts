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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ServiciosService } from './servicios.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolEnum } from 'src/auth/enums/rol.enum';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { CreateCategoriaServicioDto } from './dto/create-categoria-servicio.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Servicios')
@ApiBearerAuth()
@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  /**
   * Crea un servicio ofrecido por la plataforma.
   * Body: nombre, descripcion y precio.
   * Respuesta: servicio creado.
   */
  @Post()
  @ApiOperation({ summary: 'Crear servicio' })
  @ApiResponse({ status: 201, description: 'Servicio creado' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  create(@Body() createServicioDto: CreateServicioDto) {
    return this.serviciosService.create(createServicioDto);
  }

  /**
   * Lista todos los servicios ordenados por nombre.
   * Parametros: ninguno.
   * Respuesta: servicios disponibles.
   */
  @Get()
  @ApiOperation({ summary: 'Listar servicios' })
  @ApiResponse({ status: 200, description: 'Servicios encontrados' })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.serviciosService.findAll(page, limit);
  }

  @Post('categorias')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  createCategoria(@Body() createCategoriaDto: CreateCategoriaServicioDto) {
    return this.serviciosService.createCategoria(createCategoriaDto);
  }

  @Get('categorias')
  findCategorias() {
    return this.serviciosService.findCategorias();
  }

  @Get('buscar')
  buscarPorNombre(
    @Query('nombre') nombre: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.serviciosService.buscarPorNombre(nombre, page, limit);
  }

  /**
   * Busca servicios por rango de precio.
   * Query params: min y max.
   * Respuesta: servicios dentro del rango.
   */
  @Get('rango-precio')
  @ApiOperation({ summary: 'Buscar servicios por precio' })
  @ApiResponse({ status: 200, description: 'Servicios encontrados' })
  findByRangoPrecio(@Query('min') min: string, @Query('max') max: string) {
    return this.serviciosService.findByRangoPrecio(Number(min), Number(max));
  }

  /**
   * Obtiene un servicio por id.
   * Parametros: id del servicio.
   * Respuesta: servicio encontrado.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener servicio por id' })
  @ApiResponse({ status: 200, description: 'Servicio encontrado' })
  findOne(@Param('id') id: string) {
    return this.serviciosService.findOne(id);
  }

  /**
   * Actualiza un servicio.
   * Parametros: id del servicio.
   * Body: campos de servicio a modificar.
   * Respuesta: servicio actualizado.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar servicio' })
  @ApiResponse({ status: 200, description: 'Servicio actualizado' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateServicioDto: UpdateServicioDto,
  ) {
    return this.serviciosService.update(id, updateServicioDto);
  }

  /**
   * Elimina un servicio por id.
   * Parametros: id del servicio.
   * Respuesta: mensaje de confirmacion.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar servicio' })
  @ApiResponse({ status: 200, description: 'Servicio eliminado' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.serviciosService.remove(id);
  }

  @Patch(':id/activar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  activar(@Param('id') id: string) {
    return this.serviciosService.cambiarActivo(id, true);
  }
}
