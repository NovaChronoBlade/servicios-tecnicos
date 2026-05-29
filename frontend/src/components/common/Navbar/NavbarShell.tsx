"use client";

import { alpha, AppBar, Box, Container, Toolbar, useTheme } from '@mui/material';
import type { ReactNode } from 'react';

type NavbarShellProps = {
  left: ReactNode;
  center?: ReactNode;
  right: ReactNode;
};

export function NavbarShell({ left, center, right }: NavbarShellProps) {
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: alpha(theme.palette.background.paper, 0.88),
        color: 'text.primary',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 76, py: 1.25, gap: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>{left}</Box>
          {center ? (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', flex: 1, px: 2 }}>
              {center}
            </Box>
          ) : null}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>{right}</Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}