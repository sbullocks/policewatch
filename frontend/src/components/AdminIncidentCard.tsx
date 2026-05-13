import { useState } from 'react';
import {
  Card, CardContent, CardActions, Box, Typography, Chip, Button,
  Stack, Divider, CircularProgress,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { PendingIncident } from '../store/adminApi';
import { VIOLATION_LABELS } from './ViolationTypeSelect';
import { VIOLATION_COLORS } from './ViolationFilterBar';

interface Props {
  incident: PendingIncident;
  password: string;
  onApprove: (id: string, password: string) => Promise<void>;
  onReject: (id: string, password: string) => Promise<void>;
}

const CONFIDENCE_CONFIG = {
  confirmed: { label: 'AI: Confirmed', color: 'success' as const },
  uncertain: { label: 'AI: Uncertain', color: 'warning' as const },
  not_visible: { label: 'AI: Not Visible', color: 'error' as const },
};

export default function AdminIncidentCard({ incident, password, onApprove, onReject }: Props) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);

  const handle = async (action: 'approve' | 'reject') => {
    setLoading(action);
    try {
      if (action === 'approve') await onApprove(incident.id, password);
      else await onReject(incident.id, password);
    } finally {
      setLoading(null);
    }
  };

  const confidenceCfg = CONFIDENCE_CONFIG[incident.aiConfidence as keyof typeof CONFIDENCE_CONFIG]
    ?? CONFIDENCE_CONFIG.uncertain;

  return (
    <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
          <Chip
            label={VIOLATION_LABELS[incident.violationType] ?? incident.violationType}
            size="small"
            sx={{ bgcolor: VIOLATION_COLORS[incident.violationType] ?? '#888', color: '#fff', fontWeight: 700 }}
          />
          <Chip
            label={confidenceCfg.label}
            size="small"
            color={confidenceCfg.color}
            variant="outlined"
          />
        </Stack>

        <Box sx={{ width: '100%', borderRadius: 1, overflow: 'hidden', bgcolor: 'black', mb: 1.5 }}>
          <video src={incident.videoUrl} controls style={{ width: '100%', maxHeight: 220, display: 'block' }} />
        </Box>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary" noWrap>{incident.address}</Typography>
        </Stack>

        <Typography variant="caption" color="text.disabled" display="block" sx={{ mb: 1 }}>
          {new Date(incident.incidentAt).toLocaleString()}
        </Typography>

        {incident.vehicleDesc && (
          <Typography variant="body2" sx={{ mb: 1 }}>{incident.vehicleDesc}</Typography>
        )}

        <Divider sx={{ mb: 1 }} />

        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          AI Reasoning
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          {incident.aiReasoning}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={loading === 'approve' ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}
          disabled={!!loading}
          onClick={() => handle('approve')}
          fullWidth
        >
          Publish
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={loading === 'reject' ? <CircularProgress size={16} color="inherit" /> : <CloseIcon />}
          disabled={!!loading}
          onClick={() => handle('reject')}
          fullWidth
        >
          Reject
        </Button>
      </CardActions>
    </Card>
  );
}
