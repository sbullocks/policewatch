import { Chip, Tooltip } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';

interface Props {
  speedMs: number | null | undefined;
  size?: 'small' | 'medium';
}

function mphLabel(ms: number): string {
  return `${Math.round(ms * 2.237)} mph`;
}

export default function RecorderSpeedChip({ speedMs, size = 'small' }: Props) {
  if (speedMs == null) return null;
  return (
    <Tooltip title="Recorder's vehicle speed at time of capture — not the violating vehicle's speed">
      <Chip
        icon={<SpeedIcon />}
        label={`Recorder: ~${mphLabel(speedMs)}`}
        size={size}
        variant="outlined"
        color="default"
        sx={{ fontWeight: 500 }}
      />
    </Tooltip>
  );
}
