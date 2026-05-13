import { Box, Typography, Link, Stack, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <Box component="footer" sx={{ mt: 'auto', borderTop: '1px solid', borderColor: 'divider', py: 2, px: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        <Typography variant="caption" color="text.disabled">
          PoliceWatch — community accountability platform
        </Typography>
        <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
          <Link component="button" variant="caption" color="text.secondary" underline="hover" onClick={() => navigate('/about')}>
            About
          </Link>
          <Link component="button" variant="caption" color="text.secondary" underline="hover" onClick={() => navigate('/legal')}>
            Legal &amp; Privacy
          </Link>
          <Link
            href="https://github.com/sbullocks/policewatch"
            variant="caption"
            color="text.secondary"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
}
