'use client';

import Link from 'next/link';
import { Alert, Box, Button, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getUsuarioById } from '@/services/usuarios.service';
import { useAuthStore } from '@/store/authStore';

export default function PerfilPage() {
  const { user } = useAuthStore();
  const { data: profile, loading, error } = useApiData(
    () => (user?.id_usuario ? getUsuarioById(user.id_usuario) : Promise.resolve(null)),
    [user?.id_usuario],
    null,
  );

  if (loading) return <LoadingSpinner />;
  if (!profile) return <Alert severity="error">{error ?? 'Perfil no disponible'}</Alert>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Cuenta"
        title={profile.nombre}
        description={profile.correo}
        actions={
          <Button component={Link} href={APP_ROUTES.CLIENT.PERFIL.EDITAR} variant="contained">
            Editar perfil
          </Button>
        }
      />

      <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, mt: 3 }}>
        <Typography variant="body1" color="text.secondary">{profile.telefono}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Documento: {profile.documento}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Rol: {profile.rol}</Typography>
      </Paper>
    </Box>
  );
}
