import { Select as MuiSelect, FormControl, InputLabel, MenuItem, OutlinedInput } from '@mui/material';

export default function Select({ label, value, onChange, options=[], multiple=false, ...props }) {
  return (
    <FormControl fullWidth {...props}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect multiple={multiple} value={value} onChange={onChange} input={<OutlinedInput label={label} />} >
        {options.map(opt => <MenuItem key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</MenuItem>)}
      </MuiSelect>
    </FormControl>
  );
}
