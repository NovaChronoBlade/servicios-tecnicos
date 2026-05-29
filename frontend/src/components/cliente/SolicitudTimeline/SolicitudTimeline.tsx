'use client';

import type { SolicitudEstado } from '@/types';

import {
  alpha,
  Box,
  Chip,
  Paper,
  Step,
  StepContent,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';

import {
  CheckCircle2,
  CircleDotDashed,
  Clock3,
  FileCheck2,
  Truck,
  XCircle,
} from 'lucide-react';

type SolicitudTimelineProps = {
  estado: SolicitudEstado;
  fechaProgramada?: string | null;
};

const steps = [
  {
    key: 'pendiente',
    label: 'Pendiente',
    description: 'La solicitud fue creada y está lista para asignarse.',
    icon: Clock3,
  },

  {
    key: 'aceptado',
    label: 'Aceptada',
    description: 'Un técnico tomó tu solicitud.',
    icon: FileCheck2,
  },

  {
    key: 'en_curso',
    label: 'En curso',
    description: 'El técnico ya está trabajando en el servicio.',
    icon: Truck,
  },

  {
    key: 'completado',
    label: 'Completada',
    description: 'El servicio fue finalizado correctamente.',
    icon: CheckCircle2,
  },
];

function getActiveIndex(estado: SolicitudEstado) {
  if (estado === 'cancelado') {
    return -1;
  }

  const found = steps.findIndex((step) => step.key === estado);

  return found === -1 ? 0 : found;
}

export function SolicitudTimeline({
  estado,
  fechaProgramada,
}: SolicitudTimelineProps) {
  const activeIndex = getActiveIndex(estado);

  const isCancelled = estado === 'cancelado';

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 4,
        borderColor: 'divider',
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
          mb: 4,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            Seguimiento de solicitud
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {fechaProgramada
              ? `Programada para ${new Date(fechaProgramada).toLocaleString(
                  'es-CO',
                )}`
              : 'Sin programación registrada'}
          </Typography>
        </Box>

        <Chip
          icon={
            isCancelled ? <XCircle size={16} /> : <CircleDotDashed size={16} />
          }
          label={
            isCancelled ? 'Cancelada' : estado.replace('_', ' ').toUpperCase()
          }
          color={isCancelled ? 'error' : 'primary'}
          variant="outlined"
        />
      </Box>

      {/* STEPPER */}
      <Stepper
        activeStep={activeIndex}
        orientation="vertical"
        connector={
          <StepConnector
            sx={{
              [`& .${stepConnectorClasses.line}`]: {
                borderColor: 'divider',

                borderLeftWidth: 2,

                minHeight: 30,
              },
            }}
          />
        }
        sx={{
          '& .MuiStep-root': {
            pb: 1.75,
          },
        }}
      >
        {steps.map((step, index) => {
          const Icon = step.icon;

          const completed = activeIndex >= index && !isCancelled;

          const active = activeIndex === index;

          return (
            <Step key={step.key} completed={completed}>
              <StepLabel
                slots={{
                  stepIcon: () => (
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',

                        transition: 'all .2s ease',

                        bgcolor: completed
                          ? 'primary.main'
                          : active
                            ? 'primary.light'
                            : 'action.hover',

                        color:
                          completed || active
                            ? 'primary.contrastText'
                            : 'text.secondary',

                        border: active && !completed ? '2px solid' : 'none',

                        borderColor: 'primary.main',
                      }}
                    >
                      <Icon size={18} />
                    </Box>
                  ),
                }}
                sx={{
                  '& .MuiStepLabel-labelContainer': {
                    pl: 1,
                  },
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: active || completed ? alpha('#2563eb', 0.08) : 'transparent',
                    border: '1px solid',
                    borderColor: active || completed ? alpha('#2563eb', 0.22) : 'divider',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    {step.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {step.description}
                  </Typography>
                </Box>
              </StepLabel>

              <StepContent sx={{ ml: 1.5, borderLeftColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary">
                  Estado {index + 1} de {steps.length}
                </Typography>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Paper>
  );
}
