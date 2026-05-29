'use client';

import Link from 'next/link';
import { Alert, Box, Button, Chip, Divider, LinearProgress, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { listSolicitudesByTecnico } from '@/services/solicitudes.service';
import { useAuthStore } from '@/store/authStore';

export default function TecnicoMisSolicitudesPage() {
  const { user } = useAuthStore();
  const { data: solicitudes, loading, error } = useApiData(
    () => (user?.id_usuario ? listSolicitudesByTecnico(user.id_usuario) : Promise.resolve([])),
    [user?.id_usuario],
    [],
  );

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Agenda"
        title="Mis solicitudes"
        description="Servicios aceptados o en curso con informacion tecnica para la visita."
        chips={[{ label: `${solicitudes.length} asignadas` }]}
      />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2 }}>
        {solicitudes.map((solicitud) => (
          <Paper key={solicitud.id_ss} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{solicitud.servicioNombre}</Typography>
                <Typography variant="body2" color="text.secondary">{solicitud.clienteNombre} - {solicitud.direccionResumen}</Typography>
              </Box>
              <Chip label={solicitud.estado} color={solicitud.estado === 'en_curso' ? 'primary' : 'default'} />
            </Box>
            <Box sx={{ my: 2 }}>
              <LinearProgress variant="determinate" value={solicitud.progreso} sx={{ height: 8, borderRadius: 99 }} />
              <Typography variant="caption" color="text.secondary">{solicitud.progreso}% de avance operativo</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button component={Link} href={APP_ROUTES.TECNICO.MIS_SOLICITUDES.DETAIL(solicitud.id_ss)}>Ver detalle</Button>
              <Button component={Link} href={APP_ROUTES.TECNICO.MIS_SOLICITUDES.COMPLETAR(solicitud.id_ss)} variant="contained">Completar</Button>
            </Box>
          </Paper>
        ))}
        {solicitudes.length === 0 ? <Typography variant="body2" color="text.secondary">No tienes solicitudes asignadas.</Typography> : null}
      </Box>
    </Box>
  );
}
