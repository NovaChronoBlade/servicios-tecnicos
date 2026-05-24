import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  UPDATE_SERVICIO_REQUEST_EXAMPLE,
  UpdateServicioDto,
} from './update-servicio.dto';

describe('UpdateServicioDto', () => {
  const validateDto = (payload: Record<string, unknown>) =>
    validate(plainToInstance(UpdateServicioDto, payload));

  it('accepts a partial servicio payload', async () => {
    const errors = await validateDto(UPDATE_SERVICIO_REQUEST_EXAMPLE);

    expect(errors).toHaveLength(0);
  });

  it('keeps create validations for provided fields', async () => {
    const errors = await validateDto({
      nombre: '',
      precio: -1,
    });

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['nombre', 'precio']),
    );
  });
});
