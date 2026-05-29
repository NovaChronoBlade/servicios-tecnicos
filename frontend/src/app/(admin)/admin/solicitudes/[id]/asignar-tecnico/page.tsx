"use client";

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, Button, Chip, Divider, Paper, Snackbar, Typography } from '@mui/material';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getApiErrorMessage } from '@/services/api-error';
import { asignarTecnico, getSolicitudById, reasignarTecnico, type SolicitudView } from '@/services/solicitudes.service';
import { listTecnicos, type TecnicoListItem } from '@/services/usuarios.service';

type PageProps = { params: Promise<{ id: string }> };

export default function AdminAsignarTecnicoPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);
  const { data, loading, error } = useApiData<{
    solicitud: SolicitudView | null;
    tecnicos: TecnicoListItem[];
  }>(
    async () => {
      const [solicitud, tecnicos] = await Promise.all([
        getSolicitudById(id),
        listTecnicos(),
      ]);
      return { solicitud, tecnicos };
    },
    [id],
    { solicitud: null, tecnicos: [] },
  );

  const handleAssign = async (idTecnico: string) => {
    setSavingError(null);
    try {
      if (data.solicitud?.id_tecnico) {
        await reasignarTecnico(id, { id_tecnico: idTecnico });
      } else {
        await asignarTecnico(id, idTecnico);
      }
      setSaved(true);
      router.push(APP_ROUTES.ADMIN.SOLICITUDES.DETAIL(id));
    } catch (err) {
      setSavingError(getApiErrorMessage(err, 'No se pudo asignar el tecnico.'));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!data.solicitud) return <Alert severity="error">{error ?? 'Solicitud no encontrada'}</Alert>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader eyebrow="Reasignacion" title="Asignar tecnico" description={data.solicitud.servicioNombre} />
      <Divider sx={{ mb: 3 }} />
      {(error || savingError) ? <Alert severity="error" sx={{ mb: 3 }}>{savingError ?? error}</Alert> : null}
      <Box sx={{ display: 'grid', gap: 2 }}>
        {data.tecnicos.map((tecnico) => (
          <Paper key={tecnico.id_usuario} variant="outlined" sx={{ p: 2.5, borderRadius: 3, display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography sx={{ fontWeight: 800 }}>{tecnico.nombre}</Typography>
              <Typography variant="body2" color="text.secondary">{tecnico.especialidad}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip label={`${Number(tecnico.calificacion_promedio ?? 0).toFixed(1)} / 5`} color="primary" variant="outlined" />
              <Button variant="contained" onClick={() => handleAssign(tecnico.id_usuario)}>Asignar</Button>
            </Box>
          </Paper>
        ))}
      </Box>
      <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Tecnico asignado" />
    </Box>
  );
}
