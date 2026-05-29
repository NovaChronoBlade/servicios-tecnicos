'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getApiErrorMessage } from '@/services/api-error';
import {
  asignarTecnico,
  getSolicitudById,
  listSolicitudesPendientesDisponibles,
} from '@/services/solicitudes.service';
import { useAuthStore } from '@/store/authStore';

type PageProps = { params: Promise<{ id: string }> };

export default function SolicitudDisponibleDetallePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: solicitud, loading, error } = useApiData(
    async () => {
      const disponibles = await listSolicitudesPendientesDisponibles();
      return disponibles.find((item) => item.id_ss === id) ?? getSolicitudById(id);
    },
    [id],
    null,
  );

  const handleAccept = async () => {
    if (!user?.id_usuario) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      await asignarTecnico(id, user.id_usuario);
      router.push(APP_ROUTES.TECNICO.MIS_SOLICITUDES.ROOT);
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'No se pudo aceptar la solicitud.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!solicitud) return <Alert severity="error">{error ?? 'Solicitud no encontrada'}</Alert>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Detalle pendiente"
        title={solicitud.servicioNombre}
        description={solicitud.direccionResumen}
        chips={[{ label: solicitud.prioridad }, { label: solicitud.valorEstimado }, { label: solicitud.estado }]}
        actions={<Button onClick={handleAccept} variant="contained" disabled={submitting}>{submitting ? 'Aceptando...' : 'Aceptar solicitud'}</Button>}
      />
      <Divider sx={{ mb: 3 }} />
      {(error || submitError) ? <Alert severity="error" sx={{ mb: 3 }}>{submitError ?? error}</Alert> : null}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
          {[
            ['Cliente', solicitud.clienteNombre],
            ['Telefono', solicitud.clienteTelefono],
            ['Categoria', solicitud.servicioCategoria],
            ['Fecha programada', new Date(solicitud.fecha_programada ?? solicitud.fecha).toLocaleString('es-CO')],
            ['Tiempo estimado', solicitud.tiempoEstimado],
            ['Estado', solicitud.estado],
          ].map(([label, value]) => (
            <Paper key={label} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, mt: 0.5 }}>{value}</Typography>
            </Paper>
          ))}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Chip label={`Solicitud ${solicitud.id_ss}`} variant="outlined" />
        </Box>
      </Paper>
    </Box>
  );
}
