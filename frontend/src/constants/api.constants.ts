/**
 * =========================================================
 * API CONFIGURATION & ENDPOINTS
 * =========================================================
 */

// ── Configuración base ────────────────────────────────────
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
} as const;

// ── Auth ──────────────────────────────────────────────────
export const AUTH_ENDPOINTS = {
  LOGIN:    '/auth/login',    // POST
  REGISTER: '/auth/register', // POST
  REFRESH:  '/auth/refresh',  // POST
  LOGOUT:   '/auth/logout',   // POST
} as const;

// ── Usuarios ──────────────────────────────────────────────
export const USUARIOS_ENDPOINTS = {
  LIST:              '/usuarios',                                                  // GET
  TECNICOS:          '/usuarios/tecnicos',                                         // GET
  MIS_DETALLES_TECNICOS: '/usuarios/me/detalles-tecnicos',                         // GET
  DETAIL:            (id: string) => `/usuarios/${id}`,                           // GET
  UPDATE:            (id: string) => `/usuarios/${id}`,                           // PATCH
  DESACTIVAR:        (id: string) => `/usuarios/${id}/desactivar`,                // PATCH
  DATOS_TECNICOS:    (id: string) => `/usuarios/${id}/datos-tecnicos`,            // POST
  DETALLES_TECNICOS: (id: string) => `/usuarios/${id}/detalles-tecnicos`,         // GET/PATCH
} as const;

// ── Servicios ─────────────────────────────────────────────
export const SERVICIOS_ENDPOINTS = {
  CREATE:       '/servicios',           // POST
  LIST:         '/servicios',           // GET
  BUSCAR:       '/servicios/buscar',    // GET  ?q=
  RANGO_PRECIO: '/servicios/rango-precio', // GET  ?min=&max=
  CATEGORIAS: {
    CREATE: '/servicios/categorias',    // POST
    LIST:   '/servicios/categorias',    // GET
  },
  DETAIL:  (id: string) => `/servicios/${id}`,         // GET
  UPDATE:  (id: string) => `/servicios/${id}`,         // PATCH
  DELETE:  (id: string) => `/servicios/${id}`,         // DELETE
  ACTIVAR: (id: string) => `/servicios/${id}/activar`, // PATCH
} as const;

// ── Solicitudes ───────────────────────────────────────────
export const SOLICITUDES_ENDPOINTS = {
  CREATE:                 '/solicitudes-servicio',                          // POST
  LIST:                   '/solicitudes-servicio',                          // GET
  BY_ESTADO:              '/solicitudes-servicio/estado',                   // GET  ?estado=
  PENDIENTES_DISPONIBLES: '/solicitudes-servicio/pendientes-disponibles',   // GET
  BY_CLIENTE:             (id: string) => `/solicitudes-servicio/cliente/${id}`,                          // GET
  BY_TECNICO:             (id: string) => `/solicitudes-servicio/tecnico/${id}`,                          // GET
  DETAIL:                 (id: string) => `/solicitudes-servicio/${id}`,                                  // GET
  UPDATE_ESTADO:          (id: string) => `/solicitudes-servicio/${id}/estado`,                           // PATCH
  CANCELAR:               (id: string) => `/solicitudes-servicio/${id}/cancelar`,                         // PATCH
  REASIGNAR_TECNICO:      (id: string) => `/solicitudes-servicio/${id}/reasignar-tecnico`,                // PATCH
  ASIGNAR_TECNICO:        (id: string, idTecnico: string) => `/solicitudes-servicio/${id}/asignar-tecnico/${idTecnico}`, // PATCH
  CONFIRMAR_CLIENTE:      (id: string) => `/solicitudes-servicio/${id}/confirmar/cliente`,                // PATCH
  CONFIRMAR_TECNICO:      (id: string) => `/solicitudes-servicio/${id}/confirmar/tecnico`,                // PATCH
} as const;

// ── Direcciones ───────────────────────────────────────────
export const DIRECCIONES_ENDPOINTS = {
  CREATE:     '/direcciones',                                          // POST
  LIST:       '/direcciones',                                          // GET
  BY_USUARIO: (id: string) => `/direcciones/usuario/${id}`,           // GET
  DETAIL:     (id: string) => `/direcciones/${id}`,                   // GET
  UPDATE:     (id: string) => `/direcciones/${id}`,                   // PATCH
  DELETE:     (id: string) => `/direcciones/${id}`,                   // DELETE
} as const;

// ── Pagos ─────────────────────────────────────────────────
export const PAGOS_ENDPOINTS = {
  CREATE:        '/pagos',                                             // POST
  LIST:          '/pagos',                                             // GET
  BY_SOLICITUD:  (id: string) => `/pagos/solicitud/${id}`,            // GET
  BY_CLIENTE:    (id: string) => `/pagos/cliente/${id}`,              // GET
  DETAIL:        (id: string) => `/pagos/${id}`,                      // GET
  UPDATE_ESTADO: (id: string) => `/pagos/${id}/estado`,               // PATCH
  REEMBOLSAR:    (id: string) => `/pagos/${id}/reembolsar`,           // PATCH
} as const;

// ── Calificaciones ────────────────────────────────────────
export const CALIFICACIONES_ENDPOINTS = {
  CREATE:           '/calificaciones',                                          // POST
  TOP_TECNICOS:     '/calificaciones/top-tecnicos',                            // GET
  BY_TECNICO:       (id: string) => `/calificaciones/tecnico/${id}`,           // GET
  PROMEDIO_TECNICO: (id: string) => `/calificaciones/tecnico/${id}/promedio`,  // GET
  BY_CLIENTE:       (id: string) => `/calificaciones/cliente/${id}`,           // GET
  DETAIL:           (id: string) => `/calificaciones/${id}`,                   // GET
} as const;

// ── Comentarios ───────────────────────────────────────────
export const COMENTARIOS_ENDPOINTS = {
  CREATE:       '/comentarios',                                          // POST
  LIST:         '/comentarios',                                          // GET
  BY_SOLICITUD: (id: string) => `/comentarios/solicitud/${id}`,         // GET
  DETAIL:       (id: string) => `/comentarios/${id}`,                   // GET
  UPDATE:       (id: string) => `/comentarios/${id}`,                   // PATCH
  DELETE:       (id: string) => `/comentarios/${id}`,                   // DELETE
} as const;

export const ADMIN_ENDPOINTS = {
  CONFIGURACION: '/admin/configuracion', // GET
  AUDITORIA: '/admin/auditoria',         // GET
} as const;
