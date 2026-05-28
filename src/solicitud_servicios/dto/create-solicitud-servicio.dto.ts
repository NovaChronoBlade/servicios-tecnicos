import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export const CREATE_SOLICITUD_SERVICIO_REQUEST_EXAMPLE = {
  id_cliente: 'cli-001',
  id_servicio: 'srv-001',
  id_direccion: 'dir-001',
  estado: 'pendiente',
};

export const SOLICITUD_SERVICIO_RESPONSE_EXAMPLE = {
  id_ss: 'ss-001',
  ...CREATE_SOLICITUD_SERVICIO_REQUEST_EXAMPLE,
  id_tecnico: 'tec-001',
  fecha: '2026-05-23T22:37:10.000Z',
};

export class CreateSolicitudServicioDto {
  @ApiProperty({ example: 'USR-CLI-abc123' })
  @IsString()
  @IsNotEmpty()
  id_cliente!: string;

  @ApiPropertyOptional({ example: 'USR-TEC-abc123' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id_tecnico?: string;

  @ApiProperty({ example: 'SRV-abc123' })
  @IsString()
  @IsNotEmpty()
  id_servicio!: string;

  @ApiProperty({ example: 'DIR-abc123' })
  @IsString()
  @IsNotEmpty()
  id_direccion!: string;

  @ApiPropertyOptional({ example: 'pendiente', maxLength: 20 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  estado?: string;

  @ApiPropertyOptional({
    example: '2026-05-23T22:37:10.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  fecha?: string;
}
