export interface Calificacion {
  id_calificacion: string;
  id_tecnico: string;
  id_cliente: string;
  id_ss: string;
  puntuacion: number; // 1..5
  comentario?: string | null;
  fecha_calificacion: string;
  nombre_tecnico?: string;
  nombre_cliente?: string;
  nombre_servicio?: string;
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
  nombre_tecnico?: string;
  especialidad?: string;
  disponible?: boolean;
  promedio: number;
  total_calificaciones: number;
}
