"use client";

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useApiData } from '@/hooks/useApiData';
import { listCalificaciones } from '@/services/calificaciones.service';
import { Alert, Box, Chip, Divider, Paper, Rating, Typography } from '@mui/material';

export default function AdminComentariosPage() {
  const { data: calificaciones, loading, error } = useApiData(listCalificaciones, [], []);

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Reputacion"
        title="Calificaciones y comentarios"
        description="Consulta las calificaciones registradas por solicitud, cliente y tecnico."
        chips={[{ label: `${calificaciones.length} registros` }]}
      />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2 }}>
        {calificaciones.map((calificacion) => (
          <Paper key={calificacion.id_calificacion} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Solicitud {calificacion.id_ss}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {calificacion.nombre_cliente} - {calificacion.nombre_tecnico}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Rating value={calificacion.puntuacion} readOnly size="small" />
                <Chip label={new Date(calificacion.fecha_calificacion).toLocaleDateString('es-CO')} variant="outlined" />
              </Box>
            </Box>
            {calificacion.comentario ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {calificacion.comentario}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Sin comentario.
              </Typography>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
