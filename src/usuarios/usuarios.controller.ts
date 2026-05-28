import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateDetallesTecnicosDto } from './dto/create-detallesTecnicos.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolEnum } from 'src/auth/enums/rol.enum';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post(':id_tecnico/datos-tecnicos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.TECNICO, RolEnum.ADMIN)
  agregarDatosTecnicos(
    @Param('id_tecnico') idTecnico: string,
    @Body() createDetallesTecnicosDto: CreateDetallesTecnicosDto,
  ) {
    return this.usuariosService.agregarDatosTecnicos(
      createDetallesTecnicosDto,
      idTecnico,
    );
  }

  // @Post()
  // create(@Body() createUsuarioDto: CreateUsuarioDto) {
  //   return this.usuariosService.create(createUsuarioDto);
  // }

  // @Get()
  // findAll() {
  //   return this.usuariosService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usuariosService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
  //   return this.usuariosService.update(+id, updateUsuarioDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usuariosService.remove(+id);
  // }
}
