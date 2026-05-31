'use client';

import Link from 'next/link';
import { Alert, Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { listServicios, deactivateServicio, activateServicio } from '@/services/servicios.service';
import IconButton from '@mui/material/IconButton';

export default function AdminServiciosPage() {
  const { data: servicios, loading, error, reload } = useApiData(listServicios, [], []);

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Catalogo"
        title="Servicios"
        description="Administracion basica del catalogo y categorias."
        chips={[{ label: `${servicios.length} servicios` }]}
        actions={
          <>
            <Button component={Link} href={APP_ROUTES.ADMIN.SERVICIOS.CREAR} variant="contained">Crear servicio</Button>
            <Button component={Link} href={APP_ROUTES.ADMIN.SERVICIOS.CATEGORIAS} variant="outlined">Categorias</Button>
          </>
        }
      />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
        {servicios.map((servicio) => (
          <Paper key={servicio.id_servicio} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{servicio.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">{servicio.descripcion}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip label={servicio.activo ? 'Activo' : 'Inactivo'} color={servicio.activo ? 'success' : 'default'} />
                <IconButton aria-label="editar" component={Link} href={APP_ROUTES.ADMIN.SERVICIOS.EDITAR(servicio.id_servicio)} size="small">
                  <span style={{ fontSize: 14 }}>Editar</span>
                </IconButton>
                <IconButton
                  aria-label={servicio.activo ? 'desactivar' : 'activar'}
                  onClick={async () => {
                    const ok = window.confirm(servicio.activo ? 'Desactivar servicio?' : 'Reactivar servicio?');
                    if (!ok) return;
                    try {
                      if (servicio.activo) await deactivateServicio(servicio.id_servicio);
                      else await activateServicio(servicio.id_servicio);
                      await reload();
                    } catch (e) {
                      // silenciar; useApiData mostrará error en próxima carga
                      void reload();
                    }
                  }}
                  size="small"
                >
                  <span style={{ fontSize: 14 }}>{servicio.activo ? 'Desactivar' : 'Reactivar'}</span>
                </IconButton>
              </Box>
            </Box>
            <Typography sx={{ mt: 2, fontWeight: 800 }}>${Number(servicio.precio).toLocaleString('es-CO')}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
