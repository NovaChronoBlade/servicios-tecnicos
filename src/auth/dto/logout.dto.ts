import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LogoutDto {
  @ApiPropertyOptional({
    description:
      'Refresh token a invalidar. Si se omite, se invalida el JWT de acceso actual.',
  })
  @IsOptional()
  @IsString()
  refresh_token?: string;
}
