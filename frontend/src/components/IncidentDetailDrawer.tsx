import {
  Drawer, Box, Typography, Chip, IconButton, Stack, Divider, Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShareIcon from '@mui/icons-material/Share';
import { Incident } from '../store/incidentsApi';
import { VIOLATION_LABELS } from './ViolationTypeSelect';
import { VIOLATION_COLORS } from './ViolationFilterBar';

interface Props {
  incident: Incident | null;
  onClose: () => void;
}

export default function IncidentDetailDrawer({ incident, onClose }: Props) {
  const handleShare = () => {
    const url = `${window.location.origin}/incident/${incident?.id}`;
    navigator.clipboard.writeText(url).catch(() => {});
  };

  return (
    <Drawer
      anchor="bottom"
      open={!!incident}
      onClose={onClose}
      PaperProps={{
        sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '80vh' },
      }}
    >
      {incident && (
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Chip
              label={VIOLATION_LABELS[incident.violationType] ?? incident.violationType}
              size="small"
              sx={{
                bgcolor: VIOLATION_COLORS[incident.violationType] ?? '#888',
                color: '#fff',
                fontWeight: 700,
              }}
            />
            <Stack direction="row" spacing={1}>
              <IconButton size="small" onClick={handleShare} title="Copy link">
                <ShareIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">{incident.address}</Typography>
          </Stack>

          <Typography variant="caption" color="text.disabled">
            {new Date(incident.incidentAt).toLocaleString()}
          </Typography>

          {incident.vehicleDesc && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {incident.vehicleDesc}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              width: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'black',
              mb: 2,
            }}
          >
            <video
              src={incident.videoUrl}
              controls
              style={{ width: '100%', maxHeight: 260, display: 'block' }}
            />
          </Box>

          <Button
            fullWidth
            variant="outlined"
            size="small"
            href={`/incident/${incident.id}`}
          >
            View Full Report
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
