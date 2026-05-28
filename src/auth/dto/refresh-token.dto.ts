import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token vigente entregado por login o refresh.',
    example: 'bf2f4fd1d7d0c4b4...',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token!: string;
}
