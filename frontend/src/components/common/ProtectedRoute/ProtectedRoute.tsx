'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useAuthStore } from '@/store/authStore';
import { APP_ROUTES } from '@/constants/routes.constants';
import type { UserRole } from '@/types/user.types';

interface AuthGuardProps {
  children:     React.ReactNode;
  allowedRoles: UserRole[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated, user } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !user) {
      router.replace(APP_ROUTES.LOGIN);
      return;
    }

    if (!allowedRoles.includes(user.rol)) {
      router.replace(`${APP_ROUTES.LOGIN}?role=forbidden`);
    }
  }, [isHydrated, isAuthenticated, user, allowedRoles, router]);

  if (!isHydrated) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user || !allowedRoles.includes(user.rol)) {
    return null;
  }

  return <>{children}</>;
}