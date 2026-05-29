/**
 * =========================================================
 * APP ROUTES CONSTANTS
 * =========================================================
 *
 * Rutas centralizadas de navegación del frontend.
 *
 * Aquí se almacenan:
 * - Rutas públicas
 * - Rutas protegidas por rol
 * - Dashboards por rol
 * - Paths reutilizables
 * - Redirects
 *
 * Objetivo:
 * Evitar hardcodear rutas como "/login" o "/dashboard"
 * directamente en componentes, hooks o middleware.
 *
 * Ejemplo:
 * APP_ROUTES.LOGIN
 * APP_ROUTES.CLIENT.DASHBOARD
 * APP_ROUTES.ADMIN.USUARIOS.DETAIL('42')
 *
 * =========================================================
 */

// ── Públicas ──────────────────────────────────────────────
export const APP_ROUTES = {
  HOME:             '/',
  LOGIN:            '/login',
  REGISTER:         '/register',

  // ── Cliente ───────────────────────────────────────────
  CLIENT: {
    DASHBOARD: '/dashboard',

    SOLICITAR_SERVICIO: {
      ROOT:    '/solicitar-servicio',
      DETAIL:  (id?: string) => id ? `/solicitar-servicio/${id}` : '/solicitar-servicio/:id',
      SUCCESS: '/solicitar-servicio/success',
    },

    MIS_SOLICITUDES: {
      ROOT: '/mis-solicitudes',
    },

    SERVICIOS: {
      ROOT:   '/servicios',
      DETAIL: (id?: string) => id ? `/servicios/${id}` : '/servicios/:id',
    },

    DIRECCIONES: {
      ROOT:   '/direcciones',
      DETAIL: (id?: string) => id ? `/direcciones/${id}` : '/direcciones/:id',
    },

    PAGOS: {
      ROOT:   '/pagos',
      DETAIL: (id?: string) => id ? `/pagos/${id}` : '/pagos/:id',
    },

    CALIFICACIONES: {
      ROOT:   '/calificaciones',
      DETAIL: (id?: string) => id ? `/calificaciones/${id}` : '/calificaciones/:id',
    },

    PERFIL: {
      ROOT:   '/perfil',
      EDITAR: '/perfil/editar',
    },
  },

  // ── Técnico ───────────────────────────────────────────
  TECNICO: {
    DASHBOARD: '/tecnico/dashboard',

    SOLICITUDES_DISPONIBLES: {
      ROOT:   '/tecnico/solicitudes-disponibles',
      DETAIL: (id?: string) => id ? `/tecnico/solicitudes-disponibles/${id}` : '/tecnico/solicitudes-disponibles/:id',
    },

    MIS_SOLICITUDES: {
      ROOT:      '/tecnico/mis-solicitudes',
      DETAIL:    (id?: string) => id ? `/tecnico/mis-solicitudes/${id}` : '/tecnico/mis-solicitudes/:id',
      COMPLETAR: (id?: string) => id ? `/tecnico/mis-solicitudes/${id}/completar` : '/tecnico/mis-solicitudes/:id/completar',
    },

    DATOS_TECNICOS: {
      ROOT:   '/tecnico/datos-tecnicos',
      EDITAR: '/tecnico/datos-tecnicos/editar',
    },

    DISPONIBILIDAD: '/tecnico/disponibilidad',
    CALIFICACIONES: '/tecnico/calificaciones',

    PERFIL: {
      ROOT: '/tecnico/perfil',
    },
  },

  // ── Admin ─────────────────────────────────────────────
  ADMIN: {
    DASHBOARD: '/dashboard',

    USUARIOS: {
      ROOT:     '/usuarios',
      CLIENTES: '/usuarios/clientes',
      TECNICOS: '/usuarios/tecnicos',
      DETAIL:   (id?: string) => id ? `/usuarios/${id}` : '/usuarios/:id',
      EDITAR:   (id?: string) => id ? `/usuarios/${id}/editar` : '/usuarios/:id/editar',
    },

    SERVICIOS: {
      ROOT:       '/servicios',
      CREAR:      '/servicios/crear',
      CATEGORIAS: '/servicios/categorias',
      DETAIL:     (id?: string) => id ? `/servicios/${id}` : '/servicios/:id',
      EDITAR:     (id?: string) => id ? `/servicios/${id}/editar` : '/servicios/:id/editar',
    },

    SOLICITUDES: {
      ROOT:            '/solicitudes',
      DETAIL:          (id?: string) => id ? `/solicitudes/${id}` : '/solicitudes/:id',
      ASIGNAR_TECNICO: (id?: string) => id ? `/solicitudes/${id}/asignar-tecnico` : '/solicitudes/:id/asignar-tecnico',
    },

    PAGOS: '/pagos',

    REPORTES: {
      ROOT:         '/reportes',
      INGRESOS:     '/reportes/ingresos',
      SOLICITUDES:  '/reportes/solicitudes',
    },

    ADMINISTRACION: {
      CONFIGURACION: '/administracion/configuracion',
      AUDITORIA:     '/administracion/auditoria',
    },

    CALIFICACIONES: '/calificaciones',
  },

} as const;