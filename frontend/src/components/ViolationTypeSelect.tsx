import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

export const VIOLATION_LABELS: Record<string, string> = {
  running_red_light: 'Running Red Light',
  speeding: 'Speeding',
  no_lights_or_sirens: 'No Lights or Sirens',
  wrong_way_driving: 'Wrong-Way Driving',
  reckless_driving: 'Reckless Driving',
};

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export default function ViolationTypeSelect({ value, onChange, error }: Props) {
  return (
    <FormControl fullWidth error={error} required>
      <InputLabel id="violation-type-label">Violation Type</InputLabel>
      <Select
        labelId="violation-type-label"
        value={value}
        label="Violation Type"
        onChange={(e) => onChange(e.target.value)}
      >
        {Object.entries(VIOLATION_LABELS).map(([key, label]) => (
          <MenuItem key={key} value={key}>{label}</MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>Required</FormHelperText>}
    </FormControl>
  );
}
