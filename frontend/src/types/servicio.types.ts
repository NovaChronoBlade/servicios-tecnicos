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
  nombre_categoria?: string | null;
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
  | "asignado"
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
  fecha_aceptacion?: string | null;
  fecha_finalizacion?: string | null;
  nombre_cliente?: string;
  nombre_tecnico?: string | null;
  telefono_cliente?: string | null;
  correo_tecnico?: string | null;
  telefono_tecnico?: string | null;
  tecnico_especialidad?: string | null;
  tecnico_disponible?: boolean | null;
  tecnico_calificacion_promedio?: string | number | null;
  nombre_servicio?: string;
  precio_servicio?: string | number | null;
  direccion_servicio?: string;
  tipo_edificio?: string;
  informacion_direccion?: string | null;
  nota_direccion?: string | null;
  id_pago?: string | null;
  metodo_pago?: string | null;
  estado_pago?: string | null;
  numero_referencia?: string | null;
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

export interface CheckoutSolicitudRequest {
  id_cliente: string;
  id_tecnico: string;
  id_servicio: string;
  id_direccion: string;
  metodo_pago: string;
  token_pago?: string;
  moneda?: string;
  fecha_programada?: string;
}

export interface CheckoutSolicitudResponse {
  solicitud: SolicitudServicio;
  pago: {
    id_pago: string;
    id_ss: string;
    monto: number | string;
    metodo_pago: string;
    estado: "pagado";
    numero_referencia?: string | null;
    pasarela?: {
      provider: string;
      approved: boolean;
    };
  };
}
