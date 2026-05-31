'use client';

import { use } from 'react';
import { Alert, Box, Chip, Paper, Typography } from '@mui/material';
import { Building2, Landmark, MapPinned, Navigation, NotebookPen } from 'lucide-react';

import { ClientDetailHero } from '@/components/common/ClientPage/ClientDetailHero';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useApiData } from '@/hooks/useApiData';
import { getDireccionById } from '@/services/direcciones.service';

export default function DireccionDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: direccion, loading, error } = useApiData(
    () => getDireccionById(id),
    [id],
    null,
  );

  if (loading) return <LoadingSpinner />;
  if (!direccion) return <Alert severity="error">{error ?? 'Direccion no encontrada'}</Alert>;

  const addressParts = direccion.direccion.split(',').map((part) => part.trim());
  const addressName = addressParts[0] || 'Direccion registrada';
  const apartmentTowerFloor = addressParts[1] || 'No especificado';
  const city = addressParts[addressParts.length - 1] || 'Sin ciudad';
  const neighborhood = direccion.tipo_edificio || 'No especificado';
  const reference = direccion.informacion ?? 'Sin referencia de llegada.';
  const instructions = direccion.nota ?? 'Sin instrucciones adicionales para el tecnico.';

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ClientDetailHero
        eyebrow="Direccion registrada"
        title={addressName}
        description={`Ciudad: ${city}. Referencia: ${reference}`}
        chips={direccion.es_default ? <Chip color="primary" label="Predeterminada" /> : null}
        facts={[
          { label: 'Barrio / tipo', value: neighborhood, accent: 'secondary' },
          { label: 'Apartamento / torre / piso', value: apartmentTowerFloor, accent: 'info' },
          { label: 'Nombre de direccion', value: addressName, accent: direccion.es_default ? 'success' : 'default' },
          { label: 'Referencia', value: direccion.id_direccion, accent: 'primary' },
        ]}
      />

      <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, mt: 3, background: 'linear-gradient(150deg, rgba(14, 116, 144, 0.06) 0%, rgba(59, 130, 246, 0.08) 100%)' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Detalle de ubicacion y acceso</Typography>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
          {[
            ['Ciudad', city, MapPinned],
            ['Barrio', neighborhood, Landmark],
            ['Apartamento / torre / piso', apartmentTowerFloor, Building2],
            ['Referencia de llegada', reference, Navigation],
            ['Instrucciones para el tecnico', instructions, NotebookPen],
          ].map(([label, value, Icon]) => (
            <Paper key={String(label)} variant="outlined" sx={{ p: 2.25, borderRadius: 3, gridColumn: label === 'Instrucciones para el tecnico' ? { xs: '1 / -1', md: '1 / -1' } : undefined }}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <Icon size={18} />
                <Box>
                  <Typography variant="caption" color="text.secondary">{String(label)}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{String(value)}</Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
