import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { PrismaService } from 'src/prisma.service';
import {
  createPrismaServiceMock,
  PrismaServiceMock,
} from 'src/common/testing/prisma-service.mock';

describe('ServiciosService', () => {
  let service: ServiciosService;
  let prismaMock: PrismaServiceMock;

  beforeEach(async () => {
    prismaMock = createPrismaServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiciosService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ServiciosService>(ServiciosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates and lists services', async () => {
    prismaMock.$executeRaw.mockResolvedValue(1);
    prismaMock.$queryRaw.mockResolvedValueOnce([{ id_servicio: 'SRV-1' }]);

    const created = await service.create({
      nombre: 'Revision PC',
      descripcion: 'Diagnostico',
      precio: 50000,
    });
    const all = await service.findAll();

    expect(created.id_servicio).toMatch(/^SRV-/);
    expect(all).toEqual({
      data: [{ id_servicio: 'SRV-1' }],
      pagination: { page: 1, limit: 10, total: 0 },
    });
  });

  it('findOne returns a service or throws NotFoundException', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([{ id_servicio: 'SRV-1' }]);

    await expect(service.findOne('SRV-1')).resolves.toEqual({
      id_servicio: 'SRV-1',
    });

    prismaMock.$queryRaw.mockResolvedValueOnce([]);

    await expect(service.findOne('SRV-NO')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('update rejects empty and negative updates', async () => {
    prismaMock.$queryRaw.mockResolvedValue([{ id_servicio: 'SRV-1' }]);

    await expect(service.update('SRV-1', {})).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(
      service.update('SRV-1', { precio: -1 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('updates sent fields and returns the refreshed service', async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ id_servicio: 'SRV-1' }])
      .mockResolvedValueOnce([
        {
          id_servicio: 'SRV-1',
          nombre: 'Soporte',
          descripcion: 'En sitio',
          precio: 100000,
        },
      ]);
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(
      service.update('SRV-1', {
        nombre: 'Soporte',
        descripcion: 'En sitio',
        precio: 100000,
      }),
    ).resolves.toMatchObject({ nombre: 'Soporte', precio: 100000 });

    expect(prismaMock.$executeRaw).toHaveBeenCalledTimes(3);
  });

  it('removes an existing service', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([{ id_servicio: 'SRV-1' }]);
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(service.remove('SRV-1')).resolves.toEqual({
      message: "Servicio 'SRV-1' desactivado exitosamente",
    });
  });

  it('findByRangoPrecio validates and queries ranges', async () => {
    await expect(service.findByRangoPrecio(200, 100)).rejects.toBeInstanceOf(
      BadRequestException,
    );

    prismaMock.$queryRaw.mockResolvedValueOnce([{ id_servicio: 'SRV-1' }]);

    await expect(service.findByRangoPrecio(100, 200)).resolves.toEqual([
      { id_servicio: 'SRV-1' },
    ]);
  });

  it('reads the category summary view', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([
      { nombre_categoria: 'Electricidad', total_servicios: 2 },
    ]);

    await expect(service.findResumenPorCategorias()).resolves.toEqual([
      { nombre_categoria: 'Electricidad', total_servicios: 2 },
    ]);
  });

  it('lists services above average price using a subquery', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([{ id_servicio: 'SRV-CARO' }]);

    await expect(service.findServiciosSobrePromedio()).resolves.toEqual([
      { id_servicio: 'SRV-CARO' },
    ]);
  });
});
