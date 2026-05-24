import { PartialType } from '@nestjs/mapped-types';
import {
  CALIFICACION_RESPONSE_EXAMPLE,
  CREATE_CALIFICACION_REQUEST_EXAMPLE,
  CreateCalificacionDto,
} from './create-calificacion.dto';

export const UPDATE_CALIFICACION_REQUEST_EXAMPLE = {
  puntuacion: 4,
  comentario: 'Buen servicio, con una pequena demora.',
};

export const UPDATE_CALIFICACION_RESPONSE_EXAMPLE = {
  ...CALIFICACION_RESPONSE_EXAMPLE,
  ...UPDATE_CALIFICACION_REQUEST_EXAMPLE,
};

export class UpdateCalificacionDto extends PartialType(CreateCalificacionDto) {}
