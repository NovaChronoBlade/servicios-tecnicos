"use client";

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { SolicitudDisponibleCard } from '@/components/tecnico/SolicitudDisponibleCard/SolicitudDisponibleCard';
import { APP_ROUTES } from '@/constants/routes.constants';
import { solicitudesAsignadasMock, solicitudesDisponiblesMock, tecnicoPerfilMock, tecnicoSummary } from '@/mocks/tecnico-pages.mock';
import { Box, Button, Card, CardContent, Chip, Divider, Paper, Typography } from '@mui/material';
import { CalendarClock, CheckCircle2, ClipboardList, Star, Wrench } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Disponibles', value: tecnicoSummary.solicitudesDisponibles, icon: ClipboardList },
  { label: 'En curso', value: tecnicoSummary.solicitudesEnCurso, icon: Wrench },
  { label: 'Aceptadas', value: tecnicoSummary.solicitudesAceptadas, icon: CheckCircle2 },
  { label: 'Promedio', value: tecnicoSummary.calificacionPromedio.toFixed(1), icon: Star },
];

export default function TecnicoDashboardPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Centro tecnico"
        title={`Hola, ${tecnicoPerfilMock.nombre}`}
        description="Revisa solicitudes disponibles, controla tus servicios asignados y mantén tu perfil operativo actualizado."
        chips={[{ label: tecnicoPerfilMock.especialidad }, { label: tecnicoPerfilMock.disponible ? 'Disponible' : 'No disponible' }]}
        actions={
          <>
            <Button component={Link} href={APP_ROUTES.TECNICO.SOLICITUDES_DISPONIBLES.ROOT} variant="contained">
              Revisar solicitudes
            </Button>
            <Button component={Link} href={APP_ROUTES.TECNICO.MIS_SOLICITUDES.ROOT} variant="outlined">
              Mis solicitudes
            </Button>
          </>
        }
      />

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, my: 3 }}>
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{value}</Typography>
              </Box>
              <Box sx={{ width: 46, height: 46, borderRadius: 2, display: 'grid', placeItems: 'center', bgcolor: 'action.hover', color: 'primary.main' }}>
                <Icon size={22} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1.35fr 0.65fr' } }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Solicitudes disponibles</Typography>
              <Typography variant="body2" color="text.secondary">Atenciones abiertas para tomar.</Typography>
            </Box>
            <Button component={Link} href={APP_ROUTES.TECNICO.SOLICITUDES_DISPONIBLES.ROOT} size="small">Ver todas</Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'grid', gap: 2 }}>
            {solicitudesDisponiblesMock.slice(0, 2).map((solicitud) => (
              <SolicitudDisponibleCard key={solicitud.id_ss} solicitud={solicitud} compact />
            ))}
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Agenda inmediata</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Servicios asignados y siguientes pasos.</Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'grid', gap: 2 }}>
            {solicitudesAsignadasMock.map((solicitud) => (
              <Paper key={solicitud.id_ss} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{solicitud.servicioNombre}</Typography>
                  <Chip size="small" label={solicitud.estado} />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1, color: 'text.secondary' }}>
                  <CalendarClock size={16} />
                  <Typography variant="body2">{new Date(solicitud.fecha_programada ?? solicitud.fecha).toLocaleString('es-CO')}</Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
