"use client";

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { DatosTecnicosForm, type DatosTecnicosFormValues } from '@/components/tecnico/DatosTecnicosForm/DatosTecnicosForm';
import { APP_ROUTES } from '@/constants/routes.constants';
import { tecnicoPerfilMock } from '@/mocks/tecnico-pages.mock';
import { Box, Divider, Paper, Snackbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EditarDatosTecnicosPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const initialValues: DatosTecnicosFormValues = {
    especialidad: tecnicoPerfilMock.especialidad,
    licencia_profesional: tecnicoPerfilMock.licencia_profesional,
    zonaCobertura: tecnicoPerfilMock.zonaCobertura,
    bio: tecnicoPerfilMock.bio,
    disponible: tecnicoPerfilMock.disponible,
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Edicion" title="Editar datos tecnicos" description="Ajusta especialidad, licencia, zona de cobertura y disponibilidad." />
      <Divider sx={{ mb: 3 }} />
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, maxWidth: 900 }}>
        <DatosTecnicosForm initialValues={initialValues} onSubmit={() => setSaved(true)} onCancel={() => router.push(APP_ROUTES.TECNICO.DATOS_TECNICOS.ROOT)} />
      </Paper>
      <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Datos guardados localmente" />
    </Box>
  );
}
