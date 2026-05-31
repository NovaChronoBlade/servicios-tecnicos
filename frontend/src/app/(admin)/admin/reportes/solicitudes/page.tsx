'use client';

import { Alert, Box, Chip, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useApiData } from '@/hooks/useApiData';
import { listSolicitudes } from '@/services/solicitudes.service';

export default function AdminReporteSolicitudesPage() {
  const { data: solicitudes, loading, error } = useApiData(listSolicitudes, [], []);

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Reporte" title="Solicitudes" description="Estados actuales de solicitudes registradas." chips={[{ label: `${solicitudes.length} solicitudes` }]} />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2 }}>
        {solicitudes.map((solicitud) => (
          <Paper key={solicitud.id_ss} variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography sx={{ fontWeight: 800 }}>{solicitud.servicioNombre}</Typography>
            <Chip label={solicitud.estado} />
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
