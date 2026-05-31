export interface Comentario {
  id_comentario: string;
  id_tecnico: string;
  id_cliente: string;
  id_ss: string;
  contenido: string;
  fecha_comentario?: string;
  nombre_cliente?: string;
  nombre_tecnico?: string;
}

export type CreateComentarioRequest = Pick<
  Comentario,
  'id_tecnico' | 'id_cliente' | 'id_ss' | 'contenido'
>;

export type UpdateComentarioRequest = Pick<Comentario, 'contenido'>;
