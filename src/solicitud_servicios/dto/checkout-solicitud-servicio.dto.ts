import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CheckoutSolicitudServicioDto {
  @ApiProperty({ example: 'USR-CLI-abc123' })
  @IsString()
  @IsNotEmpty()
  id_cliente!: string;

  @ApiProperty({ example: 'USR-TEC-abc123' })
  @IsString()
  @IsNotEmpty()
  id_tecnico!: string;

  @ApiProperty({ example: 'SRV-abc123' })
  @IsString()
  @IsNotEmpty()
  id_servicio!: string;

  @ApiProperty({ example: 'DIR-abc123' })
  @IsString()
  @IsNotEmpty()
  id_direccion!: string;

  @ApiProperty({ example: 'tarjeta', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  metodo_pago!: string;

  @ApiPropertyOptional({ example: 'tok_mock_4242' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  token_pago?: string;

  @ApiPropertyOptional({ example: 'COP' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  moneda?: string;

  @ApiPropertyOptional({
    example: '2026-05-30T14:00:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  fecha_programada?: string;
}
