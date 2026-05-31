"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Alert, Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import { CalendarCheck2, CheckCircle2, CreditCard, ListChecks, UserRound, type LucideIcon } from 'lucide-react';

import { ClientDetailHero } from '@/components/common/ClientPage/ClientDetailHero';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { getApiErrorMessage } from '@/services/api-error';
import { getSolicitudById, type SolicitudView } from '@/services/solicitudes.service';
import { getSolicitudEstadoMeta } from '@/utils/solicitud-state';

export default function SolicitudExitoPage() {
  const [requestId, setRequestId] = useState<string | null>(null);
  const [solicitud, setSolicitud] = useState<SolicitudView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    setRequestId(id);

    if (!id) {
      setLoading(false);
      return;
    }

    void getSolicitudById(id)
      .then(setSolicitud)
      .catch((err) => setError(getApiErrorMessage(err, 'No se pudo cargar la solicitud creada.')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const estado = getSolicitudEstadoMeta(solicitud?.estado);
  const nextSteps: Array<{ label: string; value: string; Icon: LucideIcon }> = [
    { label: 'Pago aprobado', value: solicitud?.numero_referencia ?? 'Referencia generada', Icon: CreditCard },
    { label: 'Tecnico asignado', value: solicitud?.tecnicoEspecialidad ?? 'Pendiente de aceptacion', Icon: UserRound },
    {
      label: 'Agenda',
      value: solicitud?.fecha_programada ? new Date(solicitud.fecha_programada).toLocaleString('es-CO') : 'Por confirmar',
      Icon: CalendarCheck2,
    },
    { label: 'Proximo paso', value: 'El tecnico debe aceptar el servicio', Icon: ListChecks },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1180, mx: 'auto' }}>
      {error ? <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert> : null}

      <ClientDetailHero
        eyebrow="Confirmacion"
        title={solicitud ? solicitud.servicioNombre : 'Solicitud registrada'}
        description="El pago fue aprobado y la solicitud quedo creada con el tecnico seleccionado."
        chips={<Chip label={solicitud ? estado.label : 'Registro completo'} color={solicitud ? estado.color : 'success'} />}
        facts={[
          { label: 'Servicio', value: solicitud?.servicioNombre ?? requestId ?? 'Creado', accent: 'primary' },
          { label: 'Estado actual', value: solicitud ? estado.label : 'Creada', accent: solicitud?.estado === 'cancelado' ? 'error' : 'success' },
          { label: 'Metodo de pago', value: solicitud?.pagoMetodo ?? 'Aprobado', accent: 'secondary' },
          { label: 'Tecnico', value: solicitud?.tecnicoNombre ?? 'Asignado', accent: 'info' },
        ]}
        actions={
          <>
            <Button component={Link} href={APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT} variant="contained">
              Ver solicitudes
            </Button>
            {solicitud ? (
              <Button component={Link} href={APP_ROUTES.CLIENT.MIS_SOLICITUDES.DETAIL(solicitud.id_ss)} variant="outlined">
                Ver detalle
              </Button>
            ) : (
              <Button component={Link} href={APP_ROUTES.CLIENT.DASHBOARD} variant="outlined">
                Ir al dashboard
              </Button>
            )}
          </>
        }
      />

      <Box sx={{ display: 'grid', gap: 2, mt: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' } }}>
        {nextSteps.map(({ label, value, Icon }) => (
          <Paper key={label} variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon size={18} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{label}</Typography>
            </Box>
            <Divider sx={{ my: 1.25 }} />
            <Typography variant="body2" color="text.secondary">{value}</Typography>
          </Paper>
        ))}
      </Box>

      <Alert icon={<CheckCircle2 size={18} />} severity="success" variant="outlined" sx={{ mt: 3 }}>
        La solicitud aparecera en Mis solicitudes con el estado actualizado en tiempo real desde el backend.
      </Alert>
    </Box>
  );
}
