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
  @IsString()
  @IsNotEmpty()
  id_cliente!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id_tecnico?: string;

  @IsString()
  @IsNotEmpty()
  id_servicio!: string;

  @IsString()
  @IsNotEmpty()
  id_direccion!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  estado?: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;
}
