import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const [loginError, setLoginError] = useState(null);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-dark-bg relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.13) 0%, rgba(191,0,255,0.06) 50%, transparent 80%), #04040f',
      }}
    >
      {/* Scanlines overlay */}
      <div className="scanlines pointer-events-none fixed inset-0 z-10" />

      {/* Card */}
      <div
        className="relative z-20 w-full max-w-md mx-4 rounded-2xl border-2 border-neon-cyan p-10 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(191,0,255,0.06) 100%)',
          boxShadow: '0 0 60px rgba(191,0,255,0.3), 0 0 120px rgba(0,212,255,0.15)',
        }}
      >
        {/* Logo / Title */}
        <div className="mb-2">
          <span
            className="text-5xl font-bold text-neon-green"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            {'<'}
          </span>
          <span
            className="text-5xl font-bold text-neon-cyan"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            NC
          </span>
          <span
            className="text-5xl font-bold text-neon-green"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            {' />'}
          </span>
        </div>

        <h1
          className="text-3xl font-bold text-neon-green mb-1"
          style={{ fontFamily: 'Orbitron, monospace' }}
        >
          New Coders
        </h1>

        <p
          className="text-neon-cyan text-lg mb-8"
          style={{ fontFamily: 'Orbitron, monospace' }}
        >
          Dev Path: 30 Dias de Codigo
        </p>

        <div
          className="w-full h-px mb-8"
          style={{
            background: 'linear-gradient(90deg, transparent, #bf00ff, #00d4ff, #bf00ff, transparent)',
          }}
        />

        <p className="text-text-light mb-6 text-sm">
          Inicia sesion con Google para acceder al curso
        </p>

        {/* Google Login Button */}
        <div className="flex justify-center mb-8">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              setLoginError(null);
              login(credentialResponse);
            }}
            onError={() => {
              setLoginError('No se pudo iniciar sesión. Verifica tu conexión e intenta de nuevo.');
            }}
            theme="filled_black"
            shape="pill"
            size="large"
            text="signin_with"
            locale="es"
          />
        </div>
        {loginError && (
          <p className="text-neon-yellow text-sm mt-4">{loginError}</p>
        )}

        <div
          className="w-full h-px mb-4"
          style={{
            background: 'linear-gradient(90deg, transparent, #bf00ff, #00d4ff, #bf00ff, transparent)',
          }}
        />

        <p className="text-border-dark text-xs">
          Al iniciar sesion, aceptas los terminos del programa educativo
        </p>
      </div>
    </div>
  );
}
