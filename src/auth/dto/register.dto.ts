import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
} from 'class-validator';
import { RolEnum } from '../enums/rol.enum';

export class RegisterDto {
  @IsString()
  documento!: string;

  @IsDateString()
  fecha_nacimiento!: Date;

  @IsString()
  nombre!: string;

  @IsEmail()
  correo!: string;

  @MinLength(8)
  contrasena!: string;

  @IsString()
  telefono!: string;

  @IsEnum(RolEnum, {
    message: `El rol debe ser uno de los siguientes: ${Object.values(RolEnum).join(', ')}`,
  })
  rol!: RolEnum;

  @IsBoolean()
  activo: boolean = true;
}
