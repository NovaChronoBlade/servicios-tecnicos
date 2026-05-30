import type { SolicitudServicio } from '@/types';

export const SOLICITUD_ESTADOS = [
  'pendiente',
  'asignado',
  'aceptado',
  'en_curso',
  'completado',
  'cancelado',
] as const;

export type SolicitudEstadoBase = (typeof SOLICITUD_ESTADOS)[number];

export type SolicitudEstadoMeta = {
  canonical: 'PENDING' | 'ASSIGNED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  label: string;
  color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  priority: 'Alta' | 'Media' | 'Baja';
  progress: number;
};

const ESTADO_META: Record<SolicitudEstadoBase, SolicitudEstadoMeta> = {
  pendiente: {
    canonical: 'PENDING',
    label: 'Pendiente',
    color: 'warning',
    priority: 'Media',
    progress: 12,
  },
  asignado: {
    canonical: 'ASSIGNED',
    label: 'Tecnico asignado',
    color: 'secondary',
    priority: 'Media',
    progress: 28,
  },
  aceptado: {
    canonical: 'ACCEPTED',
    label: 'Aceptada',
    color: 'info',
    priority: 'Media',
    progress: 45,
  },
  en_curso: {
    canonical: 'IN_PROGRESS',
    label: 'En curso',
    color: 'primary',
    priority: 'Alta',
    progress: 72,
  },
  completado: {
    canonical: 'COMPLETED',
    label: 'Completada',
    color: 'success',
    priority: 'Baja',
    progress: 100,
  },
  cancelado: {
    canonical: 'CANCELLED',
    label: 'Cancelada',
    color: 'error',
    priority: 'Baja',
    progress: 100,
  },
};

const ALIASES: Record<string, SolicitudEstadoBase> = {
  pendiente: 'pendiente',
  pending: 'pendiente',
  asignado: 'asignado',
  assigned: 'asignado',
  aceptado: 'aceptado',
  accepted: 'aceptado',
  en_curso: 'en_curso',
  in_progress: 'en_curso',
  completado: 'completado',
  completed: 'completado',
  cancelado: 'cancelado',
  cancelled: 'cancelado',
  canceled: 'cancelado',
};

export function normalizeSolicitudEstado(value?: string | null): SolicitudEstadoBase {
  if (!value) return 'pendiente';
  return ALIASES[value.trim().toLowerCase()] ?? 'pendiente';
}

export function getSolicitudEstadoMeta(value?: string | null) {
  return ESTADO_META[normalizeSolicitudEstado(value)];
}

export function hasAssignedTechnician(solicitud: Pick<SolicitudServicio, 'id_tecnico'>) {
  return Boolean(solicitud.id_tecnico);
}

export function canAdminAssignTechnician(solicitud: Pick<SolicitudServicio, 'estado' | 'id_tecnico'>) {
  return normalizeSolicitudEstado(solicitud.estado) === 'pendiente' && !solicitud.id_tecnico;
}

export function canTechnicianAccept(solicitud: Pick<SolicitudServicio, 'estado' | 'id_tecnico'>, userId?: string | null) {
  return normalizeSolicitudEstado(solicitud.estado) === 'asignado' && Boolean(userId) && solicitud.id_tecnico === userId;
}

export function canTechnicianStart(solicitud: Pick<SolicitudServicio, 'estado' | 'id_tecnico'>, userId?: string | null) {
  return normalizeSolicitudEstado(solicitud.estado) === 'aceptado' && Boolean(userId) && solicitud.id_tecnico === userId;
}

export function canTechnicianReportCompletion(solicitud: Pick<SolicitudServicio, 'estado' | 'id_tecnico'>, userId?: string | null) {
  return normalizeSolicitudEstado(solicitud.estado) === 'en_curso' && Boolean(userId) && solicitud.id_tecnico === userId;
}

export function canClientComplete(solicitud: Pick<SolicitudServicio, 'estado' | 'id_tecnico' | 'confirmacion_cliente'>) {
  return normalizeSolicitudEstado(solicitud.estado) === 'en_curso' && Boolean(solicitud.id_tecnico) && !solicitud.confirmacion_cliente;
}

export function isSolicitudTerminal(value?: string | null) {
  const estado = normalizeSolicitudEstado(value);
  return estado === 'completado' || estado === 'cancelado';
}
