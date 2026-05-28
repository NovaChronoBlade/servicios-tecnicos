import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateDireccionDto {
  @ApiPropertyOptional({ example: 'Carrera 10 #20-30', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  direccion?: string;

  @ApiPropertyOptional({ example: 'Casa', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  tipo_edificio?: string;

  @ApiPropertyOptional({ example: 'Porteria principal', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  informacion?: string;

  @ApiPropertyOptional({ example: 'No tocar timbre', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nota?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  es_default?: boolean;
}
