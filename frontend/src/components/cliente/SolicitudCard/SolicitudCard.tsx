"use client";

import { APP_ROUTES } from '@/constants/routes.constants';
import type { DashboardSolicitudMock } from '@/mocks/client-dashboard.mock';
import { Box, Button, Card, CardActions, CardContent, Chip, Divider } from '@mui/material';
import { ArrowRight, CalendarClock, MapPin, MessageCircle, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

type SolicitudCardProps = {
	solicitud: DashboardSolicitudMock;
	compact?: boolean;
};

const estadoLabels: Record<string, { label: string; color: 'default' | 'info' | 'warning' | 'success' | 'error' }> = {
	pendiente: { label: 'Pendiente', color: 'warning' },
	aceptado: { label: 'Aceptada', color: 'info' },
	en_curso: { label: 'En curso', color: 'info' },
	completado: { label: 'Completada', color: 'success' },
	cancelado: { label: 'Cancelada', color: 'error' },
};

export function SolicitudCard({ solicitud, compact = false }: SolicitudCardProps) {
	const router = useRouter();
	const estado = estadoLabels[solicitud.estado] ?? { label: solicitud.estado, color: 'default' };

	return (
		<Card
			variant="outlined"
			sx={{
				borderRadius: 3,
				borderColor: 'divider',
				transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
				'&:hover': {
					transform: 'translateY(-2px)',
					boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)',
					borderColor: 'primary.main',
				},
			}}
		>
			<CardContent sx={{ p: compact ? 2 : 2.5 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
					<Box>
						<Box component={compact ? 'h3' : 'h2'} sx={{ m: 0, fontSize: compact ? '1rem' : '1.25rem', fontWeight: 700, lineHeight: 1.1 }}>
							{solicitud.servicioNombre}
						</Box>
						<Box component="p" sx={{ m: 0, mt: 0.5, fontSize: '0.875rem', color: 'text.secondary' }}>
							{solicitud.servicioCategoria}
						</Box>
					</Box>
					<Chip label={estado.label} color={estado.color} variant="outlined" />
				</Box>

				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, color: 'text.secondary' }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<CalendarClock size={16} />
						<Box component="span" sx={{ fontSize: '0.875rem' }}>Programada para {new Date(solicitud.fecha_programada ?? solicitud.fecha).toLocaleString('es-CO')}</Box>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<MapPin size={16} />
						<Box component="span" sx={{ fontSize: '0.875rem' }}>{solicitud.direccionResumen}</Box>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<UserRound size={16} />
						<Box component="span" sx={{ fontSize: '0.875rem' }}>{solicitud.tecnicoNombre ?? 'Técnico por asignar'}</Box>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<MessageCircle size={16} />
						<Box component="span" sx={{ fontSize: '0.875rem' }}>Prioridad {solicitud.prioridad}</Box>
					</Box>
				</Box>

				<Divider sx={{ my: 2 }} />

				<Box component="p" sx={{ m: 0, fontSize: '0.875rem', color: 'text.secondary' }}>
					ID de solicitud: {solicitud.id_ss}
				</Box>
			</CardContent>

			<CardActions sx={{ px: compact ? 2 : 2.5, pb: compact ? 2 : 2.5, pt: 0, justifyContent: 'space-between' }}>
				<Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
					{solicitud.confirmacion_cliente ? 'Confirmada por el cliente' : 'Pendiente de confirmación'}
				</Box>
				<Button size="small" endIcon={<ArrowRight size={16} />} onClick={() => router.push(APP_ROUTES.CLIENT.MIS_SOLICITUDES.ROOT)}>
					Ver solicitudes
				</Button>
			</CardActions>
		</Card>
	);
}
