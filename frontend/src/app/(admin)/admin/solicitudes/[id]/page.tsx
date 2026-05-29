'use client';

import { use } from 'react';
import Link from 'next/link';
import { Alert, Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getSolicitudById } from '@/services/solicitudes.service';

type PageProps = { params: Promise<{ id: string }> };

export default function AdminSolicitudDetallePage({ params }: PageProps) {
  const { id } = use(params);
  const { data: solicitud, loading, error } = useApiData(
    () => getSolicitudById(id),
    [id],
    null,
  );

  if (loading) return <LoadingSpinner />;
  if (!solicitud) return <Alert severity="error">{error ?? 'Solicitud no encontrada'}</Alert>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Detalle solicitud"
        title={solicitud.servicioNombre}
        description={solicitud.direccionResumen}
        chips={[{ label: solicitud.estado }, { label: solicitud.prioridad }]}
        actions={<Button component={Link} href={APP_ROUTES.ADMIN.SOLICITUDES.ASIGNAR_TECNICO(solicitud.id_ss)} variant="contained">Asignar tecnico</Button>}
      />
      <Divider sx={{ mb: 3 }} />
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
          {[
            ['Cliente', solicitud.nombre_cliente ?? solicitud.id_cliente],
            ['Tecnico', solicitud.nombre_tecnico ?? solicitud.id_tecnico ?? 'Sin asignar'],
            ['Servicio', solicitud.id_servicio],
            ['Fecha', new Date(solicitud.fecha_programada ?? solicitud.fecha).toLocaleString('es-CO')],
          ].map(([label, value]) => (
            <Paper key={label} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography sx={{ fontWeight: 800, mt: 0.5 }}>{value}</Typography>
            </Paper>
          ))}
        </Box>
        <Box sx={{ mt: 2 }}><Chip label={`Solicitud ${solicitud.id_ss}`} variant="outlined" /></Box>
      </Paper>
    </Box>
  );
}
