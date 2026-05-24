import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CREATE_SOLICITUD_SERVICIO_REQUEST_EXAMPLE,
  CreateSolicitudServicioDto,
} from './create-solicitud-servicio.dto';

describe('CreateSolicitudServicioDto', () => {
  const validateDto = (payload: Record<string, unknown>) =>
    validate(plainToInstance(CreateSolicitudServicioDto, payload));

  it('accepts a valid solicitud de servicio payload', async () => {
    const errors = await validateDto(CREATE_SOLICITUD_SERVICIO_REQUEST_EXAMPLE);

    expect(errors).toHaveLength(0);
  });

  it('requires cliente, servicio and direccion identifiers', async () => {
    const errors = await validateDto({});

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['id_cliente', 'id_servicio', 'id_direccion']),
    );
  });

  it('validates optional estado and fecha when provided', async () => {
    const errors = await validateDto({
      ...CREATE_SOLICITUD_SERVICIO_REQUEST_EXAMPLE,
      estado: 'a'.repeat(21),
      fecha: 'fecha-invalida',
    });

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['estado', 'fecha']),
    );
  });
});
