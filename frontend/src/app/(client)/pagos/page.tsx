"use client";

import { useMemo, useState } from 'react';
import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import { APP_ROUTES } from '@/constants/routes.constants';
import { clientPaymentsMock } from '@/mocks/client-pages.mock';
import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { PagoForm, type PagoFormValues } from '@/components/cliente/PagoForm/PagoForm';

export default function PagosPage() {
	const [payments, setPayments] = useState(clientPaymentsMock);
	const [openCreateDialog, setOpenCreateDialog] = useState(false);

	const pendingPayments = useMemo(
		() => payments.filter((pago) => pago.estado === 'pendiente').length,
		[payments],
	);
	const paidPayments = useMemo(
		() => payments.filter((pago) => pago.estado === 'pagado').length,
		[payments],
	);

	const handleCreatePayment = (values: PagoFormValues) => {
		const nextId = `pag-local-${Date.now()}`;

		setPayments((current) => [
			{
				id_pago: nextId,
				id_ss: values.id_ss,
				monto: String(values.monto),
				metodo_pago: values.metodo_pago,
				estado: values.estado,
				numero_referencia: values.numero_referencia ?? null,
				fecha_pago: new Date().toISOString(),
			},
			...current,
		]);

		setOpenCreateDialog(false);
	};

	return (
		<Box sx={{ p: { xs: 2, md: 4 } }}>
			<ClientPageHeader
				eyebrow="Finanzas"
				title="Pagos"
				description="Consulta el estado de tus transacciones, revisa referencias y mantén trazabilidad sobre cada solicitud atendida."
				chips={[
					{ label: `${payments.length} registros` },
					{ label: `${pendingPayments} pendientes` },
					{ label: `${paidPayments} pagados` },
				]}
				actions={
					<Button variant="contained" onClick={() => setOpenCreateDialog(true)}>
						Agregar pago
					</Button>
				}
			/>

			<Divider sx={{ mb: 3 }} />

			<Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, mb: 3 }}>
				<Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
					<Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
						<Typography variant="caption" color="text.secondary">Pagos registrados</Typography>
						<Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>{payments.length}</Typography>
					</Paper>
					<Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
						<Typography variant="caption" color="text.secondary">Pendientes por revisar</Typography>
						<Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>{pendingPayments}</Typography>
					</Paper>
					<Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
						<Typography variant="caption" color="text.secondary">Pagos confirmados</Typography>
						<Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>{paidPayments}</Typography>
					</Paper>
				</Box>
			</Paper>

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				{payments.map((pago) => {
					const isLocal = pago.id_pago.startsWith('pag-local-');

					return (
					<Paper key={pago.id_pago} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'start' }}>
							<Box>
								<Typography variant="h6" sx={{ fontWeight: 800 }}>${Number(pago.monto).toLocaleString('es-CO')}</Typography>
								<Typography variant="body2" color="text.secondary">{pago.metodo_pago}</Typography>
								<Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
									Referencia: {pago.numero_referencia ?? 'Pendiente de confirmación'}
								</Typography>
							</Box>
							<Chip label={pago.estado} color={pago.estado === 'pagado' ? 'success' : 'warning'} />
						</Box>

						<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2, alignItems: 'center', flexWrap: 'wrap' }}>
							<Typography variant="body2" color="text.secondary">
								Fecha: {new Date(pago.fecha_pago).toLocaleDateString('es-CO')}
							</Typography>
							{isLocal ? (
								<Typography variant="caption" color="text.secondary">
									Guardado localmente (mock)
								</Typography>
							) : (
								<Button component={Link} href={APP_ROUTES.CLIENT.PAGOS.DETAIL(pago.id_pago)} size="small">
									Ver detalle
								</Button>
							)}
						</Box>
					</Paper>
					);
				})}
			</Box>

			<Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} fullWidth maxWidth="sm">
				<DialogTitle>Registrar pago</DialogTitle>
				<DialogContent>
					<PagoForm onSubmit={handleCreatePayment} onCancel={() => setOpenCreateDialog(false)} />
				</DialogContent>
			</Dialog>
		</Box>
	);
}
