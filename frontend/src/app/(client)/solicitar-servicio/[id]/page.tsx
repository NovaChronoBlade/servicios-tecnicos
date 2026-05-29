import { APP_ROUTES } from '@/constants/routes.constants';
import { getServicioById } from '@/mocks/client-pages.mock';
import { Box, Button, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default async function SolicitarServicioDetallePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const servicio = getServicioById(id);

	return (
		<Box sx={{ p: { xs: 2, md: 4 } }}>
			<Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
				<Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
					{servicio.nombre}
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Finaliza el flujo de solicitud con este servicio.
				</Typography>

				<Box sx={{ mt: 3, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
					<Button component={Link} href={APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.SUCCESS} variant="contained">
						Confirmar solicitud
					</Button>
					<Button component={Link} href={APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.ROOT} variant="outlined">
						Volver
					</Button>
				</Box>
			</Paper>
		</Box>
	);
}
