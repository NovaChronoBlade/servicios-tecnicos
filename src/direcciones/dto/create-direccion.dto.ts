import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDireccionDto {
  @ApiPropertyOptional({ example: 'USR-CLI-abc123' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id_usuario?: string;

  @ApiProperty({ example: 'Calle 123 #45-67', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  direccion!: string;

  @ApiProperty({ example: 'Apartamento', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tipo_edificio!: string;

  @ApiPropertyOptional({ example: 'Torre B, piso 4', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  informacion?: string;

  @ApiPropertyOptional({ example: 'Llamar antes de llegar', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nota?: string;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  es_default?: boolean;
}
