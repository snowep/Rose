import { createClient } from './client';
import { AuthResult } from '@/types/auth';

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error, session: null };
    }

    return { user: data.user, error: null, session: data.session };
  } catch (error) {
    return { user: null, error, session: null };
  }
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { user: null, error, session: null };
    }

    return { user: data.user, error: null, session: data.session };
  } catch (error) {
    return { user: null, error, session: null };
  }
}

export async function resetPassword(email: string): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      return { user: null, error, session: null };
    }

    return { user: null, error: null, session: null };
  } catch (error) {
    return { user: null, error, session: null };
  }
}

export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentSession() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
