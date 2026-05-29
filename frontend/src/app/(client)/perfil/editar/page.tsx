import { clientUserMock } from '@/mocks/client-pages.mock';
import { Box, Paper, TextField, Typography, Button } from '@mui/material';
import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';

export default function PerfilEditarPage() {
	return (
		<Box sx={{ p: { xs: 2, md: 4 } }}>
			<ClientPageHeader
				eyebrow="Edición"
				title="Editar perfil"
				description="Actualiza tus datos básicos y mantén tu cuenta al día."
			/>

			<Box sx={{ display: 'grid', gap: 3, mt: 3, gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.1fr) minmax(300px, 0.9fr)' } }}>
				<Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
					<Box sx={{ display: 'grid', gap: 2 }}>
						<TextField label="Nombre" defaultValue={clientUserMock.nombre} fullWidth />
						<TextField label="Correo" defaultValue={clientUserMock.correo} fullWidth />
						<TextField label="Teléfono" defaultValue={clientUserMock.telefono} fullWidth />
						<Button variant="contained" sx={{ justifySelf: 'start' }}>Guardar cambios</Button>
					</Box>
				</Paper>

				<Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
					<Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 800 }} color="text.secondary">
						Perfil conectado
					</Typography>
					<Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
						{clientUserMock.nombre}
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1.25, mb: 2.25 }}>
						Estos datos se usan en solicitudes, pagos y notificaciones.
					</Typography>

					<Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' } }}>
						<Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
							<Typography variant="caption" color="text.secondary">Correo</Typography>
							<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5, overflowWrap: 'anywhere' }}>
								{clientUserMock.correo}
							</Typography>
						</Paper>
						<Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
							<Typography variant="caption" color="text.secondary">Teléfono</Typography>
							<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5, overflowWrap: 'anywhere' }}>
								{clientUserMock.telefono}
							</Typography>
						</Paper>
						<Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
							<Typography variant="caption" color="text.secondary">Documento</Typography>
							<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5, overflowWrap: 'anywhere' }}>
								{clientUserMock.documento}
							</Typography>
						</Paper>
						<Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
							<Typography variant="caption" color="text.secondary">Rol</Typography>
							<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5, textTransform: 'capitalize' }}>
								{clientUserMock.rol}
							</Typography>
						</Paper>
					</Box>
				</Paper>
			</Box>
		</Box>
	);
}
