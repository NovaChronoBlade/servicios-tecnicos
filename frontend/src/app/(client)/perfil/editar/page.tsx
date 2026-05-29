'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, Paper, TextField, Typography, Button, Snackbar } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getApiErrorMessage } from '@/services/api-error';
import { getUsuarioById, updateUsuario } from '@/services/usuarios.service';
import { useAuthStore } from '@/store/authStore';

export default function PerfilEditarPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: profile, loading, error, reload } = useApiData(
    () => (user?.id_usuario ? getUsuarioById(user.id_usuario) : Promise.resolve(null)),
    [user?.id_usuario],
    null,
  );
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setNombre(profile.nombre);
    setCorreo(profile.correo);
    setTelefono(profile.telefono);
  }, [profile]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;

    setSaving(true);
    setSavingError(null);
    try {
      await updateUsuario(profile.id_usuario, { nombre, correo, telefono });
      setSaved(true);
      void reload();
    } catch (err) {
      setSavingError(getApiErrorMessage(err, 'No se pudo actualizar el perfil.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!profile) return <Alert severity="error">{error ?? 'Perfil no disponible'}</Alert>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Edicion"
        title="Editar perfil"
        description="Actualiza tus datos basicos y manten tu cuenta al dia."
      />

      {(error || savingError) ? <Alert severity="error" sx={{ mt: 3 }}>{savingError ?? error}</Alert> : null}

      <Box sx={{ display: 'grid', gap: 3, mt: 3, gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.1fr) minmax(300px, 0.9fr)' } }}>
        <Paper component="form" onSubmit={handleSubmit} variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Nombre" value={nombre} onChange={(event) => setNombre(event.target.value)} fullWidth />
            <TextField label="Correo" value={correo} onChange={(event) => setCorreo(event.target.value)} fullWidth />
            <TextField label="Telefono" value={telefono} onChange={(event) => setTelefono(event.target.value)} fullWidth />
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button type="submit" variant="contained" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</Button>
              <Button variant="outlined" onClick={() => router.push(APP_ROUTES.CLIENT.PERFIL.ROOT)}>Volver</Button>
            </Box>
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
          <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 800 }} color="text.secondary">
            Perfil conectado
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>{profile.nombre}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25, mb: 2.25 }}>
            Estos datos se usan en solicitudes, pagos y notificaciones.
          </Typography>

          <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' } }}>
            {[
              ['Correo', profile.correo],
              ['Telefono', profile.telefono],
              ['Documento', profile.documento],
              ['Rol', profile.rol],
            ].map(([label, value]) => (
              <Paper key={label} variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5, overflowWrap: 'anywhere' }}>{value}</Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Box>
      <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Perfil actualizado" />
    </Box>
  );
}
