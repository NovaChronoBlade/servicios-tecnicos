"use client";

import { Box, Button, FormControlLabel, Paper, Switch, TextField } from '@mui/material';
import { useState } from 'react';

export type DatosTecnicosFormValues = {
	especialidad: string;
	licencia_profesional: string;
	zonaCobertura: string;
	bio: string;
	disponible: boolean;
};

type DatosTecnicosFormProps = {
	initialValues: DatosTecnicosFormValues;
	onSubmit: (values: DatosTecnicosFormValues) => void;
	onCancel?: () => void;
};

export function DatosTecnicosForm({ initialValues, onSubmit, onCancel }: DatosTecnicosFormProps) {
	const [especialidad, setEspecialidad] = useState(initialValues.especialidad);
	const [licencia, setLicencia] = useState(initialValues.licencia_profesional);
	const [zona, setZona] = useState(initialValues.zonaCobertura);
	const [bio, setBio] = useState(initialValues.bio);
	const [disponible, setDisponible] = useState(initialValues.disponible);

	return (
		<Box component="form" onSubmit={(event) => { event.preventDefault(); onSubmit({ especialidad, licencia_profesional: licencia, zonaCobertura: zona, bio, disponible }); }} sx={{ display: 'grid', gap: 2 }}>
			<Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
				<TextField label="Especialidad" value={especialidad} onChange={(event) => setEspecialidad(event.target.value)} fullWidth />
			</Paper>
			<TextField label="Licencia profesional" value={licencia} onChange={(event) => setLicencia(event.target.value)} fullWidth />
			<TextField label="Zona de cobertura" value={zona} onChange={(event) => setZona(event.target.value)} fullWidth />
			<TextField label="Biografía profesional" value={bio} onChange={(event) => setBio(event.target.value)} multiline minRows={4} fullWidth />
			<FormControlLabel control={<Switch checked={disponible} onChange={(event) => setDisponible(event.target.checked)} />} label="Disponible para solicitudes" />
			<Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
				{onCancel ? <Button variant="text" onClick={onCancel}>Cancelar</Button> : null}
				<Button type="submit" variant="contained">Guardar cambios</Button>
			</Box>
		</Box>
	);
}