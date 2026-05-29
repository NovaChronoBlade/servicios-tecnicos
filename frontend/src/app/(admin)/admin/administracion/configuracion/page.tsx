import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { adminSettingsMock } from '@/mocks/admin-pages.mock';
import { Box, Divider, Paper, Typography } from '@mui/material';

export default function AdminConfiguracionPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Sistema" title="Configuracion" description="Resumen de configuraciones tecnicas principales." />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
        {adminSettingsMock.map((setting) => (
          <Paper key={setting.label} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>{setting.label}</Typography>
            <Typography variant="body2" color="text.secondary">{setting.value}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
