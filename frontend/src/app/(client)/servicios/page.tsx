'use client';

import { Alert, Box, Button, Divider, Typography } from '@mui/material';
import Link from 'next/link';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { ServicioCard } from '@/components/cliente/ServicioCard/ServicioCard';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { listServicios } from '@/services/servicios.service';

export default function ServiciosPage() {
  const { data: servicios, loading, error } = useApiData(listServicios, [], []);

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Catalogo"
        title="Servicios disponibles"
        description="Elige un servicio y solicita atencion desde la ruta dedicada."
        chips={[{ label: `${servicios.length} servicios` }]}
        actions={
          <Button component={Link} href={APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.ROOT} variant="contained">
            Solicitar un servicio
          </Button>
        }
      />

      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}

      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' } }}>
        {servicios.map((servicio) => (
          <ServicioCard key={servicio.id_servicio} servicio={servicio} compact />
        ))}
        {servicios.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No hay servicios disponibles.</Typography>
        ) : null}
      </Box>
    </Box>
  );
}
