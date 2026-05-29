"use client";

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { Box, Button, Divider, MenuItem, Paper, Snackbar, TextField } from '@mui/material';
import { useState } from 'react';

export default function AdminCrearServicioPage() {
  const [saved, setSaved] = useState(false);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Catalogo" title="Crear servicio" description="Formulario base para registrar un nuevo servicio del catalogo." />
      <Divider sx={{ mb: 3 }} />
      <Paper component="form" onSubmit={(event) => { event.preventDefault(); setSaved(true); }} variant="outlined" sx={{ p: 3, borderRadius: 3, maxWidth: 820, display: 'grid', gap: 2 }}>
        <TextField label="Nombre" fullWidth />
        <TextField label="Descripcion" multiline minRows={4} fullWidth />
        <TextField label="Precio" type="number" fullWidth />
        <TextField select label="Categoria" defaultValue="cat-clima" fullWidth>
          <MenuItem value="cat-clima">Climatizacion</MenuItem>
          <MenuItem value="cat-elec">Electricidad</MenuItem>
          <MenuItem value="cat-plom">Plomeria</MenuItem>
        </TextField>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">Guardar servicio</Button>
        </Box>
      </Paper>
      <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Servicio guardado localmente" />
    </Box>
  );
}
