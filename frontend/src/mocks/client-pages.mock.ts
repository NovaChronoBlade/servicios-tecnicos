import type {
  Calificacion,
  Direccion,
  Pago,
  Servicio,
  SolicitudServicio,
  TopTecnico,
  User,
} from '@/types';
import { UserRole } from '@/types';

export type ClientServicioMock = Servicio & {
  categoriaNombre: string;
  tiempoEstimado: string;
  puntuacionPromedio: number;
};

export type ClientSolicitudMock = SolicitudServicio & {
  servicioNombre: string;
  servicioCategoria: string;
  direccionResumen: string;
  tecnicoNombre?: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
};

export const clientUserMock: User = {
  id_usuario: 'cliente-1',
  nombre: 'Mariana López',
  correo: 'mariana.lopez@mail.com',
  rol: UserRole.CLIENTE,
  documento: '1002003004',
  fecha_nacimiento: '1994-08-17',
  telefono: '+57 300 555 1212',
  activo: true,
};

export const clientServicesMock: ClientServicioMock[] = [
  {
    id_servicio: 'serv-11',
    nombre: 'Aire acondicionado',
    descripcion: 'Instalación, limpieza preventiva y revisión de equipos residenciales o comerciales.',
    precio: '125000',
    activo: true,
    id_categoria: 'cat-clima',
    categoria: { id_categoria: 'cat-clima', nombre: 'Climatización', descripcion: 'Servicios de confort térmico', activo: true },
    categoriaNombre: 'Climatización',
    tiempoEstimado: '45 - 60 min',
    puntuacionPromedio: 4.9,
  },
  {
    id_servicio: 'serv-07',
    nombre: 'Instalación eléctrica menor',
    descripcion: 'Puntos eléctricos, tomas, interruptores y ajustes rápidos con diagnóstico seguro.',
    precio: '85000',
    activo: true,
    id_categoria: 'cat-elec',
    categoria: { id_categoria: 'cat-elec', nombre: 'Electricidad', descripcion: 'Instalaciones y mantenimiento eléctrico', activo: true },
    categoriaNombre: 'Electricidad',
    tiempoEstimado: '30 - 45 min',
    puntuacionPromedio: 4.8,
  },
  {
    id_servicio: 'serv-04',
    nombre: 'Reparación de fugas',
    descripcion: 'Atención a grifería, sanitarios y pequeñas fugas con sellado y pruebas de presión.',
    precio: '95000',
    activo: true,
    id_categoria: 'cat-plom',
    categoria: { id_categoria: 'cat-plom', nombre: 'Plomería', descripcion: 'Reparaciones de agua y desagüe', activo: true },
    categoriaNombre: 'Plomería',
    tiempoEstimado: '40 - 55 min',
    puntuacionPromedio: 4.7,
  },
  {
    id_servicio: 'serv-15',
    nombre: 'Mantenimiento de nevera',
    descripcion: 'Diagnóstico de enfriamiento, limpieza y revisión de compresor y sellos.',
    precio: '135000',
    activo: true,
    id_categoria: 'cat-electro',
    categoria: { id_categoria: 'cat-electro', nombre: 'Electrodomésticos', descripcion: 'Reparación y mantenimiento', activo: true },
    categoriaNombre: 'Electrodomésticos',
    tiempoEstimado: '50 - 70 min',
    puntuacionPromedio: 4.8,
  },
];

export const clientRequestsMock: ClientSolicitudMock[] = [
  {
    id_ss: 'ss-1001',
    id_cliente: 'cliente-1',
    id_tecnico: 'tec-23',
    id_servicio: 'serv-11',
    id_direccion: 'dir-1',
    estado: 'en_curso',
    confirmacion_cliente: true,
    confirmacion_tecnico: false,
    motivo_cancelacion: null,
    fecha: '2026-05-29T08:30:00.000Z',
    fecha_programada: '2026-05-29T15:00:00.000Z',
    servicioNombre: 'Revisión y mantenimiento de aire acondicionado',
    servicioCategoria: 'Climatización',
    direccionResumen: 'Cra. 12 #34-56, Apto 402, Bogotá',
    tecnicoNombre: 'Andrés Melo',
    prioridad: 'Alta',
  },
  {
    id_ss: 'ss-1002',
    id_cliente: 'cliente-1',
    id_tecnico: null,
    id_servicio: 'serv-07',
    id_direccion: 'dir-2',
    estado: 'pendiente',
    confirmacion_cliente: true,
    confirmacion_tecnico: false,
    motivo_cancelacion: null,
    fecha: '2026-05-28T13:10:00.000Z',
    fecha_programada: '2026-05-30T10:00:00.000Z',
    servicioNombre: 'Instalación de tomacorrientes inteligentes',
    servicioCategoria: 'Electricidad',
    direccionResumen: 'Cl. 80 #9-21, Casa 2, Medellín',
    tecnicoNombre: undefined,
    prioridad: 'Media',
  },
  {
    id_ss: 'ss-1003',
    id_cliente: 'cliente-1',
    id_tecnico: 'tec-08',
    id_servicio: 'serv-04',
    id_direccion: 'dir-3',
    estado: 'completado',
    confirmacion_cliente: true,
    confirmacion_tecnico: true,
    motivo_cancelacion: null,
    fecha: '2026-05-24T09:45:00.000Z',
    fecha_programada: '2026-05-24T12:30:00.000Z',
    servicioNombre: 'Cambio de grifería y sellado de fuga',
    servicioCategoria: 'Plomería',
    direccionResumen: 'Av. 19 #14-90, Interior 5, Cali',
    tecnicoNombre: 'Luisa Fernández',
    prioridad: 'Baja',
  },
];

export const clientAddressesMock: Direccion[] = [
  {
    id_direccion: 'dir-1',
    id_usuario: 'cliente-1',
    direccion: 'Cra. 12 #34-56, Apto 402, Bogotá',
    tipo_edificio: 'Apartamento',
    informacion: 'Portería 24/7',
    nota: 'Llamar al llegar',
    es_default: true,
  },
  {
    id_direccion: 'dir-2',
    id_usuario: 'cliente-1',
    direccion: 'Cl. 80 #9-21, Casa 2, Medellín',
    tipo_edificio: 'Casa',
    informacion: 'Fachada azul',
    nota: null,
    es_default: false,
  },
  {
    id_direccion: 'dir-3',
    id_usuario: 'cliente-1',
    direccion: 'Av. 19 #14-90, Interior 5, Cali',
    tipo_edificio: 'Apartamento',
    informacion: 'Torre B, apto 301',
    nota: 'Con permiso en recepción',
    es_default: false,
  },
];

export const clientPaymentsMock: Pago[] = [
  {
    id_pago: 'pag-901',
    id_ss: 'ss-1003',
    monto: '95000',
    metodo_pago: 'Transferencia',
    estado: 'pagado',
    numero_referencia: 'TRX-294050',
    fecha_pago: '2026-05-24T13:05:00.000Z',
  },
  {
    id_pago: 'pag-902',
    id_ss: 'ss-1002',
    monto: '85000',
    metodo_pago: 'Tarjeta',
    estado: 'pendiente',
    numero_referencia: null,
    fecha_pago: '2026-05-28T13:10:00.000Z',
  },
];

export const clientCalificacionesMock: Calificacion[] = [
  {
    id_calificacion: 'cal-1001',
    id_tecnico: 'tec-23',
    id_cliente: 'cliente-1',
    id_ss: 'ss-1001',
    puntuacion: 5,
    comentario: 'Llegó a tiempo y dejó todo impecable.',
    fecha_calificacion: '2026-05-29T17:05:00.000Z',
  },
  {
    id_calificacion: 'cal-1002',
    id_tecnico: 'tec-08',
    id_cliente: 'cliente-1',
    id_ss: 'ss-1003',
    puntuacion: 4,
    comentario: 'Buen trabajo, explicación clara.',
    fecha_calificacion: '2026-05-24T14:00:00.000Z',
  },
];

export const topTechniciansMock: TopTecnico[] = [
  { id_tecnico: 'tec-23', nombre: 'Andrés Melo', promedio: 4.9, total_calificaciones: 120 },
  { id_tecnico: 'tec-08', nombre: 'Luisa Fernández', promedio: 4.8, total_calificaciones: 98 },
  { id_tecnico: 'tec-51', nombre: 'Camilo Rojas', promedio: 4.7, total_calificaciones: 84 },
];

export function getServicioById(id?: string) {
  return clientServicesMock.find((servicio) => servicio.id_servicio === id) ?? clientServicesMock[0];
}

export function getSolicitudById(id?: string) {
  return clientRequestsMock.find((solicitud) => solicitud.id_ss === id) ?? clientRequestsMock[0];
}

export function getDireccionById(id?: string) {
  return clientAddressesMock.find((direccion) => direccion.id_direccion === id) ?? clientAddressesMock[0];
}

export function getPagoById(id?: string) {
  return clientPaymentsMock.find((pago) => pago.id_pago === id) ?? clientPaymentsMock[0];
}

export function getCalificacionById(id?: string) {
  return clientCalificacionesMock.find((calificacion) => calificacion.id_calificacion === id) ?? clientCalificacionesMock[0];
}