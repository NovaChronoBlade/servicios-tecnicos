import { APP_ROUTES } from '@/constants/routes.constants';
import { clientServicesMock } from '@/mocks/client-pages.mock';
import { Box, Button, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';

export default function SolicitarServicioPage() {
	const featured = clientServicesMock[0];

	return (
		<Box sx={{ p: { xs: 2, md: 4 } }}>
			<ClientPageHeader
				eyebrow="Flujo"
				title="Solicitar servicio"
				description="El cliente selecciona un servicio y una dirección propia para crear una solicitud pendiente, que luego podrá seguir, pagar y calificar."
				chips={[
					{ label: 'Solicitud pendiente' },
					{ label: 'Dirección requerida' },
					{ label: 'Pago posterior' },
				]}
			/>

			<Box sx={{ display: 'grid', gap: 3, mt: 3, gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.1fr) minmax(320px, 0.9fr)' } }}>
				<Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
					<Typography variant="overline" color="text.secondary">Servicio sugerido</Typography>
					<Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>{featured.nombre}</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{featured.descripcion}</Typography>

					<Box sx={{ display: 'grid', gap: 1.5, mt: 3 }}>
						<Typography variant="body2" color="text.secondary">1. Elige un servicio del catálogo.</Typography>
						<Typography variant="body2" color="text.secondary">2. Selecciona tu dirección guardada.</Typography>
						<Typography variant="body2" color="text.secondary">3. Envía la solicitud para asignación o seguimiento.</Typography>
					</Box>

					<Button component={Link} href={APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.DETAIL(featured.id_servicio)} variant="contained" sx={{ mt: 3 }}>
						Continuar con la solicitud
					</Button>
				</Paper>

				<Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, bgcolor: 'background.paper' }}>
					<Typography variant="h6" sx={{ fontWeight: 800 }}>Qué resuelve este flujo</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
						Organiza en un solo lugar la publicación de servicios, la creación de solicitudes y el seguimiento hasta el pago y la calificación posterior.
					</Typography>

					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 3 }}>
						<Button component={Link} href={APP_ROUTES.CLIENT.SERVICIOS.ROOT} variant="outlined">
							Ver catálogo completo
						</Button>
						<Button component={Link} href={APP_ROUTES.CLIENT.DIRECCIONES.ROOT} variant="text">
							Confirmar direcciones guardadas
						</Button>
					</Box>
				</Paper>
			</Box>
		</Box>
	);
}
