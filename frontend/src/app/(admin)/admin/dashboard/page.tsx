"use client";

import Link from 'next/link';
import { Alert, Box, Button, Card, CardContent, Chip, Divider, Paper, Typography } from '@mui/material';
import { CreditCard, FileBarChart, UsersRound, Wrench } from 'lucide-react';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { listPagosBySolicitud } from '@/services/pagos.service';
import { listServicios } from '@/services/servicios.service';
import { listSolicitudes } from '@/services/solicitudes.service';
import { listUsuarios } from '@/services/usuarios.service';
import { UserRole } from '@/types';

export default function AdminDashboardPage() {
  const { data, loading, error } = useApiData(
    async () => {
      const [usuarios, servicios, solicitudes] = await Promise.all([
        listUsuarios(),
        listServicios(),
        listSolicitudes(),
      ]);
      const pagos = (await Promise.all(
        solicitudes.slice(0, 30).map((solicitud) => listPagosBySolicitud(solicitud.id_ss).catch(() => [])),
      )).flat();
      return { usuarios, servicios, solicitudes, pagos };
    },
    [],
    { usuarios: [], servicios: [], solicitudes: [], pagos: [] },
  );

  if (loading) return <LoadingSpinner />;

  const stats = [
    { label: 'Usuarios', value: data.usuarios.length, icon: UsersRound, href: APP_ROUTES.ADMIN.USUARIOS.ROOT },
    { label: 'Servicios', value: data.servicios.length, icon: Wrench, href: APP_ROUTES.ADMIN.SERVICIOS.ROOT },
    { label: 'Solicitudes', value: data.solicitudes.length, icon: FileBarChart, href: APP_ROUTES.ADMIN.SOLICITUDES.ROOT },
    { label: 'Pagos pendientes', value: data.pagos.filter((pago) => pago.estado === 'pendiente').length, icon: CreditCard, href: APP_ROUTES.ADMIN.PAGOS },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Panel admin"
        title="Operacion general"
        description="Vista rapida de usuarios, servicios, solicitudes, pagos y reportes de la plataforma."
        chips={[
          { label: `${data.usuarios.filter((user) => user.rol === UserRole.CLIENTE).length} clientes` },
          { label: `${data.usuarios.filter((user) => user.rol === UserRole.TECNICO).length} tecnicos` },
        ]}
        actions={
          <>
            <Button component={Link} href={APP_ROUTES.ADMIN.USUARIOS.ROOT} variant="contained">Usuarios</Button>
            <Button component={Link} href={APP_ROUTES.ADMIN.REPORTES.ROOT} variant="outlined">Reportes</Button>
          </>
        }
      />
      {error ? <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, my: 3 }}>
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Card key={label} component={Link} href={href} variant="outlined" sx={{ borderRadius: 3, textDecoration: 'none', color: 'inherit' }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
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
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Solicitudes recientes</Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'grid', gap: 1.5 }}>
            {data.solicitudes.slice(0, 5).map((solicitud) => (
              <Paper key={solicitud.id_ss} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Typography sx={{ fontWeight: 800 }}>{solicitud.servicioNombre}</Typography>
                  <Chip size="small" label={solicitud.estado} />
                </Box>
                <Typography variant="body2" color="text.secondary">{solicitud.clienteNombre}</Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Servicios publicados</Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'grid', gap: 1.5 }}>
            {data.servicios.slice(0, 5).map((servicio) => (
              <Paper key={servicio.id_servicio} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Typography sx={{ fontWeight: 800 }}>{servicio.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">{servicio.categoriaNombre} - ${Number(servicio.precio).toLocaleString('es-CO')}</Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
