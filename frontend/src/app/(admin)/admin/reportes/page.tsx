import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { APP_ROUTES } from '@/constants/routes.constants';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function AdminReportesPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Analitica" title="Reportes" description="Accesos basicos a reportes operativos y financieros." />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
        {[
          ['Ingresos', 'Resumen de pagos y referencias.', APP_ROUTES.ADMIN.REPORTES.INGRESOS],
          ['Solicitudes', 'Estados, volumen y flujo operativo.', APP_ROUTES.ADMIN.REPORTES.SOLICITUDES],
        ].map(([title, description, href]) => (
          <Paper key={title} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>{description}</Typography>
            <Button component={Link} href={href}>Abrir reporte</Button>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
