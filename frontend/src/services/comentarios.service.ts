import { COMENTARIOS_ENDPOINTS } from '@/constants/api.constants';

import { api } from './api';

export type Comentario = {
  id_comentario: string;
  id_tecnico: string;
  id_cliente: string;
  id_ss: string;
  contenido: string;
  fecha_comentario?: string;
  nombre_cliente?: string;
  nombre_tecnico?: string;
};

export type CreateComentarioRequest = Pick<
  Comentario,
  'id_tecnico' | 'id_cliente' | 'id_ss' | 'contenido'
>;

export type UpdateComentarioRequest = Pick<Comentario, 'contenido'>;

export async function createComentario(payload: CreateComentarioRequest) {
  const { data } = await api.post<Comentario>(COMENTARIOS_ENDPOINTS.CREATE, payload);
  return data;
}

export async function listComentarios() {
  const { data } = await api.get<Comentario[]>(COMENTARIOS_ENDPOINTS.LIST);
  return data;
}

export async function listComentariosBySolicitud(idSolicitud: string) {
  const { data } = await api.get<Comentario[]>(
    COMENTARIOS_ENDPOINTS.BY_SOLICITUD(idSolicitud),
  );
  return data;
}

export async function getComentarioById(id: string) {
  const { data } = await api.get<Comentario>(COMENTARIOS_ENDPOINTS.DETAIL(id));
  return data;
}

export async function updateComentario(id: string, payload: UpdateComentarioRequest) {
  const { data } = await api.patch<Comentario>(
    COMENTARIOS_ENDPOINTS.UPDATE(id),
    payload,
  );
  return data;
}

export async function deleteComentario(id: string) {
  await api.delete(COMENTARIOS_ENDPOINTS.DELETE(id));
}
