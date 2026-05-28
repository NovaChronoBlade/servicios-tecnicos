import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SolicitudServiciosService } from './solicitud_servicios.service';
import { PrismaService } from 'src/prisma.service';
import { DireccionesService } from 'src/direcciones/direcciones.service';
import { RolEnum } from 'src/auth/enums/rol.enum';
import {
  createPrismaServiceMock,
  PrismaServiceMock,
} from 'src/common/testing/prisma-service.mock';

describe('SolicitudServiciosService', () => {
  let service: SolicitudServiciosService;
  let prismaMock: PrismaServiceMock;
  let direccionesMock: Partial<DireccionesService>;

  beforeEach(async () => {
    prismaMock = createPrismaServiceMock();
    direccionesMock = { belongsToUser: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SolicitudServiciosService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: DireccionesService, useValue: direccionesMock },
      ],
    }).compile();

    service = module.get<SolicitudServiciosService>(SolicitudServiciosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create validates actor and address ownership', async () => {
    const dto = {
      id_cliente: 'USR-CLI-1',
      id_servicio: 'SRV-1',
      id_direccion: 'DIR-1',
    };

    await expect(
      service.create(dto, { userId: 'USR-CLI-2', rol: RolEnum.CLIENTE }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    (direccionesMock.belongsToUser as jest.Mock).mockResolvedValueOnce(false);

    await expect(
      service.create(dto, { userId: 'USR-CLI-1', rol: RolEnum.CLIENTE }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('create inserts a pending request', async () => {
    (direccionesMock.belongsToUser as jest.Mock).mockResolvedValue(true);
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(
      service.create(
        {
          id_cliente: 'USR-CLI-1',
          id_tecnico: null,
          id_servicio: 'SRV-1',
          id_direccion: 'DIR-1',
        },
        { userId: 'USR-CLI-1', rol: RolEnum.CLIENTE },
      ),
    ).resolves.toMatchObject({
      id_cliente: 'USR-CLI-1',
      id_servicio: 'SRV-1',
      estado: 'pendiente',
    });
  });

  it('findAll and findOne return request data', async () => {
    prismaMock.$queryRawUnsafe
      .mockResolvedValueOnce([{ id_ss: 'SS-1' }])
      .mockResolvedValueOnce([{ total: 1 }]);
    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ id_ss: 'SS-1', estado: 'pendiente' }]);

    await expect(service.findAll()).resolves.toEqual({
      data: [{ id_ss: 'SS-1' }],
      pagination: { page: 1, limit: 10, total: 1 },
    });
    await expect(service.findOne('SS-1')).resolves.toEqual({
      id_ss: 'SS-1',
      estado: 'pendiente',
    });
  });

  it('findOne throws when request does not exist', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([]);

    await expect(service.findOne('SS-NO')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updateEstado validates states and transitions', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([
      { id_ss: 'SS-1', estado: 'pendiente' },
    ]);

    await expect(
      service.updateEstado('SS-1', 'inventado'),
    ).rejects.toBeInstanceOf(BadRequestException);

    prismaMock.$queryRaw.mockResolvedValueOnce([
      { id_ss: 'SS-1', estado: 'pendiente' },
    ]);

    await expect(service.updateEstado('SS-1', 'pendiente')).resolves.toEqual({
      id_ss: 'SS-1',
      estado: 'pendiente',
    });

    prismaMock.$queryRaw.mockResolvedValueOnce([
      { id_ss: 'SS-1', estado: 'pendiente' },
    ]);

    await expect(
      service.updateEstado('SS-1', 'completado'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('updateEstado persists valid transitions', async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ id_ss: 'SS-1', estado: 'pendiente' }])
      .mockResolvedValueOnce([{ id_ss: 'SS-1', estado: 'aceptado' }]);
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(service.updateEstado('SS-1', 'aceptado')).resolves.toEqual({
      id_ss: 'SS-1',
      estado: 'aceptado',
    });
  });

  it('lists requests by cliente, tecnico and estado', async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ id_ss: 'SS-CLI' }])
      .mockResolvedValueOnce([{ id_ss: 'SS-TEC' }])
      .mockResolvedValueOnce([{ id_ss: 'SS-EST' }]);

    await expect(service.findByCliente('USR-CLI-1')).resolves.toEqual([
      { id_ss: 'SS-CLI' },
    ]);
    await expect(service.findByTecnico('USR-TEC-1')).resolves.toEqual([
      { id_ss: 'SS-TEC' },
    ]);
    await expect(service.findByEstado('pendiente')).resolves.toEqual([
      { id_ss: 'SS-EST' },
    ]);
  });

  it('findByEstado rejects invalid state', async () => {
    await expect(service.findByEstado('inventado')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('findPendientesDisponibles returns pending unassigned requests', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([
      {
        id_ss: 'SS-1',
        estado: 'pendiente',
        id_tecnico: null,
        nombre_servicio: 'Servicio X',
      },
    ]);

    const result = await service.findPendientesDisponibles();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id_ss: 'SS-1',
      estado: 'pendiente',
      id_tecnico: null,
    });
  });

  it('asignarTecnico validates state and actor', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([
      { id_ss: 'SS-1', estado: 'aceptado' },
    ]);

    await expect(
      service.asignarTecnico('SS-1', 'USR-TEC-1', {
        userId: 'USR-TEC-1',
        rol: RolEnum.TECNICO,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    prismaMock.$queryRaw.mockResolvedValueOnce([
      { id_ss: 'SS-1', estado: 'pendiente' },
    ]);

    await expect(
      service.asignarTecnico('SS-1', 'USR-TEC-1', {
        userId: 'USR-TEC-2',
        rol: RolEnum.TECNICO,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('asignarTecnico accepts a pending request and marks technician busy', async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ id_ss: 'SS-1', estado: 'pendiente' }])
      .mockResolvedValueOnce([
        { id_ss: 'SS-1', estado: 'aceptado', id_tecnico: 'USR-TEC-1' },
      ]);
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(
      service.asignarTecnico('SS-1', 'USR-TEC-1', {
        userId: 'USR-TEC-1',
        rol: RolEnum.TECNICO,
      }),
    ).resolves.toMatchObject({ id_tecnico: 'USR-TEC-1' });
    expect(prismaMock.$executeRaw).toHaveBeenCalledTimes(2);
  });

  it('confirmarPorCliente validates owner and cancelled state', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([
      { id_ss: 'SS-1', id_cliente: 'USR-CLI-2', estado: 'en_curso' },
    ]);

    await expect(
      service.confirmarPorCliente('SS-1', 'USR-CLI-1'),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    prismaMock.$queryRaw.mockResolvedValueOnce([
      { id_ss: 'SS-1', id_cliente: 'USR-CLI-1', estado: 'cancelado' },
    ]);

    await expect(
      service.confirmarPorCliente('SS-1', 'USR-CLI-1'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('confirmarPorCliente completes when both parties confirmed', async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([
        {
          id_ss: 'SS-1',
          id_cliente: 'USR-CLI-1',
          id_tecnico: 'USR-TEC-1',
          estado: 'en_curso',
        },
      ])
      .mockResolvedValueOnce([
        {
          id_ss: 'SS-1',
          id_cliente: 'USR-CLI-1',
          id_tecnico: 'USR-TEC-1',
          estado: 'en_curso',
          confirmacion_cliente: true,
          confirmacion_tecnico: true,
        },
      ])
      .mockResolvedValueOnce([
        {
          id_ss: 'SS-1',
          estado: 'en_curso',
        },
      ])
      .mockResolvedValueOnce([
        {
          id_ss: 'SS-1',
          estado: 'completado',
        },
      ])
      .mockResolvedValueOnce([
        {
          id_ss: 'SS-1',
          estado: 'completado',
        },
      ]);
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(
      service.confirmarPorCliente('SS-1', 'USR-CLI-1'),
    ).resolves.toMatchObject({ estado: 'completado' });
  });

  it('confirmarPorTecnico validates assigned technician and cancelled state', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([
      { id_ss: 'SS-1', id_tecnico: 'USR-TEC-2', estado: 'en_curso' },
    ]);

    await expect(
      service.confirmarPorTecnico('SS-1', 'USR-TEC-1'),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    prismaMock.$queryRaw.mockResolvedValueOnce([
      { id_ss: 'SS-1', id_tecnico: 'USR-TEC-1', estado: 'cancelado' },
    ]);

    await expect(
      service.confirmarPorTecnico('SS-1', 'USR-TEC-1'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('confirmarPorTecnico stores technician confirmation', async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([
        {
          id_ss: 'SS-1',
          id_tecnico: 'USR-TEC-1',
          estado: 'en_curso',
        },
      ])
      .mockResolvedValueOnce([
        {
          id_ss: 'SS-1',
          id_tecnico: 'USR-TEC-1',
          estado: 'en_curso',
          confirmacion_cliente: false,
          confirmacion_tecnico: true,
        },
      ])
      .mockResolvedValueOnce([
        {
          id_ss: 'SS-1',
          id_tecnico: 'USR-TEC-1',
          estado: 'en_curso',
          confirmacion_cliente: false,
          confirmacion_tecnico: true,
        },
      ]);
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(
      service.confirmarPorTecnico('SS-1', 'USR-TEC-1'),
    ).resolves.toMatchObject({ confirmacion_tecnico: true });
  });
});
