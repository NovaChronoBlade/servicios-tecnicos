"use client";

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, Divider, Paper, Snackbar } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { CompletarServicioForm, type CompletarServicioFormValues } from '@/components/tecnico/CompletarServicioForm/CompletarServicioForm';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getApiErrorMessage } from '@/services/api-error';
import {
  confirmarTecnico,
  getSolicitudById,
  updateSolicitudEstado,
} from '@/services/solicitudes.service';

type PageProps = { params: Promise<{ id: string }> };

export default function CompletarSolicitudPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);

  const { data: solicitud, loading, error } = useApiData(
    () => getSolicitudById(id),
    [id],
    null,
  );

  const handleSubmit = async (_values: CompletarServicioFormValues) => {
    setSaving(true);
    setSavingError(null);

    try {
      if (solicitud?.estado === 'aceptado') {
        await updateSolicitudEstado(id, 'en_curso');
      }
      await confirmarTecnico(id);
      setSaved(true);
      router.push(APP_ROUTES.TECNICO.MIS_SOLICITUDES.DETAIL(id));
    } catch (err) {
      setSavingError(getApiErrorMessage(err, 'No se pudo confirmar el cierre del servicio.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!solicitud) return <Alert severity="error">{error ?? 'Solicitud no encontrada'}</Alert>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Cierre operativo" title={`Completar ${solicitud.id_ss}`} description={solicitud.servicioNombre} />
      <Divider sx={{ mb: 3 }} />
      {(error || savingError) ? <Alert severity="error" sx={{ mb: 3 }}>{savingError ?? error}</Alert> : null}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, maxWidth: 900 }}>
        <CompletarServicioForm
          onSubmit={handleSubmit}
          onCancel={() => router.push(APP_ROUTES.TECNICO.MIS_SOLICITUDES.DETAIL(solicitud.id_ss))}
        />
      </Paper>
      <Snackbar open={saved || saving} autoHideDuration={2500} onClose={() => setSaved(false)} message={saving ? 'Enviando cierre...' : 'Cierre confirmado'} />
    </Box>
  );
}
