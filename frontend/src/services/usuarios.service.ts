import { USUARIOS_ENDPOINTS } from '@/constants/api.constants';
import type {
  TecnicoDetails,
  UpdateUsuarioRequest,
  User,
  UserRole,
} from '@/types';

import { api } from './api';
import { cleanParams, unwrapList, type ApiListResponse } from './api-response';

export type UsuarioFilters = {
  page?: number;
  limit?: number;
  rol?: UserRole;
  activo?: boolean;
};

export type TecnicoListItem = Partial<User> &
  TecnicoDetails & {
    id_usuario: string;
    nombre: string;
    correo: string;
    telefono?: string;
    activo?: boolean;
  };

export type TecnicoFilters = {
  page?: number;
  limit?: number;
  disponible?: boolean;
};

export type CreateDetallesTecnicosRequest = {
  especialidad: string;
  licencia_profesional: string;
  disponible?: boolean;
  calificacion_promedio?: number;
};

export type UpdateDetallesTecnicosRequest = Partial<CreateDetallesTecnicosRequest>;

export async function listUsuarios(filters: UsuarioFilters = {}) {
  const { data } = await api.get<ApiListResponse<User>>(USUARIOS_ENDPOINTS.LIST, {
    params: cleanParams({
      page: filters.page,
      limit: filters.limit ?? 100,
      rol: filters.rol,
      activo: filters.activo,
    }),
  });

  return unwrapList(data);
}

export async function listTecnicos(filters: TecnicoFilters = {}) {
  const { data } = await api.get<ApiListResponse<TecnicoListItem>>(
    USUARIOS_ENDPOINTS.TECNICOS,
    {
      params: cleanParams({
        page: filters.page,
        limit: filters.limit ?? 100,
        disponible: filters.disponible,
      }),
    },
  );

  return unwrapList(data);
}

export async function getUsuarioById(id: string) {
  const { data } = await api.get<User>(USUARIOS_ENDPOINTS.DETAIL(id));
  return data;
}

export async function updateUsuario(id: string, payload: UpdateUsuarioRequest) {
  const { data } = await api.patch<User>(USUARIOS_ENDPOINTS.UPDATE(id), payload);
  return data;
}

export async function desactivarUsuario(id: string) {
  await api.patch(USUARIOS_ENDPOINTS.DESACTIVAR(id));
}

export async function createDetallesTecnicos(
  idTecnico: string,
  payload: CreateDetallesTecnicosRequest,
) {
  const { data } = await api.post<TecnicoDetails>(
    USUARIOS_ENDPOINTS.DATOS_TECNICOS(idTecnico),
    payload,
  );
  return data;
}

export async function updateDetallesTecnicos(
  idTecnico: string,
  payload: UpdateDetallesTecnicosRequest,
) {
  const { data } = await api.patch<TecnicoDetails>(
    USUARIOS_ENDPOINTS.DETALLES_TECNICOS(idTecnico),
    payload,
  );
  return data;
}
