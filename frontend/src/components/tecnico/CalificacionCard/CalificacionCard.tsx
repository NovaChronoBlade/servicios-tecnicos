"use client";

import type { CalificacionListItem } from '@/services/calificaciones.service';
import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import { Star } from 'lucide-react';

type CalificacionCardProps = {
	calificacion: CalificacionListItem;
};

export function CalificacionCard({ calificacion }: CalificacionCardProps) {
	return (
		<Card variant="outlined" sx={{ borderRadius: 3 }}>
			<CardContent sx={{ p: 2.5 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'start' }}>
					<Box>
						<Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{calificacion.clienteNombre}</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{calificacion.servicioNombre}</Typography>
					</Box>
					<Chip icon={<Star size={14} fill="currentColor" />} label={`${calificacion.puntuacion} / 5`} color="primary" variant="outlined" />
				</Box>
				<Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
					{calificacion.comentario ?? 'Sin comentario.'}
				</Typography>
				<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
					{new Date(calificacion.fecha_calificacion).toLocaleDateString('es-CO')}
				</Typography>
			</CardContent>
		</Card>
	);
}
