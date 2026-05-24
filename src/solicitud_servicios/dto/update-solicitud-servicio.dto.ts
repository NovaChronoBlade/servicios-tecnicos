import { PartialType } from '@nestjs/mapped-types';
import {
  CreateSolicitudServicioDto,
  SOLICITUD_SERVICIO_RESPONSE_EXAMPLE,
} from './create-solicitud-servicio.dto';

export const UPDATE_SOLICITUD_SERVICIO_REQUEST_EXAMPLE = {
  id_tecnico: 'tec-001',
  estado: 'asignado',
};

export const UPDATE_SOLICITUD_SERVICIO_RESPONSE_EXAMPLE = {
  ...SOLICITUD_SERVICIO_RESPONSE_EXAMPLE,
  ...UPDATE_SOLICITUD_SERVICIO_REQUEST_EXAMPLE,
};

export class UpdateSolicitudServicioDto extends PartialType(
  CreateSolicitudServicioDto,
) {}
