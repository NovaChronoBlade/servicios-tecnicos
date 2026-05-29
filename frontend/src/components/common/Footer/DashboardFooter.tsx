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
    title: 'Servicios',
    links: [
      { label: 'Catálogo', href: APP_ROUTES.CLIENT.SERVICIOS.ROOT },
      { label: 'Solicitar servicio', href: APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.ROOT },
      { label: 'Mis solicitudes', href: APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Perfil del cliente', href: APP_ROUTES.CLIENT.PERFIL.ROOT },
      { label: 'Direcciones', href: APP_ROUTES.CLIENT.DIRECCIONES.ROOT },
      { label: 'Dashboard', href: APP_ROUTES.CLIENT.DASHBOARD },
    ],
  },
  {
    title: 'Soporte',
    links: [
      { label: 'Centro de ayuda', href: '#' },
      { label: 'Contacto de soporte', href: '#' },
      { label: 'Estado del servicio', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Términos y condiciones', href: '#' },
      { label: 'Política de privacidad', href: '#' },
      { label: 'Tratamiento de datos', href: '#' },
    ],
  },
];

export function DashboardFooter() {
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
        <Stack
          spacing={3}
          sx={{
            py: 4,
          }}
        >
          {/* TOP */}
          <Stack
            direction={{
              xs: 'column',
              md: 'row',
            }}
            spacing={3}
            sx={{
              justifyContent: 'space-between',
              alignItems: {
                xs: 'center',
                md: 'flex-start',
              },
            }}
          >
            {/* BRAND */}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,

                  textAlign: {
                    xs: 'center',
                    md: 'left',
                  },
                }}
              >
                Servicios Técnicos
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,

                  maxWidth: 420,

                  textAlign: {
                    xs: 'center',
                    md: 'left',
                  },
                }}
              >
                Operación centralizada para solicitudes técnicas, direcciones de atención, pagos y seguimiento post-servicio.
              </Typography>
            </Box>

            {/* LINKS */}
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                width: '100%',
                gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
              }}
            >
              {footerSections.map((section) => (
                <Box key={section.title}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.25, textAlign: { xs: 'center', md: 'left' } }}>
                    {section.title}
                  </Typography>
                  <Stack spacing={1} sx={{ alignItems: { xs: 'center', md: 'flex-start' } }}>
                    {section.links.map((link) => (
                      <MuiLink
                        key={link.label}
                        component={NextLink}
                        href={link.href}
                        underline="hover"
                        color="text.secondary"
                        sx={{ fontSize: 13, fontWeight: 600, '&:hover': { color: 'primary.main' } }}
                      >
                        {link.label}
                      </MuiLink>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          </Stack>

          <Divider />

          {/* BOTTOM */}
          <Stack
            sx={{
              direction: {
                xs: 'column',
                md: 'row',
              },
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            spacing={1.5}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                textAlign: {
                  xs: 'center',
                  md: 'left',
                },
              }}
            >
              © 2026 Servicios Técnicos. Todos los derechos reservados.
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Plataforma con estándares de operación y atención técnica profesional.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
