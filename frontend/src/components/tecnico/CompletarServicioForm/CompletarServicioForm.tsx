"use client";

import { Box, Button, MenuItem, TextField } from '@mui/material';
import { useState } from 'react';

export type CompletarServicioFormValues = {
	diagnostico: string;
	trabajo_realizado: string;
	materiales: string;
	observaciones: string;
	estado_final: 'completado' | 'completado_con_observaciones';
};

type CompletarServicioFormProps = {
	initialValues?: Partial<CompletarServicioFormValues>;
	onSubmit: (values: CompletarServicioFormValues) => void;
	onCancel?: () => void;
};

export function CompletarServicioForm({ initialValues, onSubmit, onCancel }: CompletarServicioFormProps) {
	const [diagnostico, setDiagnostico] = useState(initialValues?.diagnostico ?? '');
	const [trabajoRealizado, setTrabajoRealizado] = useState(initialValues?.trabajo_realizado ?? '');
	const [materiales, setMateriales] = useState(initialValues?.materiales ?? '');
	const [observaciones, setObservaciones] = useState(initialValues?.observaciones ?? '');
	const [estadoFinal, setEstadoFinal] = useState<CompletarServicioFormValues['estado_final']>(initialValues?.estado_final ?? 'completado');

	return (
		<Box component="form" onSubmit={(event) => { event.preventDefault(); onSubmit({ diagnostico, trabajo_realizado: trabajoRealizado, materiales, observaciones, estado_final: estadoFinal }); }} sx={{ display: 'grid', gap: 2 }}>
			<TextField label="Diagnóstico" value={diagnostico} onChange={(event) => setDiagnostico(event.target.value)} multiline minRows={3} fullWidth />
			<TextField label="Trabajo realizado" value={trabajoRealizado} onChange={(event) => setTrabajoRealizado(event.target.value)} multiline minRows={4} fullWidth />
			<TextField label="Materiales y repuestos" value={materiales} onChange={(event) => setMateriales(event.target.value)} multiline minRows={3} fullWidth />
			<TextField label="Observaciones finales" value={observaciones} onChange={(event) => setObservaciones(event.target.value)} multiline minRows={3} fullWidth />
			<TextField select label="Resultado" value={estadoFinal} onChange={(event) => setEstadoFinal(event.target.value as CompletarServicioFormValues['estado_final'])} fullWidth>
				<MenuItem value="completado">Completado</MenuItem>
				<MenuItem value="completado_con_observaciones">Completado con observaciones</MenuItem>
			</TextField>
			<Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
				{onCancel ? <Button variant="text" onClick={onCancel}>Cancelar</Button> : null}
				<Button type="submit" variant="contained">Finalizar servicio</Button>
			</Box>
		</Box>
	);
}