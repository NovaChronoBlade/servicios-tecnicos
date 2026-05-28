import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreatePagoDto {
  @ApiProperty({ example: 'SS-abc123' })
  @IsString()
  @IsNotEmpty()
  id_ss!: string;

  @ApiProperty({ example: 89000, minimum: 0.01 })
  @IsNumber()
  @IsPositive()
  monto!: number;

  @ApiProperty({ example: 'tarjeta', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  metodo_pago!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  token_pago?: string;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  moneda?: string;
}
