import { SERVICIOS_ENDPOINTS } from '@/constants/api.constants';
import type {
  CategoriaServicio,
  CreateServicioRequest,
  Servicio,
  ServicioFilters,
  UpdateServicioRequest,
} from '@/types';

import { api } from './api';
import { cleanParams, unwrapList, type ApiListResponse } from './api-response';

export type ServicioListItem = Servicio & {
  nombre_categoria?: string | null;
  categoriaNombre: string;
  tiempoEstimado: string;
  puntuacionPromedio: number;
};

export type CategoriaServicioListItem = CategoriaServicio & {
  servicios?: number;
};

export function normalizeServicio(servicio: Servicio & { nombre_categoria?: string | null }): ServicioListItem {
  const categoriaNombre =
    servicio.categoria?.nombre ?? servicio.nombre_categoria ?? 'Sin categoria';

  return {
    ...servicio,
    precio: String(servicio.precio ?? 0),
    categoriaNombre,
    tiempoEstimado: 'Por confirmar',
    puntuacionPromedio: 0,
  };
}

export async function listServicios(filters: ServicioFilters = {}) {
  const endpoint = filters.nombre?.trim()
    ? SERVICIOS_ENDPOINTS.BUSCAR
    : SERVICIOS_ENDPOINTS.LIST;

  const { data } = await api.get<ApiListResponse<Servicio & { nombre_categoria?: string | null }>>(
    endpoint,
    {
      params: cleanParams({
        nombre: filters.nombre,
        page: filters.page,
        limit: filters.limit ?? 100,
      }),
    },
  );

  return unwrapList(data).map(normalizeServicio);
}

export async function getServicioById(id: string) {
  const { data } = await api.get<Servicio & { nombre_categoria?: string | null }>(
    SERVICIOS_ENDPOINTS.DETAIL(id),
  );
  return normalizeServicio(data);
}

export async function createServicio(payload: CreateServicioRequest) {
  const { data } = await api.post<Servicio & { nombre_categoria?: string | null }>(
    SERVICIOS_ENDPOINTS.CREATE,
    payload,
  );
  return normalizeServicio(data);
}

export async function updateServicio(id: string, payload: UpdateServicioRequest) {
  const { data } = await api.patch<Servicio & { nombre_categoria?: string | null }>(
    SERVICIOS_ENDPOINTS.UPDATE(id),
    payload,
  );
  return normalizeServicio(data);
}

export async function deactivateServicio(id: string) {
  await api.delete(SERVICIOS_ENDPOINTS.DELETE(id));
}

export async function activateServicio(id: string) {
  const { data } = await api.patch<Servicio & { nombre_categoria?: string | null }>(
    SERVICIOS_ENDPOINTS.ACTIVAR(id),
  );
  return normalizeServicio(data);
}

export async function listCategorias() {
  const { data } = await api.get<CategoriaServicioListItem[]>(
    SERVICIOS_ENDPOINTS.CATEGORIAS.LIST,
  );
  return data;
}

export async function createCategoria(payload: Omit<CategoriaServicio, 'id_categoria'>) {
  const { data } = await api.post<CategoriaServicioListItem>(
    SERVICIOS_ENDPOINTS.CATEGORIAS.CREATE,
    payload,
  );
  return data;
}
