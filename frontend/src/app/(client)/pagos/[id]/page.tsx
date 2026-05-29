import { getPagoById } from '@/mocks/client-pages.mock';
import { Box, Chip, Paper, Typography } from '@mui/material';
import { ClientDetailHero } from '@/components/common/ClientPage/ClientDetailHero';

export default async function PagoDetallePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const pago = getPagoById(id);

	return (
		<Box sx={{ p: { xs: 2, md: 4 } }}>
			<ClientDetailHero
				eyebrow="Movimiento financiero"
				title={`Pago de $${Number(pago.monto).toLocaleString('es-CO')}`}
				description={`Método: ${pago.metodo_pago}. Revisa aquí el estado y el contexto de la transacción.`}
				chips={<Chip label={pago.estado} color={pago.estado === 'pagado' ? 'success' : 'warning'} />}
				facts={[
					{ label: 'Monto', value: `$${Number(pago.monto).toLocaleString('es-CO')}`, accent: 'primary' },
					{ label: 'Método', value: pago.metodo_pago, accent: 'secondary' },
					{ label: 'Estado', value: pago.estado, accent: pago.estado === 'pagado' ? 'success' : 'warning' },
					{ label: 'Referencia', value: pago.id_pago, accent: 'info' },
				]}
			/>

			<Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, mt: 3 }}>
				<Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
					<Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
						<Typography variant="caption" color="text.secondary">Concepto</Typography>
						<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>Cobro asociado a la atención registrada</Typography>
					</Paper>
					<Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
						<Typography variant="caption" color="text.secondary">Seguimiento</Typography>
						<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>Notificación disponible en el historial</Typography>
					</Paper>
					<Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
						<Typography variant="caption" color="text.secondary">Estado de soporte</Typography>
						<Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>Recibo y trazabilidad listos para consulta</Typography>
					</Paper>
				</Box>
			</Paper>
		</Box>
	);
}
