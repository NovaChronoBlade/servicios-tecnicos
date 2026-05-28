import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDireccionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id_usuario?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  direccion!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tipo_edificio!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  informacion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  nota?: string;

  @IsOptional()
  @IsBoolean()
  es_default?: boolean;
}
