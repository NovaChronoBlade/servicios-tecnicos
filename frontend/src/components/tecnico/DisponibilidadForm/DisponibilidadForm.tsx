"use client";

import { Box, Button, FormControlLabel, MenuItem, Paper, Switch, TextField } from '@mui/material';
import { useState } from 'react';

export type DisponibilidadFormValues = {
	dia: string;
	inicio: string;
	fin: string;
	activa: boolean;
	nota?: string;
};

type DisponibilidadFormProps = {
	initialValues: DisponibilidadFormValues;
	onSubmit: (values: DisponibilidadFormValues) => void;
	onCancel?: () => void;
};

const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export function DisponibilidadForm({ initialValues, onSubmit, onCancel }: DisponibilidadFormProps) {
	const [dia, setDia] = useState(initialValues.dia);
	const [inicio, setInicio] = useState(initialValues.inicio);
	const [fin, setFin] = useState(initialValues.fin);
	const [activa, setActiva] = useState(initialValues.activa);
	const [nota, setNota] = useState(initialValues.nota ?? '');

	return (
		<Box component="form" onSubmit={(event) => { event.preventDefault(); onSubmit({ dia, inicio, fin, activa, nota: nota.trim() || undefined }); }} sx={{ display: 'grid', gap: 2 }}>
			<Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
				<TextField select label="Día" value={dia} onChange={(event) => setDia(event.target.value)} fullWidth>
					{dias.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
				</TextField>
			</Paper>
			<Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' } }}>
				<TextField label="Inicio" type="time" value={inicio} onChange={(event) => setInicio(event.target.value)} slotProps={{ inputLabel: { shrink: true } }} fullWidth />
				<TextField label="Fin" type="time" value={fin} onChange={(event) => setFin(event.target.value)} slotProps={{ inputLabel: { shrink: true } }} fullWidth />
			</Box>
			<TextField label="Nota" value={nota} onChange={(event) => setNota(event.target.value)} multiline minRows={3} fullWidth />
			<FormControlLabel control={<Switch checked={activa} onChange={(event) => setActiva(event.target.checked)} />} label="Bloque activo" />
			<Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
				{onCancel ? <Button variant="text" onClick={onCancel}>Cancelar</Button> : null}
				<Button type="submit" variant="contained">Guardar disponibilidad</Button>
			</Box>
		</Box>
	);
}
