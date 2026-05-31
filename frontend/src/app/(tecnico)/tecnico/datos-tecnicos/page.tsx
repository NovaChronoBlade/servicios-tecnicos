'use client';

import Link from 'next/link';
import { Alert, Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getMisDetallesTecnicos } from '@/services/usuarios.service';
import { useAuthStore } from '@/store/authStore';

export default function DatosTecnicosPage() {
  const { user } = useAuthStore();
  const { data: detalles, loading, error } = useApiData(
    () => (user?.id_usuario ? getMisDetallesTecnicos().catch(() => null) : Promise.resolve(null)),
    [user?.id_usuario],
    null,
  );

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Perfil tecnico"
        title="Datos tecnicos"
        description="Informacion profesional visible para administracion y asignacion de solicitudes."
        chips={[{ label: detalles?.disponible ? 'Disponible' : 'No disponible' }]}
        actions={<Button component={Link} href={APP_ROUTES.TECNICO.DATOS_TECNICOS.EDITAR} variant="contained">Editar datos</Button>}
      />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
          {[
            ['Especialidad', detalles?.especialidad ?? 'No disponible'],
            ['Licencia profesional', detalles?.licencia_profesional ?? 'No disponible'],
            ['Calificacion promedio', String(detalles?.calificacion_promedio ?? 0)],
            ['Disponibilidad', detalles?.disponible ? 'Disponible' : 'No disponible'],
          ].map(([label, value]) => (
            <Paper key={label} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, mt: 0.5 }}>{value}</Typography>
            </Paper>
          ))}
        </Box>
        <Box sx={{ mt: 2 }}><Chip label={user?.id_usuario ?? 'Tecnico'} variant="outlined" /></Box>
      </Paper>
    </Box>
  );
}
