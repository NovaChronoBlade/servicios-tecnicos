import { IsNotEmpty, IsString } from 'class-validator';

export class ReasignarTecnicoDto {
  @IsString()
  @IsNotEmpty()
  id_tecnico!: string;
}
