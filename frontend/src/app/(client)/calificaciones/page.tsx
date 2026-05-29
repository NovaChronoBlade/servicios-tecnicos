'use client';

import { Alert, Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import {
  listCalificacionesByCliente,
  listTopTecnicos,
} from '@/services/calificaciones.service';
import { useAuthStore } from '@/store/authStore';

export default function CalificacionesPage() {
  const { user } = useAuthStore();
  const { data, loading, error } = useApiData(
    async () => {
      const [topTecnicos, calificaciones] = await Promise.all([
        listTopTecnicos(10),
        user?.id_usuario ? listCalificacionesByCliente(user.id_usuario) : Promise.resolve([]),
      ]);
      return { topTecnicos, calificaciones };
    },
    [user?.id_usuario],
    { topTecnicos: [], calificaciones: [] },
  );

  if (loading) return <LoadingSpinner />;

  const averageScore = data.topTecnicos.length
    ? data.topTecnicos.reduce((sum, tecnico) => sum + tecnico.promedio, 0) / data.topTecnicos.length
    : 0;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Valoracion posterior"
        title="Calificaciones"
        description="Cuando una solicitud se completa, el cliente puede calificar y comentar la atencion recibida para mejorar el servicio futuro."
        chips={[
          { label: `${data.topTecnicos.length} tecnicos destacados` },
          { label: `${data.calificaciones.length} opiniones` },
        ]}
        actions={
          <Button component={Link} href={APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT} variant="contained">
            Revisar solicitudes finalizadas
          </Button>
        }
      />

      <Divider sx={{ my: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}

      <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Promedio general</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>{averageScore.toFixed(1)} / 5</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Opiniones disponibles</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>{data.calificaciones.length}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Objetivo</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>Cerrar el ciclo de atencion</Typography>
          </Paper>
        </Box>
      </Paper>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' } }}>
        {data.topTecnicos.map((tecnico) => (
          <Paper key={tecnico.id_tecnico} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'start' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{tecnico.nombre}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Promedio: {tecnico.promedio} / 5</Typography>
              </Box>
              <Chip color="primary" label={`${tecnico.total_calificaciones} valoraciones`} />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
              <Chip label={tecnico.especialidad ?? 'Servicio tecnico'} variant="outlined" />
              <Chip label={tecnico.disponible ? 'Disponible' : 'No disponible'} variant="outlined" />
            </Box>
          </Paper>
        ))}
      </Box>

      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.calificaciones.map((calificacion) => (
          <Paper key={calificacion.id_calificacion} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'start', flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{calificacion.puntuacion} / 5</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{calificacion.comentario ?? 'Sin comentario.'}</Typography>
              </Box>
              <Button component={Link} href={APP_ROUTES.CLIENT.CALIFICACIONES.DETAIL(calificacion.id_calificacion)} size="small">
                Ver detalle
              </Button>
            </Box>
          </Paper>
        ))}
        {data.calificaciones.length === 0 ? (
          <Typography variant="body2" color="text.secondary">Aun no tienes calificaciones registradas.</Typography>
        ) : null}
      </Box>
    </Box>
  );
}
