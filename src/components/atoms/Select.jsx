import { Select as MuiSelect, FormControl, InputLabel, MenuItem, OutlinedInput } from '@mui/material';

export default function Select({ label, value, onChange, options=[], multiple=false, id, ...props }) {
  const inputId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <FormControl fullWidth {...props}>
      <InputLabel id={`${inputId}-label`}>{label}</InputLabel>
      <MuiSelect 
        multiple={multiple} 
        value={value} 
        onChange={onChange} 
        input={<OutlinedInput id={inputId} label={label} />}
        labelId={`${inputId}-label`}
      >
        {options.map(opt => <MenuItem key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</MenuItem>)}
      </MuiSelect>
    </FormControl>
  );
}
