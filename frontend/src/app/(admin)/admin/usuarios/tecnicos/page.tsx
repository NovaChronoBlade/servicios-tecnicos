'use client';

import Link from 'next/link';
import { Alert, Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { listTecnicos } from '@/services/usuarios.service';

export default function AdminTecnicosPage() {
  const { data: tecnicos, loading, error } = useApiData(listTecnicos, [], []);

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Tecnicos" title="Tecnicos registrados" description="Seguimiento de disponibilidad, reputacion y datos tecnicos." chips={[{ label: `${tecnicos.length} tecnicos` }]} />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2 }}>
        {tecnicos.map((user) => (
          <Paper key={user.id_usuario} variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography sx={{ fontWeight: 800 }}>{user.nombre}</Typography>
              <Typography variant="body2" color="text.secondary">{user.correo}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip label={`${Number(user.calificacion_promedio ?? 0).toFixed(1)} / 5`} color="primary" variant="outlined" />
              <Button component={Link} href={APP_ROUTES.ADMIN.USUARIOS.DETAIL(user.id_usuario)}>Detalle</Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
