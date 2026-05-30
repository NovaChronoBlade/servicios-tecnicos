"use client";

import { Alert, Box, Chip, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useApiData } from '@/hooks/useApiData';
import { getAdminAuditoria } from '@/services/admin.service';

export default function AdminAuditoriaPage() {
  const { data: eventos, loading, error } = useApiData(
    getAdminAuditoria,
    [],
    [],
  );

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Sistema" title="Auditoria" description="Eventos administrativos recientes." chips={[{ label: `${eventos.length} eventos` }]} />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2 }}>
        {eventos.map((evento) => (
          <Paper key={evento.id} variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 800 }}>{evento.evento}</Typography>
              <Typography variant="body2" color="text.secondary">{new Date(evento.fecha).toLocaleString('es-CO')}</Typography>
            </Box>
            <Chip label={evento.modulo} />
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
