import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthContext = createContext(null);

const API_BASE = '/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión desde cookie al cargar
  useEffect(() => {
    async function restoreSession() {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        // Sin sesión válida
      } finally {
        // Limpieza legacy
        localStorage.removeItem('google_auth_credential');
        sessionStorage.removeItem('google_auth_user');
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = useCallback(async (credentialResponse) => {
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      if (!res.ok) {
        console.error('Login failed:', res.status);
        return;
      }

      const data = await res.json();
      setUser(data.user);

      // Migrar progreso de localStorage al servidor
      const savedProgress = localStorage.getItem('completedLessons');
      if (savedProgress) {
        try {
          const completedDays = JSON.parse(savedProgress);
          if (Array.isArray(completedDays) && completedDays.length > 0) {
            const migrateRes = await fetch(`${API_BASE}/progress/migrate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ completedDays }),
            });
            if (migrateRes.ok) {
              localStorage.removeItem('completedLessons');
            }
          }
        } catch {
          // Ignorar errores de migración
        }
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  }, []);

  const logout = useCallback(async () => {
    const email = user?.email;

    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Continuar con logout local
    }

    setUser(null);

    if (email && window.google?.accounts?.id) {
      window.google.accounts.id.revoke(email, () => {});
    }
  }, [user?.email]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={{ user, loading, login, logout }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
