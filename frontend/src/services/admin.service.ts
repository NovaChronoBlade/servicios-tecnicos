import { ADMIN_ENDPOINTS } from '@/constants/api.constants';
import { api } from './api';

export type AdminConfigItem = Record<string, string>;

export type AdminAuditEvent = {
  id: string;
  modulo: string;
  evento: string;
  fecha: string;
};

export async function getAdminConfiguracion() {
  const { data } = await api.get<AdminConfigItem>(
    ADMIN_ENDPOINTS.CONFIGURACION,
  );
  return data;
}

export async function getAdminAuditoria() {
  const { data } = await api.get<AdminAuditEvent[]>(ADMIN_ENDPOINTS.AUDITORIA);
  return data;
}
