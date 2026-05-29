import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { APP_ROUTES } from '@/constants/routes.constants';
import { clientRequestsMock } from '@/mocks/client-pages.mock';
import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function AdminSolicitudesPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Solicitudes" title="Gestion de solicitudes" description="Seguimiento general de estados, cliente y tecnico asignado." chips={[{ label: `${clientRequestsMock.length} solicitudes` }]} />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {clientRequestsMock.map((solicitud) => (
          <Paper key={solicitud.id_ss} variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{solicitud.servicioNombre}</Typography>
              <Typography variant="body2" color="text.secondary">{solicitud.direccionResumen}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip label={solicitud.estado} />
              <Button component={Link} href={APP_ROUTES.ADMIN.SOLICITUDES.DETAIL(solicitud.id_ss)}>Detalle</Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
