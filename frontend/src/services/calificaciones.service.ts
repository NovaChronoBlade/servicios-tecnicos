import { CALIFICACIONES_ENDPOINTS } from '@/constants/api.constants';
import type {
  Calificacion,
  CreateCalificacionRequest,
  TopTecnico,
} from '@/types';

import { api } from './api';
import { cleanParams, unwrapList, type ApiListResponse } from './api-response';

export type CalificacionListItem = Calificacion & {
  nombre_tecnico?: string;
  nombre_cliente?: string;
  nombre_servicio?: string;
  clienteNombre?: string;
  servicioNombre?: string;
};

export type TopTecnicoListItem = TopTecnico & {
  nombre_tecnico?: string;
  especialidad?: string;
  disponible?: boolean;
};

function normalizeCalificacion(calificacion: Partial<CalificacionListItem> & { id_calificacion: string }): CalificacionListItem {
  return {
    id_calificacion: calificacion.id_calificacion,
    id_tecnico: calificacion.id_tecnico ?? '',
    id_cliente: calificacion.id_cliente ?? '',
    id_ss: calificacion.id_ss ?? '',
    puntuacion: Number(calificacion.puntuacion ?? 0),
    comentario: calificacion.comentario ?? null,
    fecha_calificacion: calificacion.fecha_calificacion ?? new Date().toISOString(),
    nombre_tecnico: calificacion.nombre_tecnico,
    nombre_cliente: calificacion.nombre_cliente,
    nombre_servicio: calificacion.nombre_servicio,
    clienteNombre: calificacion.nombre_cliente ?? calificacion.clienteNombre ?? 'Cliente',
    servicioNombre: calificacion.nombre_servicio ?? calificacion.servicioNombre ?? 'Servicio',
  };
}

function normalizeTopTecnico(tecnico: TopTecnicoListItem): TopTecnicoListItem {
  return {
    ...tecnico,
    nombre: tecnico.nombre ?? tecnico.nombre_tecnico ?? 'Tecnico',
    promedio: Number(tecnico.promedio ?? 0),
    total_calificaciones: Number(tecnico.total_calificaciones ?? 0),
  };
}

export async function createCalificacion(payload: CreateCalificacionRequest) {
  const { data } = await api.post<CalificacionListItem>(
    CALIFICACIONES_ENDPOINTS.CREATE,
    payload,
  );
  return normalizeCalificacion(data);
}

export async function listTopTecnicos(limit = 10) {
  const { data } = await api.get<TopTecnicoListItem[]>(
    CALIFICACIONES_ENDPOINTS.TOP_TECNICOS,
    { params: { limit } },
  );
  return data.map(normalizeTopTecnico);
}

export async function listCalificacionesByTecnico(idTecnico: string) {
  const { data } = await api.get<ApiListResponse<CalificacionListItem>>(
    CALIFICACIONES_ENDPOINTS.BY_TECNICO(idTecnico),
    { params: cleanParams({ limit: 100 }) },
  );
  return unwrapList(data).map(normalizeCalificacion);
}

export async function getPromedioTecnico(idTecnico: string) {
  const { data } = await api.get<TopTecnicoListItem>(
    CALIFICACIONES_ENDPOINTS.PROMEDIO_TECNICO(idTecnico),
  );
  return normalizeTopTecnico(data);
}

export async function listCalificacionesByCliente(idCliente: string) {
  const { data } = await api.get<ApiListResponse<CalificacionListItem>>(
    CALIFICACIONES_ENDPOINTS.BY_CLIENTE(idCliente),
    { params: cleanParams({ limit: 100 }) },
  );
  return unwrapList(data).map(normalizeCalificacion);
}

export async function getCalificacionById(id: string) {
  const { data } = await api.get<CalificacionListItem>(
    CALIFICACIONES_ENDPOINTS.DETAIL(id),
  );
  return normalizeCalificacion(data);
}
