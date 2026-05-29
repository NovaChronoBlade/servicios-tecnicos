'use client';

import { use } from 'react';
import { Alert, Box, Chip, Paper, Typography } from '@mui/material';

import { ClientDetailHero } from '@/components/common/ClientPage/ClientDetailHero';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useApiData } from '@/hooks/useApiData';
import { getPagoById } from '@/services/pagos.service';

export default function PagoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: pago, loading, error } = useApiData(
    () => getPagoById(id),
    [id],
    null,
  );

  if (loading) return <LoadingSpinner />;
  if (!pago) return <Alert severity="error">{error ?? 'Pago no encontrado'}</Alert>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientDetailHero
        eyebrow="Movimiento financiero"
        title={`Pago de $${Number(pago.monto).toLocaleString('es-CO')}`}
        description={`Metodo: ${pago.metodo_pago}. Revisa aqui el estado y el contexto de la transaccion.`}
        chips={<Chip label={pago.estado} color={pago.estado === 'pagado' ? 'success' : 'warning'} />}
        facts={[
          { label: 'Monto', value: `$${Number(pago.monto).toLocaleString('es-CO')}`, accent: 'primary' },
          { label: 'Metodo', value: pago.metodo_pago, accent: 'secondary' },
          { label: 'Estado', value: pago.estado, accent: pago.estado === 'pagado' ? 'success' : 'warning' },
          { label: 'Referencia', value: pago.numero_referencia ?? pago.id_pago, accent: 'info' },
        ]}
      />

      <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, mt: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Solicitud</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{pago.id_ss}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Servicio</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{pago.nombre_servicio ?? 'No informado'}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Fecha</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{new Date(pago.fecha_pago).toLocaleString('es-CO')}</Typography>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
}
