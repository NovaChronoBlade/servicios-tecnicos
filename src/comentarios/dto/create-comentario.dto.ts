import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateComentarioDto {
  @IsString()
  @IsNotEmpty()
  id_tecnico!: string;

  @IsString()
  @IsNotEmpty()
  id_cliente!: string;

  @IsString()
  @IsNotEmpty()
  id_ss!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  contenido!: string;
}
