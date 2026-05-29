import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { adminAuditMock } from '@/mocks/admin-pages.mock';
import { Box, Chip, Divider, Paper, Typography } from '@mui/material';

export default function AdminAuditoriaPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Sistema" title="Auditoria" description="Eventos administrativos recientes." chips={[{ label: `${adminAuditMock.length} eventos` }]} />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {adminAuditMock.map((event) => (
          <Paper key={event.id} variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 800 }}>{event.evento}</Typography>
              <Typography variant="body2" color="text.secondary">{new Date(event.fecha).toLocaleString('es-CO')}</Typography>
            </Box>
            <Chip label={event.modulo} />
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
