import { SOLICITUDES_ENDPOINTS } from '@/constants/api.constants';
import type {
  CancelarSolicitudRequest,
  CreateSolicitudRequest,
  ReasignarTecnicoRequest,
  SolicitudServicio,
  UpdateSolicitudRequest,
} from '@/types';

import { api } from './api';
import { cleanParams, unwrapList, type ApiListResponse } from './api-response';

export type SolicitudView = SolicitudServicio & {
  nombre_cliente?: string;
  nombre_tecnico?: string | null;
  nombre_servicio?: string;
  precio_servicio?: string | number | null;
  direccion_servicio?: string;
  tipo_edificio?: string;
  servicioNombre: string;
  servicioCategoria: string;
  direccionResumen: string;
  tecnicoNombre?: string;
  clienteNombre?: string;
  clienteTelefono?: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  tiempoEstimado: string;
  valorEstimado: string;
  distanciaKm: number;
  progreso: number;
  notasTecnicas: string;
  materialesSugeridos: string;
  observacionesCliente: string;
};

export type SolicitudFilters = {
  page?: number;
  limit?: number;
  estado?: string;
  id_tecnico?: string;
  desde?: string;
};

type SolicitudBackend = Partial<SolicitudServicio> & {
  id_ss: string;
  nombre_cliente?: string;
  nombre_tecnico?: string | null;
  nombre_servicio?: string;
  precio_servicio?: string | number | null;
  direccion_servicio?: string;
  tipo_edificio?: string;
};

function getPriority(estado?: string): 'Alta' | 'Media' | 'Baja' {
  if (estado === 'en_curso') return 'Alta';
  if (estado === 'pendiente' || estado === 'aceptado') return 'Media';
  return 'Baja';
}

function getProgress(estado?: string) {
  if (estado === 'completado') return 100;
  if (estado === 'en_curso') return 66;
  if (estado === 'aceptado') return 33;
  return 12;
}

export function normalizeSolicitud(solicitud: SolicitudBackend): SolicitudView {
  const precio = solicitud.precio_servicio ?? 0;
  const servicioNombre = solicitud.nombre_servicio ?? solicitud.id_servicio ?? 'Servicio';
  const direccionResumen =
    solicitud.direccion_servicio ??
    solicitud.id_direccion ??
    'Direccion no disponible en este endpoint';

  return {
    id_ss: solicitud.id_ss,
    id_cliente: solicitud.id_cliente ?? '',
    id_tecnico: solicitud.id_tecnico ?? null,
    id_servicio: solicitud.id_servicio ?? '',
    id_direccion: solicitud.id_direccion ?? '',
    estado: solicitud.estado ?? 'pendiente',
    confirmacion_cliente: Boolean(solicitud.confirmacion_cliente),
    confirmacion_tecnico: Boolean(solicitud.confirmacion_tecnico),
    motivo_cancelacion: solicitud.motivo_cancelacion ?? null,
    fecha: solicitud.fecha ?? new Date().toISOString(),
    fecha_programada: solicitud.fecha_programada ?? null,
    nombre_cliente: solicitud.nombre_cliente,
    nombre_tecnico: solicitud.nombre_tecnico,
    nombre_servicio: solicitud.nombre_servicio,
    precio_servicio: solicitud.precio_servicio,
    direccion_servicio: solicitud.direccion_servicio,
    tipo_edificio: solicitud.tipo_edificio,
    servicioNombre,
    servicioCategoria: solicitud.tipo_edificio ?? 'Servicio tecnico',
    direccionResumen,
    tecnicoNombre: solicitud.nombre_tecnico ?? undefined,
    clienteNombre: solicitud.nombre_cliente ?? solicitud.id_cliente ?? 'Cliente',
    clienteTelefono: 'No disponible',
    prioridad: getPriority(solicitud.estado),
    tiempoEstimado: 'Por confirmar',
    valorEstimado: `$${Number(precio).toLocaleString('es-CO')}`,
    distanciaKm: 0,
    progreso: getProgress(solicitud.estado),
    notasTecnicas: 'Sin notas tecnicas registradas.',
    materialesSugeridos: 'Sin materiales sugeridos registrados.',
    observacionesCliente: direccionResumen,
  };
}

export async function createSolicitud(payload: CreateSolicitudRequest) {
  const { data } = await api.post<SolicitudBackend>(
    SOLICITUDES_ENDPOINTS.CREATE,
    payload,
  );
  return normalizeSolicitud(data);
}

export async function listSolicitudes(filters: SolicitudFilters = {}) {
  const { data } = await api.get<ApiListResponse<SolicitudBackend>>(
    SOLICITUDES_ENDPOINTS.LIST,
    {
      params: cleanParams({
        page: filters.page,
        limit: filters.limit ?? 100,
        estado: filters.estado,
        id_tecnico: filters.id_tecnico,
        desde: filters.desde,
      }),
    },
  );
  return unwrapList(data).map(normalizeSolicitud);
}

export async function listSolicitudesByCliente(idCliente: string) {
  const { data } = await api.get<SolicitudBackend[]>(
    SOLICITUDES_ENDPOINTS.BY_CLIENTE(idCliente),
  );
  return data.map(normalizeSolicitud);
}

export async function listSolicitudesByTecnico(idTecnico: string) {
  const { data } = await api.get<SolicitudBackend[]>(
    SOLICITUDES_ENDPOINTS.BY_TECNICO(idTecnico),
  );
  return data.map(normalizeSolicitud);
}

export async function listSolicitudesPendientesDisponibles() {
  const { data } = await api.get<SolicitudBackend[]>(
    SOLICITUDES_ENDPOINTS.PENDIENTES_DISPONIBLES,
  );
  return data.map(normalizeSolicitud);
}

export async function getSolicitudById(id: string) {
  const { data } = await api.get<SolicitudBackend>(SOLICITUDES_ENDPOINTS.DETAIL(id));
  return normalizeSolicitud(data);
}

export async function updateSolicitudEstado(id: string, estado: string) {
  const { data } = await api.patch<SolicitudBackend>(
    SOLICITUDES_ENDPOINTS.UPDATE_ESTADO(id),
    { estado },
  );
  return normalizeSolicitud(data);
}

export async function cancelarSolicitud(id: string, payload: CancelarSolicitudRequest) {
  const { data } = await api.patch<SolicitudBackend>(
    SOLICITUDES_ENDPOINTS.CANCELAR(id),
    payload,
  );
  return normalizeSolicitud(data);
}

export async function reasignarTecnico(id: string, payload: ReasignarTecnicoRequest) {
  const { data } = await api.patch<SolicitudBackend>(
    SOLICITUDES_ENDPOINTS.REASIGNAR_TECNICO(id),
    payload,
  );
  return normalizeSolicitud(data);
}

export async function asignarTecnico(id: string, idTecnico: string) {
  const { data } = await api.patch<SolicitudBackend>(
    SOLICITUDES_ENDPOINTS.ASIGNAR_TECNICO(id, idTecnico),
  );
  return normalizeSolicitud(data);
}

export async function confirmarCliente(id: string) {
  const { data } = await api.patch<SolicitudBackend>(
    SOLICITUDES_ENDPOINTS.CONFIRMAR_CLIENTE(id),
  );
  return normalizeSolicitud(data);
}

export async function confirmarTecnico(id: string) {
  const { data } = await api.patch<SolicitudBackend>(
    SOLICITUDES_ENDPOINTS.CONFIRMAR_TECNICO(id),
  );
  return normalizeSolicitud(data);
}

export async function updateSolicitud(_id: string, _payload: UpdateSolicitudRequest) {
  throw new Error('El backend no expone PATCH general de solicitudes; use endpoints de estado, cancelacion o asignacion.');
}
