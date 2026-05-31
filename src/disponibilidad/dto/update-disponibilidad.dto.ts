import { PartialType } from '@nestjs/swagger';
import {
  CreateDisponibilidadDto,
  DISPONIBILIDAD_RESPONSE_EXAMPLE,
} from './create-disponibilidad.dto';

export const UPDATE_DISPONIBILIDAD_REQUEST_EXAMPLE = {
  hora_inicio: '09:00',
  hora_fin: '13:00',
  activo: false,
};

export const UPDATE_DISPONIBILIDAD_RESPONSE_EXAMPLE = {
  ...DISPONIBILIDAD_RESPONSE_EXAMPLE,
  ...UPDATE_DISPONIBILIDAD_REQUEST_EXAMPLE,
};

export class UpdateDisponibilidadDto extends PartialType(
  CreateDisponibilidadDto,
) {}
