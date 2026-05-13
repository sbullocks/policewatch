import { useRef } from 'react';
import { Box, Button, Typography, CircularProgress, Stack, Chip } from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import StopIcon from '@mui/icons-material/Stop';
import ReplayIcon from '@mui/icons-material/Replay';
import UploadFileIcon from '@mui/icons-material/UploadFile';
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
      {videoUrl ? (
        <Box sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', bgcolor: 'black' }}>
          <video src={videoUrl} controls style={{ width: '100%', maxHeight: 320, display: 'block' }} />
        </Box>
      ) : state === 'recording' ? (
        <Box
          sx={{
            width: '100%', height: 200, bgcolor: 'black', borderRadius: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Stack alignItems="center" spacing={1}>
            <Chip
              icon={<RadioButtonCheckedIcon sx={{ color: 'error.main !important' }} />}
              label="RECORDING"
              color="error"
              variant="outlined"
              sx={{ fontWeight: 700, letterSpacing: 1 }}
            />
            <Typography variant="h4" color="white" fontWeight={700}>
              {secondsLeft}s
            </Typography>
          </Stack>
        </Box>
      ) : null}

      {error && (
        <Typography color="error" variant="body2" textAlign="center">{error}</Typography>
      )}

      <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
        {state === 'idle' && supportsMediaRecorder && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<RadioButtonCheckedIcon />}
            onClick={onStart}
            sx={{ px: 4, fontWeight: 700 }}
          >
            Start Recording
          </Button>
        )}

        {state === 'requesting' && (
          <Button variant="contained" disabled size="large" startIcon={<CircularProgress size={18} />}>
            Requesting Camera…
          </Button>
        )}

        {state === 'recording' && (
          <Button
            variant="contained"
            color="error"
            size="large"
            startIcon={<StopIcon />}
            onClick={onStop}
            sx={{ px: 4, fontWeight: 700 }}
          >
            Stop
          </Button>
        )}

        {state === 'stopped' && (
          <Button variant="outlined" startIcon={<ReplayIcon />} onClick={onReset}>
            Re-record
          </Button>
        )}

        {(state === 'idle' || !supportsMediaRecorder) && (
          <>
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Video
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
          </>
        )}
      </Stack>

      {!supportsMediaRecorder && (
        <Typography variant="caption" color="text.secondary" textAlign="center">
          In-browser recording is not supported on your device. Please upload a video clip.
        </Typography>
      )}
    </Box>
  );
}
