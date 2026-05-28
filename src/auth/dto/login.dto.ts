import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'cliente@test.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, example: 'Passw0rd!123' })
  @MinLength(8)
  password!: string;
}
