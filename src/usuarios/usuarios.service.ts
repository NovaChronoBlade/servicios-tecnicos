import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma.service';
import { RolEnum } from 'src/auth/enums/rol.enum';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const {
      documento,
      fecha_nacimiento,
      nombre,
      correo,
      contrasena,
      telefono,
      rol,
    } = createUsuarioDto;

    const id_usuario = this.generarIdUsuario(rol ?? RolEnum.CLIENTE);

    await this.prisma.$executeRaw`
      INSERT INTO usuarios (id_usuario, documento, fecha_nacimiento, nombre, correo, contrasena, telefono, rol)
      VALUES (${id_usuario}, ${documento}, ${fecha_nacimiento}::date, ${nombre}, ${correo}, ${contrasena}, ${telefono}, ${rol})
    `;

    return { id_usuario, ...createUsuarioDto };
  }

  async findOne(id: string) {
    const usuarios = await this.prisma.$queryRaw`
      SELECT * FROM usuarios
      WHERE id_usuario = ${id}
      LIMIT 1
    `;

    const usuario = Array.isArray(usuarios) ? usuarios[0] : null;
    if (!usuario)
      throw new NotFoundException(ERROR_MESSAGES.usuario.noEncontrado(id));

    return usuario;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.$executeRaw`
      DELETE FROM usuarios WHERE id_usuario = ${id}
    `;

    return { message: `Usuario ${id} eliminado exitosamente` };
  }

  async findByCorreo(correo: string) {
    const usuarios = await this.prisma.$queryRaw`
        SELECT *
        FROM usuarios
        WHERE correo = ${correo}
        LIMIT 1
      `;

    return Array.isArray(usuarios) ? usuarios[0] : null;
  }

  async findByDocumento(documento: string) {
    const usuarios = await this.prisma.$queryRaw`
        SELECT *
        FROM usuarios
        WHERE documento = ${documento}
        LIMIT 1
      `;

    return Array.isArray(usuarios) ? usuarios[0] : null;
  }

  async findByTelefono(telefono: string) {
    const usuarios = await this.prisma.$queryRaw`
        SELECT *
        FROM usuarios
        WHERE telefono = ${telefono}
        LIMIT 1
      `;
    return Array.isArray(usuarios) ? usuarios[0] : null;
  }

  private generarIdUsuario(rol: RolEnum): string {
    const prefijos = {
      [RolEnum.CLIENTE]: 'USR-CLI',
      [RolEnum.TECNICO]: 'USR-TEC',
      [RolEnum.ADMIN]: 'USR-ADM',
    };
    const shortId = uuidv4().split('-')[0];
    return `${prefijos[rol]}-${shortId}`;
  }
}
