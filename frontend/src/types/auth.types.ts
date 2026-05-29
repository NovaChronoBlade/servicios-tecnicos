import { UserPublic, UserRole } from './user.types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  documento: string;
  fecha_nacimiento: string;
  nombre: string;
  correo: string;
  contrasena: string;
  telefono: string;
  rol: UserRole;
  activo?: boolean;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  refresh_token?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: string; // ej: "1h"
  token: string; // alias de compatibilidad (= access_token)
}

export interface AuthResponse extends AuthTokens {
  message: string;
  usuario: UserPublic;
  user?: UserPublic;
}

export type RegisterResponse = AuthResponse;
