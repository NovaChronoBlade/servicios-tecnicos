'use client';

import Link from 'next/link';
import { Alert, Box, Button, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getPromedioTecnico } from '@/services/calificaciones.service';
import { getUsuarioById } from '@/services/usuarios.service';
import { useAuthStore } from '@/store/authStore';

export default function TecnicoPerfilPage() {
  const { user } = useAuthStore();
  const { data, loading, error } = useApiData(
    async () => {
      if (!user?.id_usuario) return { profile: null, promedio: null };
      const [profile, promedio] = await Promise.all([
        getUsuarioById(user.id_usuario),
        getPromedioTecnico(user.id_usuario).catch(() => null),
      ]);
      return { profile, promedio };
    },
    [user?.id_usuario],
    { profile: null, promedio: null },
  );

  if (loading) return <LoadingSpinner />;
  if (!data.profile) return <Alert severity="error">{error ?? 'Perfil no disponible'}</Alert>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Cuenta"
        title={data.profile.nombre}
        description={data.profile.correo}
        chips={[{ label: data.profile.rol }, { label: data.profile.activo ? 'Activo' : 'Inactivo' }]}
        actions={<Button component={Link} href={APP_ROUTES.TECNICO.DATOS_TECNICOS.EDITAR} variant="contained">Editar perfil tecnico</Button>}
      />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
          {[
            ['Documento', data.profile.documento],
            ['Telefono', data.profile.telefono],
            ['Nacimiento', data.profile.fecha_nacimiento],
            ['Especialidad', data.promedio?.especialidad ?? 'Sin datos tecnicos publicados'],
            ['Calificacion promedio', String(data.promedio?.promedio ?? 0)],
            ['Total calificaciones', String(data.promedio?.total_calificaciones ?? 0)],
          ].map(([label, value]) => (
            <Paper key={label} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, mt: 0.5 }}>{value}</Typography>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
