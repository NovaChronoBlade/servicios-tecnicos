'use client';

import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useContext } from 'react';
import { ColorModeContext } from '@/theme/ThemeProvider';
import { useTheme } from '@mui/material/styles';

export function TopNavBar() {
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={1}
      sx={{ backdropFilter: 'blur(6px)', bgcolor: 'background.paper' }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: 1280,
          mx: 'auto',
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href={String('/')} style={{ textDecoration: 'none' }}>
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: 700, color: 'primary.main' }}
            >
              Servicios Técnicos
            </Typography>
          </Link>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Link href={String('/login')}>
            <Button
              variant="outlined"
              sx={{ display: { xs: 'none', lg: 'inline-flex' } }}
            >
              Iniciar Sesión
            </Button>
          </Link>
          <Link href={String('/register')}>
            <Button variant="contained">Regístrate</Button>
          </Link>

          <IconButton
            aria-label="toggle theme"
            onClick={() => colorMode.toggleColorMode()}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              {theme.palette.mode === 'dark' ? 'dark_mode' : 'light_mode'}
            </span>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
