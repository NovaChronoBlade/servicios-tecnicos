import type { Calificacion, SolicitudServicio, TecnicoDetails, User } from '@/types';
import { UserRole } from '@/types';

export type TecnicoSolicitudDisponibleMock = SolicitudServicio & {
	clienteNombre: string;
	clienteTelefono: string;
	servicioNombre: string;
	servicioCategoria: string;
	direccionResumen: string;
	prioridad: 'Alta' | 'Media' | 'Baja';
	tiempoEstimado: string;
	valorEstimado: string;
	distanciaKm: number;
};

export type TecnicoSolicitudAsignadaMock = TecnicoSolicitudDisponibleMock & {
	progreso: number;
	notasTecnicas: string;
	materialesSugeridos: string;
	observacionesCliente: string;
};

export type TecnicoDisponibilidadSlot = {
	dia: string;
	inicio: string;
	fin: string;
	activa: boolean;
	nota?: string;
};

export type TecnicoPerfilMock = User & TecnicoDetails & {
	zonaCobertura: string;
	bio: string;
	serviciosAtendidos: number;
	tiempoRespuestaPromedio: string;
	calificacionesRecientes: number;
};

export type TecnicoCalificacionMock = Calificacion & {
	clienteNombre: string;
	servicioNombre: string;
};

export const tecnicoPerfilMock: TecnicoPerfilMock = {
	id_usuario: 'tec-23',
	nombre: 'Andrés Melo',
	correo: 'andres.melo@servicios-tecnicos.com',
	rol: UserRole.TECNICO,
	documento: '80234567',
	fecha_nacimiento: '1991-04-10',
	telefono: '+57 301 777 9844',
	activo: true,
	especialidad: 'Climatización y mantenimiento residencial',
	licencia_profesional: 'LP-447120',
	disponible: true,
	calificacion_promedio: '4.9',
	zonaCobertura: 'Nororiente de Bogotá y alrededores',
	bio: 'Técnico certificado con enfoque en diagnósticos rápidos, atención limpia y seguimiento post-servicio.',
	serviciosAtendidos: 286,
	tiempoRespuestaPromedio: '18 min',
	calificacionesRecientes: 124,
};

export const tecnicoDisponibilidadMock: TecnicoDisponibilidadSlot[] = [
	{ dia: 'Lunes', inicio: '08:00', fin: '17:00', activa: true, nota: 'Ventana ideal para domicilios amplios' },
	{ dia: 'Martes', inicio: '08:00', fin: '16:00', activa: true, nota: 'Agenda prioritaria' },
	{ dia: 'Miércoles', inicio: '09:00', fin: '18:00', activa: false, nota: 'Reservado para mantenimiento personal' },
	{ dia: 'Jueves', inicio: '08:30', fin: '17:30', activa: true, nota: 'Atención completa' },
	{ dia: 'Viernes', inicio: '08:00', fin: '15:30', activa: true, nota: 'Cierre anticipado' },
];

export const solicitudesDisponiblesMock: TecnicoSolicitudDisponibleMock[] = [
	{
		id_ss: 'ss-2001',
		id_cliente: 'cliente-1',
		id_tecnico: null,
		id_servicio: 'serv-11',
		id_direccion: 'dir-1',
		estado: 'pendiente',
		confirmacion_cliente: true,
		confirmacion_tecnico: false,
		motivo_cancelacion: null,
		fecha: '2026-05-29T09:20:00.000Z',
		fecha_programada: '2026-05-29T15:30:00.000Z',
		clienteNombre: 'Mariana López',
		clienteTelefono: '+57 300 555 1212',
		servicioNombre: 'Mantenimiento de aire acondicionado',
		servicioCategoria: 'Climatización',
		direccionResumen: 'Cra. 12 #34-56, Apto 402, Bogotá',
		prioridad: 'Alta',
		tiempoEstimado: '45 - 60 min',
		valorEstimado: '$125.000',
		distanciaKm: 2.4,
	},
	{
		id_ss: 'ss-2002',
		id_cliente: 'cliente-1',
		id_tecnico: null,
		id_servicio: 'serv-07',
		id_direccion: 'dir-2',
		estado: 'pendiente',
		confirmacion_cliente: true,
		confirmacion_tecnico: false,
		motivo_cancelacion: null,
		fecha: '2026-05-29T10:05:00.000Z',
		fecha_programada: '2026-05-30T10:00:00.000Z',
		clienteNombre: 'Carlos Ríos',
		clienteTelefono: '+57 300 222 0099',
		servicioNombre: 'Instalación eléctrica menor',
		servicioCategoria: 'Electricidad',
		direccionResumen: 'Cl. 80 #9-21, Casa 2, Medellín',
		prioridad: 'Media',
		tiempoEstimado: '30 - 45 min',
		valorEstimado: '$85.000',
		distanciaKm: 5.8,
	},
	{
		id_ss: 'ss-2003',
		id_cliente: 'cliente-1',
		id_tecnico: null,
		id_servicio: 'serv-04',
		id_direccion: 'dir-3',
		estado: 'pendiente',
		confirmacion_cliente: true,
		confirmacion_tecnico: false,
		motivo_cancelacion: null,
		fecha: '2026-05-28T16:45:00.000Z',
		fecha_programada: '2026-05-30T13:30:00.000Z',
		clienteNombre: 'Luisa Fernández',
		clienteTelefono: '+57 300 444 7788',
		servicioNombre: 'Reparación de fugas',
		servicioCategoria: 'Plomería',
		direccionResumen: 'Av. 19 #14-90, Interior 5, Cali',
		prioridad: 'Baja',
		tiempoEstimado: '40 - 55 min',
		valorEstimado: '$95.000',
		distanciaKm: 7.2,
	},
];

export const solicitudesAsignadasMock: TecnicoSolicitudAsignadaMock[] = [
	{
		...solicitudesDisponiblesMock[0],
		id_tecnico: tecnicoPerfilMock.id_usuario,
		estado: 'en_curso',
		progreso: 68,
		notasTecnicas: 'Se requiere verificar presión, filtros y prueba de funcionamiento final.',
		materialesSugeridos: 'Gas refrigerante, limpiador dieléctrico, paños y multímetro.',
		observacionesCliente: 'Llamar al portero al llegar.',
	},
	{
		...solicitudesDisponiblesMock[2],
		id_tecnico: tecnicoPerfilMock.id_usuario,
		estado: 'aceptado',
		progreso: 28,
		notasTecnicas: 'Revisar sellos, presión y posible cambio de empaque.',
		materialesSugeridos: 'Cinta teflón, sellador y empaques de repuesto.',
		observacionesCliente: 'Permiso en recepción.',
	},
];

export const calificacionesTecnicoMock: TecnicoCalificacionMock[] = [
	{
		id_calificacion: 'cal-tec-01',
		id_tecnico: tecnicoPerfilMock.id_usuario,
		id_cliente: 'cliente-1',
		id_ss: 'ss-1001',
		puntuacion: 5,
		comentario: 'Servicio impecable y comunicación clara.',
		fecha_calificacion: '2026-05-29T17:10:00.000Z',
		clienteNombre: 'Mariana López',
		servicioNombre: 'Mantenimiento de aire acondicionado',
	},
	{
		id_calificacion: 'cal-tec-02',
		id_tecnico: tecnicoPerfilMock.id_usuario,
		id_cliente: 'cliente-1',
		id_ss: 'ss-1003',
		puntuacion: 4,
		comentario: 'Buen trabajo y explicación técnica clara.',
		fecha_calificacion: '2026-05-24T14:00:00.000Z',
		clienteNombre: 'Luisa Fernández',
		servicioNombre: 'Reparación de fugas',
	},
];

export const tecnicoSummary = {
	solicitudesDisponibles: solicitudesDisponiblesMock.length,
	solicitudesEnCurso: solicitudesAsignadasMock.filter((item) => item.estado === 'en_curso').length,
	solicitudesAceptadas: solicitudesAsignadasMock.filter((item) => item.estado === 'aceptado').length,
	disponibilidadActiva: tecnicoDisponibilidadMock.filter((slot) => slot.activa).length,
	calificacionPromedio: Number(tecnicoPerfilMock.calificacion_promedio),
};

export function getSolicitudDisponibleById(id?: string) {
	return solicitudesDisponiblesMock.find((item) => item.id_ss === id) ?? solicitudesDisponiblesMock[0];
}

export function getSolicitudAsignadaById(id?: string) {
	return solicitudesAsignadasMock.find((item) => item.id_ss === id) ?? solicitudesAsignadasMock[0];
}

export function getCalificacionTecnicoById(id?: string) {
	return calificacionesTecnicoMock.find((item) => item.id_calificacion === id) ?? calificacionesTecnicoMock[0];
}