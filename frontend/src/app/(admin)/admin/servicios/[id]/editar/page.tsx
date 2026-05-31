"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Alert, Box, Button, Divider, MenuItem, Paper, Snackbar, TextField } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useApiData } from '@/hooks/useApiData';
import { getApiErrorMessage } from '@/services/api-error';
import { getServicioById, updateServicio, listCategorias } from '@/services/servicios.service';

export default function AdminEditarServicioPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();

  const { data: categorias, loading: loadingCats } = useApiData(listCategorias, [], []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [values, setValues] = useState({ nombre: '', descripcion: '', precio: '', id_categoria: '' });

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const servicio = await getServicioById(id);
        if (!mounted) return;
        setValues({
          nombre: servicio.nombre ?? '',
          descripcion: servicio.descripcion ?? '',
          precio: String(servicio.precio ?? ''),
          id_categoria: servicio.id_categoria ?? '' as string,
        });
      } catch (err) {
        setError(getApiErrorMessage(err, 'No se pudo cargar el servicio.'));
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;
    const formEl = event.currentTarget as HTMLFormElement;
    const form = new FormData(formEl);

    setSaving(true);
    setError(null);

    try {
      await updateServicio(id, {
        nombre: String(form.get('nombre') ?? ''),
        descripcion: String(form.get('descripcion') ?? ''),
        precio: Number(form.get('precio') ?? 0),
        id_categoria: String(form.get('id_categoria') || '') || undefined,
      });
      setSaved(true);
      // volver al listado para ver el cambio
      router.push('/admin/servicios');
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo actualizar el servicio.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingCats) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Catalogo" title="Editar servicio" description="Editar los datos del servicio." />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Paper component="form" onSubmit={handleSubmit} variant="outlined" sx={{ p: 3, borderRadius: 3, maxWidth: 820, display: 'grid', gap: 2 }}>
        <TextField name="nombre" label="Nombre" required fullWidth defaultValue={values.nombre} />
        <TextField name="descripcion" label="Descripcion" required multiline minRows={4} fullWidth defaultValue={values.descripcion} />
        <TextField name="precio" label="Precio" type="number" required fullWidth defaultValue={values.precio} />
        <TextField select name="id_categoria" label="Categoria" value={values.id_categoria} onChange={(e) => setValues(v => ({ ...v, id_categoria: e.target.value }))} fullWidth>
          <MenuItem value="">Sin categoria</MenuItem>
          {categorias.map((categoria: any) => (
            <MenuItem key={categoria.id_categoria} value={categoria.id_categoria}>
              {categoria.nombre}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</Button>
        </Box>
      </Paper>
      <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Servicio actualizado" />
    </Box>
  );
}
