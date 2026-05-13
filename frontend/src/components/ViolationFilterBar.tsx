import { Box, Chip, Stack, Typography } from '@mui/material';
import { VIOLATION_LABELS } from './ViolationTypeSelect';

export const VIOLATION_COLORS: Record<string, string> = {
  running_red_light: '#e63946',
  speeding: '#f4a261',
  no_lights_or_sirens: '#9b5de5',
  wrong_way_driving: '#ffd60a',
  reckless_driving: '#e85d04',
};

interface Props {
  active: string[];
  onChange: (active: string[]) => void;
  counts: Record<string, number>;
}

export default function ViolationFilterBar({ active, onChange, counts }: Props) {
  const toggle = (key: string) => {
    onChange(active.includes(key) ? active.filter((k) => k !== key) : [...active, key]);
  };

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        bgcolor: 'background.paper',
        borderRadius: 3,
        px: 2,
        py: 1,
        boxShadow: 4,
        maxWidth: '95vw',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          {total} incident{total !== 1 ? 's' : ''}
        </Typography>
        {Object.entries(VIOLATION_LABELS).map(([key, label]) => {
          const isActive = active.length === 0 || active.includes(key);
          return (
            <Chip
              key={key}
              label={`${label}${counts[key] ? ` (${counts[key]})` : ''}`}
              size="small"
              onClick={() => toggle(key)}
              sx={{
                bgcolor: isActive ? VIOLATION_COLORS[key] : 'transparent',
                color: isActive ? '#fff' : 'text.disabled',
                borderColor: VIOLATION_COLORS[key],
                border: '1px solid',
                fontWeight: isActive ? 700 : 400,
                fontSize: '0.7rem',
                '&:hover': { opacity: 0.85 },
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
