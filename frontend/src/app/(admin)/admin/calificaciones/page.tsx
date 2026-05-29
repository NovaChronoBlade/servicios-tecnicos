import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { clientCalificacionesMock, topTechniciansMock } from '@/mocks/client-pages.mock';
import { Box, Chip, Divider, Paper, Typography } from '@mui/material';

export default function AdminCalificacionesPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Reputacion" title="Calificaciones" description="Resumen de calificaciones y tecnicos destacados." chips={[{ label: `${clientCalificacionesMock.length} opiniones` }]} />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
        {topTechniciansMock.map((tecnico) => (
          <Paper key={tecnico.id_tecnico} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{tecnico.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">{tecnico.total_calificaciones} valoraciones</Typography>
              </Box>
              <Chip label={`${tecnico.promedio} / 5`} color="primary" variant="outlined" />
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
