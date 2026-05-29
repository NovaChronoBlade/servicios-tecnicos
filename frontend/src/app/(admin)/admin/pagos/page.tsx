'use client';

import { Alert, Box, Chip, Divider, Paper, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useApiData } from '@/hooks/useApiData';
import { listPagosBySolicitud } from '@/services/pagos.service';
import { listSolicitudes } from '@/services/solicitudes.service';

export default function AdminPagosPage() {
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

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Pagos" title="Gestion de pagos" description="Consulta de pagos, estados y referencias." chips={[{ label: `${pagos.length} pagos` }]} />
      <Divider sx={{ mb: 3 }} />
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2 }}>
        {pagos.map((pago) => (
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
