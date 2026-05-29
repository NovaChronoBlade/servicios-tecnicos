import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { adminCategoriasMock } from '@/mocks/admin-pages.mock';
import { Box, Chip, Divider, Paper, Typography } from '@mui/material';

export default function AdminCategoriasPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Catalogo" title="Categorias de servicios" description="Agrupaciones del catalogo de servicios." chips={[{ label: `${adminCategoriasMock.length} categorias` }]} />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
        {adminCategoriasMock.map((categoria) => (
          <Paper key={categoria.id_categoria} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{categoria.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">{categoria.descripcion}</Typography>
              </Box>
              <Chip label={`${categoria.servicios} servicios`} />
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
