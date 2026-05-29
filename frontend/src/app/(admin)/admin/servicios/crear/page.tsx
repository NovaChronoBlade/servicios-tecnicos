"use client";

import { useState } from 'react';
import { Alert, Box, Button, Divider, MenuItem, Paper, Snackbar, TextField } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useApiData } from '@/hooks/useApiData';
import { getApiErrorMessage } from '@/services/api-error';
import { createServicio, listCategorias } from '@/services/servicios.service';

export default function AdminCrearServicioPage() {
  const { data: categorias, loading, error } = useApiData(listCategorias, [], []);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setSavingError(null);

    try {
      await createServicio({
        nombre: String(form.get('nombre') ?? ''),
        descripcion: String(form.get('descripcion') ?? ''),
        precio: Number(form.get('precio') ?? 0),
        id_categoria: String(form.get('id_categoria') || '') || undefined,
        activo: true,
      });
      event.currentTarget.reset();
      setSaved(true);
    } catch (err) {
      setSavingError(getApiErrorMessage(err, 'No se pudo crear el servicio.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Catalogo" title="Crear servicio" description="Formulario base para registrar un nuevo servicio del catalogo." />
      <Divider sx={{ mb: 3 }} />
      {(error || savingError) ? <Alert severity="error" sx={{ mb: 3 }}>{savingError ?? error}</Alert> : null}
      <Paper component="form" onSubmit={handleSubmit} variant="outlined" sx={{ p: 3, borderRadius: 3, maxWidth: 820, display: 'grid', gap: 2 }}>
        <TextField name="nombre" label="Nombre" required fullWidth />
        <TextField name="descripcion" label="Descripcion" required multiline minRows={4} fullWidth />
        <TextField name="precio" label="Precio" type="number" required fullWidth />
        <TextField select name="id_categoria" label="Categoria" defaultValue="" fullWidth>
          <MenuItem value="">Sin categoria</MenuItem>
          {categorias.map((categoria) => (
            <MenuItem key={categoria.id_categoria} value={categoria.id_categoria}>
              {categoria.nombre}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" disabled={saving}>{saving ? 'Guardando...' : 'Guardar servicio'}</Button>
        </Box>
      </Paper>
      <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Servicio creado" />
    </Box>
  );
}
