import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolEnum } from '../enums/rol.enum';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let reflector: { getAllAndOverride: jest.Mock };
  let guard: RolesGuard;

  const contextWithRole = (rol?: RolEnum) =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: rol ? { rol } : {} }),
      }),
    }) as any;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() };
    guard = new RolesGuard(reflector as unknown as Reflector);
  });

  it('allows routes without required roles', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    expect(guard.canActivate(contextWithRole())).toBe(true);
  });

  it('throws when a protected route has no user role', () => {
    reflector.getAllAndOverride.mockReturnValue([RolEnum.ADMIN]);

    expect(() => guard.canActivate(contextWithRole())).toThrow(
      UnauthorizedException,
    );
  });

  it('allows matching roles and denies non matching roles', () => {
    reflector.getAllAndOverride.mockReturnValue([RolEnum.ADMIN]);

    expect(guard.canActivate(contextWithRole(RolEnum.ADMIN))).toBe(true);
    expect(guard.canActivate(contextWithRole(RolEnum.CLIENTE))).toBe(false);
  });
});
