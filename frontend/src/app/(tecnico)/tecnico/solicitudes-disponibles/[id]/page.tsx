import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { APP_ROUTES } from '@/constants/routes.constants';
import { getSolicitudDisponibleById } from '@/mocks/tecnico-pages.mock';
import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';

type PageProps = { params: Promise<{ id: string }> };

export default async function SolicitudDisponibleDetallePage({ params }: PageProps) {
  const { id } = await params;
  const solicitud = getSolicitudDisponibleById(id);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Detalle pendiente"
        title={solicitud.servicioNombre}
        description={solicitud.direccionResumen}
        chips={[{ label: solicitud.prioridad }, { label: solicitud.valorEstimado }, { label: `${solicitud.distanciaKm.toFixed(1)} km` }]}
        actions={<Button component={Link} href={APP_ROUTES.TECNICO.MIS_SOLICITUDES.ROOT} variant="contained">Aceptar solicitud</Button>}
      />
      <Divider sx={{ mb: 3 }} />
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
          {[
            ['Cliente', solicitud.clienteNombre],
            ['Telefono', solicitud.clienteTelefono],
            ['Categoria', solicitud.servicioCategoria],
            ['Fecha programada', new Date(solicitud.fecha_programada ?? solicitud.fecha).toLocaleString('es-CO')],
            ['Tiempo estimado', solicitud.tiempoEstimado],
            ['Estado', solicitud.estado],
          ].map(([label, value]) => (
            <Paper key={label} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, mt: 0.5 }}>{value}</Typography>
            </Paper>
          ))}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Chip label={`Solicitud ${solicitud.id_ss}`} variant="outlined" />
        </Box>
      </Paper>
    </Box>
  );
}
