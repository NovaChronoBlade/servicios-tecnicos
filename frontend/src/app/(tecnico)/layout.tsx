"use client";

import { AuthGuard } from '@/components/common/ProtectedRoute/ProtectedRoute';
import { NavbarTecnico } from '@/components/common/Navbar/NavbarTecnico';
import { UserRole } from '@/types/user.types';
import { alpha, Box, useTheme } from '@mui/material';
import type { ReactNode } from 'react';

export default function TecnicoLayout({ children }: { children: ReactNode }) {
	const theme = useTheme();

	return (
		<AuthGuard allowedRoles={[UserRole.TECNICO]}>
			<Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.98)} 0%, ${theme.palette.background.paper} 100%)` }}>
				<NavbarTecnico />
				<Box component="main" sx={{ flex: 1 }}>
					{children}
				</Box>
			</Box>
		</AuthGuard>
	);
}
