'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, Button, MenuItem, Paper, TextField, Typography } from '@mui/material';

import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getApiErrorMessage } from '@/services/api-error';
import { listDirecciones } from '@/services/direcciones.service';
import { getServicioById, type ServicioListItem } from '@/services/servicios.service';
import { createSolicitud } from '@/services/solicitudes.service';
import { useAuthStore } from '@/store/authStore';
import type { Direccion } from '@/types';

export default function SolicitarServicioDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data, loading, error } = useApiData<{
    servicio: ServicioListItem | null;
    direcciones: Direccion[];
  }>(
    async () => {
      const [servicio, direcciones] = await Promise.all([
        getServicioById(id),
        listDirecciones(),
      ]);
      return { servicio, direcciones };
    },
    [id],
    { servicio: null, direcciones: [] },
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!user?.id_usuario || !selectedAddress) return;

    setSubmitting(true);
    try {
      await createSolicitud({
        id_cliente: user.id_usuario,
        id_servicio: id,
        id_direccion: selectedAddress,
        fecha_programada: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      });
      router.push(APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.SUCCESS);
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'No se pudo crear la solicitud.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!data.servicio) return <Alert severity="error">{error ?? 'Servicio no encontrado'}</Alert>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {(error || submitError) ? <Alert severity="error" sx={{ mb: 3 }}>{submitError ?? error}</Alert> : null}
      <Paper component="form" onSubmit={handleSubmit} variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          {data.servicio.nombre}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Selecciona una direccion guardada y una fecha programada para crear la solicitud real en el backend.
        </Typography>

        <Box sx={{ mt: 3, display: 'grid', gap: 2, maxWidth: 760 }}>
          <TextField
            select
            label="Direccion de servicio"
            value={selectedAddress}
            onChange={(event) => setSelectedAddress(event.target.value)}
            required
            fullWidth
            helperText={data.direcciones.length === 0 ? 'Crea una direccion antes de solicitar el servicio.' : 'Solo se listan tus direcciones guardadas.'}
          >
            {data.direcciones.map((direccion) => (
              <MenuItem key={direccion.id_direccion} value={direccion.id_direccion}>
                {direccion.direccion}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Fecha programada"
            type="datetime-local"
            value={scheduledAt}
            onChange={(event) => setScheduledAt(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button type="submit" variant="contained" disabled={submitting || !selectedAddress || data.direcciones.length === 0}>
            {submitting ? 'Creando...' : 'Confirmar solicitud'}
          </Button>
          <Button onClick={() => router.push(APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.ROOT)} variant="outlined">
            Volver
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
