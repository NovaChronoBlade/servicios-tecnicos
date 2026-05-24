import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  UPDATE_SOLICITUD_SERVICIO_REQUEST_EXAMPLE,
  UpdateSolicitudServicioDto,
} from './update-solicitud-servicio.dto';

describe('UpdateSolicitudServicioDto', () => {
  const validateDto = (payload: Record<string, unknown>) =>
    validate(plainToInstance(UpdateSolicitudServicioDto, payload));

  it('accepts a partial solicitud de servicio payload', async () => {
    const errors = await validateDto(UPDATE_SOLICITUD_SERVICIO_REQUEST_EXAMPLE);

    expect(errors).toHaveLength(0);
  });

  it('keeps create validations for provided fields', async () => {
    const errors = await validateDto({
      id_tecnico: '',
      estado: 'a'.repeat(21),
    });

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['id_tecnico', 'estado']),
    );
  });
});
