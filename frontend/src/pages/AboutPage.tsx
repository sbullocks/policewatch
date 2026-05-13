import {
  Container, Typography, Box, Stack, Paper, Divider, Button,
} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import MapIcon from '@mui/icons-material/Map';
import VerifiedIcon from '@mui/icons-material/Verified';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  {
    icon: <VideocamIcon fontSize="large" color="primary" />,
    title: 'Record or Upload',
    body: 'Upload dashcam footage or record live from your phone as a passenger. GPS and speed are captured automatically. Submissions are anonymous — no account required.',
  },
  {
    icon: <VerifiedIcon fontSize="large" color="primary" />,
    title: 'AI Validates',
    body: 'Video frames are analyzed by Claude AI to confirm the stated violation is visible. Confirmed incidents are published immediately. Uncertain submissions go to a human review queue.',
  },
  {
    icon: <MapIcon fontSize="large" color="primary" />,
    title: 'Appears on the Map',
    body: 'Confirmed incidents are pinned to the community map, color-coded by violation type. Every report includes the video, location, and timestamp as a shareable permalink.',
  },
];

const VIOLATIONS = [
  'Speeding',
  'Running a red light',
  'Illegal U-turn',
  'Failure to yield',
  'Reckless driving',
  'Improper lane change',
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Hero */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Community accountability for law enforcement traffic conduct
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mx: 'auto', mb: 3 }}>
          PoliceWatch is a free, anonymous platform for documenting and sharing evidence of law
          enforcement traffic violations. Every confirmed report is publicly accessible and permanently
          stored as a community record.
        </Typography>
        <Button variant="contained" color="primary" size="large" onClick={() => navigate('/record')}>
          Submit a Report
        </Button>
      </Box>

      <Divider sx={{ mb: 5 }} />

      {/* How it works */}
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        How it works
      </Typography>
      <Stack spacing={2} sx={{ mb: 5 }}>
        {STEPS.map((step, i) => (
          <Paper key={i} variant="outlined" sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box sx={{ flexShrink: 0, pt: 0.5 }}>{step.icon}</Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {i + 1}. {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">{step.body}</Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* What qualifies */}
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5 }}>
        What qualifies
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Reports must show a law enforcement vehicle committing a traffic violation. Supported types:
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 5 }}>
        {VIOLATIONS.map((v) => (
          <Paper key={v} variant="outlined" sx={{ px: 2, py: 0.75 }}>
            <Typography variant="body2">{v}</Typography>
          </Paper>
        ))}
      </Stack>

      {/* Privacy */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <LockIcon color="action" sx={{ flexShrink: 0, mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Your privacy
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No account, email, or personal information is required to submit. Location data is
              attached to the incident, not to you. Video is stored on Cloudflare R2 and is publicly
              accessible once published — do not submit footage that identifies you or bystanders.
              See our <Button variant="text" size="small" sx={{ p: 0, minWidth: 0, verticalAlign: 'baseline' }} onClick={() => navigate('/legal')}>Privacy Policy</Button> for full details.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Disclaimer */}
      <Typography variant="caption" color="text.disabled" display="block" sx={{ textAlign: 'center' }}>
        PoliceWatch is an independent civic tool. It is not affiliated with any law enforcement agency,
        government body, or legal organization. Content is user-submitted and community-moderated.
      </Typography>
    </Container>
  );
}
