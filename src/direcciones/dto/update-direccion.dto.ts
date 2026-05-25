import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateDireccionDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  direccion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  tipo_edificio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  informacion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  nota?: string;
}
