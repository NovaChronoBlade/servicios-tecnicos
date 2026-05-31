"use client";

import { APP_ROUTES } from '@/constants/routes.constants';
import type { SolicitudView } from '@/services/solicitudes.service';
import { alpha, Box, Button, Card, CardActions, CardContent, Chip, Divider, Typography, useTheme } from '@mui/material';
import { ArrowRight, CalendarClock, MapPin, Phone, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

type SolicitudDisponibleCardProps = {
	solicitud: SolicitudView;
	compact?: boolean;
};

const priorityColor = {
	Alta: 'error',
	Media: 'warning',
	Baja: 'success',
} as const;

export function SolicitudDisponibleCard({ solicitud, compact = false }: SolicitudDisponibleCardProps) {
	const router = useRouter();
	const theme = useTheme();

	return (
		<Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider', transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 16px 40px ${alpha(theme.palette.common.black, 0.08)}`, borderColor: 'primary.main' } }}>
			<CardContent sx={{ p: compact ? 2 : 2.5 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
					<Box>
						<Typography variant={compact ? 'subtitle1' : 'h6'} sx={{ fontWeight: 800 }}>
							{solicitud.servicioNombre}
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
							{solicitud.servicioCategoria}
						</Typography>
					</Box>
					<Chip label={solicitud.prioridad} color={priorityColor[solicitud.prioridad]} variant="outlined" />
				</Box>

				<Box sx={{ display: 'grid', gap: 1.15 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
						<CalendarClock size={16} />
						<Typography variant="body2">{new Date(solicitud.fecha_programada ?? solicitud.fecha).toLocaleString('es-CO')}</Typography>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
						<MapPin size={16} />
						<Typography variant="body2">{solicitud.direccionResumen}</Typography>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
						<UserRound size={16} />
						<Typography variant="body2">{solicitud.clienteNombre}</Typography>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
						<Phone size={16} />
						<Typography variant="body2">{solicitud.clienteTelefono}</Typography>
					</Box>
				</Box>

				<Divider sx={{ my: 2 }} />

				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
					<Chip size="small" label={`${solicitud.distanciaKm.toFixed(1)} km`} />
					<Chip size="small" label={solicitud.tiempoEstimado} variant="outlined" />
					<Chip size="small" label={solicitud.valorEstimado} color="primary" variant="outlined" />
				</Box>
			</CardContent>

			<CardActions sx={{ px: compact ? 2 : 2.5, pb: compact ? 2 : 2.5, pt: 0, justifyContent: 'space-between' }}>
				<Typography variant="caption" color="text.secondary">ID {solicitud.id_ss}</Typography>
				<Button size="small" endIcon={<ArrowRight size={16} />} onClick={() => router.push(APP_ROUTES.TECNICO.SOLICITUDES_DISPONIBLES.DETAIL(solicitud.id_ss))}>
					Ver detalle
				</Button>
			</CardActions>
		</Card>
	);
}
