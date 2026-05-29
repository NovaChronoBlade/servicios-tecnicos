import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { clientPaymentsMock } from '@/mocks/client-pages.mock';
import { Box, Chip, Divider, Paper, Typography } from '@mui/material';

export default function AdminPagosPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Pagos" title="Gestion de pagos" description="Consulta de pagos, estados y referencias." chips={[{ label: `${clientPaymentsMock.length} pagos` }]} />
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'grid', gap: 2 }}>
        {clientPaymentsMock.map((pago) => (
          <Paper key={pago.id_pago} variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 800 }}>${Number(pago.monto).toLocaleString('es-CO')}</Typography>
              <Typography variant="body2" color="text.secondary">{pago.metodo_pago} - {pago.numero_referencia ?? 'Sin referencia'}</Typography>
            </Box>
            <Chip label={pago.estado} color={pago.estado === 'pagado' ? 'success' : 'warning'} />
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
