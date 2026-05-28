import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import {
  createPrismaServiceMock,
  PrismaServiceMock,
} from 'src/common/testing/prisma-service.mock';
import { RolEnum } from './enums/rol.enum';

describe('AuthService', () => {
  let service: AuthService;
  let prismaMock: PrismaServiceMock;
  let jwtMock: { sign: jest.Mock };
  let usuariosMock: {
    findByCorreo: jest.Mock;
    findByDocumento: jest.Mock;
    findByTelefono: jest.Mock;
    create: jest.Mock;
  };
  let configMock: { get: jest.Mock };

  beforeEach(async () => {
    prismaMock = createPrismaServiceMock();
    jwtMock = { sign: jest.fn().mockReturnValue('access-token') };
    usuariosMock = {
      findByCorreo: jest.fn(),
      findByDocumento: jest.fn(),
      findByTelefono: jest.fn(),
      create: jest.fn(),
    };
    configMock = {
      get: jest.fn((key: string, defaultValue?: unknown) => {
        const values = {
          JWT_ACCESS_EXPIRES_IN: '1h',
          JWT_REFRESH_EXPIRES_IN_DAYS: 7,
        };
        return values[key] ?? defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
        { provide: UsuariosService, useValue: usuariosMock },
        { provide: ConfigService, useValue: configMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('register creates user and issues access and refresh tokens', async () => {
    usuariosMock.findByDocumento.mockResolvedValue(null);
    usuariosMock.findByCorreo.mockResolvedValue(null);
    usuariosMock.findByTelefono.mockResolvedValue(null);
    usuariosMock.create.mockResolvedValue({
      id_usuario: 'USR-CLI-1',
      nombre: 'Cliente',
      correo: 'cliente@test.com',
      rol: RolEnum.CLIENTE,
    });
    prismaMock.$executeRaw.mockResolvedValue(1);

    const result = await service.register({
      documento: '123',
      fecha_nacimiento: new Date('1990-01-01'),
      nombre: 'Cliente',
      correo: 'cliente@test.com',
      contrasena: 'Password123',
      telefono: '3001234567',
      rol: RolEnum.CLIENTE,
      activo: true,
    });

    expect(result.access_token).toBe('access-token');
    expect(result.refresh_token).toBeTruthy();
    expect(result.token).toBe('access-token');
    expect(usuariosMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        contrasena: expect.any(String),
      }),
    );
    expect(usuariosMock.create.mock.calls[0][0].contrasena).not.toBe(
      'Password123',
    );
    expect(prismaMock.$executeRaw).toHaveBeenCalled();
  });

  it('login rejects inactive users', async () => {
    usuariosMock.findByCorreo.mockResolvedValue({
      id_usuario: 'USR-CLI-1',
      contrasena: 'hash',
      activo: false,
    });

    await expect(
      service.login({ email: 'cliente@test.com', password: 'Password123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('login rejects invalid password', async () => {
    const passwordHash = await bcrypt.hash('Password123', 1);
    usuariosMock.findByCorreo.mockResolvedValue({
      id_usuario: 'USR-CLI-1',
      contrasena: passwordHash,
      activo: true,
    });

    await expect(
      service.login({
        email: 'cliente@test.com',
        password: 'WrongPassword123',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('login issues tokens for active user', async () => {
    const passwordHash = await bcrypt.hash('Password123', 1);
    usuariosMock.findByCorreo.mockResolvedValue({
      id_usuario: 'USR-CLI-1',
      nombre: 'Cliente',
      correo: 'cliente@test.com',
      rol: RolEnum.CLIENTE,
      contrasena: passwordHash,
      activo: true,
    });
    prismaMock.$executeRaw.mockResolvedValue(1);

    const result = await service.login({
      email: 'cliente@test.com',
      password: 'Password123',
    });

    expect(result.usuario.id_usuario).toBe('USR-CLI-1');
    expect(result.access_token).toBe('access-token');
    expect(result.refresh_token).toBeTruthy();
  });

  it('refresh rotates a valid refresh token', async () => {
    prismaMock.$queryRaw.mockResolvedValue([
      {
        id_refresh: 'REF-1',
        id_usuario: 'USR-CLI-1',
        nombre: 'Cliente',
        correo: 'cliente@test.com',
        rol: RolEnum.CLIENTE,
        activo: true,
        expires_at: new Date(Date.now() + 60_000),
        revoked_at: null,
      },
    ]);
    prismaMock.$executeRaw.mockResolvedValue(1);

    const result = await service.refresh('refresh-token');

    expect(result.access_token).toBe('access-token');
    expect(result.refresh_token).toBeTruthy();
    expect(prismaMock.$executeRaw).toHaveBeenCalledTimes(2);
  });

  it('logout revokes current access token and optional refresh token', async () => {
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(
      service.logout(
        {
          userId: 'USR-CLI-1',
          jti: 'jwt-id',
          exp: Math.floor(Date.now() / 1000) + 3600,
        },
        'refresh-token',
      ),
    ).resolves.toEqual({ message: 'Sesion cerrada exitosamente' });

    expect(prismaMock.$executeRaw).toHaveBeenCalledTimes(2);
  });
});
