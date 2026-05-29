import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { SolicitudDisponibleCard } from '@/components/tecnico/SolicitudDisponibleCard/SolicitudDisponibleCard';
import { solicitudesDisponiblesMock } from '@/mocks/tecnico-pages.mock';
import { Box, Divider } from '@mui/material';

export default function SolicitudesDisponiblesPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Operacion"
        title="Solicitudes disponibles"
        description="Revisa solicitudes pendientes, distancia estimada, cliente y prioridad antes de tomar una atencion."
        chips={[{ label: `${solicitudesDisponiblesMock.length} pendientes` }]}
      />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
        {solicitudesDisponiblesMock.map((solicitud) => (
          <SolicitudDisponibleCard key={solicitud.id_ss} solicitud={solicitud} />
        ))}
      </Box>
    </Box>
  );
}
