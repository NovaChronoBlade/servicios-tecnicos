import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: '1020304050' })
  @IsString()
  documento!: string;

  @ApiProperty({ example: '1995-05-20', type: String, format: 'date' })
  @IsDateString()
  fecha_nacimiento!: Date;

  @ApiProperty({ example: 'Cliente Demo' })
  @IsString()
  nombre!: string;

  @ApiProperty({ example: 'cliente@test.com' })
  @IsEmail()
  correo!: string;

  @ApiProperty({ minLength: 8, example: 'Passw0rd!123' })
  @MinLength(8)
  contrasena!: string;

  @ApiProperty({ example: '3101234567' })
  @IsString()
  telefono!: string;

  @ApiProperty({ enum: RolEnum, example: RolEnum.CLIENTE })
  @IsEnum(RolEnum, {
    message: `El rol debe ser uno de los siguientes: ${Object.values(RolEnum).join(', ')}`,
  })
  rol!: RolEnum;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  activo: boolean = true;
}
