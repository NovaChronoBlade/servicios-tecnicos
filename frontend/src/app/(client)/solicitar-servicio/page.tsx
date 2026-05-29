'use client';

import Link from 'next/link';
import { Alert, Box, Button, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { listServicios } from '@/services/servicios.service';

export default function SolicitarServicioPage() {
  const { data: servicios, loading, error } = useApiData(listServicios, [], []);
  const featured = servicios[0];

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <ClientPageHeader
        eyebrow="Flujo"
        title="Solicitar servicio"
        description="El cliente selecciona un servicio y una direccion propia para crear una solicitud pendiente, que luego podra seguir, pagar y calificar."
        chips={[
          { label: 'Solicitud pendiente' },
          { label: 'Direccion requerida' },
          { label: 'Pago posterior' },
        ]}
      />

      <Box sx={{ display: 'grid', gap: 3, mt: 3, gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.1fr) minmax(320px, 0.9fr)' } }}>
        <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
          <Typography variant="overline" color="text.secondary">Servicio sugerido</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>
            {featured?.nombre ?? 'Sin servicios disponibles'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {featured?.descripcion ?? 'El catalogo aun no tiene servicios activos.'}
          </Typography>

          <Box sx={{ display: 'grid', gap: 1.5, mt: 3 }}>
            <Typography variant="body2" color="text.secondary">1. Elige un servicio del catalogo.</Typography>
            <Typography variant="body2" color="text.secondary">2. Selecciona tu direccion guardada.</Typography>
            <Typography variant="body2" color="text.secondary">3. Envia la solicitud para asignacion o seguimiento.</Typography>
          </Box>

          <Button
            component={Link}
            href={featured ? APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.DETAIL(featured.id_servicio) : APP_ROUTES.CLIENT.SERVICIOS.ROOT}
            variant="contained"
            sx={{ mt: 3 }}
            disabled={!featured}
          >
            Continuar con la solicitud
          </Button>
        </Paper>

        <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, bgcolor: 'background.paper' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Que resuelve este flujo</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
            Organiza en un solo lugar la publicacion de servicios, la creacion de solicitudes y el seguimiento hasta el pago y la calificacion posterior.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 3 }}>
            <Button component={Link} href={APP_ROUTES.CLIENT.SERVICIOS.ROOT} variant="outlined">
              Ver catalogo completo
            </Button>
            <Button component={Link} href={APP_ROUTES.CLIENT.DIRECCIONES.ROOT} variant="text">
              Confirmar direcciones guardadas
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
