import { useState, useMemo } from 'react';
import { Box, CircularProgress, Typography, Alert, Stack, Chip } from '@mui/material';
import IncidentMap from '../components/IncidentMap';
import ViolationFilterBar from '../components/ViolationFilterBar';
import IncidentDetailDrawer from '../components/IncidentDetailDrawer';
import { useGetIncidentsQuery, Incident } from '../store/incidentsApi';

const DATE_RANGES = [
  { label: 'All time', days: null },
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
] as const;

export default function MapPage() {
  const [dateRange, setDateRange] = useState<number | null>(null);
  const since = useMemo(() => {
    if (!dateRange) return undefined;
    const d = new Date();
    d.setDate(d.getDate() - dateRange);
    return d.toISOString();
  }, [dateRange]);

  const { data: incidents, isLoading, isError } = useGetIncidentsQuery(since);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selected, setSelected] = useState<Incident | null>(null);

  const filtered = useMemo(() => {
    if (!incidents) return [];
    if (activeFilters.length === 0) return incidents;
    return incidents.filter((i) => activeFilters.includes(i.violationType));
  }, [incidents, activeFilters]);

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    (incidents ?? []).forEach((i) => {
      result[i.violationType] = (result[i.violationType] ?? 0) + 1;
    });
    return result;
  }, [incidents]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Could not load incidents. Is the backend running?</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100svh - 64px)' }}>
      {/* Filter bar — in document flow so it's always touchable */}
      <Box sx={{ flexShrink: 0, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <ViolationFilterBar
          active={activeFilters}
          onChange={setActiveFilters}
          counts={counts}
        />
        {/* Date range — second scrollable row */}
        <Box sx={{ overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'nowrap', minWidth: 'max-content', px: 1, pb: 0.75 }}>
            {DATE_RANGES.map(({ label, days }) => (
              <Chip
                key={label}
                label={label}
                size="small"
                onClick={() => setDateRange(days)}
                color={dateRange === days ? 'primary' : 'default'}
                variant={dateRange === days ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Map fills remaining height */}
      <Box sx={{ flexGrow: 1, position: 'relative', minHeight: 0 }}>
        {filtered.length === 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              bgcolor: 'background.paper',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              boxShadow: 4,
              whiteSpace: 'nowrap',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {(incidents?.length ?? 0) === 0
                ? 'No incidents reported yet. Be the first.'
                : 'No incidents match the selected filters.'}
            </Typography>
          </Box>
        )}
        <IncidentMap incidents={filtered} onSelect={setSelected} />
      </Box>

      <IncidentDetailDrawer incident={selected} onClose={() => setSelected(null)} />
    </Box>
  );
}
