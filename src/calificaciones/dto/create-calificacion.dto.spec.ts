import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CREATE_CALIFICACION_REQUEST_EXAMPLE,
  CreateCalificacionDto,
} from './create-calificacion.dto';

describe('CreateCalificacionDto', () => {
  const validateDto = (payload: Record<string, unknown>) =>
    validate(plainToInstance(CreateCalificacionDto, payload));

  it('accepts a valid calificacion payload', async () => {
    const errors = await validateDto(CREATE_CALIFICACION_REQUEST_EXAMPLE);

    expect(errors).toHaveLength(0);
  });

  it('requires tecnico, cliente and solicitud identifiers', async () => {
    const errors = await validateDto({
      puntuacion: 5,
    });

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['id_tecnico', 'id_cliente', 'id_ss']),
    );
  });

  it('validates puntuacion range and comentario length', async () => {
    const errors = await validateDto({
      ...CREATE_CALIFICACION_REQUEST_EXAMPLE,
      puntuacion: 6,
      comentario: 'a'.repeat(501),
    });

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['puntuacion', 'comentario']),
    );
  });

  it('transforms puntuacion to number', () => {
    const dto = plainToInstance(CreateCalificacionDto, {
      ...CREATE_CALIFICACION_REQUEST_EXAMPLE,
      puntuacion: '4',
    });

    expect(dto.puntuacion).toBe(4);
  });
});
