import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DireccionesService } from './direcciones.service';
import { PrismaService } from 'src/prisma.service';
import { RolEnum } from 'src/auth/enums/rol.enum';
import {
  createPrismaServiceMock,
  PrismaServiceMock,
} from 'src/common/testing/prisma-service.mock';

describe('DireccionesService', () => {
  let service: DireccionesService;
  let prisma: PrismaServiceMock;

  beforeEach(async () => {
    prisma = createPrismaServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DireccionesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<DireccionesService>(DireccionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a default address for the authenticated user', async () => {
    prisma.$executeRaw.mockResolvedValue(1);

    const result = await service.create(
      {
        direccion: 'Calle 1',
        tipo_edificio: 'Casa',
        es_default: true,
      },
      { userId: 'USR-1', rol: RolEnum.CLIENTE },
    );

    expect(result.id_direccion).toMatch(/^DIR-/);
    expect(result).toMatchObject({
      id_usuario: 'USR-1',
      direccion: 'Calle 1',
      es_default: true,
    });
    expect(prisma.$executeRaw).toHaveBeenCalledTimes(2);
  });

  it('rejects creating addresses for another user unless admin', async () => {
    await expect(
      service.create(
        { id_usuario: 'USR-2', direccion: 'Calle 1', tipo_edificio: 'Casa' },
        { userId: 'USR-1', rol: RolEnum.CLIENTE },
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    prisma.$executeRaw.mockResolvedValue(1);

    await expect(
      service.create(
        { id_usuario: 'USR-2', direccion: 'Calle 2', tipo_edificio: 'Apto' },
        { userId: 'ADM-1', rol: RolEnum.ADMIN },
      ),
    ).resolves.toMatchObject({ id_usuario: 'USR-2' });
  });

  it('findAll returns all addresses for admin and own addresses for clients', async () => {
    prisma.$queryRaw
      .mockResolvedValueOnce([{ id_direccion: 'DIR-1' }])
      .mockResolvedValueOnce([{ id_direccion: 'DIR-2' }]);

    await expect(
      service.findAll({ userId: 'ADM-1', rol: RolEnum.ADMIN }),
    ).resolves.toEqual([{ id_direccion: 'DIR-1' }]);
    await expect(
      service.findAll({ userId: 'USR-1', rol: RolEnum.CLIENTE }),
    ).resolves.toEqual([{ id_direccion: 'DIR-2' }]);
  });

  it('findOne validates existence and ownership', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([]);

    await expect(
      service.findOne('DIR-NO', { userId: 'USR-1', rol: RolEnum.CLIENTE }),
    ).rejects.toBeInstanceOf(NotFoundException);

    prisma.$queryRaw.mockResolvedValueOnce([
      { id_direccion: 'DIR-1', id_usuario: 'USR-2' },
    ]);

    await expect(
      service.findOne('DIR-1', { userId: 'USR-1', rol: RolEnum.CLIENTE }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    prisma.$queryRaw.mockResolvedValueOnce([
      { id_direccion: 'DIR-1', id_usuario: 'USR-1' },
    ]);

    await expect(
      service.findOne('DIR-1', { userId: 'USR-1', rol: RolEnum.CLIENTE }),
    ).resolves.toEqual({ id_direccion: 'DIR-1', id_usuario: 'USR-1' });
  });

  it('findByUsuario requires ownership unless admin', async () => {
    await expect(
      service.findByUsuario('USR-2', { userId: 'USR-1', rol: RolEnum.CLIENTE }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    prisma.$queryRaw.mockResolvedValueOnce([{ id_direccion: 'DIR-1' }]);

    await expect(
      service.findByUsuario('USR-2', { userId: 'ADM-1', rol: RolEnum.ADMIN }),
    ).resolves.toEqual([{ id_direccion: 'DIR-1' }]);
  });

  it('update rejects empty body and updates a default address', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([
      {
        id_direccion: 'DIR-1',
        id_usuario: 'USR-1',
        direccion: 'Antigua',
        tipo_edificio: 'Casa',
        informacion: null,
        nota: null,
        es_default: false,
      },
    ]);

    await expect(
      service.update('DIR-1', {}, { userId: 'USR-1', rol: RolEnum.CLIENTE }),
    ).rejects.toBeInstanceOf(BadRequestException);

    prisma.$queryRaw
      .mockResolvedValueOnce([
        {
          id_direccion: 'DIR-1',
          id_usuario: 'USR-1',
          direccion: 'Antigua',
          tipo_edificio: 'Casa',
          informacion: null,
          nota: null,
          es_default: false,
        },
      ])
      .mockResolvedValueOnce([
        {
          id_direccion: 'DIR-1',
          id_usuario: 'USR-1',
          direccion: 'Nueva',
          tipo_edificio: 'Casa',
          informacion: null,
          nota: 'Porteria',
          es_default: true,
        },
      ]);
    prisma.$executeRaw.mockResolvedValue(1);

    await expect(
      service.update(
        'DIR-1',
        { direccion: 'Nueva', nota: 'Porteria', es_default: true },
        { userId: 'USR-1', rol: RolEnum.CLIENTE },
      ),
    ).resolves.toMatchObject({ direccion: 'Nueva', es_default: true });
    expect(prisma.$executeRaw).toHaveBeenCalledTimes(2);
  });

  it('remove deletes an owned address', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([
      { id_direccion: 'DIR-1', id_usuario: 'USR-1' },
    ]);
    prisma.$executeRaw.mockResolvedValue(1);

    await expect(
      service.remove('DIR-1', { userId: 'USR-1', rol: RolEnum.CLIENTE }),
    ).resolves.toEqual({ message: 'Direccion DIR-1 eliminada exitosamente' });
  });

  it('belongsToUser checks the address owner', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([{ id_direccion: 'DIR-1' }]);
    await expect(service.belongsToUser('DIR-1', 'USR-1')).resolves.toBe(true);

    prisma.$queryRaw.mockResolvedValueOnce([]);
    await expect(service.belongsToUser('DIR-2', 'USR-1')).resolves.toBe(false);
  });
});
