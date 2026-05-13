import {
  Container, Typography, Box, Stack, Chip, Paper, CircularProgress, Alert, Divider,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useGetPatternsQuery } from '../store/incidentsApi';
import { VIOLATION_LABELS } from '../components/ViolationTypeSelect';
import { VIOLATION_COLORS } from '../components/ViolationFilterBar';

export default function PatternsPage() {
  const { data, isLoading, isError } = useGetPatternsQuery();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">Could not load pattern data.</Alert>
      </Container>
    );
  }

  const topViolation = data.byType[0];

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Incident Patterns
      </Typography>

      {/* Summary chips */}
      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ px: 3, py: 2, textAlign: 'center', minWidth: 120 }}>
          <Typography variant="h4" fontWeight={700} color="primary">{data.total}</Typography>
          <Typography variant="caption" color="text.secondary">Total Confirmed</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ px: 3, py: 2, textAlign: 'center', minWidth: 120 }}>
          <Typography variant="h4" fontWeight={700} color="primary">{data.thisMonth}</Typography>
          <Typography variant="caption" color="text.secondary">This Month</Typography>
        </Paper>
        {topViolation && (
          <Paper variant="outlined" sx={{ px: 3, py: 2, textAlign: 'center', minWidth: 160 }}>
            <Chip
              label={VIOLATION_LABELS[topViolation.violationType] ?? topViolation.violationType}
              size="small"
              sx={{
                bgcolor: VIOLATION_COLORS[topViolation.violationType] ?? '#888',
                color: '#fff',
                fontWeight: 700,
                mb: 0.5,
              }}
            />
            <Typography variant="caption" color="text.secondary" display="block">
              Most Reported
            </Typography>
          </Paper>
        )}
      </Stack>

      {/* Breakdown by violation type */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <BarChartIcon fontSize="small" color="action" />
        <Typography variant="subtitle1" fontWeight={600}>By Violation Type</Typography>
      </Stack>
      <Paper variant="outlined" sx={{ mb: 4 }}>
        {data.byType.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            No data yet.
          </Typography>
        ) : (
          data.byType.map((row, i) => {
            const maxCount = data.byType[0]?.count ?? 1;
            const pct = Math.round((row.count / maxCount) * 100);
            const label = VIOLATION_LABELS[row.violationType] ?? row.violationType;
            const color = VIOLATION_COLORS[row.violationType] ?? '#888';
            return (
              <Box key={row.violationType}>
                {i > 0 && <Divider />}
                <Stack direction="row" alignItems="center" spacing={2} sx={{ px: 2, py: 1.5 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 160 }}>{label}</Typography>
                  <Box sx={{ flexGrow: 1, bgcolor: 'action.hover', borderRadius: 1, height: 8 }}>
                    <Box sx={{ width: `${pct}%`, bgcolor: color, borderRadius: 1, height: '100%' }} />
                  </Box>
                  <Typography variant="body2" fontWeight={700} sx={{ minWidth: 24, textAlign: 'right' }}>
                    {row.count}
                  </Typography>
                </Stack>
              </Box>
            );
          })
        )}
      </Paper>

      {/* Hot spots */}
      {data.hotSpots.length > 0 && (
        <>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="subtitle1" fontWeight={600}>Repeat Locations</Typography>
          </Stack>
          <Paper variant="outlined">
            {data.hotSpots.map((spot, i) => (
              <Box key={spot.address}>
                {i > 0 && <Divider />}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body2">{spot.address}</Typography>
                  <Chip label={`${spot.count} incidents`} size="small" color="warning" variant="outlined" />
                </Stack>
              </Box>
            ))}
          </Paper>
        </>
      )}
    </Container>
  );
}
