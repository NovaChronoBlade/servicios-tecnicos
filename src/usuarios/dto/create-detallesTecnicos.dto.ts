import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const CREATE_DETALLES_TECNICOS_REQUEST_EXAMPLE = {
  especialidad: 'Electricidad residencial',
  licencia_profesional: 'LIC-12345',
  disponible: true,
};

export const DETALLES_TECNICOS_RESPONSE_EXAMPLE = {
  id_usuario: 'tec-001',
  ...CREATE_DETALLES_TECNICOS_REQUEST_EXAMPLE,
  calificacion_promedio: 0,
};

export class CreateDetallesTecnicosDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  especialidad!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  licencia_profesional!: string;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  calificacion_promedio?: number;
}
