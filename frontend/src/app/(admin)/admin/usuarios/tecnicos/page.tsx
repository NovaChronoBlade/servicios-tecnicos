import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { APP_ROUTES } from '@/constants/routes.constants';
import { adminUsersMock } from '@/mocks/admin-pages.mock';
import { topTechniciansMock } from '@/mocks/client-pages.mock';
import { UserRole } from '@/types';
import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function AdminTecnicosPage() {
  const tecnicos = adminUsersMock.filter((user) => user.rol === UserRole.TECNICO);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Tecnicos" title="Tecnicos registrados" description="Seguimiento de disponibilidad, reputacion y datos tecnicos." chips={[{ label: `${tecnicos.length} tecnicos` }]} />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {tecnicos.map((user) => {
          const score = topTechniciansMock.find((item) => item.id_tecnico === user.id_usuario);
          return (
            <Paper key={user.id_usuario} variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography sx={{ fontWeight: 800 }}>{user.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">{user.correo}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip label={score ? `${score.promedio} / 5` : 'Sin promedio'} color="primary" variant="outlined" />
                <Button component={Link} href={APP_ROUTES.ADMIN.USUARIOS.DETAIL(user.id_usuario)}>Detalle</Button>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
