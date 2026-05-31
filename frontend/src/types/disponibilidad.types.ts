export interface DisponibilidadTecnico {
  id_disponibilidad: string;
  id_tecnico: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  activo: boolean;
  nota?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDisponibilidadRequest {
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  activo?: boolean;
  nota?: string;
}

export type UpdateDisponibilidadRequest = Partial<CreateDisponibilidadRequest>;
