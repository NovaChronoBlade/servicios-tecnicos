import { clientPaymentsMock, clientRequestsMock, clientServicesMock, topTechniciansMock } from '@/mocks/client-pages.mock';
import type { User } from '@/types';
import { UserRole } from '@/types';

export const adminUserMock: User = {
  id_usuario: 'admin-1',
  nombre: 'Admin General',
  correo: 'admin@servicios-tecnicos.com',
  rol: UserRole.ADMIN,
  documento: '900100200',
  fecha_nacimiento: '1988-02-18',
  telefono: '+57 300 900 1000',
  activo: true,
};

export const adminUsersMock: User[] = [
  adminUserMock,
  {
    id_usuario: 'cliente-1',
    nombre: 'Mariana Lopez',
    correo: 'mariana.lopez@mail.com',
    rol: UserRole.CLIENTE,
    documento: '1002003004',
    fecha_nacimiento: '1994-08-17',
    telefono: '+57 300 555 1212',
    activo: true,
  },
  {
    id_usuario: 'tec-23',
    nombre: 'Andres Melo',
    correo: 'andres.melo@servicios-tecnicos.com',
    rol: UserRole.TECNICO,
    documento: '80234567',
    fecha_nacimiento: '1991-04-10',
    telefono: '+57 301 777 9844',
    activo: true,
  },
  {
    id_usuario: 'tec-08',
    nombre: 'Luisa Fernandez',
    correo: 'luisa.fernandez@servicios-tecnicos.com',
    rol: UserRole.TECNICO,
    documento: '52700100',
    fecha_nacimiento: '1990-11-03',
    telefono: '+57 300 444 7788',
    activo: true,
  },
];

export const adminCategoriasMock = [
  { id_categoria: 'cat-clima', nombre: 'Climatizacion', descripcion: 'Confort termico', activo: true, servicios: 1 },
  { id_categoria: 'cat-elec', nombre: 'Electricidad', descripcion: 'Instalaciones electricas', activo: true, servicios: 1 },
  { id_categoria: 'cat-plom', nombre: 'Plomeria', descripcion: 'Reparaciones hidraulicas', activo: true, servicios: 1 },
  { id_categoria: 'cat-electro', nombre: 'Electrodomesticos', descripcion: 'Mantenimiento de equipos', activo: true, servicios: 1 },
];

export const adminAuditMock = [
  { id: 'aud-01', evento: 'Usuario desactivado', modulo: 'Usuarios', fecha: '2026-05-29T09:10:00.000Z' },
  { id: 'aud-02', evento: 'Solicitud reasignada', modulo: 'Solicitudes', fecha: '2026-05-29T10:25:00.000Z' },
  { id: 'aud-03', evento: 'Pago reembolsado', modulo: 'Pagos', fecha: '2026-05-28T16:40:00.000Z' },
];

export const adminComentariosMock = [
  {
    id_comentario: 'com-01',
    id_ss: 'ss-1001',
    id_cliente: 'cliente-1',
    id_tecnico: 'tec-23',
    nombre_cliente: 'Mariana Lopez',
    nombre_tecnico: 'Andres Melo',
    contenido: 'El tecnico explico el diagnostico y dejo recomendaciones claras.',
    fecha_comentario: '2026-05-29T17:20:00.000Z',
  },
  {
    id_comentario: 'com-02',
    id_ss: 'ss-1003',
    id_cliente: 'cliente-1',
    id_tecnico: 'tec-08',
    nombre_cliente: 'Mariana Lopez',
    nombre_tecnico: 'Luisa Fernandez',
    contenido: 'La reparacion quedo estable y se confirmo el cierre del servicio.',
    fecha_comentario: '2026-05-24T14:10:00.000Z',
  },
];

export const adminSettingsMock = [
  { label: 'CORS', value: 'Configurado por variable de entorno' },
  { label: 'JWT', value: 'Access y refresh token habilitados' },
  { label: 'Logs', value: 'Pino / JSON por niveles' },
  { label: 'Cobertura', value: 'Umbral global minimo 70%' },
];

export const adminSummaryMock = {
  usuarios: adminUsersMock.length,
  tecnicos: adminUsersMock.filter((user) => user.rol === UserRole.TECNICO).length,
  clientes: adminUsersMock.filter((user) => user.rol === UserRole.CLIENTE).length,
  servicios: clientServicesMock.length,
  solicitudes: clientRequestsMock.length,
  pagosPendientes: clientPaymentsMock.filter((pago) => pago.estado === 'pendiente').length,
  topTecnicos: topTechniciansMock.length,
};

export function getAdminUserById(id?: string) {
  return adminUsersMock.find((user) => user.id_usuario === id) ?? adminUsersMock[0];
}

export function getAdminSolicitudById(id?: string) {
  return clientRequestsMock.find((solicitud) => solicitud.id_ss === id) ?? clientRequestsMock[0];
}
