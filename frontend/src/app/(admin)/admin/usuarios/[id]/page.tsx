import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { getAdminUserById } from '@/mocks/admin-pages.mock';
import { Box, Chip, Divider, Paper, Typography } from '@mui/material';

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminUsuarioDetallePage({ params }: PageProps) {
  const { id } = await params;
  const user = getAdminUserById(id);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Detalle usuario" title={user.nombre} description={user.correo} chips={[{ label: user.rol }, { label: user.activo ? 'Activo' : 'Inactivo' }]} />
      <Divider sx={{ mb: 3 }} />
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
          {[
            ['ID', user.id_usuario],
            ['Documento', user.documento],
            ['Telefono', user.telefono],
            ['Fecha nacimiento', user.fecha_nacimiento],
          ].map(([label, value]) => (
            <Paper key={label} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography sx={{ fontWeight: 800, mt: 0.5 }}>{value}</Typography>
            </Paper>
          ))}
        </Box>
        <Box sx={{ mt: 2 }}><Chip label="Vista administrativa basica" variant="outlined" /></Box>
      </Paper>
    </Box>
  );
}
