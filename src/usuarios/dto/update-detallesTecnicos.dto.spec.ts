import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  UPDATE_DETALLES_TECNICOS_REQUEST_EXAMPLE,
  UpdateDetallesTecnicosDto,
} from './update-detallesTecnicos.dto';

describe('UpdateDetallesTecnicosDto', () => {
  const validateDto = (payload: Record<string, unknown>) =>
    validate(plainToInstance(UpdateDetallesTecnicosDto, payload));

  it('accepts a partial detalles tecnicos payload', async () => {
    const errors = await validateDto(UPDATE_DETALLES_TECNICOS_REQUEST_EXAMPLE);

    expect(errors).toHaveLength(0);
  });

  it('keeps create validations for provided fields', async () => {
    const errors = await validateDto({
      especialidad: '',
      licencia_profesional: '',
      calificacion_promedio: -1,
    });

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining([
        'especialidad',
        'licencia_profesional',
        'calificacion_promedio',
      ]),
    );
  });
});
