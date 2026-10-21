import { Select as MuiSelect, FormControl, InputLabel } from '@mui/material';

export default function Select({ label, value, onChange, options=[], multiple=false, id, name, ...props }) {
  const inputId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <FormControl fullWidth {...props}>
      <InputLabel id={`${inputId}-label`} htmlFor={inputId}>{label}</InputLabel>
      <MuiSelect
        native
        multiple={multiple}
        value={value}
        onChange={onChange}
        id={inputId}
        name={name}
        labelId={`${inputId}-label`}
      >
        <option value="" />
        {options.map(opt => <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>)}
      </MuiSelect>
    </FormControl>
  );
}
