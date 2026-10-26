'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { signIn } from '@/lib/supabase/auth';
import { Box, Typography } from '@mui/material';
import { AuthFormCard } from '@/components/molecules/AuthFormCard';
import { AuthFormFields } from '@/components/molecules/AuthFormFields';
import { AuthButton } from '@/components/atoms/AuthButton';
import { AuthError } from '@/components/atoms/AuthError';
import { AuthLink } from '@/components/atoms/AuthLink';

export function RegisterForm() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>();
  const [generalError, setGeneralError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email format');
      valid = false;
    } else {
      setEmailError(undefined);
    }

    // Validate password (minimum 6 chars)
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError(undefined);
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm password');
      valid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    } else {
      setConfirmPasswordError(undefined);
    }

    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError(undefined);

    if (!validate()) return;

    setLoading(true);
    try {
      const { error } = await signUp(email, password);
      if (error) {
        setGeneralError(error.message || 'Registration failed');
      } else {
        // Auto sign in after successful registration
        await signIn(email, password);
        router.push('/');
        router.refresh();
      }
    } catch {
      setGeneralError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormCard
      title="Create Account"
      description="Sign up for your account"
      footer={
        <>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Already have an account?{' '}
            <AuthLink href="/login">Sign in</AuthLink>
          </Typography>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {generalError && <AuthError message={generalError} />}
        <AuthFormFields
          email={email}
          onEmailChange={(value) => {
            setEmail(value);
            setEmailError(undefined);
          }}
          password={password}
          onPasswordChange={(value) => {
            setPassword(value);
            setPasswordError(undefined);
          }}
          confirmPassword={confirmPassword}
          onConfirmPasswordChange={(value) => {
            setConfirmPassword(value);
            setConfirmPasswordError(undefined);
          }}
          showConfirmPassword={true}
          emailError={emailError}
          passwordError={passwordError}
          confirmPasswordError={confirmPasswordError}
        />
        <AuthButton type="submit" loading={loading} sx={{ mt: 2 }}>
          Sign Up
        </AuthButton>
      </form>
    </AuthFormCard>
  );
}