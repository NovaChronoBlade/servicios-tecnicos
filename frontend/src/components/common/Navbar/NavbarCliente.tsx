"use client";

import { ThemeToggleButton } from '@/components/common/ThemeToggle/ThemeToggleButton';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useAuthStore } from '@/store/authStore';
import { alpha, AppBar, Avatar, Box, Button, Chip, Container, Toolbar, useTheme } from '@mui/material';
import { ArrowRight, Headset, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

const navigation = [
	{ label: 'Dashboard', href: APP_ROUTES.CLIENT.DASHBOARD },
	{ label: 'Servicios', href: APP_ROUTES.CLIENT.SERVICIOS.ROOT },
	{ label: 'Solicitudes', href: APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT },
	{ label: 'Perfil', href: APP_ROUTES.CLIENT.PERFIL.ROOT },
];

export function NavbarCliente() {
	const { user } = useAuthStore();
	const theme = useTheme();

	const initials = useMemo(() => {
		const nombre = user?.nombre?.trim() ?? 'Cliente';
		return nombre
			.split(/\s+/)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join('');
	}, [user?.nombre]);

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
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
						<Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
							<Headset size={20} />
						</Avatar>
						<Box>
							<Box component="span" sx={{ display: 'block', fontSize: '1rem', fontWeight: 800, lineHeight: 1.1 }}>
								Servicios Técnicos
							</Box>
							<Box component="span" sx={{ display: 'block', fontSize: '0.75rem', color: 'text.secondary' }}>
								Centro operativo del cliente
							</Box>
						</Box>
					</Box>

					<Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 1.5 }}>
						{navigation.map((item) => (
							<Button key={item.href} component={Link} href={item.href} variant="text" sx={{ color: 'text.primary' }}>
								{item.label}
							</Button>
						))}
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
						<Chip icon={<Sparkles size={14} />} label={user?.rol ?? 'cliente'} color="primary" variant="outlined" />
						<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
							<Box component="span" sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 700 }}>
								{user?.nombre ?? 'Cliente'}
							</Box>
							<Box component="span" sx={{ display: 'block', fontSize: '0.75rem', color: 'text.secondary' }}>
								{user?.correo ?? 'Sesión activa'}
							</Box>
						</Box>
						<Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', color: 'secondary.contrastText', fontSize: 13, fontWeight: 800 }}>
							{initials}
						</Avatar>
						<ThemeToggleButton size="small" />
						<Button
							variant="contained"
							component={Link}
							href={APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.ROOT}
							endIcon={<ArrowRight size={16} />}
							sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
						>
							Solicitar
						</Button>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
