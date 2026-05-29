'use client';

import { Alert, Box, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useApiData } from '@/hooks/useApiData';
import { listPagosBySolicitud } from '@/services/pagos.service';
import { listSolicitudes } from '@/services/solicitudes.service';

export default function AdminReporteIngresosPage() {
  const { data: pagos, loading, error } = useApiData(
    async () => {
      const solicitudes = await listSolicitudes();
      return (await Promise.all(
        solicitudes.map((solicitud) => listPagosBySolicitud(solicitud.id_ss).catch(() => [])),
      )).flat();
    },
    [],
    [],
  );
  const total = pagos.reduce((sum, pago) => sum + Number(pago.monto), 0);

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Reporte" title="Ingresos" description="Resumen basico de pagos registrados." chips={[{ label: `$${total.toLocaleString('es-CO')}` }]} />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        {pagos.map((pago) => (
          <Box key={pago.id_pago} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1.5 }}>
            <Typography>{pago.id_pago}</Typography>
            <Typography sx={{ fontWeight: 800 }}>${Number(pago.monto).toLocaleString('es-CO')}</Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
