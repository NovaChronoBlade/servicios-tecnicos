'use client';

import NextLink from 'next/link';

import {
  Box,
  Container,
  Grid,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

export function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        py: 6,
        mt: 10,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* INFO */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: 'primary.main',
              }}
            >
              Servicios Técnicos
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 2,
                maxWidth: 520,
                lineHeight: 1.8,
              }}
            >
              Plataforma moderna para gestión de servicios técnicos,
              reparaciones, clientes, diagnósticos e inventario para técnicos y
              empresas.
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              <IconButton
                sx={{
                  bgcolor: 'action.hover',
                }}
              >
                <FaFacebook size={18} />
              </IconButton>

              <IconButton
                sx={{
                  bgcolor: 'action.hover',
                }}
              >
                <FaInstagram size={18} />
              </IconButton>

              <IconButton
                sx={{
                  bgcolor: 'action.hover',
                }}
              >
                <FaLinkedin size={18} />
              </IconButton>
            </Stack>
          </Grid>

          {/* NAVEGACIÓN */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Navegación
            </Typography>

            <Stack spacing={1}>
              <MuiLink
                component={NextLink}
                href={String('/')}
                underline="hover"
                color="text.primary"
                variant="body2"
              >
                Inicio
              </MuiLink>

              <MuiLink
                component={NextLink}
                href={String('/login')}
                underline="hover"
                color="text.primary"
                variant="body2"
              >
                Iniciar sesión
              </MuiLink>

              <MuiLink
                component={NextLink}
                href={String('/register')}
                underline="hover"
                color="text.primary"
                variant="body2"
              >
                Registrarse
              </MuiLink>
            </Stack>
          </Grid>

          {/* SOPORTE */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Soporte
            </Typography>

            <Stack spacing={1}>
              <MuiLink
                component={NextLink}
                href={String('#')}
                underline="hover"
                color="text.primary"
                variant="body2"
              >
                Centro de ayuda
              </MuiLink>

              <MuiLink
                component={NextLink}
                href={String('#')}
                underline="hover"
                color="text.primary"
                variant="body2"
              >
                Contacto
              </MuiLink>

              <MuiLink
                component={NextLink}
                href={String('#')}
                underline="hover"
                color="text.primary"
                variant="body2"
              >
                Términos y condiciones
              </MuiLink>
            </Stack>
          </Grid>

          {/* COPYRIGHT */}
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 4,
                pt: 3,
                borderTop: `1px solid ${theme.palette.divider}`,
                textAlign: {
                  xs: 'center',
                  md: 'left',
                },
              }}
            >
              © 2026 Servicios Técnicos. Todos los derechos reservados.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
