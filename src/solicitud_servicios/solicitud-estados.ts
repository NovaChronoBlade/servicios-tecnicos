import { BadRequestException } from '@nestjs/common';

export const ESTADOS_SOLICITUD = [
  'pendiente',
  'asignado',
  'aceptado',
  'en_curso',
  'completado',
  'cancelado',
] as const;

export type EstadoSolicitud = (typeof ESTADOS_SOLICITUD)[number];

const ESTADO_ALIASES: Record<string, EstadoSolicitud> = {
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

export const TRANSICIONES_SOLICITUD: Record<
  EstadoSolicitud,
  EstadoSolicitud[]
> = {
  pendiente: ['asignado', 'aceptado', 'cancelado'],
  asignado: ['aceptado', 'cancelado'],
  aceptado: ['en_curso', 'cancelado'],
  en_curso: ['completado', 'cancelado'],
  completado: [],
  cancelado: [],
};

export function normalizeEstadoSolicitud(value: string): EstadoSolicitud {
  const normalized = ESTADO_ALIASES[value.trim().toLowerCase()];
  if (!normalized) {
    throw new BadRequestException(
      `Estado invalido. Los estados permitidos son: ${ESTADOS_SOLICITUD.join(', ')}`,
    );
  }

  return normalized;
}

export function canTransitionSolicitud(
  current: EstadoSolicitud,
  next: EstadoSolicitud,
) {
  return TRANSICIONES_SOLICITUD[current].includes(next);
}
