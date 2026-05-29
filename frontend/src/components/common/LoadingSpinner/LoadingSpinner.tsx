import { Box, CircularProgress, Typography } from '@mui/material';

type LoadingSpinnerProps = {
	label?: string;
};

export function LoadingSpinner({ label = 'Cargando...' }: LoadingSpinnerProps) {
	return (
		<Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2 }}>
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
				<CircularProgress color="primary" size={40} />
				<Typography variant="body2" color="text.secondary">
					{label}
				</Typography>
			</Box>
		</Box>
	);
}
