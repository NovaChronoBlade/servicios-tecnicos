import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'Electricidad residencial', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  especialidad!: string;

  @ApiProperty({ example: 'LIC-12345', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  licencia_profesional!: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @ApiPropertyOptional({ example: 0, minimum: 0, maximum: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  calificacion_promedio?: number;
}
