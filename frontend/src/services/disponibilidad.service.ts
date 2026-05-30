import { DISPONIBILIDAD_ENDPOINTS } from '@/constants/api.constants';
import type {
  CreateDisponibilidadRequest,
  DisponibilidadTecnico,
  UpdateDisponibilidadRequest,
} from '@/types';

import { api } from './api';

export async function listMiDisponibilidad() {
  const { data } = await api.get<DisponibilidadTecnico[]>(
    DISPONIBILIDAD_ENDPOINTS.MINE,
  );
  return data;
}

export async function listDisponibilidadTecnico(idTecnico: string) {
  const { data } = await api.get<DisponibilidadTecnico[]>(
    DISPONIBILIDAD_ENDPOINTS.BY_TECNICO(idTecnico),
  );
  return data;
}

export async function createMiDisponibilidad(
  payload: CreateDisponibilidadRequest,
) {
  const { data } = await api.post<DisponibilidadTecnico>(
    DISPONIBILIDAD_ENDPOINTS.MINE,
    payload,
  );
  return data;
}

export async function createDisponibilidadTecnico(
  idTecnico: string,
  payload: CreateDisponibilidadRequest,
) {
  const { data } = await api.post<DisponibilidadTecnico>(
    DISPONIBILIDAD_ENDPOINTS.BY_TECNICO(idTecnico),
    payload,
  );
  return data;
}

export async function updateDisponibilidad(
  idDisponibilidad: string,
  payload: UpdateDisponibilidadRequest,
) {
  const { data } = await api.patch<DisponibilidadTecnico>(
    DISPONIBILIDAD_ENDPOINTS.DETAIL(idDisponibilidad),
    payload,
  );
  return data;
}

export async function deleteDisponibilidad(idDisponibilidad: string) {
  await api.delete(DISPONIBILIDAD_ENDPOINTS.DETAIL(idDisponibilidad));
}
