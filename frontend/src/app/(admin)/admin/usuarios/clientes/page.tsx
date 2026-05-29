import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { APP_ROUTES } from '@/constants/routes.constants';
import { adminUsersMock } from '@/mocks/admin-pages.mock';
import { UserRole } from '@/types';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function AdminClientesPage() {
  const clientes = adminUsersMock.filter((user) => user.rol === UserRole.CLIENTE);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Clientes" title="Clientes registrados" description="Usuarios que crean solicitudes, pagan y califican servicios." chips={[{ label: `${clientes.length} clientes` }]} />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {clientes.map((user) => (
          <Paper key={user.id_usuario} variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 800 }}>{user.nombre}</Typography>
              <Typography variant="body2" color="text.secondary">{user.telefono}</Typography>
            </Box>
            <Button component={Link} href={APP_ROUTES.ADMIN.USUARIOS.DETAIL(user.id_usuario)}>Detalle</Button>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
