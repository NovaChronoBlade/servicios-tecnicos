import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolEnum } from '../enums/rol.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

type RequestWithUser = {
  user?: {
    rol?: RolEnum;
  };
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.getAllAndOverride<RolEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!rolesRequeridos || rolesRequeridos.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const rolUsuario = request.user?.rol;

    if (!rolUsuario) {
      throw new UnauthorizedException('No se pudo identificar el rol del usuario');
    }

    return rolesRequeridos.includes(rolUsuario);
  }
}
