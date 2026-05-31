'use client';

import { useRouter } from 'next/navigation';

import {
  alpha,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';

import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  House,
  TriangleAlert,
  Wrench,
} from 'lucide-react';

import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { ServicioCard } from '@/components/cliente/ServicioCard/ServicioCard';
import { SolicitudCard } from '@/components/cliente/SolicitudCard/SolicitudCard';
import { SolicitudTimeline } from '@/components/cliente/SolicitudTimeline/SolicitudTimeline';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { listDirecciones } from '@/services/direcciones.service';
import { listPagosByCliente, type PagoListItem } from '@/services/pagos.service';
import { listServicios, type ServicioListItem } from '@/services/servicios.service';
import {
  listSolicitudesByCliente,
  type SolicitudView,
} from '@/services/solicitudes.service';
import { useAuthStore } from '@/store/authStore';
import type { Direccion } from '@/types';

type DashboardData = {
  solicitudes: SolicitudView[];
  servicios: ServicioListItem[];
  direcciones: Direccion[];
  pagos: PagoListItem[];
};

const emptyDashboardData: DashboardData = {
  solicitudes: [],
  servicios: [],
  direcciones: [],
  pagos: [],
};

export default function ClienteDashboardPage() {
  const { user, isHydrated } = useAuthStore();
  const router = useRouter();
  const theme = useTheme();

  const { data, loading, error } = useApiData<DashboardData>(
    async () => {
      if (!user?.id_usuario) return emptyDashboardData;

      const [solicitudes, servicios, direcciones, pagos] = await Promise.all([
        listSolicitudesByCliente(user.id_usuario),
        listServicios(),
        listDirecciones(),
        listPagosByCliente(user.id_usuario),
      ]);

      return { solicitudes, servicios, direcciones, pagos };
    },
    [user?.id_usuario],
    emptyDashboardData,
  );

  if (!isHydrated || loading) return <LoadingSpinner />;

  const quickStats = [
    {
      label: 'Solicitudes activas',
      value: data.solicitudes.filter((solicitud) => !['completado', 'cancelado'].includes(solicitud.estado)).length,
      icon: Wrench,
      route: APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT,
    },
    {
      label: 'Pagos pendientes',
      value: data.pagos.filter((pago) => pago.estado === 'pendiente').length,
      icon: CreditCard,
      route: APP_ROUTES.CLIENT.PAGOS.ROOT,
    },
    {
      label: 'Direcciones guardadas',
      value: data.direcciones.length,
      icon: House,
      route: APP_ROUTES.CLIENT.DIRECCIONES.ROOT,
    },
    {
      label: 'Servicios disponibles',
      value: data.servicios.filter((servicio) => servicio.activo).length,
      icon: CalendarDays,
      route: APP_ROUTES.CLIENT.SERVICIOS.ROOT,
    },
  ];
  const timelineSolicitud = data.solicitudes[0];

  return (
    <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}

      <Grid container spacing={3}>
        <Grid size={12}>
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 58%, ${theme.palette.secondary.main} 100%)`,
              color: 'common.white',
              boxShadow: `0 24px 80px ${alpha(theme.palette.primary.main, 0.22)}`,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                <Chip icon={<TriangleAlert size={14} />} label="Centro operativo" sx={{ bgcolor: alpha(theme.palette.common.white, 0.12), color: 'common.white' }} />
                <Chip label={user?.rol ?? 'cliente'} sx={{ bgcolor: alpha(theme.palette.common.white, 0.12), color: 'common.white' }} />
              </Box>

              <Box>
                <Typography variant="h4" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 800 }}>
                  Bienvenido, {user?.nombre ?? 'cliente'}
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: 760, color: alpha(theme.palette.common.white, 0.84), mt: 1 }}>
                  Administra solicitudes, revisa servicios disponibles y sigue el estado de tu atencion desde un solo lugar.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
                <Button
                  variant="contained"
                  color="inherit"
                  endIcon={<ArrowRight size={16} />}
                  sx={{ color: 'primary.main', fontWeight: 800 }}
                  onClick={() => router.push(APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.ROOT)}
                >
                  Solicitar servicio
                </Button>
                <Button
                  variant="outlined"
                  sx={{ borderColor: alpha(theme.palette.common.white, 0.35), color: 'common.white' }}
                  onClick={() => router.push(APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT)}
                >
                  Ver solicitudes
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {quickStats.map(({ label, value, icon: Icon, route }) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={label}>
            <Card
              variant="outlined"
              sx={{ borderRadius: 3, cursor: 'pointer', height: '100%', borderColor: 'divider' }}
              onClick={() => router.push(route)}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {label}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                      {value}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2, display: 'grid', placeItems: 'center', bgcolor: 'action.hover', color: 'primary.main' }}>
                    <Icon size={22} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Solicitudes recientes</Typography>
                <Typography variant="body2" color="text.secondary">Ultimos movimientos de tu cuenta</Typography>
              </Box>
              <Button size="small" onClick={() => router.push(APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT)}>
                Ver todas
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {data.solicitudes.slice(0, 3).map((solicitud) => (
                <SolicitudCard key={solicitud.id_ss} solicitud={solicitud} compact />
              ))}
              {data.solicitudes.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Aun no tienes solicitudes registradas.</Typography>
              ) : null}
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          {timelineSolicitud ? (
            <SolicitudTimeline estado={timelineSolicitud.estado} fechaProgramada={timelineSolicitud.fecha_programada} />
          ) : (
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Seguimiento de solicitud</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>No hay solicitudes para mostrar aun.</Typography>
            </Paper>
          )}
        </Grid>

        <Grid size={12}>
          <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Servicios disponibles</Typography>
                <Typography variant="body2" color="text.secondary">Catalogo activo desde el backend</Typography>
              </Box>
              <Button size="small" onClick={() => router.push(APP_ROUTES.CLIENT.SERVICIOS.ROOT)}>
                Ver todos
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2.5}>
              {data.servicios.slice(0, 4).map((servicio) => (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={servicio.id_servicio}>
                  <ServicioCard servicio={servicio} compact />
                </Grid>
              ))}
              {data.servicios.length === 0 ? (
                <Grid size={12}>
                  <Typography variant="body2" color="text.secondary">No hay servicios publicados por el momento.</Typography>
                </Grid>
              ) : null}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
