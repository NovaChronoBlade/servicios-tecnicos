'use client';

import NextLink from 'next/link';

import {
  alpha,
  Box,
  Container,
  Link as MuiLink,
  Stack,
  Typography,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { APP_ROUTES } from '@/constants/routes.constants';

const footerSections = [
  {
    title: 'Administración',
    links: [
      { label: 'Dashboard', href: APP_ROUTES.ADMIN.DASHBOARD },
      { label: 'Usuarios', href: APP_ROUTES.ADMIN.USUARIOS.ROOT },
      { label: 'Servicios', href: APP_ROUTES.ADMIN.SERVICIOS.ROOT },
    ],
  },
  {
    title: 'Operaciones',
    links: [
      { label: 'Solicitudes', href: APP_ROUTES.ADMIN.SOLICITUDES.ROOT },
      { label: 'Pagos', href: APP_ROUTES.ADMIN.PAGOS },
      { label: 'Reportes', href: APP_ROUTES.ADMIN.REPORTES.ROOT },
    ],
  },
  {
    title: 'Sistema',
    links: [
      { label: 'Configuración', href: APP_ROUTES.ADMIN.ADMINISTRACION.CONFIGURACION },
      { label: 'Auditoría', href: APP_ROUTES.ADMIN.ADMINISTRACION.AUDITORIA },
      { label: 'Comentarios', href: APP_ROUTES.ADMIN.COMENTARIOS },
    ],
  },
  {
    title: 'Soporte',
    links: [
      { label: 'Documentación', href: '#' },
      { label: 'Contacto interno', href: '#' },
      { label: 'Estado de la plataforma', href: '#' },
    ],
  },
];

export function FooterAdmin() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(12px)',
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3} sx={{ py: 4 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            sx={{ justifyContent: 'space-between', alignItems: { xs: 'center', md: 'flex-start' } }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, textAlign: { xs: 'center', md: 'left' } }}>
                Panel Administrativo
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 420, textAlign: { xs: 'center', md: 'left' } }}>
                Administración de usuarios, servicios, pagos y reportes del sistema.
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gap: 3, width: '100%', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' } }}>
              {footerSections.map((section) => (
                <Box key={section.title}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.25, textAlign: { xs: 'center', md: 'left' } }}>
                    {section.title}
                  </Typography>
                  <Stack spacing={1} sx={{ alignItems: { xs: 'center', md: 'flex-start' } }}>
                    {section.links.map((link) => (
                      <MuiLink key={link.label} component={NextLink} href={link.href} underline="hover" color="text.secondary" sx={{ fontSize: 13, fontWeight: 600, '&:hover': { color: 'primary.main' } }}>
                        {link.label}
                      </MuiLink>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          </Stack>

          <Divider />

          <Stack sx={{ direction: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center' }} spacing={1.5}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              © 2026 Servicios Técnicos. Administración.
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Herramientas para la gestión operativa y administrativa del sistema.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}