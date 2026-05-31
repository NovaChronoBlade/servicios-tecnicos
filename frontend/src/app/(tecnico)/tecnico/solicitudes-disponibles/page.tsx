'use client';

import { Alert, Box, Divider, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { SolicitudDisponibleCard } from '@/components/tecnico/SolicitudDisponibleCard/SolicitudDisponibleCard';
import { useApiData } from '@/hooks/useApiData';
import { listSolicitudesPendientesDisponibles } from '@/services/solicitudes.service';

export default function SolicitudesDisponiblesPage() {
  const { data: solicitudes, loading, error } = useApiData(
    listSolicitudesPendientesDisponibles,
    [],
    [],
  );

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Operacion"
        title="Solicitudes disponibles"
        description="Revisa solicitudes pendientes, cliente y prioridad antes de tomar una atencion."
        chips={[{ label: `${solicitudes.length} pendientes` }]}
      />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
        {solicitudes.map((solicitud) => (
          <SolicitudDisponibleCard key={solicitud.id_ss} solicitud={solicitud} />
        ))}
        {solicitudes.length === 0 ? <Typography variant="body2" color="text.secondary">No hay solicitudes disponibles.</Typography> : null}
      </Box>
    </Box>
  );
}
