'use client';

import Link from 'next/link';
import { Alert, Box, Button, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { listUsuarios } from '@/services/usuarios.service';
import { UserRole } from '@/types';

export default function AdminClientesPage() {
  const { data: users, loading, error } = useApiData(
    () => listUsuarios({ rol: UserRole.CLIENTE }),
    [],
    [],
  );

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Clientes" title="Clientes registrados" description="Usuarios que crean solicitudes, pagan y califican servicios." chips={[{ label: `${users.length} clientes` }]} />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2 }}>
        {users.map((user) => (
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
