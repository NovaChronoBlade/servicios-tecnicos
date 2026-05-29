'use client';

import Link from 'next/link';
import { Alert, Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getPromedioTecnico } from '@/services/calificaciones.service';
import { useAuthStore } from '@/store/authStore';

export default function DatosTecnicosPage() {
  const { user } = useAuthStore();
  const { data: promedio, loading, error } = useApiData(
    () => (user?.id_usuario ? getPromedioTecnico(user.id_usuario).catch(() => null) : Promise.resolve(null)),
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
        chips={[{ label: promedio?.disponible ? 'Disponible' : 'Disponibilidad sin lectura directa' }]}
        actions={<Button component={Link} href={APP_ROUTES.TECNICO.DATOS_TECNICOS.EDITAR} variant="contained">Editar datos</Button>}
      />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
          {[
            ['Especialidad', promedio?.especialidad ?? 'No disponible'],
            ['Calificacion promedio', String(promedio?.promedio ?? 0)],
            ['Total calificaciones', String(promedio?.total_calificaciones ?? 0)],
            ['Disponibilidad', promedio?.disponible === undefined ? 'No expuesta por endpoint de perfil tecnico' : (promedio.disponible ? 'Disponible' : 'No disponible')],
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
