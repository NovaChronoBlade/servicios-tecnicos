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