import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CREATE_SERVICIO_REQUEST_EXAMPLE,
  CreateServicioDto,
} from './create-servicio.dto';

describe('CreateServicioDto', () => {
  const validateDto = (payload: Record<string, unknown>) =>
    validate(plainToInstance(CreateServicioDto, payload));

  it('accepts a valid servicio payload', async () => {
    const errors = await validateDto(CREATE_SERVICIO_REQUEST_EXAMPLE);

    expect(errors).toHaveLength(0);
  });

  it('requires nombre, descripcion and precio', async () => {
    const errors = await validateDto({});

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['nombre', 'descripcion', 'precio']),
    );
  });

  it('validates text limits and positive precio', async () => {
    const errors = await validateDto({
      nombre: 'a'.repeat(101),
      descripcion: 'a'.repeat(501),
      precio: -1,
    });

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['nombre', 'descripcion', 'precio']),
    );
  });

  it('transforms precio to number', () => {
    const dto = plainToInstance(CreateServicioDto, {
      ...CREATE_SERVICIO_REQUEST_EXAMPLE,
      precio: '90000',
    });

    expect(dto.precio).toBe(90000);
  });
});
