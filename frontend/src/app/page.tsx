"use client";

import Link from 'next/link';
import { Box, Button, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material';
import { ShieldCheck, Wrench, Zap } from 'lucide-react';
import { TopNavBar } from '@/components/common/Navbar/TopNavBar';
import { Footer } from '@/components/common/Footer/Footer';

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <TopNavBar />

      {/* HERO */}
      <Container maxWidth="lg">
        <Grid
          container
          spacing={6}
          sx={{
            alignItems: 'center',
            minHeight: 'calc(85vh - 70px)',
            py: { xs: 6, md: 0 },
          }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <Typography
                variant="h2"
                color="text.primary"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.75rem' },
                  lineHeight: 1.2,
                }}
              >
                Gestiona tus servicios técnicos de forma moderna
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontWeight: 400 }}
              >
                Plataforma para administración de clientes, reparaciones,
                inventario y seguimiento técnico.
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Comenzar
                </Button>
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                height: { xs: 300, md: 420 },
                borderRadius: 6,
                bgcolor: 'primary.main',
                opacity: 0.15,
                width: '100%',
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* FEATURES */}
      <Container
        maxWidth="lg"
        sx={{
          py: 10,
        }}
      >
        <Typography
          variant="h3"
          color="text.primary"
          sx={{
            fontSize: { xs: '2rem', md: '3rem' },
            fontWeight: 700,
            textAlign: 'center',
            mb: 6,
          }}
        >
          Características
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={0}
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={2}>
                  <Wrench size={40} />

                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700 }}
                    color="text.primary"
                  >
                    Gestión Técnica
                  </Typography>

                  <Typography color="text.secondary" variant="body2">
                    Administra reparaciones, diagnósticos y órdenes de servicio
                    fácilmente.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={0}
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={2}>
                  <ShieldCheck color="#1976d2" size={40} />

                  <Typography
                    variant="h5"
                    color="text.primary"
                    sx={{ fontWeight: 700 }}
                  >
                    Seguridad
                  </Typography>

                  <Typography color="text.secondary" variant="body2">
                    Manejo seguro de usuarios, autenticación y permisos basados
                    en roles.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={0}
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={2}>
                  <Zap size={40} />

                  <Typography
                    variant="h5"
                    color="text.primary"
                    sx={{ fontWeight: 700 }}
                  >
                    Alto rendimiento
                  </Typography>

                  <Typography color="text.secondary" variant="body2">
                    Interfaz rápida y moderna usando la potencia de Next.js y
                    Material UI.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
}
