import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CREATE_DETALLES_TECNICOS_REQUEST_EXAMPLE,
  CreateDetallesTecnicosDto,
} from './create-detallesTecnicos.dto';

describe('CreateDetallesTecnicosDto', () => {
  const validateDto = (payload: Record<string, unknown>) =>
    validate(plainToInstance(CreateDetallesTecnicosDto, payload));

  it('accepts a valid detalles tecnicos payload', async () => {
    const errors = await validateDto(CREATE_DETALLES_TECNICOS_REQUEST_EXAMPLE);

    expect(errors).toHaveLength(0);
  });

  it('requires especialidad and licencia profesional', async () => {
    const errors = await validateDto({});

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['especialidad', 'licencia_profesional']),
    );
  });

  it('validates text limits and calificacion promedio range', async () => {
    const errors = await validateDto({
      especialidad: 'a'.repeat(101),
      licencia_profesional: 'a'.repeat(51),
      calificacion_promedio: 6,
    });

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining([
        'especialidad',
        'licencia_profesional',
        'calificacion_promedio',
      ]),
    );
  });

  it('transforms calificacion promedio to number', () => {
    const dto = plainToInstance(CreateDetallesTecnicosDto, {
      ...CREATE_DETALLES_TECNICOS_REQUEST_EXAMPLE,
      calificacion_promedio: '4.5',
    });

    expect(dto.calificacion_promedio).toBe(4.5);
  });
});
