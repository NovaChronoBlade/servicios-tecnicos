"use client";

import { alpha, Box, Button, Chip, Paper, Typography, useTheme } from '@mui/material';
import type { ReactNode } from 'react';

type ClientPageHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  chips?: Array<{ label: string; color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }>;
  actions?: ReactNode;
};

export function ClientPageHeader({ title, description, eyebrow, chips = [], actions }: ClientPageHeaderProps) {
  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark ?? theme.palette.primary.main} 52%, ${theme.palette.secondary.main} 100%)`,
        color: 'common.white',
        boxShadow: `0 24px 80px ${alpha(theme.palette.primary.main, 0.16)}`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at top right, ${alpha(theme.palette.common.white, 0.18)}, transparent 32%), radial-gradient(circle at bottom left, ${alpha(theme.palette.common.white, 0.12)}, transparent 28%)`,
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          {eyebrow ? <Chip label={eyebrow} sx={{ bgcolor: alpha(theme.palette.common.white, 0.12), color: 'common.white' }} /> : null}
          {chips.map((chip) => (
            <Chip key={chip.label} label={chip.label} color={chip.color ?? 'default'} sx={{ bgcolor: alpha(theme.palette.common.white, 0.12), color: 'common.white' }} />
          ))}
        </Box>

        <Box>
          <Typography variant="h4" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 800 }}>
            {title}
          </Typography>
          {description ? (
            <Typography variant="body1" sx={{ maxWidth: 760, color: alpha(theme.palette.common.white, 0.84), mt: 1 }}>
              {description}
            </Typography>
          ) : null}
        </Box>

        {actions ? <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>{actions}</Box> : null}
      </Box>
    </Paper>
  );
}