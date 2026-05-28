import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CancelarSolicitudDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  motivo_cancelacion!: string;
}
