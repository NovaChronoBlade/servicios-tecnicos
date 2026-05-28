import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from 'src/prisma.service';
import { RolEnum } from 'src/auth/enums/rol.enum';
import {
  createPrismaServiceMock,
  PrismaServiceMock,
} from 'src/common/testing/prisma-service.mock';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let prismaMock: PrismaServiceMock;

  beforeEach(async () => {
    prismaMock = createPrismaServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create inserts a user and returns generated id', async () => {
    prismaMock.$executeRaw.mockResolvedValue(1);

    const result = await service.create({
      documento: '123',
      fecha_nacimiento: new Date('1990-01-01'),
      nombre: 'Cliente',
      correo: 'cliente@test.com',
      contrasena: 'hash',
      telefono: '3001234567',
      rol: RolEnum.CLIENTE,
    });

    expect(result.id_usuario).toMatch(/^USR-CLI-/);
    expect(prismaMock.$executeRaw).toHaveBeenCalled();
  });

  it('findAll applies filters and pagination', async () => {
    prismaMock.$queryRawUnsafe
      .mockResolvedValueOnce([{ id_usuario: 'USR-1' }])
      .mockResolvedValueOnce([{ total: 1 }]);

    await expect(
      service.findAll({
        page: '2',
        limit: '5',
        rol: RolEnum.CLIENTE,
        activo: 'true',
      }),
    ).resolves.toEqual({
      data: [{ id_usuario: 'USR-1' }],
      pagination: { page: 2, limit: 5, total: 1 },
    });

    expect(prismaMock.$queryRawUnsafe).toHaveBeenCalledTimes(2);
  });

  it('findAll rejects invalid filters', async () => {
    await expect(service.findAll({ rol: 'inventado' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(service.findAll({ activo: 'si' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('findTecnicos filters by availability', async () => {
    prismaMock.$queryRawUnsafe
      .mockResolvedValueOnce([{ id_usuario: 'USR-TEC-1' }])
      .mockResolvedValueOnce([{ total: 1 }]);

    await expect(
      service.findTecnicos({ disponible: 'false' }),
    ).resolves.toMatchObject({
      data: [{ id_usuario: 'USR-TEC-1' }],
      pagination: { total: 1 },
    });
  });

  it('findPerfil allows self or admin and rejects other users', async () => {
    await expect(
      service.findPerfil('USR-1', { userId: 'OTRO', rol: RolEnum.CLIENTE }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    prismaMock.$queryRaw.mockResolvedValueOnce([{ id_usuario: 'USR-1' }]);

    await expect(
      service.findPerfil('USR-1', { userId: 'ADM-1', rol: RolEnum.ADMIN }),
    ).resolves.toEqual({ id_usuario: 'USR-1' });
  });

  it('updatePerfil rejects empty bodies and updates allowed fields', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([{ id_usuario: 'USR-1' }]);

    await expect(
      service.updatePerfil(
        'USR-1',
        {},
        { userId: 'USR-1', rol: RolEnum.CLIENTE },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);

    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ id_usuario: 'USR-1' }])
      .mockResolvedValueOnce([{ id_usuario: 'USR-1', nombre: 'Nuevo' }]);
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(
      service.updatePerfil(
        'USR-1',
        { nombre: 'Nuevo', telefono: '301' },
        { userId: 'USR-1', rol: RolEnum.CLIENTE },
      ),
    ).resolves.toEqual({ id_usuario: 'USR-1', nombre: 'Nuevo' });

    expect(prismaMock.$executeRaw).toHaveBeenCalledTimes(2);
  });

  it('desactivar marks the user inactive', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([{ id_usuario: 'USR-1' }]);
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(service.desactivar('USR-1')).resolves.toEqual({
      message: 'Usuario USR-1 desactivado exitosamente',
    });
  });

  it('agregarDatosTecnicos permite un usuario con rol tecnico', async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([
        {
          id_usuario: 'USR-TEC-e08baae4',
          rol: RolEnum.TECNICO,
        },
      ])
      .mockResolvedValueOnce([]);
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(
      service.agregarDatosTecnicos(
        {
          especialidad: 'Electronica',
          licencia_profesional: 'LP-123',
        } as any,
        'USR-TEC-e08baae4',
        { userId: 'USR-TEC-e08baae4', rol: RolEnum.TECNICO },
      ),
    ).resolves.toEqual({
      message: 'Datos tecnicos agregados para el tecnico USR-TEC-e08baae4',
      id_tecnico: 'USR-TEC-e08baae4',
      especialidad: 'Electronica',
      licencia_profesional: 'LP-123',
      disponible: true,
      calificacion_promedio: 0,
    });

    expect(prismaMock.$executeRaw).toHaveBeenCalled();
  });

  it('agregarDatosTecnicos rejects invalid roles and duplicates', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([
      { id_usuario: 'USR-CLI-1', rol: RolEnum.CLIENTE },
    ]);

    await expect(
      service.agregarDatosTecnicos({ especialidad: 'PC' } as any, 'USR-CLI-1', {
        userId: 'USR-CLI-1',
        rol: RolEnum.CLIENTE,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    prismaMock.$queryRaw
      .mockResolvedValueOnce([
        { id_usuario: 'USR-TEC-1', rol: RolEnum.TECNICO },
      ])
      .mockResolvedValueOnce([{ id_usuario: 'USR-TEC-1' }]);

    await expect(
      service.agregarDatosTecnicos({ especialidad: 'PC' } as any, 'USR-TEC-1', {
        userId: 'USR-TEC-1',
        rol: RolEnum.TECNICO,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('updateDetallesTecnicos validates body and updates technician details', async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ id_usuario: 'USR-TEC-1' }])
      .mockResolvedValueOnce([{ especialidad: 'PC' }]);

    await expect(
      service.updateDetallesTecnicos(
        'USR-TEC-1',
        {},
        {
          userId: 'USR-TEC-1',
          rol: RolEnum.TECNICO,
        },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);

    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ id_usuario: 'USR-TEC-1' }])
      .mockResolvedValueOnce([
        {
          especialidad: 'PC',
          licencia_profesional: 'LP-1',
          disponible: true,
          calificacion_promedio: 4,
        },
      ])
      .mockResolvedValueOnce([
        {
          especialidad: 'Redes',
          licencia_profesional: 'LP-1',
          disponible: false,
          calificacion_promedio: 4,
        },
      ]);
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(
      service.updateDetallesTecnicos(
        'USR-TEC-1',
        { especialidad: 'Redes', disponible: false },
        { userId: 'USR-TEC-1', rol: RolEnum.TECNICO },
      ),
    ).resolves.toMatchObject({ especialidad: 'Redes', disponible: false });
  });

  it('findOne and findOnePublic throw when user does not exist', async () => {
    prismaMock.$queryRaw.mockResolvedValue([]);

    await expect(service.findOne('USR-NO')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(service.findOnePublic('USR-NO')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('findBy helpers return the first matching row or null', async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ correo: 'a@test.com' }])
      .mockResolvedValueOnce([{ documento: '123' }])
      .mockResolvedValueOnce([]);

    await expect(service.findByCorreo('a@test.com')).resolves.toEqual({
      correo: 'a@test.com',
    });
    await expect(service.findByDocumento('123')).resolves.toEqual({
      documento: '123',
    });
    await expect(service.findByTelefono('300')).resolves.toBeNull();
  });
});
