import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const CREATE_DISPONIBILIDAD_REQUEST_EXAMPLE = {
  dia_semana: 1,
  hora_inicio: '08:00',
  hora_fin: '12:00',
  activo: true,
  nota: 'Atencion en zona norte',
};

export const DISPONIBILIDAD_RESPONSE_EXAMPLE = {
  id_disponibilidad: 'DISP-1234ABCD',
  id_tecnico: 'USR-TEC-001',
  ...CREATE_DISPONIBILIDAD_REQUEST_EXAMPLE,
};

export class CreateDisponibilidadDto {
  @ApiProperty({ example: 1, minimum: 1, maximum: 7 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(7)
  dia_semana!: number;

  @ApiProperty({ example: '08:00', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  hora_inicio!: string;

  @ApiProperty({ example: '12:00', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  hora_fin!: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ example: 'Atencion en zona norte', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nota?: string;
}
