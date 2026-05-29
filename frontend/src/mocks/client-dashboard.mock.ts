import type { Direccion, Pago, Servicio, SolicitudServicio } from '@/types';

export type DashboardSolicitudMock = SolicitudServicio & {
  servicioNombre: string;
  servicioCategoria: string;
  direccionResumen: string;
  tecnicoNombre?: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
};

export type DashboardServicioMock = Servicio & {
  categoriaNombre: string;
  tiempoEstimado: string;
  puntuacionPromedio: number;
};

export const dashboardMock = {
  solicitudes: [
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
  ] satisfies DashboardSolicitudMock[],
  servicios: [
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
  ] satisfies DashboardServicioMock[],
  direcciones: [
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
  ] satisfies Direccion[],
  pagos: [
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
  ] satisfies Pago[],
};

export const dashboardSummary = {
  solicitudesActivas: 2,
  pagosPendientes: 1,
  direccionesGuardadas: 2,
  serviciosDisponibles: 4,
};