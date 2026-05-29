'use client';

import React from 'react';
import { ClientLayoutFrame } from '@/components/common/ClientLayout/ClientLayoutFrame';
import { AuthGuard } from '@/components/common/ProtectedRoute/ProtectedRoute';
import { UserRole } from '@/types/user.types';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={[UserRole.CLIENTE]}>
      <ClientLayoutFrame>{children}</ClientLayoutFrame>
    </AuthGuard>
  );
}
