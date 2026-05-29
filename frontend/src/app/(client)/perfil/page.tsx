import { clientUserMock } from '@/mocks/client-pages.mock';
import { APP_ROUTES } from '@/constants/routes.constants';
import { Box, Button, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';

export default function PerfilPage() {
	return (
		<Box sx={{ p: { xs: 2, md: 4 } }}>
			<ClientPageHeader
				eyebrow="Cuenta"
				title={clientUserMock.nombre}
				description={clientUserMock.correo}
				actions={
					<Button component={Link} href={APP_ROUTES.CLIENT.PERFIL.EDITAR} variant="contained">
						Editar perfil
					</Button>
				}
			/>

			<Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, mt: 3 }}>
				<Typography variant="body1" color="text.secondary">{clientUserMock.telefono}</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Documento: {clientUserMock.documento}</Typography>
			</Paper>
		</Box>
	);
}
