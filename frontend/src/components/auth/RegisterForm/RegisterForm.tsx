'use client';

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerRequest } from '../../../services/auth.service';
import { getAuthErrorMessage, getAuthFieldErrors } from '../../../services/auth.service';
import type { RegisterRequest } from '../../../types/auth.types';
import { UserRole } from '../../../types/user.types';
import { useAuthStore } from '@/store/authStore';
import { APP_ROUTES } from '@/constants/routes.constants';

export default function RegisterForm() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const searchParams = useSearchParams();

  const [form, setForm] = useState<RegisterRequest>({
    documento: '',
    fecha_nacimiento: '',
    nombre: '',
    correo: '',
    contrasena: '',
    telefono: '',
    rol: UserRole.CLIENTE,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterRequest, string>>>({});

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (searchParams.get('registered') === '1') {
      setError('Cuenta creada correctamente. Ahora inicia sesión.');
    }

    if (searchParams.get('role') === 'forbidden') {
      setError('Tu rol no tiene acceso a esta sección.');
    }

    if (isAuthenticated) {
      router.replace(APP_ROUTES.CLIENT.DASHBOARD);
    }
  }, [isAuthenticated, isHydrated, router, searchParams]);

  const validate = () => {
    const nextErrors: Partial<Record<keyof RegisterRequest, string>> = {};

    if (!form.nombre.trim()) nextErrors.nombre = 'Ingresa tu nombre completo';
    if (!form.correo.trim()) {
      nextErrors.correo = 'Ingresa tu correo electrónico';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      nextErrors.correo = 'Ingresa un correo electrónico válido';
    }
    if (!form.telefono.trim()) nextErrors.telefono = 'Ingresa tu teléfono';
    if (!form.documento.trim()) nextErrors.documento = 'Ingresa tu documento';
    if (!form.fecha_nacimiento.trim()) nextErrors.fecha_nacimiento = 'Selecciona tu fecha de nacimiento';
    if (!form.contrasena.trim()) {
      nextErrors.contrasena = 'Ingresa tu contraseña';
    } else if (form.contrasena.length < 8) {
      nextErrors.contrasena = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (form.rol !== UserRole.CLIENTE) {
      nextErrors.rol = 'Esta versión solo permite registros de cliente';
    }

    setFieldErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validate()) {
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      await registerRequest(form);
      router.replace(`${APP_ROUTES.LOGIN}?registered=1`);
    } catch (err: any) {
      setError(getAuthErrorMessage(err, 'Error al registrarse'));

      const fieldErrors = getAuthFieldErrors(err);
      setFieldErrors((prev) => ({
        ...prev,
        nombre: fieldErrors.nombre ?? prev.nombre,
        correo: fieldErrors.correo ?? fieldErrors.email ?? prev.correo,
        telefono: fieldErrors.telefono ?? prev.telefono,
        documento: fieldErrors.documento ?? prev.documento,
        fecha_nacimiento: fieldErrors.fecha_nacimiento ?? prev.fecha_nacimiento,
        contrasena: fieldErrors.contrasena ?? fieldErrors.password ?? prev.contrasena,
        rol: fieldErrors.rol ?? prev.rol,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Nombre completo"
          value={form.nombre}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, nombre: e.target.value }));
            if (fieldErrors.nombre) setFieldErrors((prev) => ({ ...prev, nombre: undefined }));
          }}
          fullWidth
          required
          autoComplete="name"
          error={Boolean(fieldErrors.nombre)}
          helperText={fieldErrors.nombre}
        />

        <TextField
          label="Correo electrónico"
          type="email"
          value={form.correo}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, correo: e.target.value }));
            if (fieldErrors.correo) setFieldErrors((prev) => ({ ...prev, correo: undefined }));
          }}
          fullWidth
          required
          autoComplete="email"
          error={Boolean(fieldErrors.correo)}
          helperText={fieldErrors.correo}
        />

        <TextField
          label="Teléfono"
          value={form.telefono}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, telefono: e.target.value }));
            if (fieldErrors.telefono) setFieldErrors((prev) => ({ ...prev, telefono: undefined }));
          }}
          fullWidth
          required
          autoComplete="tel"
          error={Boolean(fieldErrors.telefono)}
          helperText={fieldErrors.telefono}
        />

        <TextField
          label="Documento"
          value={form.documento}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, documento: e.target.value }));
            if (fieldErrors.documento) setFieldErrors((prev) => ({ ...prev, documento: undefined }));
          }}
          fullWidth
          required
          error={Boolean(fieldErrors.documento)}
          helperText={fieldErrors.documento}
        />

        <TextField
          label="Fecha de nacimiento"
          type="date"
          value={form.fecha_nacimiento}
          onChange={(e) => {
            setForm((prev) => ({
              ...prev,
              fecha_nacimiento: e.target.value,
            }));
            if (fieldErrors.fecha_nacimiento) setFieldErrors((prev) => ({ ...prev, fecha_nacimiento: undefined }));
          }}
          fullWidth
          required
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          sx={{
            '& input': {
              height: '24px',
            },
          }}
          error={Boolean(fieldErrors.fecha_nacimiento)}
          helperText={fieldErrors.fecha_nacimiento}
        />

        <FormControl fullWidth error={Boolean(fieldErrors.rol)}>
          <InputLabel id="register-role-label">Rol</InputLabel>
          <Select
            labelId="register-role-label"
            label="Rol"
            value={form.rol}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, rol: e.target.value as UserRole }))
            }
          >
            <MenuItem value={UserRole.CLIENTE}>Cliente</MenuItem>
          </Select>
          {fieldErrors.rol ? (
            <Typography variant="caption" color="error" sx={{ mt: 0.75, ml: 1.75 }}>
              {fieldErrors.rol}
            </Typography>
          ) : null}
        </FormControl>

        <TextField
          label="Contraseña"
          type="password"
          value={form.contrasena}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, contrasena: e.target.value }));
            if (fieldErrors.contrasena) setFieldErrors((prev) => ({ ...prev, contrasena: undefined }));
          }}
          fullWidth
          required
          autoComplete="new-password"
          error={Boolean(fieldErrors.contrasena)}
          helperText={fieldErrors.contrasena}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ height: 52, fontWeight: 600 }}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            'Crear cuenta'
          )}
        </Button>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          ¿Ya tienes una cuenta?{' '}
          <Box
            component={Link}
            href="/login"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Inicia sesión
          </Box>
        </Typography>
      </Stack>
    </Box>
  );
}
