'use client';

import { Alert, Box, Divider, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { SolicitudCard } from '@/components/cliente/SolicitudCard/SolicitudCard';
import { useApiData } from '@/hooks/useApiData';
import { listSolicitudesByCliente } from '@/services/solicitudes.service';
import { useAuthStore } from '@/store/authStore';

export default function MisSolicitudesPage() {
  const { user } = useAuthStore();
  const { data: solicitudes, loading, error } = useApiData(
    () => (user?.id_usuario ? listSolicitudesByCliente(user.id_usuario) : Promise.resolve([])),
    [user?.id_usuario],
    [],
  );

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Actividad"
        title="Mis solicitudes"
        description="Revisa el estado de cada atencion y entra al detalle cuando lo necesites."
      />

      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {solicitudes.map((solicitud) => (
          <SolicitudCard key={solicitud.id_ss} solicitud={solicitud} />
        ))}
        {solicitudes.length === 0 ? (
          <Typography variant="body2" color="text.secondary">Aun no tienes solicitudes registradas.</Typography>
        ) : null}
      </Box>
    </Box>
  );
}
