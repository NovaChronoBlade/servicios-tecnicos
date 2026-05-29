'use client';

import { Alert, Box, Chip, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useApiData } from '@/hooks/useApiData';
import { listCategorias, listServicios } from '@/services/servicios.service';

export default function AdminCategoriasPage() {
  const { data, loading, error } = useApiData(
    async () => {
      const [categorias, servicios] = await Promise.all([listCategorias(), listServicios()]);
      return { categorias, servicios };
    },
    [],
    { categorias: [], servicios: [] },
  );

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Catalogo" title="Categorias de servicios" description="Agrupaciones del catalogo de servicios." chips={[{ label: `${data.categorias.length} categorias` }]} />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
        {data.categorias.map((categoria) => {
          const count = data.servicios.filter((servicio) => servicio.id_categoria === categoria.id_categoria).length;

          return (
            <Paper key={categoria.id_categoria} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{categoria.nombre}</Typography>
                  <Typography variant="body2" color="text.secondary">{categoria.descripcion ?? 'Sin descripcion'}</Typography>
                </Box>
                <Chip label={`${count} servicios`} />
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
