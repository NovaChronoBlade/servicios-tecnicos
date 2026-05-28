import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const userId = payload.id_usuario ?? payload.sub;
    const tokenId = payload.jti;

    if (!userId || !tokenId) {
      throw new UnauthorizedException('Token invalido');
    }

    const revokedTokens = await this.prisma.$queryRaw`
      SELECT id_jti
      FROM revoked_access_tokens
      WHERE id_jti = ${tokenId}
      LIMIT 1
    `;
    if (Array.isArray(revokedTokens) && revokedTokens.length > 0) {
      throw new UnauthorizedException('Token revocado');
    }

    const usuarios = await this.prisma.$queryRaw`
      SELECT id_usuario, correo, rol, activo
      FROM usuarios
      WHERE id_usuario = ${userId}
      LIMIT 1
    `;
    const usuario = Array.isArray(usuarios) ? usuarios[0] : null;
    if (!usuario?.activo) {
      throw new UnauthorizedException('Usuario inactivo o no encontrado');
    }

    return {
      userId,
      email: usuario.correo,
      rol: usuario.rol,
      jti: tokenId,
      exp: payload.exp,
    };
  }
}
