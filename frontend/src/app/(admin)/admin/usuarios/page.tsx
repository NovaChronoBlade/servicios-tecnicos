import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { APP_ROUTES } from '@/constants/routes.constants';
import { adminSummaryMock, adminUsersMock } from '@/mocks/admin-pages.mock';
import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function AdminUsuariosPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Usuarios"
        title="Gestion de usuarios"
        description="Consulta clientes, tecnicos y administradores registrados."
        chips={[{ label: `${adminSummaryMock.clientes} clientes` }, { label: `${adminSummaryMock.tecnicos} tecnicos` }]}
        actions={
          <>
            <Button component={Link} href={APP_ROUTES.ADMIN.USUARIOS.CLIENTES} variant="contained">Clientes</Button>
            <Button component={Link} href={APP_ROUTES.ADMIN.USUARIOS.TECNICOS} variant="outlined">Tecnicos</Button>
          </>
        }
      />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {adminUsersMock.map((user) => (
          <Paper key={user.id_usuario} variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{user.nombre}</Typography>
              <Typography variant="body2" color="text.secondary">{user.correo}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip label={user.rol} />
              <Button component={Link} href={APP_ROUTES.ADMIN.USUARIOS.DETAIL(user.id_usuario)} size="small">Ver</Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
