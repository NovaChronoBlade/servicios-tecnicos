"use client";

import { alpha, Box, Paper, Typography, useTheme } from '@mui/material';
import type { ReactNode } from 'react';

type DetailFact = {
  label: string;
  value: ReactNode;
  accent?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
};

type ClientDetailHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  chips?: ReactNode;
  facts: DetailFact[];
  actions?: ReactNode;
  secondary?: ReactNode;
};

const accentMap = {
  default: 'text.primary',
  primary: 'primary.main',
  secondary: 'secondary.main',
  success: 'success.main',
  warning: 'warning.main',
  error: 'error.main',
  info: 'info.main',
} as const;

export function ClientDetailHero({ eyebrow, title, description, chips, facts, actions, secondary }: ClientDetailHeroProps) {
  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        background: `linear-gradient(140deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.08)} 42%, ${alpha(theme.palette.secondary.main, 0.14)} 100%)`,
        borderColor: alpha(theme.palette.primary.main, 0.18),
        boxShadow: `0 28px 90px ${alpha(theme.palette.common.black, 0.08)}`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at top right, ${alpha(theme.palette.primary.main, 0.12)}, transparent 30%), radial-gradient(circle at bottom left, ${alpha(theme.palette.secondary.main, 0.1)}, transparent 28%)`,
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1, display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.25fr) minmax(320px, 0.75fr)' }, alignItems: 'start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            <Typography variant="overline" sx={{ letterSpacing: 2.5, fontWeight: 800, color: 'text.secondary' }}>
              {eyebrow}
            </Typography>
            {chips}
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 800, lineHeight: 1.02 }}>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, mt: 1.25, fontSize: '1.02rem' }}>
              {description}
            </Typography>
          </Box>

          {actions ? <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>{actions}</Box> : null}

          {secondary ? <Box sx={{ pt: 1 }}>{secondary}</Box> : null}
        </Box>

        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.background.paper, 0.88),
            backdropFilter: 'blur(12px)',
          }}
        >
          <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' } }}>
            {facts.map((fact) => (
              <Paper key={fact.label} variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.common.white, 0.7) }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  {fact.label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: accentMap[fact.accent ?? 'default'] }}>
                  {fact.value}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Box>
    </Paper>
  );
}
