'use client';

import { Alert, Box, Chip, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useApiData } from '@/hooks/useApiData';
import { listTopTecnicos } from '@/services/calificaciones.service';

export default function AdminCalificacionesPage() {
  const { data: tecnicos, loading, error } = useApiData(() => listTopTecnicos(20), [], []);

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Reputacion" title="Calificaciones" description="Resumen de calificaciones y tecnicos destacados." chips={[{ label: `${tecnicos.length} tecnicos` }]} />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
        {tecnicos.map((tecnico) => (
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
