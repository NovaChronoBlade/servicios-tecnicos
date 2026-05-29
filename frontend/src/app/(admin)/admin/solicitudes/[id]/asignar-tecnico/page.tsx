"use client";

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { getAdminSolicitudById } from '@/mocks/admin-pages.mock';
import { topTechniciansMock } from '@/mocks/client-pages.mock';
import { Box, Button, Chip, Divider, Paper, Snackbar, Typography } from '@mui/material';
import { use, useState } from 'react';

type PageProps = { params: Promise<{ id: string }> };

export default function AdminAsignarTecnicoPage({ params }: PageProps) {
  const { id } = use(params);
  const solicitud = getAdminSolicitudById(id);
  const [saved, setSaved] = useState(false);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Reasignacion" title="Asignar tecnico" description={solicitud.servicioNombre} />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {topTechniciansMock.map((tecnico) => (
          <Paper key={tecnico.id_tecnico} variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography sx={{ fontWeight: 800 }}>{tecnico.nombre}</Typography>
              <Typography variant="body2" color="text.secondary">{tecnico.total_calificaciones} calificaciones</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip label={`${tecnico.promedio} / 5`} color="primary" variant="outlined" />
              <Button variant="contained" onClick={() => setSaved(true)}>Asignar</Button>
            </Box>
          </Paper>
        ))}
      </Box>
      <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Tecnico asignado localmente" />
    </Box>
  );
}
