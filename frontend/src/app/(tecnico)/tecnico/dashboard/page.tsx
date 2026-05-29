"use client";

import Link from 'next/link';
import { Alert, Box, Button, Card, CardContent, Chip, Divider, Paper, Typography } from '@mui/material';
import { CalendarClock, CheckCircle2, ClipboardList, Star, Wrench } from 'lucide-react';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { SolicitudDisponibleCard } from '@/components/tecnico/SolicitudDisponibleCard/SolicitudDisponibleCard';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { listCalificacionesByTecnico, getPromedioTecnico } from '@/services/calificaciones.service';
import {
  listSolicitudesByTecnico,
  listSolicitudesPendientesDisponibles,
} from '@/services/solicitudes.service';
import { useAuthStore } from '@/store/authStore';

export default function TecnicoDashboardPage() {
  const { user } = useAuthStore();
  const { data, loading, error } = useApiData(
    async () => {
      if (!user?.id_usuario) {
        return { disponibles: [], asignadas: [], promedio: null, calificaciones: [] };
      }

      const [disponibles, asignadas, promedio, calificaciones] = await Promise.all([
        listSolicitudesPendientesDisponibles(),
        listSolicitudesByTecnico(user.id_usuario),
        getPromedioTecnico(user.id_usuario).catch(() => null),
        listCalificacionesByTecnico(user.id_usuario).catch(() => []),
      ]);

      return { disponibles, asignadas, promedio, calificaciones };
    },
    [user?.id_usuario],
    { disponibles: [], asignadas: [], promedio: null, calificaciones: [] },
  );

  if (loading) return <LoadingSpinner />;

  const stats = [
    { label: 'Disponibles', value: data.disponibles.length, icon: ClipboardList },
    { label: 'En curso', value: data.asignadas.filter((item) => item.estado === 'en_curso').length, icon: Wrench },
    { label: 'Aceptadas', value: data.asignadas.filter((item) => item.estado === 'aceptado').length, icon: CheckCircle2 },
    { label: 'Promedio', value: (data.promedio?.promedio ?? 0).toFixed(1), icon: Star },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Centro tecnico"
        title={`Hola, ${user?.nombre ?? 'tecnico'}`}
        description="Revisa solicitudes disponibles, controla tus servicios asignados y manten tu perfil operativo actualizado."
        chips={[
          { label: data.promedio?.especialidad ?? 'Perfil tecnico' },
          { label: `${data.calificaciones.length} calificaciones` },
        ]}
        actions={
          <>
            <Button component={Link} href={APP_ROUTES.TECNICO.SOLICITUDES_DISPONIBLES.ROOT} variant="contained">
              Revisar solicitudes
            </Button>
            <Button component={Link} href={APP_ROUTES.TECNICO.MIS_SOLICITUDES.ROOT} variant="outlined">
              Mis solicitudes
            </Button>
          </>
        }
      />
      {error ? <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert> : null}

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, my: 3 }}>
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{value}</Typography>
              </Box>
              <Box sx={{ width: 46, height: 46, borderRadius: 2, display: 'grid', placeItems: 'center', bgcolor: 'action.hover', color: 'primary.main' }}>
                <Icon size={22} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1.35fr 0.65fr' } }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Solicitudes disponibles</Typography>
              <Typography variant="body2" color="text.secondary">Atenciones abiertas para tomar.</Typography>
            </Box>
            <Button component={Link} href={APP_ROUTES.TECNICO.SOLICITUDES_DISPONIBLES.ROOT} size="small">Ver todas</Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'grid', gap: 2 }}>
            {data.disponibles.slice(0, 2).map((solicitud) => (
              <SolicitudDisponibleCard key={solicitud.id_ss} solicitud={solicitud} compact />
            ))}
            {data.disponibles.length === 0 ? <Typography variant="body2" color="text.secondary">No hay solicitudes disponibles.</Typography> : null}
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Agenda inmediata</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Servicios asignados y siguientes pasos.</Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'grid', gap: 2 }}>
            {data.asignadas.map((solicitud) => (
              <Paper key={solicitud.id_ss} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{solicitud.servicioNombre}</Typography>
                  <Chip size="small" label={solicitud.estado} />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1, color: 'text.secondary' }}>
                  <CalendarClock size={16} />
                  <Typography variant="body2">{new Date(solicitud.fecha_programada ?? solicitud.fecha).toLocaleString('es-CO')}</Typography>
                </Box>
              </Paper>
            ))}
            {data.asignadas.length === 0 ? <Typography variant="body2" color="text.secondary">No tienes solicitudes asignadas.</Typography> : null}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
