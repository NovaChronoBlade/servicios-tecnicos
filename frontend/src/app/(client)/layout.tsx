'use client';

import React from 'react';
import { AuthGuard } from '@/components/common/ProtectedRoute/ProtectedRoute';
import { UserRole } from '@/types/user.types';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard allowedRoles={[UserRole.CLIENTE]}>{children}</AuthGuard>;
}
