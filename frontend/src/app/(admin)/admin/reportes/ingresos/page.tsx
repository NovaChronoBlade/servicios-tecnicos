import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { clientPaymentsMock } from '@/mocks/client-pages.mock';
import { Box, Divider, Paper, Typography } from '@mui/material';

export default function AdminReporteIngresosPage() {
  const total = clientPaymentsMock.reduce((sum, pago) => sum + Number(pago.monto), 0);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Reporte" title="Ingresos" description="Resumen basico de pagos registrados." chips={[{ label: `$${total.toLocaleString('es-CO')}` }]} />
      <Divider sx={{ mb: 3 }} />
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        {clientPaymentsMock.map((pago) => (
          <Box key={pago.id_pago} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1.5 }}>
            <Typography>{pago.id_pago}</Typography>
            <Typography sx={{ fontWeight: 800 }}>${Number(pago.monto).toLocaleString('es-CO')}</Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
