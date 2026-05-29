import { CalificacionCard } from '@/components/tecnico/CalificacionCard/CalificacionCard';
import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { calificacionesTecnicoMock, tecnicoPerfilMock } from '@/mocks/tecnico-pages.mock';
import { Box, Divider } from '@mui/material';

export default function TecnicoCalificacionesPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Reputacion"
        title="Calificaciones"
        description="Opiniones recibidas por servicios atendidos."
        chips={[{ label: `${tecnicoPerfilMock.calificacion_promedio} promedio` }, { label: `${calificacionesTecnicoMock.length} recientes` }]}
      />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
        {calificacionesTecnicoMock.map((calificacion) => (
          <CalificacionCard key={calificacion.id_calificacion} calificacion={calificacion} />
        ))}
      </Box>
    </Box>
  );
}
