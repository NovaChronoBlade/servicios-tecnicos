import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import { APP_ROUTES } from '@/constants/routes.constants';
import { clientCalificacionesMock, topTechniciansMock } from '@/mocks/client-pages.mock';
import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';

export default function CalificacionesPage() {
  const averageScore = topTechniciansMock.reduce((sum, tecnico) => sum + tecnico.promedio, 0) / topTechniciansMock.length;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Valoración posterior"
        title="Calificaciones"
        description="Cuando una solicitud se completa, el cliente puede calificar y comentar la atención recibida para mejorar el servicio futuro."
        chips={[
          { label: `${topTechniciansMock.length} técnicos destacados` },
          { label: `${clientCalificacionesMock.length} opiniones` },
        ]}
        actions={
          <Button component={Link} href={APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT} variant="contained">
            Revisar solicitudes finalizadas
          </Button>
        }
      />

      <Divider sx={{ my: 3 }} />

      <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Promedio general</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>{averageScore.toFixed(1)} / 5</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Opiniones disponibles</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>{clientCalificacionesMock.length}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Objetivo</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>Cerrar el ciclo de atención</Typography>
          </Paper>
        </Box>
      </Paper>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' } }}>
        {topTechniciansMock.map((tecnico) => (
          <Paper key={tecnico.id_tecnico} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'start' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{tecnico.nombre}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Promedio: {tecnico.promedio} / 5</Typography>
              </Box>
              <Chip color="primary" label={`${tecnico.total_calificaciones} valoraciones`} />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
              <Chip label="Atención a domicilio" variant="outlined" />
              <Chip label="Seguimiento completado" variant="outlined" />
            </Box>
          </Paper>
        ))}
      </Box>

      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {clientCalificacionesMock.map((calificacion) => (
          <Paper key={calificacion.id_calificacion} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'start', flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{calificacion.puntuacion} / 5</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{calificacion.comentario}</Typography>
              </Box>
              <Button component={Link} href={APP_ROUTES.CLIENT.CALIFICACIONES.DETAIL(calificacion.id_calificacion)} size="small">
                Ver detalle
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}