"use client";

import { ThemeToggleButton } from '@/components/common/ThemeToggle/ThemeToggleButton';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useAuthStore } from '@/store/authStore';
import { Avatar, Box, Button, Chip, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { ArrowRight, ClipboardList, LogOut, Settings, Sparkles, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { NavbarShell } from './NavbarShell';

const navigation = [
	{ label: 'Dashboard', href: APP_ROUTES.TECNICO.DASHBOARD },
	{ label: 'Disponibles', href: APP_ROUTES.TECNICO.SOLICITUDES_DISPONIBLES.ROOT },
	{ label: 'Mis solicitudes', href: APP_ROUTES.TECNICO.MIS_SOLICITUDES.ROOT },
	{ label: 'Datos técnicos', href: APP_ROUTES.TECNICO.DATOS_TECNICOS.ROOT },
	{ label: 'Disponibilidad', href: APP_ROUTES.TECNICO.DISPONIBILIDAD },
	{ label: 'Calificaciones', href: APP_ROUTES.TECNICO.CALIFICACIONES },
	{ label: 'Perfil', href: APP_ROUTES.TECNICO.PERFIL.ROOT },
];

export function NavbarTecnico() {
	const { user, logout } = useAuthStore();
	const router = useRouter();
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const isMenuOpen = Boolean(menuAnchor);

	const initials = useMemo(() => {
		const nombre = user?.nombre?.trim() ?? 'Técnico';
		return nombre
			.split(/\s+/)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join('');
	}, [user?.nombre]);

	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
		setMenuAnchor(event.currentTarget);
	};

	const handleCloseMenu = () => setMenuAnchor(null);
	const handleSettings = () => {
		handleCloseMenu();
		router.push(APP_ROUTES.TECNICO.DATOS_TECNICOS.EDITAR);
	};
	const handleLogout = () => {
		handleCloseMenu();
		logout();
		router.replace(APP_ROUTES.LOGIN);
	};

	const left = (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
			<Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
				<Wrench size={20} />
			</Avatar>
			<Box sx={{ minWidth: 0 }}>
				<Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1 }} noWrap>
					Centro técnico
				</Typography>
				<Typography variant="caption" color="text.secondary" noWrap>
					Operación de servicio a domicilio
				</Typography>
			</Box>
		</Box>
	);

	const center = (
		<Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
			{navigation.map((item) => (
				<Button key={item.href} component={Link} href={item.href} variant="text" sx={{ color: 'text.primary' }}>
					{item.label}
				</Button>
			))}
		</Box>
	);

	const right = (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
			<Chip icon={<Sparkles size={14} />} label={user?.rol ?? 'tecnico'} color="primary" variant="outlined" />
			<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
				<Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
					{user?.nombre ?? 'Técnico'}
				</Typography>
				<Typography variant="caption" color="text.secondary" noWrap>
					{user?.correo ?? 'Sesión activa'}
				</Typography>
			</Box>
			<IconButton
				onClick={handleOpenMenu}
				size="small"
				sx={{ p: 0.25, border: '1px solid', borderColor: isMenuOpen ? 'primary.main' : 'divider' }}
			>
				<Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', color: 'secondary.contrastText', fontSize: 13, fontWeight: 800 }}>
					{initials}
				</Avatar>
			</IconButton>

			<Menu anchorEl={menuAnchor} open={isMenuOpen} onClose={handleCloseMenu} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
				<MenuItem onClick={handleSettings}>
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
			<Button variant="contained" component={Link} href={APP_ROUTES.TECNICO.SOLICITUDES_DISPONIBLES.ROOT} endIcon={<ArrowRight size={16} />} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
				Revisar solicitudes
			</Button>
		</Box>
	);

	return <NavbarShell left={left} center={center} right={right} />;
}