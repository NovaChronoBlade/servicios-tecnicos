'use client';

import { use } from 'react';
import { Alert, Box, Chip, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useApiData } from '@/hooks/useApiData';
import { getUsuarioById } from '@/services/usuarios.service';

type PageProps = { params: Promise<{ id: string }> };

export default function AdminUsuarioDetallePage({ params }: PageProps) {
  const { id } = use(params);
  const { data: user, loading, error } = useApiData(
    () => getUsuarioById(id),
    [id],
    null,
  );

  if (loading) return <LoadingSpinner />;
  if (!user) return <Alert severity="error">{error ?? 'Usuario no encontrado'}</Alert>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Detalle usuario" title={user.nombre} description={user.correo} chips={[{ label: user.rol }, { label: user.activo ? 'Activo' : 'Inactivo' }]} />
      <Divider sx={{ mb: 3 }} />
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
          {[
            ['ID', user.id_usuario],
            ['Documento', user.documento],
            ['Telefono', user.telefono],
            ['Fecha nacimiento', user.fecha_nacimiento],
          ].map(([label, value]) => (
            <Paper key={label} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography sx={{ fontWeight: 800, mt: 0.5 }}>{value}</Typography>
            </Paper>
          ))}
        </Box>
        <Box sx={{ mt: 2 }}><Chip label="Vista administrativa" variant="outlined" /></Box>
      </Paper>
    </Box>
  );
}
