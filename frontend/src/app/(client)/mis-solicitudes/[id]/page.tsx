"use client";

import { use, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Snackbar,
  Typography,
} from '@mui/material';
import { CheckCircle2, CircleArrowLeft, Wrench } from 'lucide-react';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { SolicitudTimeline } from '@/components/cliente/SolicitudTimeline/SolicitudTimeline';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getApiErrorMessage } from '@/services/api-error';
import { confirmarCliente, getSolicitudById } from '@/services/solicitudes.service';
import { canClientComplete, getSolicitudEstadoMeta } from '@/utils/solicitud-state';

type PageProps = { params: Promise<{ id: string }> };

export default function ClienteSolicitudDetallePage({ params }: PageProps) {
  const { id } = use(params);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);

  const { data: solicitud, loading, error, reload } = useApiData(
    () => getSolicitudById(id),
    [id],
    null,
  );

  const handleComplete = async () => {
    setSaving(true);
    setSavingError(null);

    try {
      await confirmarCliente(id);
      setConfirmOpen(false);
      setSaved(true);
      await reload();
    } catch (err) {
      setSavingError(getApiErrorMessage(err, 'No se pudo finalizar el servicio.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!solicitud) return <Alert severity="error">{error ?? 'Solicitud no encontrada'}</Alert>;

  const estado = getSolicitudEstadoMeta(solicitud.estado);
  const canComplete = canClientComplete(solicitud);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Detalle"
        title={solicitud.servicioNombre}
        description={solicitud.direccionResumen}
        chips={[
          { label: estado.label, color: estado.color },
          { label: solicitud.valorEstimado },
        ]}
        actions={
          <>
            <Button component={Link} href={APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT} variant="outlined" startIcon={<CircleArrowLeft size={18} />}>
              Volver
            </Button>
            <Button variant="contained" color="success" startIcon={<CheckCircle2 size={18} />} disabled={!canComplete || saving} onClick={() => setConfirmOpen(true)}>
              Finalizar servicio
            </Button>
          </>
        }
      />

      <Divider sx={{ mb: 3 }} />
      {(error || savingError) ? <Alert severity="error" sx={{ mb: 3 }}>{savingError ?? error}</Alert> : null}
      {!canComplete ? (
        <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
          La finalizacion se habilita cuando el servicio esta en curso y tiene tecnico asignado.
        </Alert>
      ) : null}

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 380px' } }}>
        <SolicitudTimeline estado={solicitud.estado} fechaProgramada={solicitud.fecha_programada} />

        <Box sx={{ display: 'grid', gap: 2 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Tecnico asignado</Typography>
            <Divider sx={{ my: 2 }} />
            {solicitud.id_tecnico ? (
              <Box sx={{ display: 'grid', gap: 1.25 }}>
                <Typography sx={{ fontWeight: 800 }}>{solicitud.tecnicoNombre ?? solicitud.id_tecnico}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {solicitud.tecnicoEspecialidad ?? 'Especialidad por confirmar'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {solicitud.tecnicoContacto ?? 'Contacto por confirmar'}
                </Typography>
                <Chip
                  icon={<Wrench size={16} />}
                  label={solicitud.fechaAceptacion ? `Aceptado ${new Date(solicitud.fechaAceptacion).toLocaleString('es-CO')}` : solicitud.tecnicoEstadoAsignacion}
                  color={solicitud.fechaAceptacion ? 'success' : 'secondary'}
                  variant="outlined"
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">Aun no hay tecnico asignado.</Typography>
            )}
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Pago y servicio</Typography>
            <Divider sx={{ my: 2 }} />
            {[
              ['Metodo de pago', solicitud.pagoMetodo ?? 'No registrado'],
              ['Estado de pago', solicitud.pagoEstado ?? 'No registrado'],
              ['Referencia', solicitud.numero_referencia ?? 'Sin referencia'],
              ['Fecha de finalizacion', solicitud.fechaFinalizacion ? new Date(solicitud.fechaFinalizacion).toLocaleString('es-CO') : 'Pendiente'],
            ].map(([label, value]) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.75 }}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'right' }}>{value}</Typography>
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Confirmar finalizacion</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Al confirmar, la solicitud pasara a completada, se registrara la fecha de finalizacion y el tecnico quedara disponible nuevamente.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={saving}>Cancelar</Button>
          <Button onClick={handleComplete} variant="contained" color="success" disabled={saving}>
            {saving ? 'Finalizando...' : 'Finalizar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Servicio finalizado" />
    </Box>
  );
}
