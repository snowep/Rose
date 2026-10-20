import { TextField as MuiTextField } from '@mui/material';

export default function Input({ label, value, onChange, type='text', fullWidth=true, id, ...props }) {
  return (
    <MuiTextField
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      fullWidth={fullWidth}
      {...props}
    />
  );
}
