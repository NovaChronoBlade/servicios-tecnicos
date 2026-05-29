import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { Box, Chip, Divider, Paper, Typography } from '@mui/material';

export default function AdminAuditoriaPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Sistema" title="Auditoria" description="Eventos administrativos recientes." chips={[{ label: 'Endpoint pendiente' }]} />
      <Divider sx={{ mb: 3 }} />
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 800 }}>Auditoria no conectada</Typography>
          <Typography variant="body2" color="text.secondary">El backend actual no expone un endpoint de eventos administrativos.</Typography>
        </Box>
        <Chip label="Administracion" />
      </Paper>
    </Box>
  );
}
