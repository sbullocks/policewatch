import { useState, useCallback, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, Stack,
  CircularProgress, Alert, Divider,
} from '@mui/material';
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
  const [address, setAddress] = useState('');
  const [violationError, setViolationError] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-fill address from GPS, but keep it editable so dashcam users can correct it
  useEffect(() => {
    if (geo.location?.address && !address) {
      setAddress(geo.location.address);
    }
  }, [geo.location, address]);

  const handleStart = useCallback(async () => {
    geo.capture();
    await recorder.start();
  }, [recorder, geo]);

  const handleSubmit = async () => {
    if (!recorder.videoBlob) return;
    if (!violationType) { setViolationError(true); return; }
    setViolationError(false);
    setSubmitError(null);

    const location = geo.location ?? await geo.capture();

    const form = new FormData();
    form.append('video', recorder.videoBlob, 'incident.webm');
    form.append('violationType', violationType);
    form.append('incidentAt', new Date().toISOString());
    form.append('latitude', String(location?.latitude ?? 0));
    form.append('longitude', String(location?.longitude ?? 0));
    form.append('address', address.trim() || location?.address || 'Unknown location');
    if (location?.speed != null) form.append('recorderSpeed', String(location.speed));
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
    setAddress('');
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
        Upload dashcam footage or an existing clip. For uploaded footage, correct the location
        to where the violation occurred — not where you are now.
        Live recording is for passengers only — never record while driving.
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

            <ViolationTypeSelect
              value={violationType}
              onChange={setViolationType}
              error={violationError}
            />

            <TextField
              label="Location of Violation"
              placeholder="e.g. Main St & 5th Ave, Atlanta, GA"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              helperText={
                geo.loading
                  ? 'Getting your GPS location…'
                  : geo.location
                  ? 'Auto-filled from GPS — correct if uploading dashcam footage from a different location'
                  : 'GPS unavailable — enter the location manually'
              }
              InputProps={{ startAdornment: geo.loading ? <CircularProgress size={14} sx={{ mr: 1 }} /> : undefined }}
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
