"use client";

import { DashboardFooter } from '@/components/common/Footer/DashboardFooter';
import { NavbarCliente } from '@/components/common/Navbar/NavbarCliente';
import { alpha, Box, useTheme } from '@mui/material';
import type { ReactNode } from 'react';

type ClientLayoutFrameProps = {
  children: ReactNode;
};

export function ClientLayoutFrame({ children }: ClientLayoutFrameProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.96)} 0%, ${theme.palette.background.paper} 100%)`,
      }}
    >
      <NavbarCliente />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <DashboardFooter />
    </Box>
  );
}