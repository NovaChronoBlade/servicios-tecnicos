'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { CheckCircle2, CreditCard, Star, UserCheck } from 'lucide-react';

import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getApiErrorMessage } from '@/services/api-error';
import { listDirecciones } from '@/services/direcciones.service';
import { getServicioById, type ServicioListItem } from '@/services/servicios.service';
import { checkoutSolicitud } from '@/services/solicitudes.service';
import { listTecnicos, type TecnicoListItem } from '@/services/usuarios.service';
import { useAuthStore } from '@/store/authStore';
import type { Direccion } from '@/types';

const paymentMethods = ['Tarjeta', 'Nequi', 'PSE', 'Transferencia'];

function formatCardNumber(value: string) {
  const onlyDigits = value.replace(/\D/g, '').slice(0, 16);
  return onlyDigits.replace(/(.{4})/g, '$1 ').trim();
}

export default function SolicitarServicioDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data, loading, error } = useApiData<{
    servicio: ServicioListItem | null;
    direcciones: Direccion[];
    tecnicos: TecnicoListItem[];
  }>(
    async () => {
      const [servicio, direcciones, tecnicos] = await Promise.all([
        getServicioById(id),
        listDirecciones(),
        listTecnicos({ disponible: true }),
      ]);

      return { servicio, direcciones, tecnicos };
    },
    [id],
    { servicio: null, direcciones: [], tecnicos: [] },
  );

  useEffect(() => {
    if (!selectedAddress) {
      setSelectedAddress(data.direcciones.find((direccion) => direccion.es_default)?.id_direccion ?? data.direcciones[0]?.id_direccion ?? '');
    }
  }, [data.direcciones, selectedAddress]);

  useEffect(() => {
    if (!selectedTechnician) {
      setSelectedTechnician(data.tecnicos[0]?.id_usuario ?? '');
    }
  }, [data.tecnicos, selectedTechnician]);

  const selectedTechnicianInfo = useMemo(
    () => data.tecnicos.find((tecnico) => tecnico.id_usuario === selectedTechnician),
    [data.tecnicos, selectedTechnician],
  );

  const price = Number(data.servicio?.precio ?? 0);
  const isCardPayment = paymentMethod === 'Tarjeta';
  const cardToken = isCardPayment
    ? `CARD-${cardNumber.replace(/\s/g, '').slice(-4)}-${cardHolder.trim().replace(/\s+/g, '-').toUpperCase()}`
    : `${paymentMethod.toUpperCase()}-${Date.now().toString().slice(-6)}`;

  const canSubmit =
    Boolean(user?.id_usuario) &&
    Boolean(selectedAddress) &&
    Boolean(selectedTechnician) &&
    price > 0 &&
    (!isCardPayment || (cardNumber.replace(/\s/g, '').length === 16 && cardHolder.trim().length >= 6));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!user?.id_usuario || !canSubmit) return;

    setSubmitting(true);
    try {
      const result = await checkoutSolicitud({
        id_cliente: user.id_usuario,
        id_servicio: id,
        id_direccion: selectedAddress,
        id_tecnico: selectedTechnician,
        fecha_programada: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
        metodo_pago: paymentMethod,
        token_pago: cardToken,
        moneda: 'COP',
      });

      router.push(`${APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.SUCCESS}?id=${result.solicitud.id_ss}`);
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'No se pudo completar el pago y crear la solicitud.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!data.servicio) return <Alert severity="error">{error ?? 'Servicio no encontrado'}</Alert>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Checkout"
        title={data.servicio.nombre}
        description={data.servicio.descripcion}
        chips={[
          { label: `$${price.toLocaleString('es-CO')}`, color: 'success' },
          { label: `${data.tecnicos.length} tecnicos disponibles` },
        ]}
      />

      <Divider sx={{ mb: 3 }} />
      {(error || submitError) ? <Alert severity="error" sx={{ mb: 3 }}>{submitError ?? error}</Alert> : null}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 380px' }, alignItems: 'start' }}>
        <Box sx={{ display: 'grid', gap: 3 }}>
          <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Tecnico</Typography>
            <Box sx={{ display: 'grid', gap: 2, mt: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
              {data.tecnicos.map((tecnico) => {
                const selected = selectedTechnician === tecnico.id_usuario;
                return (
                  <Paper
                    key={tecnico.id_usuario}
                    variant="outlined"
                    onClick={() => setSelectedTechnician(tecnico.id_usuario)}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      cursor: 'pointer',
                      borderColor: selected ? 'primary.main' : 'divider',
                      bgcolor: selected ? 'action.hover' : 'background.paper',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 800 }}>{tecnico.nombre}</Typography>
                        <Typography variant="body2" color="text.secondary">{tecnico.especialidad}</Typography>
                      </Box>
                      {selected ? <CheckCircle2 size={20} /> : <UserCheck size={20} />}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
                      <Chip size="small" icon={<Star size={14} />} label={`${Number(tecnico.calificacion_promedio ?? 0).toFixed(1)} / 5`} />
                      <Chip size="small" label="Disponible" color="success" variant="outlined" />
                    </Box>
                  </Paper>
                );
              })}
              {data.tecnicos.length === 0 ? (
                <Alert severity="warning" sx={{ gridColumn: '1 / -1' }}>
                  No hay tecnicos disponibles para crear la solicitud en este momento.
                </Alert>
              ) : null}
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Direccion y agenda</Typography>
            <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
              <TextField
                select
                label="Direccion de servicio"
                value={selectedAddress}
                onChange={(event) => setSelectedAddress(event.target.value)}
                required
                fullWidth
                helperText={data.direcciones.length === 0 ? 'Crea una direccion antes de solicitar el servicio.' : 'Direccion asociada al servicio.'}
              >
                {data.direcciones.map((direccion) => (
                  <MenuItem key={direccion.id_direccion} value={direccion.id_direccion}>
                    {direccion.direccion}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Fecha programada"
                type="datetime-local"
                value={scheduledAt}
                onChange={(event) => setScheduledAt(event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
              />
            </Box>
          </Paper>
        </Box>

        <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2, position: { lg: 'sticky' }, top: 24 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Pago</Typography>
          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography color="text.secondary">Precio estimado</Typography>
              <Typography sx={{ fontWeight: 900 }}>${price.toLocaleString('es-CO')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography color="text.secondary">Tecnico</Typography>
              <Typography sx={{ fontWeight: 700, textAlign: 'right' }}>{selectedTechnicianInfo?.nombre ?? 'Pendiente'}</Typography>
            </Box>

            <TextField select label="Metodo de pago" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} fullWidth>
              {paymentMethods.map((method) => (
                <MenuItem key={method} value={method}>{method}</MenuItem>
              ))}
            </TextField>

            {isCardPayment ? (
              <>
                <TextField
                  label="Numero de tarjeta"
                  value={cardNumber}
                  onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                  helperText="Ejemplo: 4242 4242 4242 4242"
                  fullWidth
                />
                <TextField
                  label="Nombre del titular"
                  value={cardHolder}
                  onChange={(event) => setCardHolder(event.target.value)}
                  fullWidth
                />
              </>
            ) : (
              <Alert severity="info" variant="outlined">
                La referencia se generara al confirmar el pago.
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<CreditCard size={18} />}
              disabled={!canSubmit || submitting}
            >
              {submitting ? 'Procesando...' : 'Pagar y crear solicitud'}
            </Button>
            <Button onClick={() => router.push(APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.ROOT)} variant="text">
              Volver
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
