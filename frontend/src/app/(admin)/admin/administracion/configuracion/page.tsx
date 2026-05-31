"use client";

import { Alert, Box, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useApiData } from '@/hooks/useApiData';
import { getAdminConfiguracion } from '@/services/admin.service';

export default function AdminConfiguracionPage() {
  const { data, loading, error } = useApiData(getAdminConfiguracion, [], {});
  const settings = Object.entries(data).map(([label, value]) => ({
    label,
    value,
  }));

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Sistema" title="Configuracion" description="Resumen de configuraciones tecnicas principales." />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
        {settings.map((setting) => (
          <Paper key={setting.label} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>{setting.label}</Typography>
            <Typography variant="body2" color="text.secondary">{setting.value}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
