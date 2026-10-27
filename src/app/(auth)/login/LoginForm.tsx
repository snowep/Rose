'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { AuthFormCard } from '@/components/molecules/AuthFormCard';
import { AuthFormFields } from '@/components/molecules/AuthFormFields';
import { AuthButton } from '@/components/atoms/AuthButton';
import { AuthError } from '@/components/atoms/AuthError';
import { AuthLink } from '@/components/atoms/AuthLink';
import { useAuth } from '@/hooks/useAuth';
import { getEmailValidationError } from '@/lib/auth-validation';

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [generalError, setGeneralError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    const emailValidationError = getEmailValidationError(email);
    setEmailError(emailValidationError);
    if (emailValidationError) valid = false;

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError(undefined);
    }

    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError(undefined);

    if (!validate()) return;

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setGeneralError(error.message || 'Invalid credentials');
      } else {
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
      title="Welcome Back"
      description="Sign in to your account"
      footer={
        <>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Don't have an account?{' '}
            <AuthLink href="/register">Sign up</AuthLink>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <AuthLink href="/forgot">Forgot password?</AuthLink>
          </Typography>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {generalError && <AuthError message={generalError} />}
        <AuthFormFields
          email={email}
          onEmailChange={(value) => { setEmail(value); setEmailError(undefined); }}
          password={password}
          onPasswordChange={(value) => { setPassword(value); setPasswordError(undefined); }}
          emailError={emailError}
          passwordError={passwordError}
        />
        <AuthButton type="submit" loading={loading} sx={{ mt: 2 }}>
          Sign In
        </AuthButton>
      </form>
    </AuthFormCard>
  );
}