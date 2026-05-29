# Tipos Frontend alineados al Backend

Este documento define los tipos recomendados para frontend segun el backend actual (NestJS + Prisma).

## Estructura recomendada

```text
frontend/
  src/
    types/
      auth.types.ts
      user.types.ts
      direccion.types.ts
      servicio.types.ts
      solicitud.types.ts
      pago.types.ts
      calificacion.types.ts
      index.ts
```

## 1) auth.types.ts

```ts
import { UserPublic, UserRole } from "./user.types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  documento: string;
  fecha_nacimiento: string; // YYYY-MM-DD
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
}
```

## 2) user.types.ts

```ts
export enum UserRole {
  ADMIN = "admin",
  TECNICO = "tecnico",
  CLIENTE = "cliente",
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
```

## 3) direccion.types.ts

```ts
export interface Direccion {
  id_direccion: string;
  id_usuario: string;
  direccion: string;
  tipo_edificio: string;
  informacion?: string | null;
  nota?: string | null;
  es_default: boolean;
}

export interface CreateDireccionRequest {
  id_usuario?: string;
  direccion: string;
  tipo_edificio: string;
  informacion?: string;
  nota?: string;
  es_default?: boolean;
}

export type UpdateDireccionRequest = Partial<CreateDireccionRequest>;
```

## 4) servicio.types.ts

```ts
export interface CategoriaServicio {
  id_categoria: string;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
}

export interface Servicio {
  id_servicio: string;
  nombre: string;
  descripcion: string;
  precio: string; // Decimal de Prisma
  activo: boolean;
  id_categoria?: string | null;
  categoria?: CategoriaServicio | null;
}

export interface CreateServicioRequest {
  id_servicio?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  activo?: boolean;
  id_categoria?: string;
}

export type UpdateServicioRequest = Partial<CreateServicioRequest>;

export interface ServicioFilters {
  nombre?: string;
  min?: number;
  max?: number;
  page?: number;
  limit?: number;
}
```

## 5) solicitud.types.ts

```ts
export type SolicitudEstado =
  | "pendiente"
  | "aceptado"
  | "en_curso"
  | "completado"
  | "cancelado"
  | (string & {});

export interface SolicitudServicio {
  id_ss: string;
  id_cliente: string;
  id_tecnico?: string | null;
  id_servicio: string;
  id_direccion: string;
  estado: SolicitudEstado;
  confirmacion_cliente: boolean;
  confirmacion_tecnico: boolean;
  motivo_cancelacion?: string | null;
  fecha: string;
  fecha_programada?: string | null;
}

export interface CreateSolicitudRequest {
  id_cliente: string;
  id_tecnico?: string;
  id_servicio: string;
  id_direccion: string;
  estado?: string;
  fecha?: string;
  fecha_programada?: string;
}

export type UpdateSolicitudRequest = Partial<CreateSolicitudRequest>;

export interface ReasignarTecnicoRequest {
  id_tecnico: string;
}

export interface CancelarSolicitudRequest {
  motivo_cancelacion: string;
}

export interface SolicitudFilters {
  estado?: string;
  id_cliente?: string;
  id_tecnico?: string;
  page?: number;
  limit?: number;
}
```

## 6) pago.types.ts

```ts
export type PagoEstado = "pendiente" | "pagado" | "reembolsado";

export interface Pago {
  id_pago: string;
  id_ss: string;
  monto: string; // Decimal de Prisma
  metodo_pago: string;
  estado: PagoEstado;
  numero_referencia?: string | null;
  fecha_pago: string;
}

export interface CreatePagoRequest {
  id_ss: string;
  monto: number;
  metodo_pago: string;
  token_pago?: string;
  moneda?: string; // ISO 4217, ej "COP"
}

export interface UpdatePagoEstadoRequest {
  estado: PagoEstado;
}
```

## 7) calificacion.types.ts

```ts
export interface Calificacion {
  id_calificacion: string;
  id_tecnico: string;
  id_cliente: string;
  id_ss: string;
  puntuacion: number; // 1..5
  comentario?: string | null;
  fecha_calificacion: string;
}

export interface CreateCalificacionRequest {
  id_tecnico: string;
  id_cliente: string;
  id_ss: string;
  puntuacion: number; // 1..5
  comentario?: string;
  fecha_calificacion?: string;
}

export type UpdateCalificacionRequest = Partial<CreateCalificacionRequest>;

export interface TopTecnico {
  id_tecnico: string;
  nombre?: string;
  promedio: number;
  total_calificaciones: number;
}
```

## 8) index.ts

```ts
export * from "./auth.types";
export * from "./user.types";
export * from "./direccion.types";
export * from "./servicio.types";
export * from "./solicitud.types";
export * from "./pago.types";
export * from "./calificacion.types";
```

## Notas de integracion

- Backend usa IDs tipo string (`id_usuario`, `id_servicio`, `id_ss`, etc.). Evitar `number` en frontend para IDs.
- Campos `Decimal` de Prisma (`precio`, `monto`, `calificacion_promedio`) suelen llegar como `string` en JSON.
- Login retorna HTTP 200 y estructura con `access_token`, `refresh_token`, `expires_in`, `token`, `usuario`.
- Si quieres tipar errores de API, agrega un tipo base:

```ts
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}
```
