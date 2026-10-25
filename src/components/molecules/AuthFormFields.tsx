'use client';

import { Box } from '@mui/material';
import { AuthTextField } from '@/components/atoms/AuthTextField';
import { AuthPasswordField } from '@/components/atoms/AuthPasswordField';

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
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <Box>
      <AuthTextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        error={!!emailError}
        helperText={emailError}
        placeholder="you@example.com"
      />
      <AuthPasswordField
        label="Password"
        value={password}
        onChange={onPasswordChange}
        error={!!passwordError}
        helperText={passwordError}
      />
      {showConfirmPassword && onConfirmPasswordChange && (
        <AuthPasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
        />
      )}
    </Box>
  );
}
