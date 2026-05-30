import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { adminComentariosMock } from '@/mocks/admin-pages.mock';
import { Box, Chip, Divider, Paper, Typography } from '@mui/material';

export default function AdminComentariosPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Comentarios"
        title="Comentarios de solicitudes"
        description="Consulta los comentarios registrados por solicitud, cliente y tecnico."
        chips={[{ label: `${adminComentariosMock.length} comentarios` }]}
      />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {adminComentariosMock.map((comentario) => (
          <Paper key={comentario.id_comentario} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Solicitud {comentario.id_ss}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {comentario.nombre_cliente} - {comentario.nombre_tecnico}
                </Typography>
              </Box>
              <Chip label={new Date(comentario.fecha_comentario).toLocaleDateString('es-CO')} variant="outlined" />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {comentario.contenido}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
