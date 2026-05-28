import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authServiceMock = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            name: 'login',
            ttl: 60000,
            limit: 5,
          },
        ]),
      ],
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates refresh to AuthService', async () => {
    authServiceMock.refresh.mockResolvedValue({ access_token: 'new-token' });

    await expect(
      controller.refresh({ refresh_token: 'refresh-token' }),
    ).resolves.toEqual({ access_token: 'new-token' });

    expect(authServiceMock.refresh).toHaveBeenCalledWith('refresh-token');
  });

  it('delegates logout to AuthService with actor and optional refresh token', async () => {
    authServiceMock.logout.mockResolvedValue({ message: 'ok' });

    await expect(
      controller.logout(
        { refresh_token: 'refresh-token' },
        { user: { userId: 'USR-1', jti: 'jwt-id' } },
      ),
    ).resolves.toEqual({ message: 'ok' });

    expect(authServiceMock.logout).toHaveBeenCalledWith(
      { userId: 'USR-1', jti: 'jwt-id' },
      'refresh-token',
    );
  });
});
