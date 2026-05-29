"use client";

import { useMemo, useState } from 'react';
import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, Divider, Paper, Typography } from '@mui/material';
import { Building2, MapPinHouse, MapPinned, Navigation, NotebookPen } from 'lucide-react';
import Link from 'next/link';
import { clientAddressesMock } from '@/mocks/client-pages.mock';
import { APP_ROUTES } from '@/constants/routes.constants';
import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { DireccionForm } from '@/components/cliente/DireccionForm/DireccionForm';
import type { CreateDireccionRequest } from '@/types';

export default function DireccionesPage() {
	const [addresses, setAddresses] = useState(clientAddressesMock);
	const [openCreateDialog, setOpenCreateDialog] = useState(false);

	const defaultAddress = useMemo(
		() => addresses.find((direccion) => direccion.es_default) ?? addresses[0],
		[addresses],
	);

	const handleCreateAddress = (values: CreateDireccionRequest) => {
		const nextId = `dir-local-${Date.now()}`;

		setAddresses((current) => {
			const base = values.es_default ? current.map((item) => ({ ...item, es_default: false })) : current;

			return [
				...base,
				{
					id_direccion: nextId,
					id_usuario: 'cliente-1',
					direccion: values.direccion,
					tipo_edificio: values.tipo_edificio,
					informacion: values.informacion ?? null,
					nota: values.nota ?? null,
					es_default: Boolean(values.es_default),
				},
			];
		});

		setOpenCreateDialog(false);
	};

	const principalParts = (defaultAddress?.direccion ?? '').split(',').map((part) => part.trim());
	const mainAddressName = principalParts[0] || 'Casa principal';
	const apartmentTower = principalParts[1] || 'No especificado';
	const city = principalParts[principalParts.length - 1] || 'Sin ciudad';

	return (
		<Box sx={{ p: { xs: 2, md: 4 } }}>
			<ClientPageHeader
				eyebrow="Ubicaciones"
				title="Direcciones"
				description="Tus ubicaciones guardadas para asignar servicios, elegir el punto de atención correcto y mantener ordenado el historial de solicitudes."
				chips={[
					{ label: `${addresses.length} direcciones` },
					{ label: defaultAddress?.es_default ? 'Dirección principal' : 'Sin principal' },
				]}
				actions={
					<>
						<Button variant="contained" onClick={() => setOpenCreateDialog(true)}>
							Agregar dirección
						</Button>
						<Button component={Link} href={APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.ROOT} variant="outlined">
							Crear solicitud
						</Button>
					</>
				}
			/>

			<Divider sx={{ mb: 3 }} />

			<Paper
				variant="outlined"
				sx={{
					p: { xs: 2.5, md: 3 },
					borderRadius: 3,
					mb: 3,
					background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)',
				}}
			>
				<Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
					<Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<MapPinHouse size={16} />
							<Typography variant="caption" color="text.secondary">Nombre de dirección</Typography>
						</Box>
						<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.8 }}>
							{mainAddressName}
						</Typography>
					</Paper>
					<Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<Building2 size={16} />
							<Typography variant="caption" color="text.secondary">Apartamento / torre / piso</Typography>
						</Box>
						<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.8 }}>
							{apartmentTower}
						</Typography>
					</Paper>
					<Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<MapPinned size={16} />
							<Typography variant="caption" color="text.secondary">Ciudad</Typography>
						</Box>
						<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.8 }}>
							{city}
						</Typography>
					</Paper>
				</Box>
			</Paper>

			<Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
				{addresses.map((direccion) => {
					const isLocal = direccion.id_direccion.startsWith('dir-local-');
					const addressParts = direccion.direccion.split(',').map((part) => part.trim());
					const addressTitle = addressParts[0] || direccion.direccion;
					const buildingDetail = addressParts[1] || direccion.tipo_edificio;
					const addressCity = addressParts[addressParts.length - 1] || 'Sin ciudad';
					const referenceText = direccion.informacion ?? 'Sin referencia de llegada.';
					const instructionsText = direccion.nota ?? 'Sin instrucciones adicionales para el técnico.';

					return (
					<Paper key={direccion.id_direccion} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 1.5, alignItems: 'start' }}>
							<Box>
								<Typography variant="h6" sx={{ fontWeight: 800 }}>
									{addressTitle}
								</Typography>
								<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
									{buildingDetail}
								</Typography>
							</Box>
							{direccion.es_default ? <Chip color="primary" label="Predeterminada" /> : null}
						</Box>

						<Box sx={{ display: 'grid', gap: 1.25, mt: 0.5 }}>
							<Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
								<MapPinned size={16} />
								<Typography variant="body2" color="text.secondary">
									Ciudad: {addressCity}
								</Typography>
							</Box>
							<Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
								<Navigation size={16} />
								<Typography variant="body2" color="text.secondary">
									Referencia de llegada: {referenceText}
								</Typography>
							</Box>
							<Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
								<NotebookPen size={16} />
								<Typography variant="body2" color="text.secondary">
									Instrucciones para el técnico: {instructionsText}
								</Typography>
							</Box>
						</Box>

						<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2, alignItems: 'center' }}>
							<Chip label={direccion.es_default ? 'Lista para solicitudes' : 'Dirección secundaria'} variant="outlined" />
							{isLocal ? (
								<Typography variant="caption" color="text.secondary">
									Guardada localmente (mock)
								</Typography>
							) : (
								<Button component={Link} href={APP_ROUTES.CLIENT.DIRECCIONES.DETAIL(direccion.id_direccion)} size="small">
									Ver detalle
								</Button>
							)}
						</Box>
					</Paper>
					);
				})}
			</Box>

			<Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} fullWidth maxWidth="sm">
				<DialogTitle>Agregar dirección</DialogTitle>
				<DialogContent>
					<DireccionForm onSubmit={handleCreateAddress} onCancel={() => setOpenCreateDialog(false)} />
				</DialogContent>
			</Dialog>
		</Box>
	);
}
