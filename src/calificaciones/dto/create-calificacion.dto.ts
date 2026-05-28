import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'USR-TEC-abc123' })
  @IsString()
  @IsNotEmpty()
  id_tecnico!: string;

  @ApiProperty({ example: 'USR-CLI-abc123' })
  @IsString()
  @IsNotEmpty()
  id_cliente!: string;

  @ApiProperty({ example: 'SS-abc123' })
  @IsString()
  @IsNotEmpty()
  id_ss!: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  puntuacion!: number;

  @ApiPropertyOptional({
    example: 'Excelente servicio y puntualidad.',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comentario?: string;

  @ApiPropertyOptional({
    example: '2026-05-23T22:37:10.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  fecha_calificacion?: string;
}
