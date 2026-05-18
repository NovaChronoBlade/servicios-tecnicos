import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { RolEnum } from './enums/rol.enum';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { LoginDto } from './dto/login.dto';
import { SUCCESS_MESSAGES } from 'src/common/constants/success-messages';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usuariosService: UsuariosService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { documento, correo, telefono, rol, contrasena } = registerDto;

    const [porDocumento, porCorreo, porTelefono] = await Promise.all([
      this.usuariosService.findByDocumento(documento),
      this.usuariosService.findByCorreo(correo),
      this.usuariosService.findByTelefono(telefono),
    ]);

    if (porDocumento)
      throw new ConflictException(ERROR_MESSAGES.usuario.documentoDuplicado);
    if (porCorreo)
      throw new ConflictException(ERROR_MESSAGES.usuario.correoDuplicado);
    if (porTelefono)
      throw new ConflictException(ERROR_MESSAGES.usuario.telefonoDuplicado);

    const contrasenaCifrada = await bcrypt.hash(contrasena, 12);

    const usuario = await this.usuariosService.create({
      ...registerDto,
      contrasena: contrasenaCifrada,
      rol: rol ?? RolEnum.CLIENTE,
    });

    const token = this.jwtService.sign({
      id_usuario: usuario.id_usuario,
      correo: usuario.correo,
      rol: usuario.rol,
    });

    return {
      message: SUCCESS_MESSAGES.usuario.registrado,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const usuario = await this.usuariosService.findByCorreo(email);
    if (!usuario)
      throw new UnauthorizedException(
        ERROR_MESSAGES.usuario.credencialesInvalidas,
      );

    const contrasenaValida = await bcrypt.compare(password, usuario.contrasena);
    if (!contrasenaValida)
      throw new UnauthorizedException(
        ERROR_MESSAGES.usuario.credencialesInvalidas,
      );

    const token = this.jwtService.sign({
      id_usuario: usuario.id_usuario,
      correo: usuario.correo,
      rol: usuario.rol,
    });

    return {
      message: SUCCESS_MESSAGES.usuario.logeado,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
      token,
    };
  }
  // Validar que no exista documento, correo o teléfono duplicado
  //     const usuarioExistente = await this.prisma.usuario.findFirst({
  //       where: {
  //         OR: [{ documento }, { correo }, { telefono }],
  //       },
  //     });

  //     if (usuarioExistente) {
  //       if (usuarioExistente.documento === documento) {
  //         throw new ConflictException('El documento ya está registrado');
  //       }
  //       if (usuarioExistente.correo === correo) {
  //         throw new ConflictException('El correo ya está registrado');
  //       }
  //       if (usuarioExistente.telefono === telefono) {
  //         throw new ConflictException('El teléfono ya está registrado');
  //       }
  //     }

  //     // Encriptar contraseña
  //     const contrasenaCifrada = await bcrypt.hash(contrasena, 12);

  //     // Generar ID del usuario
  //     const id_usuario = this.generarIdUsuario(rol);

  //     // Crear usuario
  //     const usuario = await this.prisma.usuario.create({
  //       data: {
  //         id_usuario,
  //         documento,
  //         correo,
  //         telefono,
  //         rol,
  //         contrasena: contrasenaCifrada,
  //         ...rest,
  //       },
  //     });

  //     // Crear detalles técnicos si es técnico
  //     if (rol === RolEnum.TECNICO) {
  //       // Esto se puede completar después
  //       // await this.prisma.detallesTecnicos.create({...})
  //     }

  //     // Generar JWT
  //     const token = this.jwtService.sign({
  //       id_usuario: usuario.id_usuario,
  //       correo: usuario.correo,
  //       rol: usuario.rol,
  //     });

  //     return {
  //       message: 'Usuario registrado exitosamente',
  //       usuario: {
  //         id_usuario: usuario.id_usuario,
  //         nombre: usuario.nombre,
  //         correo: usuario.correo,
  //         rol: usuario.rol,
  //       },
  //       token,
  //     };
  //   }

  //   async login(correo: string, contrasena: string) {
  //     // Buscar usuario por correo
  //     const usuario = await this.prisma.usuario.findUnique({
  //       where: { correo },
  //     });

  //     if (!usuario) {
  //       throw new UnauthorizedException('Credenciales inválidas');
  //     }

  //     // Verificar contraseña
  //     const contrasenaValida = await bcrypt.compare(
  //       contrasena,
  //       usuario.contrasena,
  //     );

  //     if (!contrasenaValida) {
  //       throw new UnauthorizedException('Credenciales inválidas');
  //     }

  //     // Generar JWT
  //     const token = this.jwtService.sign({
  //       id_usuario: usuario.id_usuario,
  //       correo: usuario.correo,
  //       rol: usuario.rol,
  //     });

  //     return {
  //       message: 'Inicio de sesión exitoso',
  //       usuario: {
  //         id_usuario: usuario.id_usuario,
  //         nombre: usuario.nombre,
  //         correo: usuario.correo,
  //         rol: usuario.rol,
  //       },
  //       token,
  //     };
  //   }

  //   private usarioExistente(documento: string, correo: string, telefono: string) {

  public;

  private generarIdUsuario(rol: RolEnum): string {
    const prefijos = {
      [RolEnum.CLIENTE]: 'USR-CLI',
      [RolEnum.TECNICO]: 'USR-TEC',
      [RolEnum.ADMIN]: 'USR-ADM',
    };

    const prefijo = prefijos[rol];
    const numero = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(3, '0');

    return `${prefijo}-${numero}`;
  }
}
