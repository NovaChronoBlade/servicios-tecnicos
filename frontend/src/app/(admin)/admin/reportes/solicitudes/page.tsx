import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { clientRequestsMock } from '@/mocks/client-pages.mock';
import { Box, Chip, Divider, Paper, Typography } from '@mui/material';

export default function AdminReporteSolicitudesPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Reporte" title="Solicitudes" description="Estados actuales de solicitudes registradas." chips={[{ label: `${clientRequestsMock.length} solicitudes` }]} />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {clientRequestsMock.map((solicitud) => (
          <Paper key={solicitud.id_ss} variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography sx={{ fontWeight: 800 }}>{solicitud.servicioNombre}</Typography>
            <Chip label={solicitud.estado} />
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
