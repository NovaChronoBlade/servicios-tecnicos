"use client";

import { AuthGuard } from '@/components/common/ProtectedRoute/ProtectedRoute';
import { NavbarAdmin } from '@/components/common/Navbar/NavbarAdmin';
import { UserRole } from '@/types/user.types';
import { alpha, Box, useTheme } from '@mui/material';
import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <AuthGuard allowedRoles={[UserRole.ADMIN]}>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.98)} 0%, ${theme.palette.background.paper} 100%)` }}>
        <NavbarAdmin />
        <Box component="main" sx={{ flex: 1 }}>
          {children}
        </Box>
      </Box>
    </AuthGuard>
  );
}
