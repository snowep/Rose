import { Select as MuiSelect, FormControl, InputLabel, MenuItem } from '@mui/material';

export default function Select({ label, value, onChange, options=[], multiple=false, id, name, ...props }) {
  const inputId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <FormControl fullWidth>
      <InputLabel id={`${inputId}-label`} htmlFor={inputId}>{label}</InputLabel>
      <MuiSelect
        multiple={multiple}
        value={multiple ? (value || []) : (value || '')}
        onChange={(value) => onChange(value)}
        id={inputId}
        name={name}
        labelId={`${inputId}-label`}
        renderValue={(selected) => (Array.isArray(selected) ? selected.join(', ') : selected)}
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