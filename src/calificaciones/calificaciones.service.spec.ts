import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CalificacionesService } from './calificaciones.service';
import { PrismaService } from 'src/prisma.service';
import {
  createPrismaServiceMock,
  PrismaServiceMock,
} from 'src/common/testing/prisma-service.mock';

describe('CalificacionesService', () => {
  let service: CalificacionesService;
  let prismaMock: PrismaServiceMock;

  beforeEach(async () => {
    prismaMock = createPrismaServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalificacionesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<CalificacionesService>(CalificacionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('rejects scores outside the allowed range', async () => {
    await expect(
      service.create({
        id_tecnico: 'USR-TEC-1',
        id_cliente: 'USR-CLI-1',
        id_ss: 'SS-1',
        puntuacion: 6,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('requires an existing completed request without previous rating', async () => {
    const dto = {
      id_tecnico: 'USR-TEC-1',
      id_cliente: 'USR-CLI-1',
      id_ss: 'SS-1',
      puntuacion: 5,
    };

    prismaMock.$queryRaw.mockResolvedValueOnce([]);
    await expect(service.create(dto)).rejects.toBeInstanceOf(NotFoundException);

    prismaMock.$queryRaw.mockResolvedValueOnce([
      { id_ss: 'SS-1', estado: 'pendiente' },
    ]);
    await expect(service.create(dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );

    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ id_ss: 'SS-1', estado: 'completado' }])
      .mockResolvedValueOnce([{ id_calificacion: 'CAL-1' }]);
    await expect(service.create(dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('creates a rating and refreshes technician average', async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([
        {
          id_ss: 'SS-1',
          estado: 'completado',
          id_cliente: 'USR-CLI-1',
          id_tecnico: 'USR-TEC-1',
        },
      ])
      .mockResolvedValueOnce([]);
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(
      service.create({
        id_tecnico: 'USR-TEC-1',
        id_cliente: 'USR-CLI-1',
        id_ss: 'SS-1',
        puntuacion: 5,
        comentario: 'Excelente',
      }, { userId: 'USR-CLI-1', rol: 'cliente' }),
    ).resolves.toMatchObject({
      id_tecnico: 'USR-TEC-1',
      id_cliente: 'USR-CLI-1',
      id_ss: 'SS-1',
      puntuacion: 5,
      comentario: 'Excelente',
    });
    expect(prismaMock.$executeRaw).toHaveBeenCalledTimes(2);
  });

  it('findOne returns a rating or throws NotFoundException', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([{ id_calificacion: 'CAL-1' }]);

    await expect(service.findOne('CAL-1')).resolves.toEqual({
      id_calificacion: 'CAL-1',
    });

    prismaMock.$queryRaw.mockResolvedValueOnce([]);
    await expect(service.findOne('CAL-NO')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lists ratings by technician and client', async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ id_calificacion: 'CAL-TEC' }])
      .mockResolvedValueOnce([{ total: 1 }])
      .mockResolvedValueOnce([{ id_calificacion: 'CAL-CLI' }])
      .mockResolvedValueOnce([{ total: 1 }]);

    await expect(service.findByTecnico('USR-TEC-1')).resolves.toEqual({
      data: [{ id_calificacion: 'CAL-TEC' }],
      pagination: { page: 1, limit: 10, total: 1 },
    });
    await expect(service.findByCliente('USR-CLI-1')).resolves.toEqual({
      data: [{ id_calificacion: 'CAL-CLI' }],
      pagination: { page: 1, limit: 10, total: 1 },
    });
  });

  it('gets technician average or throws when technician is missing', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([
      { nombre_tecnico: 'Tecnico', promedio: 4.5 },
    ]);

    await expect(service.getPromedioPorTecnico('USR-TEC-1')).resolves.toEqual({
      nombre_tecnico: 'Tecnico',
      promedio: 4.5,
    });

    prismaMock.$queryRaw.mockResolvedValueOnce([]);
    await expect(
      service.getPromedioPorTecnico('USR-TEC-NO'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
