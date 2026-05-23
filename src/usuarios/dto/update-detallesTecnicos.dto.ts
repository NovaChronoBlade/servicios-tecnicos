import { PartialType } from '@nestjs/mapped-types';
import { CreateDetallesTecnicosDto } from './create-detallesTecnicos.dto';

export class UpdateDetallesTecnicosDto extends PartialType(
  CreateDetallesTecnicosDto,
) {}
