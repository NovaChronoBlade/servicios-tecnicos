import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { SUCCESS_MESSAGES } from 'src/common/constants/success-messages';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RolEnum } from './enums/rol.enum';

type JwtActor = {
  userId: string;
  email?: string;
  rol?: string;
  jti?: string;
  exp?: number;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usuariosService: UsuariosService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { documento, correo, telefono, rol, contrasena } = registerDto;

    const [porDocumento, porCorreo, porTelefono] = await Promise.all([
      this.usuariosService.findByDocumento(documento),
      this.usuariosService.findByCorreo(correo),
      this.usuariosService.findByTelefono(telefono),
    ]);

    if (porDocumento) {
      throw new ConflictException(ERROR_MESSAGES.usuario.documentoDuplicado);
    }
    if (porCorreo) {
      throw new ConflictException(ERROR_MESSAGES.usuario.correoDuplicado);
    }
    if (porTelefono) {
      throw new ConflictException(ERROR_MESSAGES.usuario.telefonoDuplicado);
    }

    const contrasenaCifrada = await bcrypt.hash(contrasena, 12);
    const usuario = await this.usuariosService.create({
      ...registerDto,
      contrasena: contrasenaCifrada,
      rol: rol ?? RolEnum.CLIENTE,
    });
    const tokens = await this.issueTokens(usuario);

    return {
      message: SUCCESS_MESSAGES.usuario.registrado,
      usuario: this.toPublicUser(usuario),
      ...tokens,
      token: tokens.access_token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const usuario = await this.usuariosService.findByCorreo(email);

    if (!usuario || usuario.activo !== true) {
      throw new UnauthorizedException(
        ERROR_MESSAGES.usuario.credencialesInvalidas,
      );
    }

    const contrasenaValida = await bcrypt.compare(password, usuario.contrasena);
    if (!contrasenaValida) {
      throw new UnauthorizedException(
        ERROR_MESSAGES.usuario.credencialesInvalidas,
      );
    }

    const tokens = await this.issueTokens(usuario);

    return {
      message: SUCCESS_MESSAGES.usuario.logeado,
      usuario: this.toPublicUser(usuario),
      ...tokens,
      token: tokens.access_token,
    };
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    const rows = await this.prisma.$queryRaw`
      SELECT
        rt.id_refresh,
        rt.id_usuario,
        rt.expires_at,
        rt.revoked_at,
        u.nombre,
        u.correo,
        u.rol,
        u.activo
      FROM refresh_tokens rt
      JOIN usuarios u ON u.id_usuario = rt.id_usuario
      WHERE rt.token_hash = ${tokenHash}
      LIMIT 1
    `;
    const storedToken = Array.isArray(rows) ? rows[0] : null;

    if (
      !storedToken ||
      storedToken.revoked_at ||
      new Date(storedToken.expires_at).getTime() <= Date.now() ||
      storedToken.activo !== true
    ) {
      throw new UnauthorizedException('Refresh token invalido');
    }

    await this.prisma.$executeRaw`
      UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE id_refresh = ${storedToken.id_refresh}
    `;

    const tokens = await this.issueTokens({
      id_usuario: storedToken.id_usuario,
      nombre: storedToken.nombre,
      correo: storedToken.correo,
      rol: storedToken.rol,
    });

    return {
      message: 'Token renovado exitosamente',
      usuario: this.toPublicUser({
        id_usuario: storedToken.id_usuario,
        nombre: storedToken.nombre,
        correo: storedToken.correo,
        rol: storedToken.rol,
      }),
      ...tokens,
      token: tokens.access_token,
    };
  }

  async logout(actor: JwtActor, refreshToken?: string) {
    if (actor.jti && actor.exp) {
      await this.prisma.$executeRaw`
        INSERT INTO revoked_access_tokens (id_jti, id_usuario, expires_at)
        VALUES (${actor.jti}, ${actor.userId}, ${new Date(actor.exp * 1000)})
        ON CONFLICT (id_jti) DO NOTHING
      `;
    }

    if (refreshToken) {
      await this.prisma.$executeRaw`
        UPDATE refresh_tokens
        SET revoked_at = NOW()
        WHERE token_hash = ${this.hashToken(refreshToken)}
          AND id_usuario = ${actor.userId}
          AND revoked_at IS NULL
      `;
    }

    return { message: 'Sesion cerrada exitosamente' };
  }

  private async issueTokens(usuario: any) {
    const tokenId = randomUUID();
    const expiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '1h',
    );
    const accessToken = this.jwtService.sign(
      {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
        rol: usuario.rol,
        jti: tokenId,
      },
      { expiresIn: expiresIn as any },
    );
    const refreshToken = randomBytes(48).toString('hex');
    const refreshDays = this.configService.get<number>(
      'JWT_REFRESH_EXPIRES_IN_DAYS',
      7,
    );
    const refreshExpiresAt = new Date(
      Date.now() + refreshDays * 24 * 60 * 60 * 1000,
    );

    await this.prisma.$executeRaw`
      INSERT INTO refresh_tokens (id_refresh, id_usuario, token_hash, expires_at)
      VALUES (
        ${`REF-${randomUUID().split('-')[0].toUpperCase()}`},
        ${usuario.id_usuario},
        ${this.hashToken(refreshToken)},
        ${refreshExpiresAt}
      )
    `;

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private toPublicUser(usuario: any) {
    return {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    };
  }
}
