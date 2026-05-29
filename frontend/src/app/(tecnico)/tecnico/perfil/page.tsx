import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { APP_ROUTES } from '@/constants/routes.constants';
import { tecnicoPerfilMock } from '@/mocks/tecnico-pages.mock';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function TecnicoPerfilPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Cuenta"
        title={tecnicoPerfilMock.nombre}
        description={tecnicoPerfilMock.correo}
        chips={[{ label: tecnicoPerfilMock.rol }, { label: tecnicoPerfilMock.activo ? 'Activo' : 'Inactivo' }]}
        actions={<Button component={Link} href={APP_ROUTES.TECNICO.DATOS_TECNICOS.EDITAR} variant="contained">Editar perfil tecnico</Button>}
      />
      <Divider sx={{ mb: 3 }} />
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
          {[
            ['Documento', tecnicoPerfilMock.documento],
            ['Telefono', tecnicoPerfilMock.telefono],
            ['Nacimiento', tecnicoPerfilMock.fecha_nacimiento],
            ['Zona', tecnicoPerfilMock.zonaCobertura],
          ].map(([label, value]) => (
            <Paper key={label} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, mt: 0.5 }}>{value}</Typography>
            </Paper>
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>{tecnicoPerfilMock.bio}</Typography>
      </Paper>
    </Box>
  );
}
