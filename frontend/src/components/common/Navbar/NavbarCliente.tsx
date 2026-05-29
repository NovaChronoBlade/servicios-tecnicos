"use client";

import { ThemeToggleButton } from '@/components/common/ThemeToggle/ThemeToggleButton';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useAuthStore } from '@/store/authStore';
import { Avatar, Box, Button, Chip, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { ArrowRight, Headset, LogOut, Settings, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { NavbarShell } from './NavbarShell';

const navigation = [
	{ label: 'Dashboard', href: APP_ROUTES.CLIENT.DASHBOARD },
	{ label: 'Servicios', href: APP_ROUTES.CLIENT.SERVICIOS.ROOT },
	{ label: 'Solicitudes', href: APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT },
	{ label: 'Perfil', href: APP_ROUTES.CLIENT.PERFIL.ROOT },
];

export function NavbarCliente() {
	const { user, logout } = useAuthStore();
	const router = useRouter();
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const isMenuOpen = Boolean(menuAnchor);

	const initials = useMemo(() => {
		const nombre = user?.nombre?.trim() ?? 'Cliente';
		return nombre
			.split(/\s+/)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join('');
	}, [user?.nombre]);

	const left = (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
			<Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
				<Headset size={20} />
			</Avatar>
			<Box sx={{ minWidth: 0 }}>
				<Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1 }} noWrap>
					Servicios Técnicos
				</Typography>
				<Typography variant="caption" color="text.secondary" noWrap>
					Centro operativo del cliente
				</Typography>
			</Box>
		</Box>
	);

	const center = (
		<Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
			{navigation.map((item) => (
				<Button key={item.href} component={Link} href={item.href} variant="text" sx={{ color: 'text.primary' }}>
					{item.label}
				</Button>
			))}
		</Box>
	);

	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
		setMenuAnchor(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setMenuAnchor(null);
	};

	const handleGoToSettings = () => {
		handleCloseMenu();
		router.push(APP_ROUTES.CLIENT.PERFIL.EDITAR);
	};

	const handleLogout = () => {
		handleCloseMenu();
		logout();
		router.replace(APP_ROUTES.LOGIN);
	};

	const right = (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
			<Chip icon={<Sparkles size={14} />} label={user?.rol ?? 'cliente'} color="primary" variant="outlined" />
			<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
				<Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
					{user?.nombre ?? 'Cliente'}
				</Typography>
				<Typography variant="caption" color="text.secondary" noWrap>
					{user?.correo ?? 'Sesión activa'}
				</Typography>
			</Box>
			<IconButton
				onClick={handleOpenMenu}
				size="small"
				sx={{
					p: 0.25,
					border: '1px solid',
					borderColor: isMenuOpen ? 'primary.main' : 'divider',
				}}
			>
				<Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', color: 'secondary.contrastText', fontSize: 13, fontWeight: 800 }}>
					{initials}
				</Avatar>
			</IconButton>

			<Menu
				anchorEl={menuAnchor}
				open={isMenuOpen}
				onClose={handleCloseMenu}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<MenuItem onClick={handleGoToSettings}>
					<ListItemIcon>
						<Settings size={16} />
					</ListItemIcon>
					Ajustes
				</MenuItem>
				<MenuItem onClick={handleLogout}>
					<ListItemIcon>
						<LogOut size={16} />
					</ListItemIcon>
					Cerrar sesión
				</MenuItem>
			</Menu>
			<ThemeToggleButton size="small" />
			<Button variant="contained" component={Link} href={APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.ROOT} endIcon={<ArrowRight size={16} />} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
				Solicitar
			</Button>
		</Box>
	);

	return <NavbarShell left={left} center={center} right={right} />;
}
