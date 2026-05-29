import { Box, Divider } from '@mui/material';
import { clientRequestsMock } from '@/mocks/client-pages.mock';
import { SolicitudCard } from '@/components/cliente/SolicitudCard/SolicitudCard';
import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';

export default function MisSolicitudesPage() {
	return (
		<Box sx={{ p: { xs: 2, md: 4 } }}>
			<ClientPageHeader
				eyebrow="Actividad"
				title="Mis solicitudes"
				description="Revisa el estado de cada atención y entra al detalle cuando lo necesites."
			/>

			<Divider sx={{ mb: 3 }} />

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				{clientRequestsMock.map((solicitud) => (
					<SolicitudCard key={solicitud.id_ss} solicitud={solicitud} />
				))}
			</Box>
		</Box>
	);
}
