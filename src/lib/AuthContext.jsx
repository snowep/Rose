import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../lib/auth.js';
import { seedUsers } from '../lib/seed.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await seedUsers();
      const raw = localStorage.getItem('rose_session');
      if (raw) {
        try {
          const { userId } = JSON.parse(raw);
          authService.getUserById(userId).then(u => {
            setUser(u);
            setLoading(false);
          }).catch(() => {
            localStorage.removeItem('rose_session');
            setLoading(false);
          });
        } catch {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email, password) => {
    const u = await authService.login({ email, password });
    localStorage.setItem('rose_session', JSON.stringify({ userId: u.id }));
    setUser(u);
    return u;
  };

  const register = async (email, password, plan = 'free') => {
    const u = await authService.register({ email, password, plan });
    localStorage.setItem('rose_session', JSON.stringify({ userId: u.id }));
    setUser(u);
    return u;
  };

  const logout = () => {
      localStorage.removeItem('rose_session');
      setUser(null);
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) {
    // redirect to login
    window.location.href = '/login';
    return null;
  }
  return children;
}
