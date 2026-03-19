import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthContext = createContext(null);

function decodeAndValidateJwt(token, clientId) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));

    // Validar issuer (debe ser Google)
    const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
    if (!validIssuers.includes(payload.iss)) return null;

    // Validar audience (debe coincidir con nuestro Client ID)
    if (payload.aud !== clientId) return null;

    // Validar expiración
    if (!payload.exp || payload.exp <= Date.now() / 1000) return null;

    // Campos requeridos
    if (!payload.email) return null;

    return {
      name: payload.name || '',
      email: payload.email,
      picture: payload.picture || '',
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

function isTokenValid(user) {
  if (!user || !user.exp) return false;
  return user.exp > Date.now() / 1000;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('google_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && isTokenValid(parsed)) {
          setUser(parsed);
        } else {
          sessionStorage.removeItem('google_auth_user');
        }
      }
    } catch {
      sessionStorage.removeItem('google_auth_user');
    }
    // Limpieza única: eliminar token legacy de localStorage
    localStorage.removeItem('google_auth_credential');
    setLoading(false);
  }, []);

  const login = useCallback((credentialResponse) => {
    const token = credentialResponse.credential;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const decoded = decodeAndValidateJwt(token, clientId);
    if (decoded) {
      sessionStorage.setItem('google_auth_user', JSON.stringify(decoded));
      setUser(decoded);
    }
  }, []);

  const logout = useCallback(() => {
    const email = user?.email;
    setUser(null);
    sessionStorage.removeItem('google_auth_user');
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
