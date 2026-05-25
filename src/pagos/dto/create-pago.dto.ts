import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, Min } from 'class-validator';

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
}
