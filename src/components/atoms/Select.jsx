import { Select as MuiSelect, FormControl, InputLabel, MenuItem } from '@mui/material';

export default function Select({ label, value, onChange, options=[], multiple=false, id, name, ...props }) {
  const inputId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <FormControl fullWidth {...props}>
      <InputLabel id={`${inputId}-label`} htmlFor={inputId}>{label}</InputLabel>
      <MuiSelect
        multiple={multiple}
        value={multiple ? (value || []) : (value || '')}
        onChange={(e) => onChange(multiple ? e.target.value : e.target.value)}
        id={inputId}
        name={name}
        labelId={`${inputId}-label`}
        renderValue={(selected) => selected.join(', ')}
      >
        {options.map(opt => (
          <MenuItem key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}
