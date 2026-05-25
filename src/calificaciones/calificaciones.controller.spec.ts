import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CalificacionesController } from './calificaciones.controller';
import { CalificacionesService } from './calificaciones.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UnauthorizedException } from '@nestjs/common';

describe('CalificacionesController - Guards', () => {
  const mockCalificacion = { id: '1', puntaje: 5, comentario: 'Excelente' };

  let app: INestApplication;

  afterEach(async () => {
    if (app) await app.close();
  });

  it('GET /calificaciones/:id devuelve 401 si no está autenticado', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CalificacionesController],
      providers: [{ provide: CalificacionesService, useValue: { findOne: () => mockCalificacion } }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => { throw new UnauthorizedException(); } })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    await request(app.getHttpServer()).get('/calificaciones/1').expect(401);
  });

  it('GET /calificaciones/:id devuelve 200 si está autenticado', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CalificacionesController],
      providers: [{ provide: CalificacionesService, useValue: { findOne: () => mockCalificacion } }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: (ctx) => { const req = ctx.switchToHttp().getRequest(); req.user = { userId: 'u1' }; return true; } })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const res = await request(app.getHttpServer()).get('/calificaciones/1').expect(200);
    expect(res.body).toEqual(mockCalificacion);
  });

  it('POST /calificaciones requiere rol CLIENTE (RolesGuard) y devuelve 403/200 según RolesGuard', async () => {
    // RolesGuard denies
    const moduleRefDenied: TestingModule = await Test.createTestingModule({
      controllers: [CalificacionesController],
      providers: [{ provide: CalificacionesService, useValue: { create: () => mockCalificacion } }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => false })
      .compile();

    app = moduleRefDenied.createNestApplication();
    await app.init();

    await request(app.getHttpServer()).post('/calificaciones').send({}).expect(403);
    await app.close();

    // RolesGuard allows
    const moduleRefAllowed: TestingModule = await Test.createTestingModule({
      controllers: [CalificacionesController],
      providers: [{ provide: CalificacionesService, useValue: { create: () => mockCalificacion } }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: (ctx) => { const req = ctx.switchToHttp().getRequest(); req.user = { userId: 'u1', rol: 'CLIENTE' }; return true; } })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRefAllowed.createNestApplication();
    await app.init();

    const res = await request(app.getHttpServer()).post('/calificaciones').send({ puntaje: 5, comentario: 'Muy bien' }).expect(201);
    expect(res.body).toEqual(mockCalificacion);
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { CalificacionesController } from './calificaciones.controller';
import { CalificacionesService } from './calificaciones.service';
import { PrismaService } from 'src/prisma.service';

describe('CalificacionesController', () => {
  let controller: CalificacionesController;
  let prismaMock: Partial<PrismaService>;

  beforeEach(async () => {
    prismaMock = { $queryRaw: jest.fn(), $executeRaw: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalificacionesController],
      providers: [CalificacionesService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    controller = module.get<CalificacionesController>(CalificacionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
