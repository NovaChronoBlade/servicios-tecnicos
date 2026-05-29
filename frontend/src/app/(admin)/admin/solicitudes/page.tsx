'use client';

import Link from 'next/link';
import { Alert, Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { listSolicitudes } from '@/services/solicitudes.service';

export default function AdminSolicitudesPage() {
  const { data: solicitudes, loading, error } = useApiData(listSolicitudes, [], []);

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Solicitudes" title="Gestion de solicitudes" description="Seguimiento general de estados, cliente y tecnico asignado." chips={[{ label: `${solicitudes.length} solicitudes` }]} />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2 }}>
        {solicitudes.map((solicitud) => (
          <Paper key={solicitud.id_ss} variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{solicitud.servicioNombre}</Typography>
              <Typography variant="body2" color="text.secondary">{solicitud.direccionResumen}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip label={solicitud.estado} />
              <Button component={Link} href={APP_ROUTES.ADMIN.SOLICITUDES.DETAIL(solicitud.id_ss)}>Detalle</Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
