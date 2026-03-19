import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
      exp: decoded.exp,
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
    const saved = localStorage.getItem('google_auth_credential');
    if (saved) {
      const decoded = decodeJwt(saved);
      if (decoded && isTokenValid(decoded)) {
        setUser(decoded);
      } else {
        localStorage.removeItem('google_auth_credential');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((credentialResponse) => {
    const token = credentialResponse.credential;
    const decoded = decodeJwt(token);
    if (decoded) {
      localStorage.setItem('google_auth_credential', token);
      setUser(decoded);
    }
  }, []);

  const logout = useCallback(() => {
    const email = user?.email;
    setUser(null);
    localStorage.removeItem('google_auth_credential');
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
