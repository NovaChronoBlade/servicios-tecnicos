'use client';

import { Alert, Box, Divider, Typography } from '@mui/material';

import { CalificacionCard } from '@/components/tecnico/CalificacionCard/CalificacionCard';
import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useApiData } from '@/hooks/useApiData';
import {
  getPromedioTecnico,
  listCalificacionesByTecnico,
} from '@/services/calificaciones.service';
import { useAuthStore } from '@/store/authStore';

export default function TecnicoCalificacionesPage() {
  const { user } = useAuthStore();
  const { data, loading, error } = useApiData(
    async () => {
      if (!user?.id_usuario) return { promedio: null, calificaciones: [] };
      const [promedio, calificaciones] = await Promise.all([
        getPromedioTecnico(user.id_usuario).catch(() => null),
        listCalificacionesByTecnico(user.id_usuario),
      ]);
      return { promedio, calificaciones };
    },
    [user?.id_usuario],
    { promedio: null, calificaciones: [] },
  );

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Reputacion"
        title="Calificaciones"
        description="Opiniones recibidas por servicios atendidos."
        chips={[{ label: `${(data.promedio?.promedio ?? 0).toFixed(1)} promedio` }, { label: `${data.calificaciones.length} recientes` }]}
      />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
        {data.calificaciones.map((calificacion) => (
          <CalificacionCard key={calificacion.id_calificacion} calificacion={calificacion} />
        ))}
        {data.calificaciones.length === 0 ? <Typography variant="body2" color="text.secondary">Aun no tienes calificaciones.</Typography> : null}
      </Box>
    </Box>
  );
}
