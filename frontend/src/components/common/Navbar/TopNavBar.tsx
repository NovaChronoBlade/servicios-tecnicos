'use client';

import Link from 'next/link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ThemeToggleButton } from '../ThemeToggle/ThemeToggleButton';
import { NavbarShell } from './NavbarShell';

export function TopNavBar() {
  const left = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Link href={String('/')} style={{ textDecoration: 'none' }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Servicios Técnicos
        </Typography>
      </Link>
    </Box>
  );

  const right = (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Link href={String('/login')}>
        <Button variant="outlined" sx={{ display: { xs: 'none', lg: 'inline-flex' } }}>
          Iniciar Sesión
        </Button>
      </Link>
      <Link href={String('/register')}>
        <Button variant="contained">Regístrate</Button>
      </Link>

      <ThemeToggleButton />
    </Box>
  );

  return (
    <NavbarShell left={left} right={right} />
  );
}
