"use client";

import { APP_ROUTES } from '@/constants/routes.constants';
import type { ServicioListItem } from '@/services/servicios.service';
import { Box, Button, Card, CardActions, CardContent, Chip } from '@mui/material';
import { ArrowRight, Clock3, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ServicioCardProps = {
	servicio: ServicioListItem;
	compact?: boolean;
};

export function ServicioCard({ servicio, compact = false }: ServicioCardProps) {
	const router = useRouter();

	return (
		<Card
			variant="outlined"
			sx={{
				borderRadius: 3,
				borderColor: 'divider',
				bgcolor: 'background.paper',
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
							{servicio.nombre}
						</Box>
						<Box component="p" sx={{ m: 0, mt: 0.5, fontSize: '0.875rem', color: 'text.secondary' }}>
							{servicio.categoriaNombre}
						</Box>
					</Box>
					<Chip label={`$${Number(servicio.precio).toLocaleString('es-CO')}`} color="primary" variant="outlined" />
				</Box>

				<Box component="p" sx={{ m: 0, minHeight: compact ? 42 : 56, fontSize: '0.875rem', color: 'text.secondary' }}>
					{servicio.descripcion}
				</Box>

				<Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap' }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
						<Clock3 size={16} />
						<Box component="span" sx={{ fontSize: '0.75rem' }}>{servicio.tiempoEstimado}</Box>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
						<Star size={16} fill="currentColor" />
						<Box component="span" sx={{ fontSize: '0.75rem' }}>{servicio.puntuacionPromedio.toFixed(1)} / 5</Box>
					</Box>
				</Box>
			</CardContent>

			<CardActions sx={{ px: compact ? 2 : 2.5, pb: compact ? 2 : 2.5, pt: 0, justifyContent: 'space-between' }}>
				<Chip size="small" label={servicio.activo ? 'Disponible' : 'No disponible'} color={servicio.activo ? 'success' : 'default'} variant="outlined" />
				<Button
					size="small"
					endIcon={<ArrowRight size={16} />}
					onClick={() => router.push(APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.DETAIL(servicio.id_servicio))}
					disabled={!servicio.activo}
				>
					Solicitar
				</Button>
			</CardActions>
		</Card>
	);
}
