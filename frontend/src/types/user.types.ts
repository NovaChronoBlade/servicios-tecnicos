export enum UserRole {
  ADMIN = 'admin',
  TECNICO = 'tecnico',
  CLIENTE = 'cliente',
}

export interface UserPublic {
  id_usuario: string;
  nombre: string;
  correo: string;
  rol: UserRole;
}

export interface User extends UserPublic {
  documento: string;
  fecha_nacimiento: string; // backend lo maneja como Date
  telefono: string;
  activo: boolean;
}

export interface TecnicoDetails {
  id_usuario: string;
  especialidad: string;
  licencia_profesional: string;
  disponible: boolean;
  calificacion_promedio: string; // Decimal de Prisma -> string en JSON
}

export interface CreateUsuarioRequest {
  id_usuario?: string;
  documento?: string;
  fecha_nacimiento?: string;
  nombre?: string;
  correo?: string;
  contrasena?: string;
  telefono?: string;
  rol?: UserRole;
}

export type UpdateUsuarioRequest = Partial<CreateUsuarioRequest>;
