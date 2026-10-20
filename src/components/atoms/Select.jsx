import { Select as MuiSelect, FormControl, InputLabel, MenuItem, OutlinedInput } from '@mui/material';

export default function Select({ label, value, onChange, options=[], multiple=false, id, ...props }) {
  const inputId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <FormControl fullWidth {...props}>
      <InputLabel id={`${inputId}-label`} htmlFor={inputId}>{label}</InputLabel>
      <MuiSelect
        multiple={multiple}
        value={value}
        onChange={onChange}
        labelId={`${inputId}-label`}
        id={inputId}
        input={<OutlinedInput id={inputId} />}
      >
        {options.map(opt => <MenuItem key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</MenuItem>)}
      </MuiSelect>
    </FormControl>
  );
}
