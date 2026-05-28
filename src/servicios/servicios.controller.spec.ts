import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UnauthorizedException } from '@nestjs/common';
import { ServiciosController } from './servicios.controller';
import { ServiciosService } from './servicios.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

describe('ServiciosController - Guards', () => {
  const mockServicios = [
    {
      id: '1',
      nombre: 'Limpieza',
      descripcion: 'Limpieza general',
      precio: 100,
    },
  ];

  let app: INestApplication;

  afterEach(async () => {
    if (app) await app.close();
  });

  it('GET /servicios devuelve 401 si no está autenticado', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ServiciosController],
      providers: [
        {
          provide: ServiciosService,
          useValue: { findAll: () => mockServicios },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => {
          throw new UnauthorizedException();
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    await request(app.getHttpServer()).get('/servicios').expect(401);
  });

  it('GET /servicios devuelve 200 si está autenticado', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ServiciosController],
      providers: [
        {
          provide: ServiciosService,
          useValue: { findAll: () => mockServicios },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (ctx) => {
          const req = ctx.switchToHttp().getRequest();
          req.user = { userId: 'u1' };
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const res = await request(app.getHttpServer())
      .get('/servicios')
      .expect(200);
    expect(res.body).toEqual(mockServicios);
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { ServiciosController } from './servicios.controller';
import { ServiciosService } from './servicios.service';
import { PrismaService } from 'src/prisma.service';

describe('ServiciosController', () => {
  let controller: ServiciosController;
  let prismaMock: Partial<PrismaService>;

  beforeEach(async () => {
    prismaMock = { $queryRaw: jest.fn(), $executeRaw: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiciosController],
      providers: [
        ServiciosService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    controller = module.get<ServiciosController>(ServiciosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
