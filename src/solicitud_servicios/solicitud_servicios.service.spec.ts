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
import { PaymentGatewayService } from 'src/pagos/payment-gateway.service';
import {
  createPrismaServiceMock,
  PrismaServiceMock,
} from 'src/common/testing/prisma-service.mock';

const solicitudBase = {
  id_ss: 'SS-1',
  id_cliente: 'USR-CLI-1',
  id_tecnico: 'USR-TEC-1',
  id_servicio: 'SRV-1',
  id_direccion: 'DIR-1',
  estado: 'en_curso',
  confirmacion_cliente: false,
  confirmacion_tecnico: false,
};

const tecnicoDisponible = {
  id_usuario: 'USR-TEC-1',
  rol: RolEnum.TECNICO,
  activo: true,
  disponible: true,
};

describe('SolicitudServiciosService', () => {
  let service: SolicitudServiciosService;
  let prismaMock: PrismaServiceMock;
  let direccionesMock: Partial<DireccionesService>;
  let paymentGateway: { charge: jest.Mock };

  beforeEach(async () => {
    prismaMock = createPrismaServiceMock();
    direccionesMock = { belongsToUser: jest.fn() } as any;
    paymentGateway = {
      charge: jest.fn().mockResolvedValue({
        approved: true,
        estado: 'pagado',
        numero_referencia: 'REF-TEST',
        provider: 'mock',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SolicitudServiciosService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: DireccionesService, useValue: direccionesMock },
        { provide: PaymentGatewayService, useValue: paymentGateway },
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

  it('create inserts a pending request when no technician is selected', async () => {
    (direccionesMock.belongsToUser as jest.Mock).mockResolvedValue(true);
    prismaMock.$queryRaw.mockResolvedValueOnce([
      { id_servicio: 'SRV-1', nombre: 'Servicio', precio: 100, activo: true },
    ]);
    prismaMock.$executeRaw.mockResolvedValue(1);
    prismaMock.$queryRawUnsafe.mockResolvedValueOnce([
      { ...solicitudBase, id_tecnico: null, estado: 'pendiente' },
    ]);

    await expect(
      service.create(
        {
          id_cliente: 'USR-CLI-1',
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

  it('checkout charges first and creates assigned request with paid payment', async () => {
    (direccionesMock.belongsToUser as jest.Mock).mockResolvedValue(true);
    prismaMock.$queryRaw
      .mockResolvedValueOnce([tecnicoDisponible])
      .mockResolvedValueOnce([
        { id_servicio: 'SRV-1', nombre: 'Servicio', precio: 150.5, activo: true },
      ]);
    prismaMock.$transaction.mockImplementationOnce(async (callback: any) =>
      callback({
        $executeRaw: jest.fn().mockResolvedValue(1),
      }),
    );
    prismaMock.$queryRawUnsafe.mockResolvedValueOnce([
      { ...solicitudBase, estado: 'asignado', metodo_pago: 'tarjeta', estado_pago: 'pagado' },
    ]);

    const result = await service.checkout(
      {
        id_cliente: 'USR-CLI-1',
        id_tecnico: 'USR-TEC-1',
        id_servicio: 'SRV-1',
        id_direccion: 'DIR-1',
        metodo_pago: 'tarjeta',
        token_pago: 'tok_test',
      },
      { userId: 'USR-CLI-1', rol: RolEnum.CLIENTE },
    );

    expect(paymentGateway.charge).toHaveBeenCalledWith(
      expect.objectContaining({
        id_cliente: 'USR-CLI-1',
        monto: 150.5,
        token_pago: 'tok_test',
      }),
    );
    expect(result.solicitud).toMatchObject({ estado: 'asignado' });
    expect(result.pago.estado).toBe('pagado');
  });

  it('findAll and findOne return enriched request data', async () => {
    prismaMock.$queryRawUnsafe
      .mockResolvedValueOnce([{ id_ss: 'SS-1' }])
      .mockResolvedValueOnce([{ total: 1 }])
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
    prismaMock.$queryRawUnsafe.mockResolvedValueOnce([]);

    await expect(service.findOne('SS-NO')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updateEstado validates states and transitions', async () => {
    prismaMock.$queryRawUnsafe.mockResolvedValueOnce([
      { ...solicitudBase, estado: 'pendiente', id_tecnico: null },
    ]);

    await expect(
      service.updateEstado('SS-1', 'inventado'),
    ).rejects.toBeInstanceOf(BadRequestException);

    prismaMock.$queryRawUnsafe.mockResolvedValueOnce([
      { ...solicitudBase, estado: 'pendiente' },
    ]);

    await expect(service.updateEstado('SS-1', 'pendiente')).resolves.toMatchObject({
      estado: 'pendiente',
    });

    prismaMock.$queryRawUnsafe.mockResolvedValueOnce([
      { ...solicitudBase, estado: 'pendiente' },
    ]);

    await expect(
      service.updateEstado('SS-1', 'completado'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('updateEstado persists valid technician flow transitions', async () => {
    prismaMock.$queryRawUnsafe
      .mockResolvedValueOnce([{ ...solicitudBase, estado: 'asignado' }])
      .mockResolvedValueOnce([{ ...solicitudBase, estado: 'aceptado' }]);
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(service.updateEstado('SS-1', 'aceptado')).resolves.toMatchObject({
      id_ss: 'SS-1',
      estado: 'aceptado',
    });
  });

  it('lists requests by cliente, tecnico and estado', async () => {
    prismaMock.$queryRawUnsafe
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
    prismaMock.$queryRawUnsafe.mockResolvedValueOnce([
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
    prismaMock.$queryRawUnsafe.mockResolvedValueOnce([
      { ...solicitudBase, estado: 'aceptado' },
    ]);

    await expect(
      service.asignarTecnico('SS-1', 'USR-TEC-1', {
        userId: 'USR-TEC-1',
        rol: RolEnum.TECNICO,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    prismaMock.$queryRawUnsafe.mockResolvedValueOnce([
      { ...solicitudBase, estado: 'pendiente', id_tecnico: null },
    ]);

    await expect(
      service.asignarTecnico('SS-1', 'USR-TEC-1', {
        userId: 'USR-TEC-2',
        rol: RolEnum.TECNICO,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('asignarTecnico lets technician accept pending request and marks busy', async () => {
    prismaMock.$queryRawUnsafe
      .mockResolvedValueOnce([
        { ...solicitudBase, estado: 'pendiente', id_tecnico: null },
      ])
      .mockResolvedValueOnce([
        { ...solicitudBase, estado: 'aceptado', id_tecnico: 'USR-TEC-1' },
      ]);
    prismaMock.$queryRaw.mockResolvedValueOnce([tecnicoDisponible]);
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(
      service.asignarTecnico('SS-1', 'USR-TEC-1', {
        userId: 'USR-TEC-1',
        rol: RolEnum.TECNICO,
      }),
    ).resolves.toMatchObject({ id_tecnico: 'USR-TEC-1', estado: 'aceptado' });
    expect(prismaMock.$executeRaw).toHaveBeenCalledTimes(2);
  });

  it('confirmarPorCliente validates owner and required state', async () => {
    prismaMock.$queryRawUnsafe.mockResolvedValueOnce([
      { ...solicitudBase, id_cliente: 'USR-CLI-2', estado: 'en_curso' },
    ]);

    await expect(
      service.confirmarPorCliente('SS-1', 'USR-CLI-1'),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    prismaMock.$queryRawUnsafe.mockResolvedValueOnce([
      { ...solicitudBase, id_cliente: 'USR-CLI-1', estado: 'aceptado' },
    ]);

    await expect(
      service.confirmarPorCliente('SS-1', 'USR-CLI-1'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('confirmarPorCliente completes in-progress request and releases technician', async () => {
    prismaMock.$queryRawUnsafe
      .mockResolvedValueOnce([
        { ...solicitudBase, estado: 'en_curso', id_cliente: 'USR-CLI-1' },
      ])
      .mockResolvedValueOnce([
        { ...solicitudBase, estado: 'completado', confirmacion_cliente: true },
      ]);
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(
      service.confirmarPorCliente('SS-1', 'USR-CLI-1'),
    ).resolves.toMatchObject({ estado: 'completado' });
    expect(prismaMock.$executeRaw).toHaveBeenCalledTimes(2);
  });

  it('confirmarPorTecnico validates assigned technician and state', async () => {
    prismaMock.$queryRawUnsafe.mockResolvedValueOnce([
      { ...solicitudBase, id_tecnico: 'USR-TEC-2', estado: 'en_curso' },
    ]);

    await expect(
      service.confirmarPorTecnico('SS-1', 'USR-TEC-1'),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    prismaMock.$queryRawUnsafe.mockResolvedValueOnce([
      { ...solicitudBase, id_tecnico: 'USR-TEC-1', estado: 'cancelado' },
    ]);

    await expect(
      service.confirmarPorTecnico('SS-1', 'USR-TEC-1'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('confirmarPorTecnico stores technician completion report without closing request', async () => {
    prismaMock.$queryRawUnsafe
      .mockResolvedValueOnce([
        { ...solicitudBase, id_tecnico: 'USR-TEC-1', estado: 'en_curso' },
      ])
      .mockResolvedValueOnce([
        {
          ...solicitudBase,
          estado: 'en_curso',
          confirmacion_tecnico: true,
        },
      ]);
    prismaMock.$executeRaw.mockResolvedValue(1);

    await expect(
      service.confirmarPorTecnico('SS-1', 'USR-TEC-1'),
    ).resolves.toMatchObject({ confirmacion_tecnico: true, estado: 'en_curso' });
  });
});
