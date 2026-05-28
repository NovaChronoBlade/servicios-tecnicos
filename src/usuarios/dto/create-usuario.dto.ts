import { ApiPropertyOptional } from '@nestjs/swagger';
import { RolEnum } from 'src/auth/enums/rol.enum';

export class CreateUsuarioDto {
  @ApiPropertyOptional({ example: 'USR-CLI-abc123' })
  id_usuario?: string;

  @ApiPropertyOptional({ example: '1020304050' })
  documento?: string;

  @ApiPropertyOptional({ example: '1995-05-20', type: String, format: 'date' })
  fecha_nacimiento?: Date;

  @ApiPropertyOptional({ example: 'Cliente Demo' })
  nombre?: string;

  @ApiPropertyOptional({ example: 'cliente@test.com' })
  correo?: string;

  @ApiPropertyOptional({ example: 'Passw0rd!123' })
  contrasena?: string;

  @ApiPropertyOptional({ example: '3101234567' })
  telefono?: string;

  @ApiPropertyOptional({ enum: RolEnum, example: RolEnum.CLIENTE })
  rol?: RolEnum;
}
