import { APP_ROUTES } from '@/constants/routes.constants';
import { getServicioById } from '@/mocks/client-pages.mock';
import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import { ClientDetailHero } from '@/components/common/ClientPage/ClientDetailHero';

export default async function ServicioDetallePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const servicio = getServicioById(id);

	return (
		<Box sx={{ p: { xs: 2, md: 4 } }}>
			<ClientDetailHero
				eyebrow="Ficha de servicio"
				title={servicio.nombre}
				description={servicio.descripcion}
				chips={<Chip label={servicio.categoriaNombre} color="primary" />}
				facts={[
					{ label: 'Precio', value: `$${Number(servicio.precio).toLocaleString('es-CO')}`, accent: 'primary' },
					{ label: 'Tiempo estimado', value: servicio.tiempoEstimado, accent: 'secondary' },
					{ label: 'Calificación', value: `${servicio.puntuacionPromedio.toFixed(1)} / 5`, accent: 'success' },
					{ label: 'ID de servicio', value: servicio.id_servicio, accent: 'info' },
				]}
				actions={
					<>
						<Button component={Link} href={APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.DETAIL(servicio.id_servicio)} variant="contained">
							Solicitar este servicio
						</Button>
						<Button component={Link} href={APP_ROUTES.CLIENT.SERVICIOS.ROOT} variant="outlined">
							Volver a servicios
						</Button>
					</>
				}
			/>

			<Divider sx={{ my: 3 }} />

			<Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
				<Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
					<Typography variant="overline" color="text.secondary">Cobertura</Typography>
					<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>Atención a domicilio y seguimiento posterior</Typography>
				</Paper>
				<Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
					<Typography variant="overline" color="text.secondary">Disponibilidad</Typography>
					<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>Agenda flexible con confirmación en el día</Typography>
				</Paper>
				<Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
					<Typography variant="overline" color="text.secondary">Soporte</Typography>
					<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>Acompañamiento antes, durante y después del servicio</Typography>
				</Paper>
			</Box>
		</Box>
	);
}
