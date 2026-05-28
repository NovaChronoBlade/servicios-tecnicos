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
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id_servicio?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  descripcion!: string;

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
