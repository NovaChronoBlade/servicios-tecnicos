'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Alert, Box, Button, Chip, Divider, LinearProgress, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getApiErrorMessage } from '@/services/api-error';
import { listSolicitudesByTecnico, updateSolicitudEstado } from '@/services/solicitudes.service';
import { useAuthStore } from '@/store/authStore';
import { canTechnicianAccept, canTechnicianReportCompletion, canTechnicianStart, getSolicitudEstadoMeta } from '@/utils/solicitud-state';

export default function TecnicoMisSolicitudesPage() {
  const { user } = useAuthStore();
  const { data: solicitudes, loading, error, reload } = useApiData(
    () => (user?.id_usuario ? listSolicitudesByTecnico(user.id_usuario) : Promise.resolve([])),
    [user?.id_usuario],
    [],
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savingError, setSavingError] = useState<string | null>(null);

  const handleStatus = async (id: string, estado: string) => {
    setSavingId(id);
    setSavingError(null);
    try {
      await updateSolicitudEstado(id, estado);
      await reload();
    } catch (err) {
      setSavingError(getApiErrorMessage(err, 'No se pudo actualizar la solicitud.'));
    } finally {
      setSavingId(null);
    }
  };

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
      {(error || savingError) ? <Alert severity="error" sx={{ mb: 3 }}>{savingError ?? error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2 }}>
        {solicitudes.map((solicitud) => {
          const estado = getSolicitudEstadoMeta(solicitud.estado);
          const accepting = canTechnicianAccept(solicitud, user?.id_usuario);
          const starting = canTechnicianStart(solicitud, user?.id_usuario);
          const reporting = canTechnicianReportCompletion(solicitud, user?.id_usuario);

          return (
          <Paper key={solicitud.id_ss} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{solicitud.servicioNombre}</Typography>
                <Typography variant="body2" color="text.secondary">{solicitud.clienteNombre} - {solicitud.direccionResumen}</Typography>
              </Box>
              <Chip label={estado.label} color={estado.color} variant="outlined" />
            </Box>
            <Box sx={{ my: 2 }}>
              <LinearProgress variant="determinate" value={solicitud.progreso} sx={{ height: 8, borderRadius: 99 }} />
              <Typography variant="caption" color="text.secondary">{solicitud.progreso}% de avance operativo</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button component={Link} href={APP_ROUTES.TECNICO.MIS_SOLICITUDES.DETAIL(solicitud.id_ss)}>Ver detalle</Button>
              {accepting ? (
                <Button variant="contained" disabled={savingId === solicitud.id_ss} onClick={() => handleStatus(solicitud.id_ss, 'aceptado')}>
                  Aceptar
                </Button>
              ) : null}
              {starting ? (
                <Button variant="contained" disabled={savingId === solicitud.id_ss} onClick={() => handleStatus(solicitud.id_ss, 'en_curso')}>
                  Iniciar
                </Button>
              ) : null}
              {reporting ? (
                <Button component={Link} href={APP_ROUTES.TECNICO.MIS_SOLICITUDES.COMPLETAR(solicitud.id_ss)} variant="contained">
                  Reportar cierre
                </Button>
              ) : null}
            </Box>
          </Paper>
          );
        })}
        {solicitudes.length === 0 ? <Typography variant="body2" color="text.secondary">No tienes solicitudes asignadas.</Typography> : null}
      </Box>
    </Box>
  );
}
