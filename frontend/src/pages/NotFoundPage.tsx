import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h2" fontWeight={700} color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h6" gutterBottom>Page not found</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        This page doesn't exist or was removed.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="contained" onClick={() => navigate('/')}>View Map</Button>
        <Button variant="outlined" onClick={() => navigate('/record')}>Submit Report</Button>
      </Box>
    </Container>
  );
}
