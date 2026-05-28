import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
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
}
