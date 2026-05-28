import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from 'src/prisma.service';
import { RolEnum } from 'src/auth/enums/rol.enum';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let prismaMock: Partial<PrismaService>;

  beforeEach(async () => {
    prismaMock = { $queryRaw: jest.fn(), $executeRaw: jest.fn() } as any;

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

  it('agregarDatosTecnicos permite un usuario con rol tecnico', async () => {
    prismaMock.$queryRaw = jest
      .fn()
      .mockResolvedValueOnce([
        {
          id_usuario: 'USR-TEC-e08baae4',
          rol: RolEnum.TECNICO,
        },
      ])
      .mockResolvedValueOnce([]);
    prismaMock.$executeRaw = jest.fn().mockResolvedValue(1);

    await expect(
      service.agregarDatosTecnicos(
        {
          especialidad: 'Electronica',
          licencia_profesional: 'LP-123',
        } as any,
        'USR-TEC-e08baae4',
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
});
