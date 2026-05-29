import { APP_ROUTES } from '@/constants/routes.constants';
import { Box, Button, Chip, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import { ClientDetailHero } from '@/components/common/ClientPage/ClientDetailHero';

export default function SolicitudExitoPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
      <Box sx={{ width: '100%', maxWidth: 1120 }}>
        <ClientDetailHero
          eyebrow="Confirmación"
          title="Solicitud creada con éxito"
          description="Tu solicitud quedó registrada y pronto se asignará un técnico. El panel ya quedó listo para seguir el flujo."
          chips={<Chip label="Registro completo" color="success" />}
          facts={[
            { label: 'Estado', value: 'En cola', accent: 'warning' },
            { label: 'Siguiente paso', value: 'Asignación', accent: 'primary' },
            { label: 'Soporte', value: 'Disponible', accent: 'secondary' },
            { label: 'Tiempo', value: 'Próximamente', accent: 'info' },
          ]}
          actions={
            <>
              <Button component={Link} href={APP_ROUTES.CLIENT.DASHBOARD} variant="contained">
                Ir al dashboard
              </Button>
              <Button component={Link} href={APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT} variant="outlined">
                Ver solicitudes
              </Button>
            </>
          }
        />

        <Paper variant="outlined" sx={{ mt: 3, p: { xs: 3, md: 4 }, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Qué sigue
          </Typography>
          <Typography variant="body2" color="text.secondary">
            La solicitud quedará visible en tu historial, podrás revisar el progreso y acceder al detalle cuando el técnico tome el caso.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}