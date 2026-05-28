import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoriaServicioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
