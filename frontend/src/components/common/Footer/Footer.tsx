'use client';

import NextLink from 'next/link';

import {
  alpha,
  Box,
  Container,
  Divider,
  IconButton,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { APP_ROUTES } from '@/constants/routes.constants';

const footerSections = [
  {
    title: 'Servicios',
    links: [
      { label: 'Catálogo técnico', href: APP_ROUTES.CLIENT.SERVICIOS.ROOT },
      { label: 'Solicitar servicio', href: APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.ROOT },
      { label: 'Seguimiento de solicitudes', href: APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Quiénes somos', href: '#' },
      { label: 'Cómo funciona', href: '#' },
      { label: 'Cobertura', href: '#' },
    ],
  },
  {
    title: 'Soporte',
    links: [
      { label: 'Centro de ayuda', href: '#' },
      { label: 'Contacto', href: '#' },
      { label: 'Estado de servicio', href: '#' },
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

export function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: alpha(theme.palette.background.paper, 0.96),
        py: { xs: 6, md: 7 },
        mt: 10,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            bgcolor: alpha(theme.palette.background.paper, 0.88),
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gap: 4,
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.25fr) repeat(4, minmax(0, 1fr))' },
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                Servicios Técnicos
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, maxWidth: 420, lineHeight: 1.8 }}>
                Plataforma profesional para coordinar atenciones técnicas a domicilio con trazabilidad de solicitudes, pagos y soporte post-servicio.
              </Typography>

              <Stack direction="row" spacing={1.25} sx={{ mt: 2.5 }}>
                <IconButton sx={{ bgcolor: 'action.hover' }}>
                  <FaFacebook size={16} />
                </IconButton>
                <IconButton sx={{ bgcolor: 'action.hover' }}>
                  <FaInstagram size={16} />
                </IconButton>
                <IconButton sx={{ bgcolor: 'action.hover' }}>
                  <FaLinkedin size={16} />
                </IconButton>
              </Stack>
            </Box>

            {footerSections.map((section) => (
              <Box key={section.title}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
                  {section.title}
                </Typography>

                <Stack spacing={1.1}>
                  {section.links.map((link) => (
                    <MuiLink
                      key={link.label}
                      component={NextLink}
                      href={link.href}
                      underline="hover"
                      color="text.secondary"
                      variant="body2"
                      sx={{ '&:hover': { color: 'text.primary' } }}
                    >
                      {link.label}
                    </MuiLink>
                  ))}
                </Stack>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            © 2026 Servicios Técnicos. Operación segura para atención técnica residencial y empresarial.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
