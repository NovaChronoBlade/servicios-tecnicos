import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaMock: Partial<PrismaService>;
  let jwtMock: Partial<JwtService>;
  let usuariosMock: Partial<UsuariosService>;

  beforeEach(async () => {
    prismaMock = { $queryRaw: jest.fn(), $executeRaw: jest.fn() } as any;
    jwtMock = { sign: jest.fn() } as any;
    usuariosMock = { findByCorreo: jest.fn(), findByDocumento: jest.fn(), findByTelefono: jest.fn(), create: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
        { provide: UsuariosService, useValue: usuariosMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
