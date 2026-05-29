import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { APP_ROUTES } from '@/constants/routes.constants';
import { solicitudesAsignadasMock } from '@/mocks/tecnico-pages.mock';
import { Box, Button, Chip, Divider, LinearProgress, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function TecnicoMisSolicitudesPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Agenda"
        title="Mis solicitudes"
        description="Servicios aceptados o en curso con informacion tecnica para la visita."
        chips={[{ label: `${solicitudesAsignadasMock.length} asignadas` }]}
      />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {solicitudesAsignadasMock.map((solicitud) => (
          <Paper key={solicitud.id_ss} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{solicitud.servicioNombre}</Typography>
                <Typography variant="body2" color="text.secondary">{solicitud.clienteNombre} - {solicitud.direccionResumen}</Typography>
              </Box>
              <Chip label={solicitud.estado} color={solicitud.estado === 'en_curso' ? 'primary' : 'default'} />
            </Box>
            <Box sx={{ my: 2 }}>
              <LinearProgress variant="determinate" value={solicitud.progreso} sx={{ height: 8, borderRadius: 99 }} />
              <Typography variant="caption" color="text.secondary">{solicitud.progreso}% de avance operativo</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button component={Link} href={APP_ROUTES.TECNICO.MIS_SOLICITUDES.DETAIL(solicitud.id_ss)}>Ver detalle</Button>
              <Button component={Link} href={APP_ROUTES.TECNICO.MIS_SOLICITUDES.COMPLETAR(solicitud.id_ss)} variant="contained">Completar</Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
