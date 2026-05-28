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
  @IsString()
  @IsNotEmpty()
  id_ss!: string;

  @IsNumber()
  @IsPositive()
  monto!: number;

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
