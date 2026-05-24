import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const CREATE_CALIFICACION_REQUEST_EXAMPLE = {
  id_tecnico: 'tec-001',
  id_cliente: 'cli-001',
  id_ss: 'ss-001',
  puntuacion: 5,
  comentario: 'Excelente servicio y puntualidad.',
};

export const CALIFICACION_RESPONSE_EXAMPLE = {
  id_calificacion: 'cal-001',
  ...CREATE_CALIFICACION_REQUEST_EXAMPLE,
  fecha_calificacion: '2026-05-23T22:37:10.000Z',
};

export class CreateCalificacionDto {
  @IsString()
  @IsNotEmpty()
  id_tecnico!: string;

  @IsString()
  @IsNotEmpty()
  id_cliente!: string;

  @IsString()
  @IsNotEmpty()
  id_ss!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  puntuacion!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comentario?: string;

  @IsOptional()
  @IsDateString()
  fecha_calificacion?: string;
}
