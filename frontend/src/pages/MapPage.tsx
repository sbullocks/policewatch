import { useState, useMemo } from 'react';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import IncidentMap from '../components/IncidentMap';
import ViolationFilterBar from '../components/ViolationFilterBar';
import IncidentDetailDrawer from '../components/IncidentDetailDrawer';
import { useGetIncidentsQuery, Incident } from '../store/incidentsApi';

export default function MapPage() {
  const { data: incidents, isLoading, isError } = useGetIncidentsQuery();
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
    <Box sx={{ position: 'relative', height: 'calc(100vh - 64px)' }}>
      <ViolationFilterBar
        active={activeFilters}
        onChange={setActiveFilters}
        counts={counts}
      />

      {filtered.length === 0 && !isLoading && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            bgcolor: 'background.paper',
            px: 3,
            py: 1.5,
            borderRadius: 2,
            boxShadow: 4,
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
      <IncidentDetailDrawer incident={selected} onClose={() => setSelected(null)} />
    </Box>
  );
}
