import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { APP_ROUTES } from '@/constants/routes.constants';
import { tecnicoPerfilMock } from '@/mocks/tecnico-pages.mock';
import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function DatosTecnicosPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Perfil tecnico"
        title="Datos tecnicos"
        description="Informacion profesional visible para administracion y asignacion de solicitudes."
        chips={[{ label: tecnicoPerfilMock.disponible ? 'Disponible' : 'No disponible' }]}
        actions={<Button component={Link} href={APP_ROUTES.TECNICO.DATOS_TECNICOS.EDITAR} variant="contained">Editar datos</Button>}
      />
      <Divider sx={{ mb: 3 }} />
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
          {[
            ['Especialidad', tecnicoPerfilMock.especialidad],
            ['Licencia profesional', tecnicoPerfilMock.licencia_profesional],
            ['Zona de cobertura', tecnicoPerfilMock.zonaCobertura],
            ['Calificacion promedio', tecnicoPerfilMock.calificacion_promedio],
            ['Servicios atendidos', String(tecnicoPerfilMock.serviciosAtendidos)],
            ['Respuesta promedio', tecnicoPerfilMock.tiempoRespuestaPromedio],
          ].map(([label, value]) => (
            <Paper key={label} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, mt: 0.5 }}>{value}</Typography>
            </Paper>
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>{tecnicoPerfilMock.bio}</Typography>
        <Box sx={{ mt: 2 }}><Chip label={tecnicoPerfilMock.id_usuario} variant="outlined" /></Box>
      </Paper>
    </Box>
  );
}
