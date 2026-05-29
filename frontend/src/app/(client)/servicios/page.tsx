import { clientServicesMock } from '@/mocks/client-pages.mock';
import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { ServicioCard } from '@/components/cliente/ServicioCard/ServicioCard';
import { Box, Button, Divider } from '@mui/material';
import Link from 'next/link';
import { APP_ROUTES } from '@/constants/routes.constants';

export default function ServiciosPage() {
	return (
		<Box sx={{ p: { xs: 2, md: 4 } }}>
			<ClientPageHeader
				eyebrow="Catálogo"
				title="Servicios disponibles"
				description="Elige un servicio y solicita atención desde la ruta dedicada."
				chips={[
					{ label: 'Climatización' },
					{ label: 'Electricidad' },
					{ label: 'Plomería' },
					{ label: 'Electrodomésticos' },
				]}
				actions={
					<Button component={Link} href={APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.ROOT} variant="contained">
						Solicitar un servicio
					</Button>
				}
			/>

			<Divider sx={{ mb: 3 }} />

			<Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' } }}>
				{clientServicesMock.map((servicio) => (
					<ServicioCard key={servicio.id_servicio} servicio={servicio} compact />
				))}
			</Box>

		</Box>
	);
}
