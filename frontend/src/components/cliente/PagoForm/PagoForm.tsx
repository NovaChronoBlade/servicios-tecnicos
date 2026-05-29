"use client";

import { useMemo, useState } from 'react';
import { alpha, Alert, Box, Button, Chip, MenuItem, Paper, TextField, Typography } from '@mui/material';
import type { PagoEstado } from '@/types';

export type PagoFormValues = {
	id_ss: string;
	monto: number;
	metodo_pago: string;
	estado: PagoEstado;
	numero_referencia?: string;
};

type PagoFormProps = {
	initialValues?: Partial<PagoFormValues>;
	submitLabel?: string;
	onSubmit: (values: PagoFormValues) => void;
	onCancel?: () => void;
};

const paymentMethods = ['Tarjeta', 'Nequi', 'Transferencia', 'PSE', 'Efectivo'];
const paymentStates: PagoEstado[] = ['pendiente', 'pagado', 'reembolsado'];

function formatCardNumber(value: string) {
  const onlyDigits = value.replace(/\D/g, '').slice(0, 16);
  return onlyDigits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length < 3) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function PagoForm({ initialValues, submitLabel = 'Registrar pago', onSubmit, onCancel }: PagoFormProps) {
	const [idSolicitud, setIdSolicitud] = useState(initialValues?.id_ss ?? '');
	const [monto, setMonto] = useState(String(initialValues?.monto ?? ''));
	const [metodoPago, setMetodoPago] = useState(initialValues?.metodo_pago ?? 'Tarjeta');
	const [estado, setEstado] = useState<PagoEstado>(initialValues?.estado ?? 'pendiente');
	const [referencia, setReferencia] = useState(initialValues?.numero_referencia ?? '');
	const [cardNumber, setCardNumber] = useState('');
	const [cardHolder, setCardHolder] = useState('');
	const [expiry, setExpiry] = useState('');
	const [cvv, setCvv] = useState('');
	const [touched, setTouched] = useState(false);
	const isCardPayment = metodoPago === 'Tarjeta';

	const montoNumerico = Number(monto);
	const invalidSolicitud = touched && idSolicitud.trim().length < 3;
	const invalidMonto = touched && (!Number.isFinite(montoNumerico) || montoNumerico <= 0);
	const invalidCardNumber = touched && isCardPayment && cardNumber.replace(/\s/g, '').length !== 16;
	const invalidHolder = touched && isCardPayment && cardHolder.trim().length < 6;
	const invalidExpiry = touched && isCardPayment && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
	const invalidCvv = touched && isCardPayment && !/^\d{3,4}$/.test(cvv);

	const helperMonto = useMemo(() => {
		if (!touched) {
			return 'Monto en COP';
		}

		return invalidMonto ? 'Ingresa un monto válido mayor a 0.' : 'Monto en COP';
	}, [invalidMonto, touched]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setTouched(true);

		if (invalidSolicitud || invalidMonto || invalidCardNumber || invalidHolder || invalidExpiry || invalidCvv) {
			return;
		}

		const computedReference =
			referencia.trim() ||
			(isCardPayment
				? `CARD-${cardNumber.replace(/\s/g, '').slice(-4)}`
				: `REF-${Date.now().toString().slice(-6)}`);

		onSubmit({
			id_ss: idSolicitud.trim(),
			monto: montoNumerico,
			metodo_pago: metodoPago,
			estado,
			numero_referencia: computedReference,
		});
	};

	return (
		<Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2.5, pt: 1 }}>
			<Paper
				variant="outlined"
				sx={{
					p: 2,
					borderRadius: 3,
					background: (theme) =>
						`linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 58%)`,
				}}
			>
				<Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
					Resumen de pago
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
					Registra la transacción asociada a la solicitud y conserva una referencia de trazabilidad.
				</Typography>
				<Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
					<Chip label={metodoPago} size="small" color="primary" variant="outlined" />
					<Chip label={`$${Number.isFinite(montoNumerico) ? Math.max(montoNumerico, 0).toLocaleString('es-CO') : '0'}`} size="small" />
				</Box>
			</Paper>

			<TextField
				label="ID de solicitud"
				value={idSolicitud}
				onChange={(event) => setIdSolicitud(event.target.value)}
				onBlur={() => setTouched(true)}
				error={invalidSolicitud}
				helperText={invalidSolicitud ? 'Asocia el pago a una solicitud válida.' : 'Ejemplo: ss-1002'}
				fullWidth
			/>

			<TextField
				label="Monto"
				type="number"
				value={monto}
				onChange={(event) => setMonto(event.target.value)}
				onBlur={() => setTouched(true)}
				error={invalidMonto}
				helperText={helperMonto}
				fullWidth
			/>

			<TextField select label="Método de pago" value={metodoPago} onChange={(event) => setMetodoPago(event.target.value)} fullWidth>
				{paymentMethods.map((method) => (
					<MenuItem key={method} value={method}>
						{method}
					</MenuItem>
				))}
			</TextField>

			{isCardPayment ? (
				<Paper variant="outlined" sx={{ p: 2.25, borderRadius: 3, borderColor: 'primary.main' }}>
					<Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
						Datos de tarjeta
					</Typography>

					<Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
						<TextField
							label="Número de tarjeta"
							value={cardNumber}
							onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
							onBlur={() => setTouched(true)}
							error={invalidCardNumber}
							helperText={invalidCardNumber ? 'Debe contener 16 dígitos.' : 'Ejemplo: 4242 4242 4242 4242'}
							fullWidth
							sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}
						/>
						<TextField
							label="Nombre del titular"
							value={cardHolder}
							onChange={(event) => setCardHolder(event.target.value)}
							onBlur={() => setTouched(true)}
							error={invalidHolder}
							helperText={invalidHolder ? 'Ingresa nombre y apellido del titular.' : 'Como aparece en la tarjeta'}
							fullWidth
						/>
						<TextField
							label="Fecha de expiración"
							value={expiry}
							onChange={(event) => setExpiry(formatExpiry(event.target.value))}
							onBlur={() => setTouched(true)}
							error={invalidExpiry}
							helperText={invalidExpiry ? 'Formato válido MM/AA.' : 'MM/AA'}
							fullWidth
						/>
						<TextField
							label="CVV"
							value={cvv}
							onChange={(event) => setCvv(event.target.value.replace(/\D/g, '').slice(0, 4))}
							onBlur={() => setTouched(true)}
							error={invalidCvv}
							helperText={invalidCvv ? 'Ingresa un CVV de 3 o 4 dígitos.' : 'Código de seguridad'}
							fullWidth
						/>
					</Box>
				</Paper>
			) : (
				<Alert severity="info" variant="outlined">
					Para {metodoPago} solo se requiere la referencia o comprobante de la transacción.
				</Alert>
			)}

			<TextField select label="Estado" value={estado} onChange={(event) => setEstado(event.target.value as PagoEstado)} fullWidth>
				{paymentStates.map((paymentState) => (
					<MenuItem key={paymentState} value={paymentState}>
						{paymentState}
					</MenuItem>
				))}
			</TextField>

			<TextField
				label="Número de referencia"
				value={referencia}
				onChange={(event) => setReferencia(event.target.value)}
				helperText={isCardPayment ? 'Opcional: si no la ingresas, se autogenera con los últimos 4 dígitos.' : 'Opcional para trazabilidad y conciliación.'}
				fullWidth
			/>

			<Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
				{onCancel ? (
					<Button variant="text" onClick={onCancel}>
						Cancelar
					</Button>
				) : null}
				<Button type="submit" variant="contained">
					{submitLabel}
				</Button>
			</Box>
		</Box>
	);
}
