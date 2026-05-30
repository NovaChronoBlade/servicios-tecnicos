'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { Alert, Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getApiErrorMessage } from '@/services/api-error';
import { getSolicitudById, listSolicitudesByTecnico, updateSolicitudEstado } from '@/services/solicitudes.service';
import { useAuthStore } from '@/store/authStore';
import { canTechnicianAccept, canTechnicianReportCompletion, canTechnicianStart, getSolicitudEstadoMeta } from '@/utils/solicitud-state';

type PageProps = { params: Promise<{ id: string }> };

export default function TecnicoSolicitudAsignadaDetallePage({ params }: PageProps) {
  const { id } = use(params);
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);
  const { data: solicitud, loading, error, reload } = useApiData(
    async () => {
      const asignadas = user?.id_usuario ? await listSolicitudesByTecnico(user.id_usuario) : [];
      return asignadas.find((item) => item.id_ss === id) ?? getSolicitudById(id);
    },
    [id, user?.id_usuario],
    null,
  );

  const handleStatus = async (estado: string) => {
    setSaving(true);
    setSavingError(null);
    try {
      await updateSolicitudEstado(id, estado);
      await reload();
    } catch (err) {
      setSavingError(getApiErrorMessage(err, 'No se pudo actualizar la solicitud.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!solicitud) return <Alert severity="error">{error ?? 'Solicitud no encontrada'}</Alert>;
  const estado = getSolicitudEstadoMeta(solicitud.estado);
  const accepting = canTechnicianAccept(solicitud, user?.id_usuario);
  const starting = canTechnicianStart(solicitud, user?.id_usuario);
  const reporting = canTechnicianReportCompletion(solicitud, user?.id_usuario);
  const action = accepting ? (
    <Button onClick={() => handleStatus('aceptado')} variant="contained" disabled={saving}>Aceptar servicio</Button>
  ) : starting ? (
    <Button onClick={() => handleStatus('en_curso')} variant="contained" disabled={saving}>Iniciar servicio</Button>
  ) : reporting ? (
    <Button component={Link} href={APP_ROUTES.TECNICO.MIS_SOLICITUDES.COMPLETAR(solicitud.id_ss)} variant="contained">Reportar cierre</Button>
  ) : (
    <Button variant="contained" disabled>Sin acciones disponibles</Button>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Servicio asignado"
        title={solicitud.servicioNombre}
        description={solicitud.observacionesCliente}
        chips={[{ label: estado.label, color: estado.color }, { label: solicitud.valorEstimado }]}
        actions={action}
      />
      <Divider sx={{ mb: 3 }} />
      {(error || savingError) ? <Alert severity="error" sx={{ mb: 3 }}>{savingError ?? error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Datos de atencion</Typography>
          <Divider sx={{ my: 2 }} />
          {[
            ['Cliente', solicitud.clienteNombre],
            ['Telefono', solicitud.clienteTelefono],
            ['Direccion', solicitud.direccionResumen],
            ['Programada', new Date(solicitud.fecha_programada ?? solicitud.fecha).toLocaleString('es-CO')],
          ].map(([label, value]) => (
            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1 }}>
              <Typography color="text.secondary">{label}</Typography>
              <Typography sx={{ fontWeight: 700, textAlign: 'right' }}>{value}</Typography>
            </Box>
          ))}
        </Paper>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Notas tecnicas</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">{solicitud.notasTecnicas}</Typography>
          <Box sx={{ mt: 2 }}><Chip label={solicitud.materialesSugeridos} variant="outlined" /></Box>
        </Paper>
      </Box>
    </Box>
  );
}
