import { getCalificacionById, topTechniciansMock } from '@/mocks/client-pages.mock';
import { Box, Paper, Typography } from '@mui/material';
import { ClientDetailHero } from '@/components/common/ClientPage/ClientDetailHero';

export default async function CalificacionDetallePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const calificacion = getCalificacionById(id);
	const tecnico = topTechniciansMock.find((item) => item.id_tecnico === calificacion.id_tecnico) ?? topTechniciansMock[0];

	return (
		<Box sx={{ p: { xs: 2, md: 4 } }}>
			<ClientDetailHero
				eyebrow="Opinión registrada"
				title={`Calificación de ${tecnico.nombre}`}
				description={calificacion.comentario ?? 'Sin comentario registrado.'}
				facts={[
					{ label: 'Puntuación', value: `${calificacion.puntuacion} / 5`, accent: 'warning' },
					{ label: 'Tecnico', value: tecnico.nombre, accent: 'secondary' },
					{ label: 'Reseñas', value: `${tecnico.total_calificaciones} valoraciones`, accent: 'info' },
					{ label: 'ID', value: calificacion.id_calificacion, accent: 'primary' },
				]}
			/>

			<Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, mt: 3 }}>
				<Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
					<Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
						<Typography variant="caption" color="text.secondary">Resumen</Typography>
						<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>Experiencia registrada después del servicio</Typography>
					</Paper>
					<Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
						<Typography variant="caption" color="text.secondary">Impacto</Typography>
						<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>Usado para priorizar técnicos mejor valorados</Typography>
					</Paper>
					<Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
						<Typography variant="caption" color="text.secondary">Seguimiento</Typography>
						<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>Visible en el historial del cliente</Typography>
					</Paper>
				</Box>
			</Paper>
		</Box>
	);
}
