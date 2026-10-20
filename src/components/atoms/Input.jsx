import { TextField as MuiTextField } from '@mui/material';

export default function Input({ label, value, onChange, type='text', fullWidth=true, ...props }) {
  return (
    <MuiTextField
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      fullWidth={fullWidth}
      {...props}
    />
  );
}
