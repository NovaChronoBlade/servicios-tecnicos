"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, Divider, Paper, Snackbar } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { DatosTecnicosForm, type DatosTecnicosFormValues } from '@/components/tecnico/DatosTecnicosForm/DatosTecnicosForm';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getApiErrorMessage } from '@/services/api-error';
import {
  createDetallesTecnicos,
  getMisDetallesTecnicos,
  updateDetallesTecnicos,
} from '@/services/usuarios.service';
import { useAuthStore } from '@/store/authStore';

export default function EditarDatosTecnicosPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);

  const { data: detalles, loading } = useApiData(
    () => (user?.id_usuario ? getMisDetallesTecnicos().catch(() => null) : Promise.resolve(null)),
    [user?.id_usuario],
    null,
  );

  const initialValues: DatosTecnicosFormValues = {
    especialidad: detalles?.especialidad ?? '',
    licencia_profesional: detalles?.licencia_profesional ?? '',
    zonaCobertura: detalles?.zona_cobertura ?? '',
    bio: detalles?.bio ?? '',
    disponible: Boolean(detalles?.disponible ?? true),
  };

  const handleSubmit = async (values: DatosTecnicosFormValues) => {
    if (!user?.id_usuario) return;
    setSavingError(null);

    const payload = {
      especialidad: values.especialidad,
      licencia_profesional: values.licencia_profesional,
      disponible: values.disponible,
    };

    try {
      await updateDetallesTecnicos(user.id_usuario, payload);
      setSaved(true);
    } catch (err) {
      try {
        await createDetallesTecnicos(user.id_usuario, payload);
        setSaved(true);
      } catch {
        setSavingError(getApiErrorMessage(err, 'No se pudieron guardar los datos tecnicos.'));
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Edicion" title="Editar datos tecnicos" description="Ajusta especialidad, licencia y disponibilidad." />
      <Divider sx={{ mb: 3 }} />
      {savingError ? <Alert severity="error" sx={{ mb: 3 }}>{savingError}</Alert> : null}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, maxWidth: 900 }}>
        <DatosTecnicosForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={() => router.push(APP_ROUTES.TECNICO.DATOS_TECNICOS.ROOT)}
        />
      </Paper>
      <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Datos tecnicos guardados" />
    </Box>
  );
}
