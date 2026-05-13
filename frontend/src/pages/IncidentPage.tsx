import { useParams } from 'react-router-dom';
import {
  Container, Typography, Box, Stack, Chip, Divider,
  Button, CircularProgress, Alert, Paper,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShareIcon from '@mui/icons-material/Share';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useGetIncidentQuery } from '../store/incidentsApi';
import { VIOLATION_LABELS } from '../components/ViolationTypeSelect';
import { VIOLATION_COLORS } from '../components/ViolationFilterBar';
import IncidentReportMap from '../components/IncidentReportMap';
import RecorderSpeedChip from '../components/RecorderSpeedChip';

export default function IncidentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: incident, isLoading, isError } = useGetIncidentQuery(id!);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `PoliceWatch — ${violationLabel ?? 'Incident'}`,
          text: `Reported incident at ${incident?.address ?? ''}`,
          url,
        });
        return;
      } catch { /* user cancelled or API unsupported */ }
    }
    navigator.clipboard.writeText(url).catch(() => {});
  };

  const handlePrint = () => window.print();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !incident) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">Incident not found or has been removed.</Alert>
      </Container>
    );
  }

  const violationLabel = VIOLATION_LABELS[incident.violationType] ?? incident.violationType;
  const color = VIOLATION_COLORS[incident.violationType] ?? '#888';
  const reportedAt = new Date(incident.incidentAt).toLocaleString('en-US', {
    dateStyle: 'full', timeStyle: 'short',
  });

  return (
    <>
      {/* Screen layout */}
      <Container maxWidth="md" sx={{ py: 3 }} className="screen-only">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
          size="small"
        >
          Back to Map
        </Button>

        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
          <Chip
            label={violationLabel}
            sx={{ bgcolor: color, color: '#fff', fontWeight: 700, fontSize: '0.9rem', px: 1 }}
          />
          <Stack direction="row" spacing={1}>
            <Button size="small" startIcon={<ShareIcon />} variant="outlined" onClick={handleShare}>
              Copy Link
            </Button>
            <Button size="small" startIcon={<PrintIcon />} variant="outlined" onClick={handlePrint}>
              Export PDF
            </Button>
          </Stack>
        </Stack>

        <Stack spacing={3}>
          <Box sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'black' }}>
            <video src={incident.videoUrl} controls style={{ width: '100%', maxHeight: 400, display: 'block' }} />
          </Box>

          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="body1">{incident.address}</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">{reportedAt}</Typography>
              {incident.vehicleDesc && (
                <Typography variant="body2">{incident.vehicleDesc}</Typography>
              )}
              <RecorderSpeedChip speedMs={incident.recorderSpeed} />
            </Stack>
          </Paper>

          <Box sx={{ height: 280, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <IncidentReportMap lat={incident.latitude} lng={incident.longitude} color={color} />
          </Box>
        </Stack>
      </Container>

      {/* Print layout — shown only when printing */}
      <Box className="print-only" sx={{ p: 4, fontFamily: 'serif' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>PoliceWatch — Incident Report</Typography>
          <Typography variant="caption" color="text.secondary">
            {window.location.href}
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography><strong>Violation:</strong> {violationLabel}</Typography>
          <Typography><strong>Location:</strong> {incident.address}</Typography>
          <Typography><strong>Date & Time:</strong> {reportedAt}</Typography>
          {incident.vehicleDesc && (
            <Typography><strong>Vehicle:</strong> {incident.vehicleDesc}</Typography>
          )}
          {incident.recorderSpeed != null && (
            <Typography>
              <strong>Recorder's speed at capture:</strong> ~{Math.round(incident.recorderSpeed * 2.237)} mph (reference only — not the violating vehicle's speed)
            </Typography>
          )}
          <Typography><strong>Report ID:</strong> {incident.id}</Typography>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          Video evidence available at: {incident.videoUrl}
        </Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" color="text.secondary">
          This report was submitted anonymously via PoliceWatch. Video evidence is stored and
          publicly accessible. Submitted {new Date(incident.createdAt).toLocaleDateString()}.
        </Typography>
      </Box>

      {/* Print CSS */}
      <style>{`
        @media print {
          .screen-only { display: none !important; }
          .print-only { display: block !important; }
          nav, header { display: none !important; }
        }
        @media screen {
          .print-only { display: none !important; }
        }
      `}</style>
    </>
  );
}
