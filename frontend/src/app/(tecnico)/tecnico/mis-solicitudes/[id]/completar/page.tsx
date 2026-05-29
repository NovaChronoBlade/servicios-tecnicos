"use client";

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { CompletarServicioForm, type CompletarServicioFormValues } from '@/components/tecnico/CompletarServicioForm/CompletarServicioForm';
import { APP_ROUTES } from '@/constants/routes.constants';
import { getSolicitudAsignadaById } from '@/mocks/tecnico-pages.mock';
import { Box, Divider, Paper, Snackbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';

type PageProps = { params: Promise<{ id: string }> };

export default function CompletarSolicitudPage({ params }: PageProps) {
  const { id } = use(params);
  const solicitud = getSolicitudAsignadaById(id);
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const handleSubmit = (_values: CompletarServicioFormValues) => {
    setSaved(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Cierre operativo" title={`Completar ${solicitud.id_ss}`} description={solicitud.servicioNombre} />
      <Divider sx={{ mb: 3 }} />
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, maxWidth: 900 }}>
        <CompletarServicioForm onSubmit={handleSubmit} onCancel={() => router.push(APP_ROUTES.TECNICO.MIS_SOLICITUDES.DETAIL(solicitud.id_ss))} />
      </Paper>
      <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Cierre guardado localmente" />
    </Box>
  );
}
