import { useState, useCallback } from 'react';
import {
  Container, Typography, TextField, Button, Stack,
  CircularProgress, Alert, Divider, Chip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import VideoCapture from '../components/VideoCapture';
import ViolationTypeSelect from '../components/ViolationTypeSelect';
import SubmitResult from '../components/SubmitResult';
import { useVideoRecorder } from '../hooks/useVideoRecorder';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSubmitIncidentMutation, SubmitResult as Result } from '../store/incidentsApi';

export default function RecordPage() {
  const recorder = useVideoRecorder();
  const geo = useGeolocation();
  const [submitIncident, { isLoading: isSubmitting }] = useSubmitIncidentMutation();

  const [violationType, setViolationType] = useState('');
  const [vehicleDesc, setVehicleDesc] = useState('');
  const [violationError, setViolationError] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleStart = useCallback(async () => {
    geo.capture();
    await recorder.start();
  }, [recorder, geo]);

  const handleSubmit = async () => {
    if (!recorder.videoBlob) return;
    if (!violationType) {
      setViolationError(true);
      return;
    }
    setViolationError(false);
    setSubmitError(null);

    const location = geo.location ?? await geo.capture();

    const form = new FormData();
    form.append('video', recorder.videoBlob, 'incident.webm');
    form.append('violationType', violationType);
    form.append('incidentAt', new Date().toISOString());
    form.append('latitude', String(location?.latitude ?? 0));
    form.append('longitude', String(location?.longitude ?? 0));
    form.append('address', location?.address ?? 'Unknown location');
    if (vehicleDesc.trim()) form.append('vehicleDesc', vehicleDesc.trim());

    try {
      const res = await submitIncident(form).unwrap();
      setResult(res);
    } catch {
      setSubmitError('Submission failed. Please check your connection and try again.');
    }
  };

  const handleReset = () => {
    recorder.reset();
    setViolationType('');
    setVehicleDesc('');
    setViolationError(false);
    setResult(null);
    setSubmitError(null);
  };

  if (result) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <SubmitResult result={result} onReportAnother={handleReset} />
      </Container>
    );
  }

  const showForm = recorder.state === 'stopped';

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Report an Incident
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload dashcam footage or an existing video clip. GPS and timestamp are auto-tagged.
        Live recording is available for passengers — never record while driving.
      </Typography>

      <Stack spacing={3}>
        <VideoCapture
          state={recorder.state}
          videoUrl={recorder.videoUrl}
          secondsLeft={recorder.secondsLeft}
          error={recorder.error}
          supportsMediaRecorder={recorder.supportsMediaRecorder}
          onStart={handleStart}
          onStop={recorder.stop}
          onReset={recorder.reset}
          onFileSelect={recorder.onFileSelect}
        />

        {showForm && (
          <>
            <Divider />

            <LocationStatus geo={geo} />

            <ViolationTypeSelect
              value={violationType}
              onChange={setViolationType}
              error={violationError}
            />

            <TextField
              label="Vehicle Description"
              placeholder="e.g. Police cruiser #47, black SUV, unmarked vehicle"
              value={vehicleDesc}
              onChange={(e) => setVehicleDesc(e.target.value)}
              multiline
              rows={2}
              fullWidth
              inputProps={{ maxLength: 500 }}
            />

            {submitError && <Alert severity="error">{submitError}</Alert>}

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isSubmitting}
              onClick={handleSubmit}
              sx={{ py: 1.5, fontWeight: 700, fontSize: '1rem' }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Report'}
            </Button>
          </>
        )}
      </Stack>
    </Container>
  );
}

function LocationStatus({ geo }: { geo: ReturnType<typeof useGeolocation> }) {
  if (geo.loading) {
    return (
      <Chip icon={<CircularProgress size={14} />} label="Getting location…" variant="outlined" />
    );
  }
  if (geo.location) {
    return (
      <Chip
        icon={<LocationOnIcon />}
        label={geo.location.address}
        color="success"
        variant="outlined"
        sx={{ maxWidth: '100%', '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }}
      />
    );
  }
  return (
    <Chip
      icon={<LocationOffIcon />}
      label={geo.error ?? 'Location not available'}
      color="warning"
      variant="outlined"
    />
  );
}
