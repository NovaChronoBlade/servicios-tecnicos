"use client";

import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import { Building2, MapPinHouse, MapPinned, Navigation, NotebookPen } from 'lucide-react';
import Link from 'next/link';

import { ClientPageHeader } from '@/components/common/ClientPage/ClientPageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { DireccionForm } from '@/components/cliente/DireccionForm/DireccionForm';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useApiData } from '@/hooks/useApiData';
import { getApiErrorMessage } from '@/services/api-error';
import { createDireccion, listDirecciones } from '@/services/direcciones.service';
import type { CreateDireccionRequest } from '@/types';

export default function DireccionesPage() {
  const { data: addresses, setData: setAddresses, loading, error, reload } = useApiData(
    listDirecciones,
    [],
    [],
  );
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);

  const defaultAddress = useMemo(
    () => addresses.find((direccion) => direccion.es_default) ?? addresses[0],
    [addresses],
  );

  const handleCreateAddress = async (values: CreateDireccionRequest) => {
    setSavingError(null);

    try {
      const created = await createDireccion(values);
      setAddresses((current) => {
        const base = created.es_default
          ? current.map((item) => ({ ...item, es_default: false }))
          : current;
        return [created, ...base];
      });
      setOpenCreateDialog(false);
      void reload();
    } catch (err) {
      setSavingError(getApiErrorMessage(err, 'No se pudo guardar la direccion.'));
    }
  };

  if (loading) return <LoadingSpinner />;

  const principalParts = (defaultAddress?.direccion ?? '').split(',').map((part) => part.trim());
  const mainAddressName = principalParts[0] || 'Casa principal';
  const apartmentTower = principalParts[1] || 'No especificado';
  const city = principalParts[principalParts.length - 1] || 'Sin ciudad';

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientPageHeader
        eyebrow="Ubicaciones"
        title="Direcciones"
        description="Tus ubicaciones guardadas para asignar servicios, elegir el punto de atencion correcto y mantener ordenado el historial de solicitudes."
        chips={[
          { label: `${addresses.length} direcciones` },
          { label: defaultAddress?.es_default ? 'Direccion principal' : 'Sin principal' },
        ]}
        actions={
          <>
            <Button variant="contained" onClick={() => setOpenCreateDialog(true)}>
              Agregar direccion
            </Button>
            <Button component={Link} href={APP_ROUTES.CLIENT.SOLICITAR_SERVICIO.ROOT} variant="outlined">
              Crear solicitud
            </Button>
          </>
        }
      />

      <Divider sx={{ mb: 3 }} />
      {(error || savingError) ? <Alert severity="error" sx={{ mb: 3 }}>{savingError ?? error}</Alert> : null}

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
              <Typography variant="caption" color="text.secondary">Nombre de direccion</Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.8 }}>{mainAddressName}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Building2 size={16} />
              <Typography variant="caption" color="text.secondary">Apartamento / torre / piso</Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.8 }}>{apartmentTower}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MapPinned size={16} />
              <Typography variant="caption" color="text.secondary">Ciudad</Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.8 }}>{city}</Typography>
          </Paper>
        </Box>
      </Paper>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
        {addresses.map((direccion) => {
          const addressParts = direccion.direccion.split(',').map((part) => part.trim());
          const addressTitle = addressParts[0] || direccion.direccion;
          const buildingDetail = addressParts[1] || direccion.tipo_edificio;
          const addressCity = addressParts[addressParts.length - 1] || 'Sin ciudad';
          const referenceText = direccion.informacion ?? 'Sin referencia de llegada.';
          const instructionsText = direccion.nota ?? 'Sin instrucciones adicionales para el tecnico.';

          return (
            <Paper key={direccion.id_direccion} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 1.5, alignItems: 'start' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{addressTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{buildingDetail}</Typography>
                </Box>
                {direccion.es_default ? <Chip color="primary" label="Predeterminada" /> : null}
              </Box>

              <Box sx={{ display: 'grid', gap: 1.25, mt: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                  <MapPinned size={16} />
                  <Typography variant="body2" color="text.secondary">Ciudad: {addressCity}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                  <Navigation size={16} />
                  <Typography variant="body2" color="text.secondary">Referencia de llegada: {referenceText}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                  <NotebookPen size={16} />
                  <Typography variant="body2" color="text.secondary">Instrucciones para el tecnico: {instructionsText}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2, alignItems: 'center' }}>
                <Chip label={direccion.es_default ? 'Lista para solicitudes' : 'Direccion secundaria'} variant="outlined" />
                <Button component={Link} href={APP_ROUTES.CLIENT.DIRECCIONES.DETAIL(direccion.id_direccion)} size="small">
                  Ver detalle
                </Button>
              </Box>
            </Paper>
          );
        })}
        {addresses.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No tienes direcciones registradas.</Typography>
        ) : null}
      </Box>

      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Agregar direccion</DialogTitle>
        <DialogContent>
          <DireccionForm onSubmit={handleCreateAddress} onCancel={() => setOpenCreateDialog(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
