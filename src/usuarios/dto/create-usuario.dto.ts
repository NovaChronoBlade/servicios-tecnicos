import { RolEnum } from 'src/auth/enums/rol.enum';

export class CreateUsuarioDto {
  id_usuario?: string;
  documento?: string;
  fecha_nacimiento?: Date;
  nombre?: string;
  correo?: string;
  contrasena?: string;
  telefono?: string;
  rol?: RolEnum;
}
