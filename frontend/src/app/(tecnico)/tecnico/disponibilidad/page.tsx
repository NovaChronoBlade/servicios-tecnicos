"use client";

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { DisponibilidadForm, type DisponibilidadFormValues } from '@/components/tecnico/DisponibilidadForm/DisponibilidadForm';
import { tecnicoDisponibilidadMock } from '@/mocks/tecnico-pages.mock';
import { Box, Chip, Divider, Paper, Snackbar, Typography } from '@mui/material';
import { useState } from 'react';

export default function TecnicoDisponibilidadPage() {
  const [saved, setSaved] = useState(false);
  const initialValues: DisponibilidadFormValues = tecnicoDisponibilidadMock[0];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Agenda" title="Disponibilidad" description="Define bloques de atencion y consulta tu agenda semanal." />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '0.75fr 1fr' } }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <DisponibilidadForm initialValues={initialValues} onSubmit={() => setSaved(true)} />
        </Paper>
        <Box sx={{ display: 'grid', gap: 2 }}>
          {tecnicoDisponibilidadMock.map((slot) => (
            <Paper key={slot.dia} variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{slot.dia}</Typography>
                <Typography variant="body2" color="text.secondary">{slot.inicio} - {slot.fin}</Typography>
                <Typography variant="caption" color="text.secondary">{slot.nota}</Typography>
              </Box>
              <Chip label={slot.activa ? 'Activa' : 'Inactiva'} color={slot.activa ? 'success' : 'default'} />
            </Paper>
          ))}
        </Box>
      </Box>
      <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Disponibilidad guardada localmente" />
    </Box>
  );
}
