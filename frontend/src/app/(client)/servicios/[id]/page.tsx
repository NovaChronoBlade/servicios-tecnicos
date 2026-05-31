'use client';

import { use } from 'react';
import Link from 'next/link';
import { Alert, Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';

import { ClientDetailHero } from '@/components/common/ClientPage/ClientDetailHero';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getServicioById } from '@/services/servicios.service';

export default function ServicioDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: servicio, loading, error } = useApiData(
    () => getServicioById(id),
    [id],
    null,
  );

  if (loading) return <LoadingSpinner />;
  if (!servicio) return <Alert severity="error">{error ?? 'Servicio no encontrado'}</Alert>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <ClientDetailHero
        eyebrow="Ficha de servicio"
        title={servicio.nombre}
        description={servicio.descripcion}
        chips={<Chip label={servicio.categoriaNombre} color="primary" />}
        facts={[
          { label: 'Precio', value: `$${Number(servicio.precio).toLocaleString('es-CO')}`, accent: 'primary' },
          { label: 'Tiempo estimado', value: servicio.tiempoEstimado, accent: 'secondary' },
          { label: 'Calificacion', value: `${servicio.puntuacionPromedio.toFixed(1)} / 5`, accent: 'success' },
          { label: 'ID de servicio', value: servicio.id_servicio, accent: 'info' },
        ]}
        actions={
          <>
            <Button component={Link} href={APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.DETAIL(servicio.id_servicio)} variant="contained">
              Solicitar este servicio
            </Button>
            <Button component={Link} href={APP_ROUTES.CLIENT.SERVICIOS.ROOT} variant="outlined">
              Volver a servicios
            </Button>
          </>
        }
      />

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography variant="overline" color="text.secondary">Cobertura</Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>Atencion a domicilio y seguimiento posterior</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography variant="overline" color="text.secondary">Disponibilidad</Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>Agenda flexible con confirmacion en el dia</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography variant="overline" color="text.secondary">Soporte</Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>Acompanamiento antes, durante y despues del servicio</Typography>
        </Paper>
      </Box>
    </Box>
  );
}
