'use client';

import NextLink from 'next/link';

import {
  Box,
  Container,
  Link as MuiLink,
  Stack,
  Typography,
  Divider,
} from '@mui/material';

import { APP_ROUTES } from '@/constants/routes.constants';

const footerLinks = [
  {
    label: 'Inicio',
    href: APP_ROUTES.HOME,
  },

  {
    label: 'Servicios',
    href: APP_ROUTES.CLIENT.SERVICIOS.ROOT,
  },

  {
    label: 'Mis solicitudes',
    href: APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT,
  },

  {
    label: 'Pagos',
    href: APP_ROUTES.CLIENT.PAGOS.ROOT,
  },

  {
    label: 'Perfil',
    href: APP_ROUTES.CLIENT.PERFIL.ROOT,
  },
];

export function DashboardFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',

        borderTop: '1px solid',

        borderColor: 'divider',

        bgcolor: 'background.paper',

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
                variant="h6"
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

                  maxWidth: 520,

                  textAlign: {
                    xs: 'center',
                    md: 'left',
                  },
                }}
              >
                Plataforma moderna para la gestión de servicios técnicos,
                solicitudes, pagos y seguimiento de reparaciones.
              </Typography>
            </Box>

            {/* LINKS */}
            <Stack
              direction="row"
              spacing={2}
              useFlexGap
              sx={{
                flexWrap: 'wrap',
                justifyContent: {
                  xs: 'center',
                  md: 'flex-end',
                },
              }}
            >
              {footerLinks.map((link) => (
                <MuiLink
                  key={link.label}
                  component={NextLink}
                  href={link.href}
                  underline="hover"
                  color="text.secondary"
                  sx={{
                    fontSize: 14,

                    fontWeight: 600,

                    transition: 'color 160ms ease',

                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
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
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
