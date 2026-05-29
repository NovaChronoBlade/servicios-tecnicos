'use client';

import React, { useEffect, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '../../../hooks/useAuth';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useAuthStore } from '@/store/authStore';
import { getAuthErrorMessage, getAuthFieldErrors } from '@/services/auth.service';
import { UserRole } from '@/types/user.types';

function getSafeRedirectPath(candidate: string | null): string {
  if (!candidate) return '';
  if (!candidate.startsWith('/')) return APP_ROUTES.CLIENT.DASHBOARD;
  return candidate;
}

function getDashboardByRole(role?: UserRole | string | null) {
  if (role === UserRole.ADMIN) return APP_ROUTES.ADMIN.DASHBOARD;
  if (role === UserRole.TECNICO) return APP_ROUTES.TECNICO.DASHBOARD;
  return APP_ROUTES.CLIENT.DASHBOARD;
}

export default function LoginForm() {
  const { login } = useAuth();
  const { isAuthenticated, isHydrated, logout, user } = useAuthStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirectPath(searchParams.get('redirect'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const roleForbidden = searchParams.get('role') === 'forbidden';
    if (roleForbidden) {
      setError('Tu rol no tiene acceso a esta sección.');
      logout();
      return;
    }

    if (isAuthenticated) {
      router.replace(redirectTo || getDashboardByRole(user?.rol));
    }
  }, [isAuthenticated, isHydrated, redirectTo, router, searchParams, user?.rol]);

  const validate = () => {
    let valid = true;

    setEmailError(null);
    setPasswordError(null);

    if (!email.trim()) {
      setEmailError('Ingresa tu correo electrónico');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Ingresa un correo electrónico válido');
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError('Ingresa tu contraseña');
      valid = false;
    }

    return valid;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setError(null);

    if (!validate()) {
      return;
    }

    setEmailError(null);
    setPasswordError(null);
    setLoading(true);

    try {
      const response = await login(email, password);
      const role = response.user?.rol ?? response.usuario?.rol;

      router.replace(redirectTo || getDashboardByRole(role));
    } catch (err: any) {
      setError(getAuthErrorMessage(err, 'Error al iniciar sesión'));

      const fieldErrors = getAuthFieldErrors(err);
      if (fieldErrors.email) setEmailError(fieldErrors.email);
      if (fieldErrors.correo && !fieldErrors.email) setEmailError(fieldErrors.correo);
      if (fieldErrors.password) setPasswordError(fieldErrors.password);
      if (fieldErrors.contrasena && !fieldErrors.password) setPasswordError(fieldErrors.contrasena);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
      }}
    >
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(null);
          }}
          fullWidth
          required
          autoComplete="email"
          error={Boolean(emailError)}
          helperText={emailError}
        />

        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError(null);
          }}
          fullWidth
          required
          autoComplete="current-password"
          error={Boolean(passwordError)}
          helperText={passwordError}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            height: 52,
            fontWeight: 600,
          }}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            'Iniciar sesión'
          )}
        </Button>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: 'center',
          }}
        >
          ¿No tienes cuenta?{' '}
          <Box
            component={Link}
            href={APP_ROUTES.REGISTER}
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Regístrate
          </Box>
        </Typography>
      </Stack>
    </Box>
  );
}
