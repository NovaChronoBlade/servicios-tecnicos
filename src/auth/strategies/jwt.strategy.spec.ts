import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import {
  createPrismaServiceMock,
  PrismaServiceMock,
} from 'src/common/testing/prisma-service.mock';

describe('JwtStrategy', () => {
  let prisma: PrismaServiceMock;
  let strategy: JwtStrategy;

  beforeEach(() => {
    prisma = createPrismaServiceMock();
    strategy = new JwtStrategy(
      {
        get: jest.fn().mockReturnValue('test-secret'),
      } as unknown as ConfigService,
      prisma as any,
    );
  });

  it('validates an active user with a non-revoked token', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([]).mockResolvedValueOnce([
      {
        id_usuario: 'USR-1',
        correo: 'cliente@test.com',
        rol: 'cliente',
        activo: true,
      },
    ]);

    await expect(
      strategy.validate({ id_usuario: 'USR-1', jti: 'jwt-id', exp: 123 }),
    ).resolves.toEqual({
      userId: 'USR-1',
      email: 'cliente@test.com',
      rol: 'cliente',
      jti: 'jwt-id',
      exp: 123,
    });
  });

  it('rejects revoked tokens', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([{ id_jti: 'jwt-id' }]);

    await expect(
      strategy.validate({ id_usuario: 'USR-1', jti: 'jwt-id' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
