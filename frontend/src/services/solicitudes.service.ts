import { SOLICITUDES_ENDPOINTS } from '@/constants/api.constants';
import type {
  CancelarSolicitudRequest,
  CheckoutSolicitudRequest,
  CheckoutSolicitudResponse,
  CreateSolicitudRequest,
  ReasignarTecnicoRequest,
  SolicitudServicio,
  UpdateSolicitudRequest,
} from '@/types';
import { getSolicitudEstadoMeta, normalizeSolicitudEstado } from '@/utils/solicitud-state';

import { api } from './api';
import { cleanParams, unwrapList, type ApiListResponse } from './api-response';

export type SolicitudView = SolicitudServicio & {
  nombre_cliente?: string;
  nombre_tecnico?: string | null;
  nombre_servicio?: string;
  precio_servicio?: string | number | null;
  direccion_servicio?: string;
  tipo_edificio?: string;
  informacion_direccion?: string | null;
  nota_direccion?: string | null;
  fecha_aceptacion?: string | null;
  fecha_finalizacion?: string | null;
  telefono_cliente?: string | null;
  correo_tecnico?: string | null;
  telefono_tecnico?: string | null;
  tecnico_especialidad?: string | null;
  tecnico_disponible?: boolean | null;
  tecnico_calificacion_promedio?: string | number | null;
  id_pago?: string | null;
  metodo_pago?: string | null;
  estado_pago?: string | null;
  numero_referencia?: string | null;
  servicioNombre: string;
  servicioCategoria: string;
  direccionResumen: string;
  tecnicoNombre?: string;
  tecnicoEspecialidad?: string;
  tecnicoEstadoAsignacion: string;
  tecnicoContacto?: string;
  fechaAceptacion?: string | null;
  fechaFinalizacion?: string | null;
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
  estadoLabel: string;
  estadoCanonical: string;
  estadoColor: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  pagoMetodo?: string | null;
  pagoEstado?: string | null;
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
};

export function normalizeSolicitud(solicitud: SolicitudBackend): SolicitudView {
  const precio = solicitud.precio_servicio ?? 0;
  const servicioNombre = solicitud.nombre_servicio ?? solicitud.id_servicio ?? 'Servicio';
  const estado = normalizeSolicitudEstado(solicitud.estado);
  const estadoMeta = getSolicitudEstadoMeta(estado);
  const direccionResumen =
    solicitud.direccion_servicio ??
    solicitud.id_direccion ??
    'Direccion no disponible en este endpoint';
  const tecnicoNombre = solicitud.nombre_tecnico ?? undefined;
  const tecnicoEspecialidad = solicitud.tecnico_especialidad ?? undefined;

  return {
    id_ss: solicitud.id_ss,
    id_cliente: solicitud.id_cliente ?? '',
    id_tecnico: solicitud.id_tecnico ?? null,
    id_servicio: solicitud.id_servicio ?? '',
    id_direccion: solicitud.id_direccion ?? '',
    estado,
    confirmacion_cliente: Boolean(solicitud.confirmacion_cliente),
    confirmacion_tecnico: Boolean(solicitud.confirmacion_tecnico),
    motivo_cancelacion: solicitud.motivo_cancelacion ?? null,
    fecha: solicitud.fecha ?? new Date().toISOString(),
    fecha_programada: solicitud.fecha_programada ?? null,
    fecha_aceptacion: solicitud.fecha_aceptacion ?? null,
    fecha_finalizacion: solicitud.fecha_finalizacion ?? null,
    nombre_cliente: solicitud.nombre_cliente,
    nombre_tecnico: solicitud.nombre_tecnico,
    telefono_cliente: solicitud.telefono_cliente,
    correo_tecnico: solicitud.correo_tecnico,
    telefono_tecnico: solicitud.telefono_tecnico,
    tecnico_especialidad: solicitud.tecnico_especialidad,
    tecnico_disponible: solicitud.tecnico_disponible,
    tecnico_calificacion_promedio: solicitud.tecnico_calificacion_promedio,
    nombre_servicio: solicitud.nombre_servicio,
    precio_servicio: solicitud.precio_servicio,
    direccion_servicio: solicitud.direccion_servicio,
    tipo_edificio: solicitud.tipo_edificio,
    informacion_direccion: solicitud.informacion_direccion,
    nota_direccion: solicitud.nota_direccion,
    id_pago: solicitud.id_pago,
    metodo_pago: solicitud.metodo_pago,
    estado_pago: solicitud.estado_pago,
    numero_referencia: solicitud.numero_referencia,
    servicioNombre,
    servicioCategoria: solicitud.tipo_edificio ?? 'Servicio tecnico',
    direccionResumen,
    tecnicoNombre,
    tecnicoEspecialidad,
    tecnicoEstadoAsignacion: solicitud.id_tecnico ? estadoMeta.label : 'Sin tecnico asignado',
    tecnicoContacto: solicitud.telefono_tecnico ?? solicitud.correo_tecnico ?? undefined,
    fechaAceptacion: solicitud.fecha_aceptacion ?? null,
    fechaFinalizacion: solicitud.fecha_finalizacion ?? null,
    clienteNombre: solicitud.nombre_cliente ?? solicitud.id_cliente ?? 'Cliente',
    clienteTelefono: solicitud.telefono_cliente ?? 'No disponible',
    prioridad: estadoMeta.priority,
    tiempoEstimado: 'Por confirmar',
    valorEstimado: `$${Number(precio).toLocaleString('es-CO')}`,
    distanciaKm: 0,
    progreso: estadoMeta.progress,
    notasTecnicas: 'Sin notas tecnicas registradas.',
    materialesSugeridos: 'Sin materiales sugeridos registrados.',
    observacionesCliente: solicitud.nota_direccion ?? solicitud.informacion_direccion ?? direccionResumen,
    estadoLabel: estadoMeta.label,
    estadoCanonical: estadoMeta.canonical,
    estadoColor: estadoMeta.color,
    pagoMetodo: solicitud.metodo_pago,
    pagoEstado: solicitud.estado_pago,
  };
}

export async function createSolicitud(payload: CreateSolicitudRequest) {
  const { data } = await api.post<SolicitudBackend>(
    SOLICITUDES_ENDPOINTS.CREATE,
    payload,
  );
  return normalizeSolicitud(data);
}

export async function checkoutSolicitud(payload: CheckoutSolicitudRequest) {
  const { data } = await api.post<CheckoutSolicitudResponse>(
    SOLICITUDES_ENDPOINTS.CHECKOUT,
    payload,
  );

  return {
    ...data,
    solicitud: normalizeSolicitud(data.solicitud),
  };
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
