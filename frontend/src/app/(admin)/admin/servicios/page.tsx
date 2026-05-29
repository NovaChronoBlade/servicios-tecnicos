import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { APP_ROUTES } from '@/constants/routes.constants';
import { clientServicesMock } from '@/mocks/client-pages.mock';
import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function AdminServiciosPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Catalogo"
        title="Servicios"
        description="Administracion basica del catalogo y categorias."
        chips={[{ label: `${clientServicesMock.length} servicios` }]}
        actions={
          <>
            <Button component={Link} href={APP_ROUTES.ADMIN.SERVICIOS.CREAR} variant="contained">Crear servicio</Button>
            <Button component={Link} href={APP_ROUTES.ADMIN.SERVICIOS.CATEGORIAS} variant="outlined">Categorias</Button>
          </>
        }
      />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
        {clientServicesMock.map((servicio) => (
          <Paper key={servicio.id_servicio} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{servicio.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">{servicio.descripcion}</Typography>
              </Box>
              <Chip label={servicio.activo ? 'Activo' : 'Inactivo'} color={servicio.activo ? 'success' : 'default'} />
            </Box>
            <Typography sx={{ mt: 2, fontWeight: 800 }}>${Number(servicio.precio).toLocaleString('es-CO')}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
