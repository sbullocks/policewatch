import { useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, Stack,
  CircularProgress, Alert, Grid, Chip,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import AdminIncidentCard from '../components/AdminIncidentCard';
import {
  useGetPendingQuery,
  useApproveIncidentMutation,
  useRejectIncidentMutation,
} from '../store/adminApi';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState('');

  const { data, isLoading, isError, error } = useGetPendingQuery(submitted, {
    skip: !submitted,
    refetchOnMountOrArgChange: true,
  });

  const [approve] = useApproveIncidentMutation();
  const [reject] = useRejectIncidentMutation();

  const isUnauthorized =
    isError && (error as { status?: number })?.status === 401;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(password);
  };

  const handleApprove = async (id: string, pw: string) => {
    await approve({ id, password: pw }).unwrap();
  };

  const handleReject = async (id: string, pw: string) => {
    await reject({ id, password: pw }).unwrap();
  };

  // Password gate
  if (!submitted) {
    return (
      <Container maxWidth="xs" sx={{ py: 8 }}>
        <Stack alignItems="center" spacing={3}>
          <LockIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="h6" fontWeight={700}>Admin Review</Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <Stack spacing={2}>
              <TextField
                label="Admin Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                autoComplete="current-password"
                required
              />
              <Button type="submit" variant="contained" fullWidth size="large">
                Sign In
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Pending Review</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          {data && (
            <Chip
              label={`${data.length} pending`}
              color={data.length > 0 ? 'warning' : 'default'}
              size="small"
            />
          )}
          <Button size="small" variant="outlined" onClick={() => setSubmitted('')}>
            Sign Out
          </Button>
        </Stack>
      </Stack>

      {isUnauthorized && (
        <Alert severity="error" sx={{ mb: 2 }} action={
          <Button color="inherit" size="small" onClick={() => { setSubmitted(''); setPassword(''); }}>
            Try Again
          </Button>
        }>
          Incorrect password.
        </Alert>
      )}

      {isError && !isUnauthorized && (
        <Alert severity="error">Could not load incidents. Is the backend running?</Alert>
      )}

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {data && data.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">No incidents pending review.</Typography>
        </Box>
      )}

      {data && data.length > 0 && (
        <Grid container spacing={3}>
          {data.map((incident) => (
            <Grid item xs={12} sm={6} key={incident.id}>
              <AdminIncidentCard
                incident={incident}
                password={submitted}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
