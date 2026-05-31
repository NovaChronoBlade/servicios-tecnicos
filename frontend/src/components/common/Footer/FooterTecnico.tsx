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
    title: 'Operación',
    links: [
      { label: 'Dashboard', href: APP_ROUTES.TECNICO.DASHBOARD },
      { label: 'Solicitudes disponibles', href: APP_ROUTES.TECNICO.SOLICITUDES_DISPONIBLES.ROOT },
      { label: 'Mis solicitudes', href: APP_ROUTES.TECNICO.MIS_SOLICITUDES.ROOT },
    ],
  },
  {
    title: 'Perfil técnico',
    links: [
      { label: 'Datos técnicos', href: APP_ROUTES.TECNICO.DATOS_TECNICOS.ROOT },
      { label: 'Disponibilidad', href: APP_ROUTES.TECNICO.DISPONIBILIDAD },
      { label: 'Calificaciones', href: APP_ROUTES.TECNICO.CALIFICACIONES },
    ],
  },
  {
    title: 'Cuenta',
    links: [
      { label: 'Perfil', href: APP_ROUTES.TECNICO.PERFIL.ROOT },
      { label: 'Editar datos técnicos', href: APP_ROUTES.TECNICO.DATOS_TECNICOS.EDITAR },
      { label: 'Solicitudes completadas', href: APP_ROUTES.TECNICO.MIS_SOLICITUDES.ROOT },
    ],
  },
  {
    title: 'Soporte',
    links: [
      { label: 'Centro de ayuda', href: '#' },
      { label: 'Contacto interno', href: '#' },
      { label: 'Estado de plataforma', href: '#' },
    ],
  },
];

export function FooterTecnico() {
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
                Herramientas de trabajo para gestionar solicitudes, disponibilidad, perfil profesional y seguimiento operativo.
              </Typography>
            </Box>

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
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 800,
                      mb: 1.25,
                      textAlign: { xs: 'center', md: 'left' },
                    }}
                  >
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
              © 2026 Servicios Técnicos. Panel operativo para tecnicos.
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Gestion profesional de tareas, disponibilidad y atencion de solicitudes.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}