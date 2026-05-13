import { Box, Typography, Button, Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { SubmitResult as Result } from '../store/incidentsApi';

interface Props {
  result: Result;
  onReportAnother: () => void;
}

const CONFIG = {
  PUBLISHED: {
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 56, color: 'success.main' }} />,
    title: 'Incident Published',
    color: 'success' as const,
  },
  PENDING_REVIEW: {
    icon: <HourglassEmptyIcon sx={{ fontSize: 56, color: 'warning.main' }} />,
    title: 'Under Review',
    color: 'warning' as const,
  },
  REJECTED: {
    icon: <ErrorOutlineIcon sx={{ fontSize: 56, color: 'error.main' }} />,
    title: 'Not Published',
    color: 'error' as const,
  },
};

export default function SubmitResult({ result, onReportAnother }: Props) {
  const cfg = CONFIG[result.status];
  return (
    <Box sx={{ textAlign: 'center', py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {cfg.icon}
      <Typography variant="h5" fontWeight={700}>{cfg.title}</Typography>
      <Alert severity={cfg.color} sx={{ maxWidth: 400 }}>{result.message}</Alert>
      <Button variant="contained" onClick={onReportAnother} sx={{ mt: 2 }}>
        Report Another Incident
      </Button>
    </Box>
  );
}
