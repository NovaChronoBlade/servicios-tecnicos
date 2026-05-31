import { DIRECCIONES_ENDPOINTS } from '@/constants/api.constants';
import type {
  CreateDireccionRequest,
  Direccion,
  UpdateDireccionRequest,
} from '@/types';

import { api } from './api';

export async function listDirecciones() {
  const { data } = await api.get<Direccion[]>(DIRECCIONES_ENDPOINTS.LIST);
  return data;
}

export async function listDireccionesByUsuario(idUsuario: string) {
  const { data } = await api.get<Direccion[]>(
    DIRECCIONES_ENDPOINTS.BY_USUARIO(idUsuario),
  );
  return data;
}

export async function getDireccionById(id: string) {
  const { data } = await api.get<Direccion>(DIRECCIONES_ENDPOINTS.DETAIL(id));
  return data;
}

export async function createDireccion(payload: CreateDireccionRequest) {
  const { data } = await api.post<Direccion>(DIRECCIONES_ENDPOINTS.CREATE, payload);
  return data;
}

export async function updateDireccion(id: string, payload: UpdateDireccionRequest) {
  const { data } = await api.patch<Direccion>(
    DIRECCIONES_ENDPOINTS.UPDATE(id),
    payload,
  );
  return data;
}

export async function deleteDireccion(id: string) {
  await api.delete(DIRECCIONES_ENDPOINTS.DELETE(id));
}
