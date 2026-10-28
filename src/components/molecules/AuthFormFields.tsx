'use client';

import { Box } from '@mui/material';
import { FormField } from '@/components/atoms/FormField';

interface AuthFormFieldsProps {
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  confirmPassword?: string;
  onConfirmPasswordChange?: (value: string) => void;
  emailError?: string;
  passwordError?: string;
  confirmPasswordError?: string;
  showConfirmPassword?: boolean;
}

export function AuthFormFields({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  confirmPassword = '',
  onConfirmPasswordChange,
  emailError,
  passwordError,
  confirmPasswordError,
  showConfirmPassword = false,
}: AuthFormFieldsProps) {
  return (
    <Box>
      <FormField
        label="Email"
        type="text"
        value={email}
        onChange={onEmailChange}
        error={!!emailError}
        helperText={emailError}
        placeholder="you@example.com"
      />
      <FormField
        label="Password"
        type="password"
        value={password}
        onChange={onPasswordChange}
        error={!!passwordError}
        helperText={passwordError}
      />
      {showConfirmPassword && onConfirmPasswordChange && (
        <FormField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
        />
      )}
    </Box>
  );
}