import { Test, TestingModule } from '@nestjs/testing';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';

describe('PagosController', () => {
  let controller: PagosController;
  let pagosService: Partial<PagosService>;

  beforeEach(async () => {
    pagosService = {
      createPago: jest.fn(),
      findById: jest.fn(),
      updateEstadoPago: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagosController],
      providers: [{ provide: PagosService, useValue: pagosService }],
    }).compile();

    controller = module.get<PagosController>(PagosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calls createPago on service', async () => {
    (pagosService.createPago as jest.Mock).mockResolvedValue({ id_pago: 'PAG-1' });
    const req: any = { user: { userId: 'cli-1' } };
    const dto: CreatePagoDto = { id_ss: 'SS-1', monto: 100, metodo_pago: 'tarjeta' };
    const result = await controller.create(dto, req as any);
    expect(pagosService.createPago).toHaveBeenCalledWith(dto, 'cli-1');
    expect(result).toEqual({ id_pago: 'PAG-1' });
  });
});
