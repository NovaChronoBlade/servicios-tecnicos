// app/(client)/dashboard/page.tsx
'use client';

import { useRouter } from 'next/navigation';

import {
  alpha,
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

import { APP_ROUTES } from '@/constants/routes.constants';

import { useAuthStore } from '@/store/authStore';

import { dashboardMock, dashboardSummary } from '@/mocks/client-dashboard.mock';

import { DashboardFooter } from '@/components/common/Footer/DashboardFooter';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { NavbarCliente } from '@/components/common/Navbar/NavbarCliente';

import { ServicioCard } from '@/components/cliente/ServicioCard/ServicioCard';
import { SolicitudCard } from '@/components/cliente/SolicitudCard/SolicitudCard';
import { SolicitudTimeline } from '@/components/cliente/SolicitudTimeline/SolicitudTimeline';

const quickStats = [
  {
    label: 'Solicitudes activas',
    value: dashboardSummary.solicitudesActivas,
    icon: Wrench,
    route: APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT,
  },

  {
    label: 'Pagos pendientes',
    value: dashboardSummary.pagosPendientes,
    icon: CreditCard,
    route: APP_ROUTES.CLIENT.PAGOS.ROOT,
  },

  {
    label: 'Direcciones guardadas',
    value: dashboardSummary.direccionesGuardadas,
    icon: House,
    route: APP_ROUTES.CLIENT.DIRECCIONES.ROOT,
  },

  {
    label: 'Servicios disponibles',
    value: dashboardSummary.serviciosDisponibles,
    icon: CalendarDays,
    route: APP_ROUTES.CLIENT.SERVICIOS.ROOT,
  },
];

export default function ClienteDashboardPage() {
  const { user, isHydrated } = useAuthStore();

  const router = useRouter();

  const theme = useTheme();

  if (!isHydrated) {
    return <LoadingSpinner />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',

        background: `linear-gradient(
          180deg,
          ${alpha(theme.palette.background.default, 0.96)} 0%,
          ${theme.palette.background.paper} 100%
        )`,
      }}
    >
      <NavbarCliente />

      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 5 },
        }}
      >
        <Box
          sx={{
            maxWidth: 1440,
            mx: 'auto',
          }}
        >
          <Grid container spacing={3}>
            {/* HERO */}
            <Grid size={12}>
              <Paper
                sx={{
                  p: { xs: 3, md: 4 },

                  borderRadius: 4,

                  overflow: 'hidden',

                  position: 'relative',

                  background: `linear-gradient(
                    135deg,
                    ${theme.palette.primary.dark} 0%,
                    ${theme.palette.primary.main} 58%,
                    ${theme.palette.secondary.main} 100%
                  )`,

                  color: 'common.white',

                  boxShadow: `0 24px 80px ${alpha(
                    theme.palette.primary.main,
                    0.22,
                  )}`,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,

                    background: `
                      radial-gradient(
                        circle at top right,
                        ${alpha(theme.palette.common.white, 0.18)},
                        transparent 32%
                      ),

                      radial-gradient(
                        circle at bottom left,
                        ${alpha(theme.palette.common.white, 0.12)},
                        transparent 28%
                      )
                    `,

                    pointerEvents: 'none',
                  }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      alignItems: 'center',
                    }}
                  >
                    <Chip
                      icon={<TriangleAlert size={14} />}
                      label="Centro operativo"
                      sx={{
                        bgcolor: alpha(theme.palette.common.white, 0.12),

                        color: 'common.white',
                      }}
                    />

                    <Chip
                      label={user?.rol ?? 'cliente'}
                      sx={{
                        bgcolor: alpha(theme.palette.common.white, 0.12),

                        color: 'common.white',
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: {
                          xs: '2rem',
                          md: '3rem',
                        },

                        fontWeight: 800,
                      }}
                    >
                      Bienvenido, {user?.nombre ?? 'cliente'}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        maxWidth: 760,

                        color: alpha(theme.palette.common.white, 0.84),

                        mt: 1,
                      }}
                    >
                      Administra solicitudes, revisa servicios disponibles y
                      sigue el estado de tu atención desde un solo lugar.
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',

                      flexDirection: {
                        xs: 'column',
                        sm: 'row',
                      },

                      gap: 1.5,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="inherit"
                      endIcon={<ArrowRight size={16} />}
                      sx={{
                        color: 'primary.main',

                        fontWeight: 800,
                      }}
                      onClick={() =>
                        router.push(APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.ROOT)
                      }
                    >
                      Solicitar servicio
                    </Button>

                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: alpha(theme.palette.common.white, 0.35),

                        color: 'common.white',
                      }}
                      onClick={() =>
                        router.push(APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT)
                      }
                    >
                      Ver solicitudes
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* STATS */}
            {quickStats.map(({ label, value, icon: Icon, route }) => (
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3,
                }}
                key={label}
              >
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,

                    cursor: 'pointer',

                    height: '100%',

                    borderColor: 'divider',

                    transition: 'transform 160ms ease, box-shadow 160ms ease',

                    '&:hover': {
                      transform: 'translateY(-2px)',

                      boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)',
                    },
                  }}
                  onClick={() => router.push(route)}
                >
                  <CardContent
                    sx={{
                      p: 2.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',

                        alignItems: 'center',

                        justifyContent: 'space-between',

                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 1,
                          }}
                        >
                          {label}
                        </Typography>

                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 800,
                            lineHeight: 1,
                          }}
                        >
                          {value}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: 48,
                          height: 48,

                          borderRadius: 2,

                          display: 'grid',

                          placeItems: 'center',

                          bgcolor: 'action.hover',

                          color: 'primary.main',
                        }}
                      >
                        <Icon size={22} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* SOLICITUDES */}
            <Grid
              size={{
                xs: 12,
                lg: 7,
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: {
                    xs: 2.5,
                    md: 3,
                  },

                  borderRadius: 3,

                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',

                    justifyContent: 'space-between',

                    alignItems: 'center',

                    gap: 2,

                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                      }}
                    >
                      Solicitudes recientes
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Últimos movimientos de tu cuenta
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    onClick={() =>
                      router.push(APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT)
                    }
                  >
                    Ver todas
                  </Button>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  {dashboardMock.solicitudes.map((solicitud) => (
                    <SolicitudCard
                      key={solicitud.id_ss}
                      solicitud={solicitud}
                      compact
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* TIMELINE */}
            <Grid
              size={{
                xs: 12,
                lg: 5,
              }}
            >
              <SolicitudTimeline
                estado={dashboardMock.solicitudes[0].estado}
                fechaProgramada={dashboardMock.solicitudes[0].fecha_programada}
              />
            </Grid>

            {/* SERVICIOS */}
            <Grid size={12}>
              <Paper
                variant="outlined"
                sx={{
                  p: {
                    xs: 2.5,
                    md: 3,
                  },

                  borderRadius: 3,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',

                    justifyContent: 'space-between',

                    alignItems: 'center',

                    gap: 2,

                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                      }}
                    >
                      Servicios disponibles
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Selección inicial basada en tu tipo de cuenta
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    onClick={() =>
                      router.push(APP_ROUTES.CLIENT.SERVICIOS.ROOT)
                    }
                  >
                    Ver todos
                  </Button>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2.5}>
                  {dashboardMock.servicios.map((servicio) => (
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                        lg: 3,
                      }}
                      key={servicio.id_servicio}
                    >
                      <ServicioCard servicio={servicio} compact />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <DashboardFooter />
    </Box>
  );
}
