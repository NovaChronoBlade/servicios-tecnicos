'use client';

import { use } from 'react';
import { Alert, Box, Paper, Typography } from '@mui/material';

import { ClientDetailHero } from '@/components/common/ClientPage/ClientDetailHero';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useApiData } from '@/hooks/useApiData';
import { getCalificacionById } from '@/services/calificaciones.service';

export default function CalificacionDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: calificacion, loading, error } = useApiData(
    () => getCalificacionById(id),
    [id],
    null,
  );

  if (loading) return <LoadingSpinner />;
  if (!calificacion) return <Alert severity="error">{error ?? 'Calificacion no encontrada'}</Alert>;

  const tecnicoNombre = calificacion.nombre_tecnico ?? 'Tecnico';

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientDetailHero
        eyebrow="Opinion registrada"
        title={`Calificacion de ${tecnicoNombre}`}
        description={calificacion.comentario ?? 'Sin comentario registrado.'}
        facts={[
          { label: 'Puntuacion', value: `${calificacion.puntuacion} / 5`, accent: 'warning' },
          { label: 'Tecnico', value: tecnicoNombre, accent: 'secondary' },
          { label: 'Cliente', value: calificacion.nombre_cliente ?? 'Cliente', accent: 'info' },
          { label: 'ID', value: calificacion.id_calificacion, accent: 'primary' },
        ]}
      />

      <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, mt: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Resumen</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>Experiencia registrada despues del servicio</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Solicitud</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{calificacion.id_ss}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Fecha</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{new Date(calificacion.fecha_calificacion).toLocaleString('es-CO')}</Typography>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
}
