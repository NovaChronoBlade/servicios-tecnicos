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
  Rating,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { CheckCircle2, CircleArrowLeft, Wrench } from 'lucide-react';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { SolicitudTimeline } from '@/components/cliente/SolicitudTimeline/SolicitudTimeline';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { createComentario } from '@/services/comentarios.service';
import { getApiErrorMessage } from '@/services/api-error';
import { createCalificacion, listCalificacionesByCliente } from '@/services/calificaciones.service';
import { confirmarCliente, getSolicitudById } from '@/services/solicitudes.service';
import { canClientComment, canClientComplete, getSolicitudEstadoMeta } from '@/utils/solicitud-state';

type PageProps = { params: Promise<{ id: string }> };

export default function ClienteSolicitudDetallePage({ params }: PageProps) {
  const { id } = use(params);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [ratingValue, setRatingValue] = useState<number | null>(5);
  const [ratingSaving, setRatingSaving] = useState(false);
  const [ratingSaved, setRatingSaved] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);

  const { data: solicitud, loading, error, reload } = useApiData(
    () => getSolicitudById(id),
    [id],
    null,
  );
  const { data: calificaciones, loading: loadingCalificaciones, error: calificacionesError, reload: reloadCalificaciones } = useApiData(
    () => (solicitud?.id_cliente ? listCalificacionesByCliente(solicitud.id_cliente) : Promise.resolve([])),
    [solicitud?.id_cliente],
    [],
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

  const calificacionRegistrada = solicitud
    ? calificaciones.find((item) => item.id_ss === solicitud.id_ss)
    : undefined;

  const handleSubmitRating = async () => {
    if (!solicitud || !canClientComment(solicitud) || !ratingValue) return;
    if (calificacionRegistrada) return;

    setRatingSaving(true);
    setRatingError(null);

    try {
      await createCalificacion({
        id_ss: solicitud.id_ss,
        id_cliente: solicitud.id_cliente,
        id_tecnico: solicitud.id_tecnico ?? '',
        puntuacion: ratingValue,
        comentario: commentContent.trim() || undefined,
      });

      if (commentContent.trim()) {
        await createComentario({
          id_ss: solicitud.id_ss,
          id_cliente: solicitud.id_cliente,
          id_tecnico: solicitud.id_tecnico ?? '',
          contenido: commentContent.trim(),
        });
      }

      setCommentContent('');
      setRatingSaved(true);
      await reloadCalificaciones();
    } catch (err) {
      setRatingError(getApiErrorMessage(err, 'No se pudo registrar la calificacion.'));
    } finally {
      setRatingSaving(false);
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

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Califica el servicio</Typography>
        <Divider sx={{ my: 2 }} />
        {calificacionesError ? <Alert severity="warning" sx={{ mb: 2 }}>{calificacionesError}</Alert> : null}
        {loadingCalificaciones ? (
          <Typography variant="body2" color="text.secondary">Cargando calificacion...</Typography>
        ) : calificacionRegistrada ? (
          <Stack spacing={1.25}>
            <Rating value={calificacionRegistrada.puntuacion} readOnly />
            <Typography variant="body2" color="text.secondary">
              Ya registraste una calificacion para esta solicitud.
            </Typography>
            {calificacionRegistrada.comentario ? (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                <Typography variant="body2">{calificacionRegistrada.comentario}</Typography>
              </Paper>
            ) : null}
          </Stack>
        ) : solicitud && canClientComment(solicitud) ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            {ratingError ? <Alert severity="error">{ratingError}</Alert> : null}
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">Puntuacion</Typography>
              <Rating
                value={ratingValue}
                onChange={(_, value) => setRatingValue(value)}
                size="large"
              />
            </Stack>
            <TextField
              label="Comentario opcional para la calificacion"
              value={commentContent}
              onChange={(event) => setCommentContent(event.target.value)}
              multiline
              minRows={4}
              fullWidth
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSubmitRating}
                disabled={ratingSaving || !ratingValue}
              >
                {ratingSaving ? 'Guardando...' : 'Enviar calificacion'}
              </Button>
            </Box>
          </Box>
        ) : (
          <Alert severity="info" variant="outlined">
            Podrás calificar cuando la solicitud quede completada.
          </Alert>
        )}
      </Paper>

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
      <Snackbar open={ratingSaved} autoHideDuration={2500} onClose={() => setRatingSaved(false)} message="Calificacion publicada" />
    </Box>
  );
}
