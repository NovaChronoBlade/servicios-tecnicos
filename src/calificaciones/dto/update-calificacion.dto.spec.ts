import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  UPDATE_CALIFICACION_REQUEST_EXAMPLE,
  UpdateCalificacionDto,
} from './update-calificacion.dto';

describe('UpdateCalificacionDto', () => {
  const validateDto = (payload: Record<string, unknown>) =>
    validate(plainToInstance(UpdateCalificacionDto, payload));

  it('accepts a partial calificacion payload', async () => {
    const errors = await validateDto(UPDATE_CALIFICACION_REQUEST_EXAMPLE);

    expect(errors).toHaveLength(0);
  });

  it('keeps create validations for provided fields', async () => {
    const errors = await validateDto({
      puntuacion: 0,
      comentario: 'a'.repeat(501),
    });

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['puntuacion', 'comentario']),
    );
  });
});
