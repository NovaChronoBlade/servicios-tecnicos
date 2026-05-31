"use client";

import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Snackbar,
  Typography,
} from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { DisponibilidadForm, type DisponibilidadFormValues } from '@/components/tecnico/DisponibilidadForm/DisponibilidadForm';
import { useApiData } from '@/hooks/useApiData';
import {
  createMiDisponibilidad,
  deleteDisponibilidad,
  listMiDisponibilidad,
  updateDisponibilidad,
} from '@/services/disponibilidad.service';
import { getApiErrorMessage } from '@/services/api-error';
import { getMisDetallesTecnicos } from '@/services/usuarios.service';
import { useAuthStore } from '@/store/authStore';
import type { DisponibilidadTecnico } from '@/types';

const DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
const DIA_TO_NUMBER: Record<string, number> = {
  Lunes: 1,
  Martes: 2,
  Miercoles: 3,
  Jueves: 4,
  Viernes: 5,
  Sabado: 6,
  Domingo: 7,
};

function formatDia(diaSemana: number) {
  return DIAS[diaSemana - 1] ?? `Dia ${diaSemana}`;
}

function toCreatePayload(values: DisponibilidadFormValues) {
  return {
    dia_semana: DIA_TO_NUMBER[values.dia] ?? 1,
    hora_inicio: values.inicio,
    hora_fin: values.fin,
    activo: values.activa,
    nota: values.nota,
  };
}

export default function TecnicoDisponibilidadPage() {
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);
  const {
    data: bloques,
    loading,
    error,
    reload,
  } = useApiData(
    () => (user?.id_usuario ? listMiDisponibilidad() : Promise.resolve([])),
    [user?.id_usuario],
    [] as DisponibilidadTecnico[],
  );
  const { data: detalles } = useApiData(
    () => (user?.id_usuario ? getMisDetallesTecnicos().catch(() => null) : Promise.resolve(null)),
    [user?.id_usuario],
    null,
  );

  const initialValues: DisponibilidadFormValues = {
    dia: 'Lunes',
    inicio: '08:00',
    fin: '17:00',
    activa: true,
    nota: '',
  };

  const handleSubmit = async (values: DisponibilidadFormValues) => {
    if (!user?.id_usuario) return;
    setSavingError(null);

    try {
      await createMiDisponibilidad(toCreatePayload(values));
      setSaved(true);
      void reload();
    } catch (err) {
      setSavingError(getApiErrorMessage(err, 'No se pudo crear el bloque de disponibilidad.'));
    }
  };

  const handleToggle = async (bloque: DisponibilidadTecnico) => {
    setSavingError(null);

    try {
      await updateDisponibilidad(bloque.id_disponibilidad, { activo: !bloque.activo });
      setSaved(true);
      void reload();
    } catch (err) {
      setSavingError(getApiErrorMessage(err, 'No se pudo actualizar el bloque.'));
    }
  };

  const handleDelete = async (idDisponibilidad: string) => {
    setSavingError(null);

    try {
      await deleteDisponibilidad(idDisponibilidad);
      setSaved(true);
      void reload();
    } catch (err) {
      setSavingError(getApiErrorMessage(err, 'No se pudo eliminar el bloque.'));
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Agenda"
        title="Disponibilidad"
        description="Administra los bloques semanales en los que puedes recibir solicitudes."
      />
      <Divider sx={{ mb: 3 }} />
      {(error || savingError) ? <Alert severity="warning" sx={{ mb: 3 }}>{savingError ?? error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '0.75fr 1fr' } }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Nuevo bloque</Typography>
          <DisponibilidadForm initialValues={initialValues} onSubmit={handleSubmit} />
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Agenda semanal</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {bloques.length ? `${bloques.length} bloques configurados` : 'Aun no tienes bloques configurados.'}
              </Typography>
            </Box>
            <Chip label={detalles?.disponible ? 'Disponible global' : 'No disponible global'} color={detalles?.disponible ? 'success' : 'default'} />
          </Box>

          <Box sx={{ display: 'grid', gap: 1.5, mt: 3 }}>
            {bloques.map((bloque) => (
              <Paper key={bloque.id_disponibilidad} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
                  <Box>
                    <Typography sx={{ fontWeight: 800 }}>
                      {formatDia(bloque.dia_semana)} - {bloque.hora_inicio} a {bloque.hora_fin}
                    </Typography>
                    {bloque.nota ? (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {bloque.nota}
                      </Typography>
                    ) : null}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={bloque.activo ? 'Activo' : 'Inactivo'} color={bloque.activo ? 'success' : 'default'} size="small" />
                    <Button size="small" variant="outlined" onClick={() => handleToggle(bloque)}>
                      {bloque.activo ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(bloque.id_disponibilidad)}>
                      Eliminar
                    </Button>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Box>
      <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Disponibilidad actualizada" />
    </Box>
  );
}
