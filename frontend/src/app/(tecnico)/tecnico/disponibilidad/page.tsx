"use client";

import { useState } from 'react';
import { Alert, Box, Chip, Divider, Paper, Snackbar, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { DisponibilidadForm, type DisponibilidadFormValues } from '@/components/tecnico/DisponibilidadForm/DisponibilidadForm';
import { useApiData } from '@/hooks/useApiData';
import { getApiErrorMessage } from '@/services/api-error';
import { getPromedioTecnico } from '@/services/calificaciones.service';
import { updateDetallesTecnicos } from '@/services/usuarios.service';
import { useAuthStore } from '@/store/authStore';

export default function TecnicoDisponibilidadPage() {
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);
  const { data: promedio, loading, error, reload } = useApiData(
    () => (user?.id_usuario ? getPromedioTecnico(user.id_usuario).catch(() => null) : Promise.resolve(null)),
    [user?.id_usuario],
    null,
  );

  const initialValues: DisponibilidadFormValues = {
    dia: 'Lunes',
    inicio: '08:00',
    fin: '17:00',
    activa: Boolean(promedio?.disponible ?? true),
    nota: 'La agenda semanal no tiene endpoint dedicado; se actualiza disponibilidad global.',
  };

  const handleSubmit = async (values: DisponibilidadFormValues) => {
    if (!user?.id_usuario) return;
    setSavingError(null);

    try {
      await updateDetallesTecnicos(user.id_usuario, { disponible: values.activa });
      setSaved(true);
      void reload();
    } catch (err) {
      setSavingError(getApiErrorMessage(err, 'No se pudo actualizar la disponibilidad.'));
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Agenda" title="Disponibilidad" description="Actualiza la disponibilidad global expuesta por datos tecnicos." />
      <Divider sx={{ mb: 3 }} />
      {(error || savingError) ? <Alert severity="warning" sx={{ mb: 3 }}>{savingError ?? error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '0.75fr 1fr' } }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <DisponibilidadForm initialValues={initialValues} onSubmit={handleSubmit} />
        </Paper>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Estado operativo</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            El backend actual permite actualizar `detalles_tecnicos.disponible`, pero no expone bloques semanales de agenda.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Chip label={promedio?.disponible ? 'Disponible' : 'No disponible'} color={promedio?.disponible ? 'success' : 'default'} />
          </Box>
        </Paper>
      </Box>
      <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Disponibilidad actualizada" />
    </Box>
  );
}
