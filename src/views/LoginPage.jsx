import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth.jsx';

const CURRICULUM = [
  {
    week: 'Semana 1 — Días 1 al 7',
    title: 'Fundamentos y HTML',
    color: '#00d4ff',
    topics: [
      'Día 1: ¿Qué es programar? Variables y lógica básica',
      'Día 2: Herramientas del programador — VS Code, navegador, consola',
      'Día 3: Tu primera página web con HTML',
      'Día 4: Encabezados, párrafos y listas',
      'Día 5: Enlaces, imágenes y atributos',
      'Día 6: Formularios HTML — inputs, botones, selects',
      'Día 7: Proyecto — Página personal en HTML',
    ],
  },
  {
    week: 'Semana 2 — Días 8 al 14',
    title: 'CSS — Diseño y Estilos',
    color: '#bf00ff',
    topics: [
      'Día 8: Selectores CSS y propiedades básicas',
      'Día 9: Colores, fuentes y tipografía',
      'Día 10: Box model — margin, padding, border',
      'Día 11: Flexbox para layouts modernos',
      'Día 12: CSS Grid para diseños complejos',
      'Día 13: Responsive design y media queries',
      'Día 14: Proyecto — Portfolio con HTML y CSS',
    ],
  },
  {
    week: 'Semana 3 — Días 15 al 21',
    title: 'JavaScript — Lógica e Interactividad',
    color: '#39ff14',
    topics: [
      'Día 15: Variables, tipos de datos y operadores',
      'Día 16: Condicionales if/else y lógica',
      'Día 17: Bucles for y while',
      'Día 18: Funciones y reutilización de código',
      'Día 19: Arrays y métodos de array',
      'Día 20: Objetos y propiedades',
      'Día 21: DOM — Manipular el HTML con JavaScript',
    ],
  },
  {
    week: 'Semana 4 — Días 22 al 26',
    title: 'Eventos, Proyectos y Python',
    color: '#ffd700',
    topics: [
      'Día 22: Eventos del navegador — click, input, submit',
      'Día 23: Proyecto To-Do List en JavaScript',
      'Día 24: Introducción a Python — sintaxis básica',
      'Día 25: Python — funciones, listas y diccionarios',
      'Día 26: Python — lectura/escritura de archivos',
    ],
  },
  {
    week: 'Semana 5 — Días 27 al 30',
    title: 'Fullstack y Deploy',
    color: '#ff6b35',
    topics: [
      'Día 27: Flask — primer servidor web con Python',
      'Día 28: Conectar frontend y backend',
      'Día 29: Git y GitHub — control de versiones',
      'Día 30: Deploy — publicar tu proyecto en internet',
    ],
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [loginError, setLoginError] = useState(null);

  return (
    <div
      className="bg-dark-bg relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.13) 0%, rgba(191,0,255,0.06) 50%, transparent 80%), #04040f',
      }}
    >
      {/* Scanlines overlay */}
      <div className="scanlines pointer-events-none fixed inset-0 z-10" />

      {/* Login card — full first viewport */}
      <div className="min-h-screen flex items-center justify-center relative z-20 px-4">
        <div
          className="w-full max-w-md rounded-2xl border-2 border-neon-cyan p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(191,0,255,0.06) 100%)',
            boxShadow: '0 0 60px rgba(191,0,255,0.3), 0 0 120px rgba(0,212,255,0.15)',
          }}
        >
          {/* Logo / Title */}
          <div className="mb-2">
            <span className="text-5xl font-bold text-neon-green" style={{ fontFamily: 'Orbitron, monospace' }}>{'<'}</span>
            <span className="text-5xl font-bold text-neon-cyan" style={{ fontFamily: 'Orbitron, monospace' }}>NC</span>
            <span className="text-5xl font-bold text-neon-green" style={{ fontFamily: 'Orbitron, monospace' }}>{' />'}</span>
          </div>

          <h1 className="text-3xl font-bold text-neon-green mb-1" style={{ fontFamily: 'Orbitron, monospace' }}>
            New Coders
          </h1>

          <p className="text-neon-cyan text-lg mb-8" style={{ fontFamily: 'Orbitron, monospace' }}>
            Dev Path: 30 Dias de Codigo
          </p>

          <div className="w-full h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent, #bf00ff, #00d4ff, #bf00ff, transparent)' }} />

          <p className="text-text-light mb-6 text-sm">
            Inicia sesion con Google para acceder al curso
          </p>

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

          <div className="w-full h-px mb-4" style={{ background: 'linear-gradient(90deg, transparent, #bf00ff, #00d4ff, #bf00ff, transparent)' }} />

          <p className="text-border-dark text-xs">
            Al iniciar sesion, aceptas los terminos del programa educativo
          </p>
        </div>
      </div>

      {/* SEO Content — curso overview visible para Google y usuarios */}
      <main className="relative z-20 max-w-4xl mx-auto px-6 pb-24">
        <header className="text-center mb-14">
          <h2 className="text-3xl font-bold text-neon-cyan mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
            Aprende a programar gratis en 30 días
          </h2>
          <p className="text-text-light text-lg max-w-2xl mx-auto leading-relaxed">
            New Coders: Dev Path es un programa gratuito y en español para aprender programación desde cero.
            En 30 días diarios aprenderás <strong className="text-neon-green">HTML</strong>, <strong className="text-neon-green">CSS</strong>,{' '}
            <strong className="text-neon-green">JavaScript</strong> y <strong className="text-neon-green">Python</strong> — con lecciones prácticas,
            retos reales y una comunidad activa en WhatsApp.
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[
            { value: '30', label: 'Días de contenido' },
            { value: '4', label: 'Lenguajes' },
            { value: '100%', label: 'Gratuito' },
            { value: '0', label: 'Experiencia previa requerida' },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="rounded-xl border border-neon-cyan/30 p-4 text-center"
              style={{ background: 'rgba(0,212,255,0.04)' }}
            >
              <p className="text-2xl font-bold text-neon-cyan" style={{ fontFamily: 'Orbitron, monospace' }}>{value}</p>
              <p className="text-text-light text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Curriculum */}
        <section aria-label="Currículo del programa">
          <h3 className="text-xl font-bold text-neon-green mb-8 text-center" style={{ fontFamily: 'Orbitron, monospace' }}>
            Currículo — 30 días de código
          </h3>
          <div className="space-y-6">
            {CURRICULUM.map(({ week, title, color, topics }) => (
              <article
                key={week}
                className="rounded-xl border p-6"
                style={{ borderColor: `${color}40`, background: `${color}06` }}
              >
                <p className="text-xs font-bold mb-1" style={{ color, fontFamily: 'Orbitron, monospace' }}>{week}</p>
                <h4 className="text-lg font-bold text-white mb-4">{title}</h4>
                <ul className="space-y-2">
                  {topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2 text-text-light text-sm">
                      <span style={{ color }} className="mt-0.5 flex-shrink-0">▸</span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Community */}
        <section className="mt-14 text-center" aria-label="Comunidad">
          <h3 className="text-xl font-bold text-neon-green mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
            Comunidad activa
          </h3>
          <p className="text-text-light mb-6">
            Aprendé en comunidad. Tenemos un grupo de WhatsApp donde los estudiantes comparten avances,
            resuelven dudas y se motivan mutuamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://chat.whatsapp.com/EBB9GtaKths1ND1CrgAobi"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-neon-green text-neon-green font-bold hover:bg-neon-green hover:text-dark-bg transition-all text-sm"
              style={{ fontFamily: 'Orbitron, monospace' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Unirse al grupo de WhatsApp
            </a>
            <a
              href="https://x.com/NewCodersOrg"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-neon-cyan text-neon-cyan font-bold hover:bg-neon-cyan hover:text-dark-bg transition-all text-sm"
              style={{ fontFamily: 'Orbitron, monospace' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Seguir en X @NewCodersOrg
            </a>
          </div>
        </section>

        <footer className="mt-14 text-center text-border-dark text-xs">
          <p>New Coders &copy; 2026</p>
        </footer>
      </main>
    </div>
  );
}
