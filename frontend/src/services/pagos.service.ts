import { PAGOS_ENDPOINTS } from '@/constants/api.constants';
import type {
  CreatePagoRequest,
  Pago,
  UpdatePagoEstadoRequest,
} from '@/types';

import { api } from './api';

export type PagoListItem = Pago & {
  id_servicio?: string;
  nombre_servicio?: string;
  pasarela?: {
    provider: string;
    approved: boolean;
  };
};

function normalizePago(pago: PagoListItem): PagoListItem {
  return {
    ...pago,
    monto: String(pago.monto ?? 0),
  };
}

export async function createPago(payload: CreatePagoRequest) {
  const { data } = await api.post<PagoListItem>(PAGOS_ENDPOINTS.CREATE, payload);
  return normalizePago(data);
}

export async function listPagosBySolicitud(idSolicitud: string) {
  const { data } = await api.get<PagoListItem[]>(
    PAGOS_ENDPOINTS.BY_SOLICITUD(idSolicitud),
  );
  return data.map(normalizePago);
}

export async function listPagosByCliente(idCliente: string) {
  const { data } = await api.get<PagoListItem[]>(PAGOS_ENDPOINTS.BY_CLIENTE(idCliente));
  return data.map(normalizePago);
}

export async function getPagoById(id: string) {
  const { data } = await api.get<PagoListItem>(PAGOS_ENDPOINTS.DETAIL(id));
  return normalizePago(data);
}

export async function updatePagoEstado(id: string, payload: UpdatePagoEstadoRequest) {
  const { data } = await api.patch<PagoListItem>(
    PAGOS_ENDPOINTS.UPDATE_ESTADO(id),
    payload,
  );
  return normalizePago(data);
}

export async function reembolsarPago(id: string) {
  const { data } = await api.patch<PagoListItem>(PAGOS_ENDPOINTS.REEMBOLSAR(id));
  return normalizePago(data);
}
