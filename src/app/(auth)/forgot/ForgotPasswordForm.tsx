'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Box, Typography } from '@mui/material';
import { AuthFormCard } from '@/components/molecules/AuthFormCard';
import { AuthButton } from '@/components/atoms/AuthButton';
import { AuthError } from '@/components/atoms/AuthError';
import { AuthLink } from '@/components/atoms/AuthLink';
import { AuthTextField } from '@/components/atoms/AuthTextField';

export function ForgotPasswordForm() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | undefined>();

  const validate = () => {
    let valid = true;

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email format');
      valid = false;
    } else {
      setEmailError(undefined);
    }

    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError(undefined);
    setSuccess(false);
    setSubmitting(true);

    if (!validate()) {
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setGeneralError(error.message || 'Failed to send reset email');
      } else {
        setSuccess(true);
      }
    } catch {
      setGeneralError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Password Reset Sent
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          We've sent a password reset link to {email}. Please check your email.
        </Typography>
        <AuthLink href="/login">Back to sign in</AuthLink>
      </Box>
    );
  }

  return (
    <AuthFormCard
      title="Forgot Password"
      description="Enter your email to receive a password reset link"
    >
      {generalError && <AuthError message={generalError} />}
      <form onSubmit={handleSubmit}>
        <AuthTextField
          label="Email"
          type="email"
          value={email}
          onChange={(value) => { setEmail(value); setEmailError(undefined); }}
          error={!!emailError}
          helperText={emailError}
          placeholder="you@example.com"
          margin="normal"
          fullWidth
        />
        <AuthButton type="submit" disabled={submitting} sx={{ mt: 2 }}>
          {submitting ? 'Sending...' : 'Send reset link'}
        </AuthButton>
      </form>
    </AuthFormCard>
  );
}