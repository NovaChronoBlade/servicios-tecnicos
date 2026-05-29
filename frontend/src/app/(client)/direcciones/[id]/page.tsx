import { getDireccionById } from '@/mocks/client-pages.mock';
import { Box, Chip, Paper, Typography } from '@mui/material';
import { Building2, Landmark, MapPinned, Navigation, NotebookPen } from 'lucide-react';
import { ClientDetailHero } from '@/components/common/ClientPage/ClientDetailHero';

export default async function DireccionDetallePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const direccion = getDireccionById(id);
	const addressParts = direccion.direccion.split(',').map((part) => part.trim());
	const addressName = addressParts[0] || 'Dirección registrada';
	const apartmentTowerFloor = addressParts[1] || 'No especificado';
	const city = addressParts[addressParts.length - 1] || 'Sin ciudad';
	const neighborhood = direccion.tipo_edificio || 'No especificado';
	const reference = direccion.informacion ?? 'Sin referencia de llegada.';
	const instructions = direccion.nota ?? 'Sin instrucciones adicionales para el técnico.';

	return (
		<Box sx={{ p: { xs: 2, md: 4 } }}>
			<ClientDetailHero
				eyebrow="Dirección registrada"
				title={addressName}
				description={`Ciudad: ${city}. Referencia: ${reference}`}
				chips={direccion.es_default ? <Chip color="primary" label="Predeterminada" /> : null}
				facts={[
					{ label: 'Barrio / tipo', value: neighborhood, accent: 'secondary' },
					{ label: 'Apartamento / torre / piso', value: apartmentTowerFloor, accent: 'info' },
					{ label: 'Nombre de dirección', value: addressName, accent: direccion.es_default ? 'success' : 'default' },
					{ label: 'Referencia', value: direccion.id_direccion, accent: 'primary' },
				]}
			/>

			<Paper
				variant="outlined"
				sx={{
					p: { xs: 3, md: 4 },
					borderRadius: 3,
					mt: 3,
					background: 'linear-gradient(150deg, rgba(14, 116, 144, 0.06) 0%, rgba(59, 130, 246, 0.08) 100%)',
				}}
			>
				<Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
					Detalle de ubicación y acceso
				</Typography>

				<Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
					<Paper variant="outlined" sx={{ p: 2.25, borderRadius: 3 }}>
						<Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
							<MapPinned size={18} />
							<Box>
								<Typography variant="caption" color="text.secondary">Ciudad</Typography>
								<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{city}</Typography>
							</Box>
						</Box>
					</Paper>

					<Paper variant="outlined" sx={{ p: 2.25, borderRadius: 3 }}>
						<Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
							<Landmark size={18} />
							<Box>
								<Typography variant="caption" color="text.secondary">Barrio</Typography>
								<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{neighborhood}</Typography>
							</Box>
						</Box>
					</Paper>

					<Paper variant="outlined" sx={{ p: 2.25, borderRadius: 3 }}>
						<Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
							<Building2 size={18} />
							<Box>
								<Typography variant="caption" color="text.secondary">Apartamento / torre / piso</Typography>
								<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{apartmentTowerFloor}</Typography>
							</Box>
						</Box>
					</Paper>

					<Paper variant="outlined" sx={{ p: 2.25, borderRadius: 3 }}>
						<Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
							<Navigation size={18} />
							<Box>
								<Typography variant="caption" color="text.secondary">Referencia de llegada</Typography>
								<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{reference}</Typography>
							</Box>
						</Box>
					</Paper>

					<Paper variant="outlined" sx={{ p: 2.25, borderRadius: 3, gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
						<Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
							<NotebookPen size={18} />
							<Box>
								<Typography variant="caption" color="text.secondary">Instrucciones para el técnico</Typography>
								<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{instructions}</Typography>
							</Box>
						</Box>
					</Paper>
				</Box>
			</Paper>
		</Box>
	);
}
