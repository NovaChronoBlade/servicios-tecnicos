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