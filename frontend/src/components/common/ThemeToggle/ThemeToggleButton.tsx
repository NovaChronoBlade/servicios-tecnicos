"use client";

import { ColorModeContext } from '@/theme/ThemeProvider';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import { MoonStar, SunMedium } from 'lucide-react';
import { useContext } from 'react';

type ThemeToggleButtonProps = {
  size?: 'small' | 'medium' | 'large';
};

export function ThemeToggleButton({ size = 'medium' }: ThemeToggleButtonProps) {
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Tooltip title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
      <IconButton
        aria-label="toggle theme"
        onClick={() => colorMode.toggleColorMode()}
        size={size}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Box sx={{ display: 'grid', placeItems: 'center' }}>
          {isDark ? <SunMedium size={18} /> : <MoonStar size={18} />}
        </Box>
      </IconButton>
    </Tooltip>
  );
}