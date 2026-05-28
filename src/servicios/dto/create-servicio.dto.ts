import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export const CREATE_SERVICIO_REQUEST_EXAMPLE = {
  nombre: 'Instalacion electrica',
  descripcion: 'Revision e instalacion de puntos electricos residenciales.',
  precio: 120000,
  activo: true,
  id_categoria: 'cat-electricidad',
};

export const SERVICIO_RESPONSE_EXAMPLE = {
  id_servicio: 'srv-001',
  ...CREATE_SERVICIO_REQUEST_EXAMPLE,
};

export class CreateServicioDto {
  @ApiPropertyOptional({ example: 'SRV-abc123' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id_servicio?: string;

  @ApiProperty({ example: 'Instalacion electrica', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @ApiProperty({
    example: 'Revision e instalacion de puntos electricos residenciales.',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  descripcion!: string;

  @ApiProperty({ example: 120000, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  precio!: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id_categoria?: string;
}
