"use client";

import { useMemo, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, MenuItem, TextField } from '@mui/material';
import type { CreateDireccionRequest } from '@/types';

type DireccionFormProps = {
	initialValues?: Partial<CreateDireccionRequest>;
	submitLabel?: string;
	onSubmit: (values: CreateDireccionRequest) => void;
	onCancel?: () => void;
};

const buildingTypes = ['Apartamento', 'Casa', 'Oficina', 'Local', 'Otro'];

export function DireccionForm({ initialValues, submitLabel = 'Guardar dirección', onSubmit, onCancel }: DireccionFormProps) {
	const [direccion, setDireccion] = useState(initialValues?.direccion ?? '');
	const [tipoEdificio, setTipoEdificio] = useState(initialValues?.tipo_edificio ?? 'Apartamento');
	const [informacion, setInformacion] = useState(initialValues?.informacion ?? '');
	const [nota, setNota] = useState(initialValues?.nota ?? '');
	const [esDefault, setEsDefault] = useState(Boolean(initialValues?.es_default));
	const [touched, setTouched] = useState(false);

	const hasError = useMemo(() => touched && direccion.trim().length < 8, [direccion, touched]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setTouched(true);

		if (direccion.trim().length < 8) {
			return;
		}

		onSubmit({
			direccion: direccion.trim(),
			tipo_edificio: tipoEdificio,
			informacion: informacion.trim() || undefined,
			nota: nota.trim() || undefined,
			es_default: esDefault,
		});
	};

	return (
		<Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
			<TextField
				label="Dirección"
				value={direccion}
				onChange={(event) => setDireccion(event.target.value)}
				onBlur={() => setTouched(true)}
				error={hasError}
				helperText={hasError ? 'Ingresa una dirección más completa para ubicar al técnico.' : 'Ejemplo: Cra. 10 #45-67, Apto 503'}
				fullWidth
			/>

			<TextField select label="Tipo de edificio" value={tipoEdificio} onChange={(event) => setTipoEdificio(event.target.value)} fullWidth>
				{buildingTypes.map((type) => (
					<MenuItem key={type} value={type}>
						{type}
					</MenuItem>
				))}
			</TextField>

			<TextField
				label="Información adicional"
				value={informacion}
				onChange={(event) => setInformacion(event.target.value)}
				helperText="Portería, torre, punto de referencia"
				fullWidth
			/>

			<TextField
				label="Nota para el técnico"
				value={nota}
				onChange={(event) => setNota(event.target.value)}
				multiline
				minRows={3}
				fullWidth
			/>

			<FormControlLabel
				control={<Checkbox checked={esDefault} onChange={(event) => setEsDefault(event.target.checked)} />}
				label="Marcar como dirección principal"
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
