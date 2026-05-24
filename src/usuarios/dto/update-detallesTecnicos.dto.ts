import { PartialType } from '@nestjs/mapped-types';
import {
  CreateDetallesTecnicosDto,
  DETALLES_TECNICOS_RESPONSE_EXAMPLE,
} from './create-detallesTecnicos.dto';

export const UPDATE_DETALLES_TECNICOS_REQUEST_EXAMPLE = {
  especialidad: 'Plomeria y gas',
  disponible: false,
};

export const UPDATE_DETALLES_TECNICOS_RESPONSE_EXAMPLE = {
  ...DETALLES_TECNICOS_RESPONSE_EXAMPLE,
  ...UPDATE_DETALLES_TECNICOS_REQUEST_EXAMPLE,
};

export class UpdateDetallesTecnicosDto extends PartialType(
  CreateDetallesTecnicosDto,
) {}
