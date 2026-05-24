import { PartialType } from '@nestjs/mapped-types';
import {
  CREATE_SERVICIO_REQUEST_EXAMPLE,
  SERVICIO_RESPONSE_EXAMPLE,
  CreateServicioDto,
} from './create-servicio.dto';

export const UPDATE_SERVICIO_REQUEST_EXAMPLE = {
  nombre: 'Mantenimiento electrico',
  precio: 95000,
};

export const UPDATE_SERVICIO_RESPONSE_EXAMPLE = {
  ...SERVICIO_RESPONSE_EXAMPLE,
  ...CREATE_SERVICIO_REQUEST_EXAMPLE,
  ...UPDATE_SERVICIO_REQUEST_EXAMPLE,
};

export class UpdateServicioDto extends PartialType(CreateServicioDto) {}
