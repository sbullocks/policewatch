import { useRef } from 'react';
import {
  Box, Button, Typography, CircularProgress, Stack, Chip, Divider,
} from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import StopIcon from '@mui/icons-material/Stop';
import ReplayIcon from '@mui/icons-material/Replay';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VideocamIcon from '@mui/icons-material/Videocam';
import { RecordState } from '../hooks/useVideoRecorder';

interface Props {
  state: RecordState;
  videoUrl: string | null;
  secondsLeft: number;
  error: string | null;
  supportsMediaRecorder: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onFileSelect: (file: File) => void;
}

export default function VideoCapture({
  state, videoUrl, secondsLeft, error, supportsMediaRecorder,
  onStart, onStop, onReset, onFileSelect,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>

      {/* Video preview */}
      {videoUrl && (
        <Box sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', bgcolor: 'black' }}>
          <video src={videoUrl} controls style={{ width: '100%', maxHeight: 320, display: 'block' }} />
        </Box>
      )}

      {/* Live recording active */}
      {state === 'recording' && (
        <Box sx={{
          width: '100%', height: 200, bgcolor: 'black', borderRadius: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Stack alignItems="center" spacing={1}>
            <Chip
              icon={<RadioButtonCheckedIcon sx={{ color: 'error.main !important' }} />}
              label="RECORDING"
              color="error"
              variant="outlined"
              sx={{ fontWeight: 700, letterSpacing: 1 }}
            />
            <Typography variant="h4" color="white" fontWeight={700}>{secondsLeft}s</Typography>
          </Stack>
        </Box>
      )}

      {error && <Typography color="error" variant="body2" textAlign="center">{error}</Typography>}

      {/* Idle state — upload primary, record secondary */}
      {state === 'idle' && (
        <Stack spacing={2} width="100%">
          {/* Primary: Upload */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            startIcon={<UploadFileIcon />}
            onClick={() => fileInputRef.current?.click()}
            sx={{ py: 1.75, fontWeight: 700, fontSize: '1rem' }}
          >
            Upload Dashcam / Video Footage
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
            }}
          />

          {/* Secondary: Live record (passengers only) */}
          {supportsMediaRecorder && (
            <>
              <Divider>
                <Typography variant="caption" color="text.disabled">or</Typography>
              </Divider>
              <Box>
                <Button
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  startIcon={<VideocamIcon />}
                  onClick={onStart}
                  sx={{ color: 'text.secondary', borderColor: 'divider' }}
                >
                  Record Live
                </Button>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  display="block"
                  textAlign="center"
                  sx={{ mt: 0.5 }}
                >
                  For passengers only — do not use while driving
                </Typography>
              </Box>
            </>
          )}
        </Stack>
      )}

      {/* Requesting camera */}
      {state === 'requesting' && (
        <Button variant="outlined" disabled size="large" fullWidth startIcon={<CircularProgress size={18} />}>
          Requesting Camera…
        </Button>
      )}

      {/* Recording active */}
      {state === 'recording' && (
        <Button
          variant="contained"
          color="error"
          size="large"
          fullWidth
          startIcon={<StopIcon />}
          onClick={onStop}
          sx={{ fontWeight: 700 }}
        >
          Stop Recording
        </Button>
      )}

      {/* After capture */}
      {state === 'stopped' && (
        <Button variant="outlined" startIcon={<ReplayIcon />} onClick={onReset} fullWidth>
          Use Different Footage
        </Button>
      )}
    </Box>
  );
}
