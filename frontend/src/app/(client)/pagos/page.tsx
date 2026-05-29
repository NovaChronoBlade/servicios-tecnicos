"use client";

import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import Link from 'next/link';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { PagoForm, type PagoFormValues } from '@/components/cliente/PagoForm/PagoForm';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getApiErrorMessage } from '@/services/api-error';
import { createPago, listPagosByCliente } from '@/services/pagos.service';
import { useAuthStore } from '@/store/authStore';

export default function PagosPage() {
  const { user } = useAuthStore();
  const { data: payments, setData: setPayments, loading, error, reload } = useApiData(
    () => (user?.id_usuario ? listPagosByCliente(user.id_usuario) : Promise.resolve([])),
    [user?.id_usuario],
    [],
  );
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);

  const pendingPayments = useMemo(
    () => payments.filter((pago) => pago.estado === 'pendiente').length,
    [payments],
  );
  const paidPayments = useMemo(
    () => payments.filter((pago) => pago.estado === 'pagado').length,
    [payments],
  );

  const handleCreatePayment = async (values: PagoFormValues) => {
    setSavingError(null);

    try {
      const created = await createPago({
        id_ss: values.id_ss,
        monto: values.monto,
        metodo_pago: values.metodo_pago,
        token_pago: values.numero_referencia,
      });
      setPayments((current) => [created, ...current]);
      setOpenCreateDialog(false);
      void reload();
    } catch (err) {
      setSavingError(getApiErrorMessage(err, 'No se pudo registrar el pago.'));
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Finanzas"
        title="Pagos"
        description="Consulta el estado de tus transacciones, revisa referencias y manten trazabilidad sobre cada solicitud atendida."
        chips={[
          { label: `${payments.length} registros` },
          { label: `${pendingPayments} pendientes` },
          { label: `${paidPayments} pagados` },
        ]}
        actions={
          <Button variant="contained" onClick={() => setOpenCreateDialog(true)}>
            Agregar pago
          </Button>
        }
      />

      <Divider sx={{ mb: 3 }} />
      {(error || savingError) ? <Alert severity="error" sx={{ mb: 3 }}>{savingError ?? error}</Alert> : null}

      <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Pagos registrados</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>{payments.length}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Pendientes por revisar</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>{pendingPayments}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Pagos confirmados</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>{paidPayments}</Typography>
          </Paper>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {payments.map((pago) => (
          <Paper key={pago.id_pago} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'start' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>${Number(pago.monto).toLocaleString('es-CO')}</Typography>
                <Typography variant="body2" color="text.secondary">{pago.metodo_pago}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  Referencia: {pago.numero_referencia ?? 'Pendiente de confirmacion'}
                </Typography>
              </Box>
              <Chip label={pago.estado} color={pago.estado === 'pagado' ? 'success' : 'warning'} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                Fecha: {new Date(pago.fecha_pago).toLocaleDateString('es-CO')}
              </Typography>
              <Button component={Link} href={APP_ROUTES.CLIENT.PAGOS.DETAIL(pago.id_pago)} size="small">
                Ver detalle
              </Button>
            </Box>
          </Paper>
        ))}
        {payments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No tienes pagos registrados.</Typography>
        ) : null}
      </Box>

      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Registrar pago</DialogTitle>
        <DialogContent>
          <PagoForm onSubmit={handleCreatePayment} onCancel={() => setOpenCreateDialog(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
