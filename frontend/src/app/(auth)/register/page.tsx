'use client';

import { Suspense } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { TopNavBar } from '@/components/common/Navbar/TopNavBar';
import RegisterForm from '../../../components/auth/RegisterForm/RegisterForm';

export default function RegisterPage() {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <TopNavBar />

      <Container maxWidth="lg">
        <Grid
          container
          spacing={6}
          sx={{
            minHeight: '80vh',
            alignItems: 'center',
          }}
        >
          {/* LEFT SIDE */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: {
                xs: 'none',
                md: 'block',
              },
            }}
          >
            <Box
              sx={{
                height: 620,
                borderRadius: 6,
                bgcolor: 'primary.main',
                opacity: 0.12,
              }}
            />
          </Grid>

          {/* RIGHT SIDE */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                maxWidth: 560,
                mx: 'auto',
                py: 8,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Crear una cuenta
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mb: 4,
                }}
              >
                Ingresa tu información usando los datos definidos por el
                backend.
              </Typography>

              <Suspense fallback={null}>
                <RegisterForm />
              </Suspense>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
