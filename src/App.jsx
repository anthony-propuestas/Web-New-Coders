import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from './hooks/useAuth.jsx';
import LoginPage from './views/LoginPage';

// Datos del carrusel de Aliados — reemplazar con imagenes y URLs reales
const CAROUSEL_ITEMS = [
  { image: 'https://i.postimg.cc/0jLjMbH1/Whats-App-Image-2026-03-28-at-16-46-14.jpg', url: 'https://sensibilidadesff.xo.je/index.php', title: 'sensibilidadesff', alt: 'Aliado 1' },
  { image: 'https://placehold.co/600x340/0a0a1e/a855f7?text=Aliado+2', url: 'https://example.com', title: 'Aliado 2', alt: 'Aliado 2' },
  { image: 'https://placehold.co/600x340/0a0a1e/a855f7?text=Aliado+3', url: 'https://example.com', title: 'Aliado 3', alt: 'Aliado 3' },
  { image: 'https://placehold.co/600x340/0a0a1e/a855f7?text=Aliado+4', url: 'https://example.com', title: 'Aliado 4', alt: 'Aliado 4' },
  { image: 'https://placehold.co/600x340/0a0a1e/a855f7?text=Aliado+5', url: 'https://example.com', title: 'Aliado 5', alt: 'Aliado 5' },
];

const SocialLinks = () => (
  <div className="flex justify-center items-center gap-5 mt-3">
    <a
      href="https://chat.whatsapp.com/EBB9GtaKths1ND1CrgAobi"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Únete a nuestra comunidad en WhatsApp"
      className="text-text-light hover:text-neon-green transition-colors duration-300"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="22" height="22" fill="currentColor">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.74 5.494 2.035 7.807L0 32l8.418-2.01A15.94 15.94 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.25a13.21 13.21 0 0 1-6.73-1.84l-.482-.286-4.997 1.194 1.222-4.862-.314-.5A13.22 13.22 0 0 1 2.75 16C2.75 8.682 8.682 2.75 16 2.75S29.25 8.682 29.25 16 23.318 29.25 16 29.25zm7.27-9.77c-.398-.199-2.355-1.162-2.72-1.295-.366-.133-.633-.199-.9.2-.266.398-1.031 1.295-1.264 1.562-.233.266-.465.299-.863.1-.398-.2-1.682-.62-3.203-1.977-1.184-1.056-1.983-2.36-2.216-2.759-.233-.398-.025-.613.175-.811.18-.179.398-.465.597-.698.199-.233.266-.398.398-.664.133-.266.067-.498-.033-.697-.1-.199-.9-2.169-1.232-2.967-.325-.779-.655-.673-.9-.686l-.765-.013c-.266 0-.697.1-1.063.498-.365.398-1.396 1.364-1.396 3.326 0 1.963 1.43 3.86 1.63 4.126.199.266 2.814 4.296 6.82 6.026.954.412 1.698.657 2.279.842.957.305 1.83.262 2.519.159.768-.115 2.355-.963 2.688-1.893.332-.93.332-1.729.232-1.893-.1-.166-.366-.266-.764-.465z"/>
      </svg>
    </a>
    <a
      href="https://x.com/NewCodersOrg"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Síguenos en X (Twitter)"
      className="text-text-light hover:text-neon-green transition-colors duration-300"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    </a>
  </div>
);

export default function App() {
  const { user, loading, logout, refreshUser } = useAuth();

  const [currentView, setCurrentView] = useState('selector');
  const [profileName, setProfileName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [hackathonForm, setHackathonForm] = useState({ display_name: '', github_profile: '', category: 'starter' });
  const [hackathonRegistration, setHackathonRegistration] = useState(null);
  const [loadingHackathonRegistration, setLoadingHackathonRegistration] = useState(false);
  const [savingHackathonRegistration, setSavingHackathonRegistration] = useState(false);
  const [hackathonError, setHackathonError] = useState('');
  const [hackathonSuccess, setHackathonSuccess] = useState('');
  const [hackathonRounds, setHackathonRounds] = useState([]);
  const [loadingHackathonRounds, setLoadingHackathonRounds] = useState(false);
  const [hackathonRoundsError, setHackathonRoundsError] = useState('');
  const [hackathonRegistrants, setHackathonRegistrants] = useState([]);
  const [loadingHackathonRegistrants, setLoadingHackathonRegistrants] = useState(false);
  const [hackathonRegistrantsError, setHackathonRegistrantsError] = useState('');
  const [hackathonVoteMessage, setHackathonVoteMessage] = useState('');
  const [hackathonVoteError, setHackathonVoteError] = useState('');
  const [votingHackathonPairingId, setVotingHackathonPairingId] = useState(null);
  const [creatingHackathonRoundCategory, setCreatingHackathonRoundCategory] = useState('');
  const [processingHackathonRoundId, setProcessingHackathonRoundId] = useState(null);
  const [hackathonAdminMessage, setHackathonAdminMessage] = useState('');
  const [hackathonAdminError, setHackathonAdminError] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminPagination, setAdminPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [adminStats, setAdminStats] = useState(null);
  const [loadingAdminStats, setLoadingAdminStats] = useState(false);
  const [adminSection, setAdminSection] = useState('users');


  useEffect(() => {
    if (!user?.name) return;
    setHackathonForm((prev) => prev.display_name ? prev : { ...prev, display_name: user.name });
  }, [user?.name]);

  useEffect(() => {
    if (currentView !== 'hackatones' && !(currentView === 'admin' && user?.role === 'admin' && adminSection === 'hackathon')) return;
    loadHackathonRounds();

    if (currentView === 'admin' && user?.role === 'admin' && adminSection === 'hackathon') {
      loadAdminHackathonRegistrants();
    }
  }, [currentView, adminSection, user?.role]);

  useEffect(() => {
    if (currentView !== 'hackatones') return;

    let cancelled = false;

    async function loadHackathonRegistration() {
      setLoadingHackathonRegistration(true);
      setHackathonError('');
      try {
        const res = await fetch('/api/hackathon/register', { credentials: 'include' });
        if (!res.ok) {
          if (!cancelled) {
            setHackathonRegistration(null);
          }
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        setHackathonRegistration(data.registration || null);
        setHackathonForm({
          display_name: data.registration?.display_name || user?.name || '',
          github_profile: data.registration?.github_profile || '',
          category: data.registration?.category || 'starter',
        });
      } catch {
        if (!cancelled) {
          setHackathonError('No pudimos cargar tu inscripción actual. Puedes intentar nuevamente.');
        }
      } finally {
        if (!cancelled) {
          setLoadingHackathonRegistration(false);
        }
      }
    }

    loadHackathonRegistration();

    return () => {
      cancelled = true;
    };
  }, [currentView, user?.name]);

  const handleDeleteAccount = async () => {
    if (!window.confirm('¿Estás seguro? Esta acción eliminará tu cuenta permanentemente. Esta operación no puede deshacerse.')) return;
    if (!window.confirm('Confirmar de nuevo: ¿Deseas eliminar definitivamente tu cuenta y todos tus datos?')) return;
    setDeletingAccount(true);
    try {
      const res = await fetch('/api/users/me', { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        logout();
      } else {
        alert('Error al eliminar la cuenta. Por favor intenta de nuevo.');
      }
    } catch {
      alert('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      setDeletingAccount(false);
    }
  };

  const loadAdminUsers = async (page = 1) => {
    setLoadingAdmin(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&limit=20`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data.users || []);
        setAdminPagination(data.pagination || { page: 1, total: 0, pages: 1 });
      }
    } catch { /* ignorar */ } finally {
      setLoadingAdmin(false);
    }
  };

  const handleToggleUserActive = async (userId, currentActive) => {
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user_id: userId, is_active: !currentActive }),
      });
      setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !currentActive } : u));
    } catch { /* ignorar */ }
  };

  const loadAdminStats = async () => {
    setAdminSection('stats');
    setLoadingAdminStats(true);
    try {
      const res = await fetch('/api/admin/stats', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAdminStats(data);
      }
    } catch { /* ignorar */ } finally {
      setLoadingAdminStats(false);
    }
  };

  const today = new Date();

  const [copied, setCopied] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselTransition, setCarouselTransition] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(() => {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  });



  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  async function loadHackathonRounds({ silent = false } = {}) {
    if (!silent) {
      setLoadingHackathonRounds(true);
    }
    setHackathonRoundsError('');

    try {
      const res = await fetch('/api/hackathon/rounds', { credentials: 'include' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setHackathonRounds([]);
        setHackathonRoundsError(data.error || 'No pudimos cargar las rondas de hackathon.');
        return;
      }

      const data = await res.json();
      setHackathonRounds(data.rounds || []);
    } catch {
      setHackathonRounds([]);
      setHackathonRoundsError('No pudimos cargar las rondas de hackathon.');
    } finally {
      if (!silent) {
        setLoadingHackathonRounds(false);
      }
    }
  }

  async function loadAdminHackathonRegistrants() {
    setLoadingHackathonRegistrants(true);
    setHackathonRegistrantsError('');

    try {
      const res = await fetch('/api/admin/hackathon-registrations', { credentials: 'include' });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setHackathonRegistrants([]);
        setHackathonRegistrantsError(data.error || 'No pudimos cargar la lista de participantes.');
        return;
      }

      setHackathonRegistrants(data.registrants || []);
    } catch {
      setHackathonRegistrants([]);
      setHackathonRegistrantsError('No pudimos cargar la lista de participantes.');
    } finally {
      setLoadingHackathonRegistrants(false);
    }
  }

  // Resize listener para el carrusel
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 768) setItemsPerView(2);
      else setItemsPerView(1);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll infinito del carrusel
  useEffect(() => {
    if (CAROUSEL_ITEMS.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex(prev => {
        const next = prev + 1;
        if (next >= CAROUSEL_ITEMS.length) {
          // Reset invisible: desactivar transición, saltar a 0
          setCarouselTransition(false);
          setTimeout(() => setCarouselTransition(true), 50);
          return 0;
        }
        return next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [itemsPerView]);

  const stars = useMemo(() =>
    Array.from({ length: 160 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.6 + 0.2,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }))
  , []);

  const handleSaveProfile = async () => {
    if (!profileName.trim()) return;
    setSavingProfile(true);
    try {
      await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ display_name: profileName.trim() }),
      });
    } catch {
      // Ignorar errores silenciosamente
    } finally {
      setSavingProfile(false);
    }
  };

  const handleHackathonFieldChange = (field, value) => {
    setHackathonForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleHackathonSubmit = async (event) => {
    event.preventDefault();
    if (savingHackathonRegistration) return;

    setSavingHackathonRegistration(true);
    setHackathonError('');
    setHackathonSuccess('');

    try {
      const res = await fetch('/api/hackathon/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(hackathonForm),
      });

      const data = await res.json();
      if (!res.ok) {
        setHackathonError(data.error || 'No pudimos guardar tu inscripción.');
        return;
      }

      setHackathonRegistration(data.registration || null);
      setHackathonForm({
        display_name: data.registration?.display_name || hackathonForm.display_name,
        github_profile: data.registration?.github_profile || hackathonForm.github_profile,
        category: data.registration?.category || hackathonForm.category,
      });
      await refreshUser();
      setHackathonSuccess(data.registration
        ? 'Tu inscripción quedó guardada. Ya formas parte de New hackers.'
        : 'Tu inscripción fue enviada correctamente.');
    } catch {
      setHackathonError('Error de conexión. Intenta nuevamente en unos segundos.');
    } finally {
      setSavingHackathonRegistration(false);
    }
  };

  const handleHackathonVote = async (pairingId, votedForUserId) => {
    if (votingHackathonPairingId) return;

    setVotingHackathonPairingId(pairingId);
    setHackathonVoteError('');
    setHackathonVoteMessage('');

    try {
      const res = await fetch(`/api/hackathon/pairings/${pairingId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ voted_for_user_id: votedForUserId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setHackathonVoteError(data.error || 'No pudimos registrar tu voto.');
        return;
      }

      setHackathonVoteMessage('Tu voto quedó registrado para este emparejamiento.');
      await loadHackathonRounds({ silent: true });
    } catch {
      setHackathonVoteError('Error de conexión al registrar tu voto.');
    } finally {
      setVotingHackathonPairingId(null);
    }
  };

  const handleLoadAdminHackathon = async () => {
    setAdminSection('hackathon');
    setHackathonAdminError('');
    setHackathonAdminMessage('');
  };

  const handleCreateHackathonRound = async (category) => {
    if (creatingHackathonRoundCategory) return;

    setCreatingHackathonRoundCategory(category);
    setHackathonAdminError('');
    setHackathonAdminMessage('');

    try {
      const res = await fetch('/api/hackathon/rounds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ category }),
      });
      const data = await res.json();

      if (!res.ok) {
        setHackathonAdminError(data.error || 'No pudimos crear la ronda.');
        return;
      }

      setHackathonAdminMessage(`Ronda ${data.round?.round_number || ''} creada para ${category}.`);
      await loadHackathonRounds({ silent: true });
    } catch {
      setHackathonAdminError('Error de conexión al crear la ronda.');
    } finally {
      setCreatingHackathonRoundCategory('');
    }
  };

  const handleTriggerHackathonRound = async (roundId) => {
    if (processingHackathonRoundId) return;

    setProcessingHackathonRoundId(roundId);
    setHackathonAdminError('');
    setHackathonAdminMessage('');

    try {
      const res = await fetch(`/api/hackathon/rounds/${roundId}/trigger`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok) {
        setHackathonAdminError(data.error || 'No pudimos emparejar esta ronda.');
        return;
      }

      setHackathonAdminMessage(`Emparejamientos creados: ${data.pairings?.length || 0}.`);
      await loadHackathonRounds({ silent: true });
    } catch {
      setHackathonAdminError('Error de conexión al emparejar la ronda.');
    } finally {
      setProcessingHackathonRoundId(null);
    }
  };

  const registrantsByCategory = hackathonRegistrants.reduce((accumulator, registrant) => {
    const key = registrant.category || 'starter';
    accumulator[key] = accumulator[key] || [];
    accumulator[key].push(registrant);
    return accumulator;
  }, {});

  const handleCloseHackathonRound = async (roundId) => {
    if (processingHackathonRoundId) return;

    setProcessingHackathonRoundId(roundId);
    setHackathonAdminError('');
    setHackathonAdminMessage('');

    try {
      const res = await fetch(`/api/hackathon/rounds/${roundId}/close`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok) {
        setHackathonAdminError(data.error || 'No pudimos cerrar la ronda.');
        return;
      }

      setHackathonAdminMessage(`Ronda cerrada. Ganadores calculados: ${data.winners?.length || 0}.`);
      await loadHackathonRounds({ silent: true });
    } catch {
      setHackathonAdminError('Error de conexión al cerrar la ronda.');
    } finally {
      setProcessingHackathonRoundId(null);
    }
  };


  if (loading) return null;
  if (!user) return <LoginPage />;

  const visibleHackathonRounds = hackathonRounds.filter((round) => round.status !== 'draft');

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMessage = { role: 'user', content: chatInput.trim() };
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: userMessage.content,
          history: updatedMessages.slice(-8),
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: 'No se pudo obtener respuesta. Intenta de nuevo.' }]);
      }
    } catch {
      setChatMessages((prev) => [...prev, { role: 'assistant', content: 'Error al conectar. Intenta de nuevo.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const renderChatWidget = () => (
    <>
      <button
        onClick={() => setShowChat((v) => !v)}
        className="fixed bottom-10 right-10 z-[100] w-14 h-14 rounded-full flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-200 border-2 border-cyan-400 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #0891b2)', boxShadow: '0 0 20px rgba(0,212,255,0.4)' }}
        title="Asistente NewCoders"
      >
        {showChat ? '✕' : '🤖'}
      </button>

      {showChat && (
        <div
          className="fixed bottom-28 right-10 z-[99] w-80 flex flex-col overflow-hidden rounded-xl border border-cyan-500/50"
          style={{ height: '420px', background: '#04040f', boxShadow: '0 0 40px rgba(0,212,255,0.15)' }}
        >
          <div className="px-4 py-3 border-b border-cyan-500/30" style={{ background: 'linear-gradient(90deg, rgba(109,40,217,0.6), rgba(8,145,178,0.6))' }}>
            <p className="text-cyan-400 font-mono text-sm font-bold">🤖 Asistente NewCoders</p>
            <p className="text-gray-400 text-xs">Solo respondo sobre el curso</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chatMessages.length === 0 && (
              <p className="text-gray-500 text-xs text-center mt-4 font-mono">
                ¡Hola! Pregúntame sobre el curso, las lecciones o cómo usar el sitio.
              </p>
            )}
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-xs font-mono leading-relaxed ${
                    m.role === 'user'
                      ? 'text-cyan-200 border border-cyan-700/50'
                      : 'text-purple-200 border border-purple-700/50'
                  }`}
                  style={{ background: m.role === 'user' ? 'rgba(8,145,178,0.2)' : 'rgba(109,40,217,0.2)' }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div
                  className="px-3 py-2 rounded-lg text-xs text-purple-300 font-mono animate-pulse border border-purple-700/50"
                  style={{ background: 'rgba(109,40,217,0.2)' }}
                >
                  Pensando...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-cyan-500/30 p-3 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 rounded-lg px-3 py-2 text-xs text-cyan-200 font-mono placeholder-gray-600 focus:outline-none"
              style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(8,145,178,0.3)' }}
              maxLength={500}
              disabled={chatLoading}
            />
            <button
              onClick={sendChatMessage}
              disabled={chatLoading || !chatInput.trim()}
              className="px-3 py-2 rounded-lg text-xs text-white font-mono transition-colors duration-150 disabled:opacity-40"
              style={{ background: '#0891b2' }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );

  if (currentView === 'selector') {
    return (
      <div className="min-h-screen bg-dark-bg text-text-light font-mono flex flex-col">
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {stars.map(s => (
            <div
              key={s.id}
              className="absolute rounded-full bg-white star-twinkle"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                opacity: s.opacity,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            />
          ))}
        </div>

        <header className="border-b border-border-dark p-8 text-center relative" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.13) 0%, rgba(191,0,255,0.06) 50%, transparent 80%), linear-gradient(180deg, #04040f 0%, #0a0a1e 100%)' }}>
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setCurrentView('perfil')}
              className="w-10 h-10 rounded-full border-2 border-neon-cyan hover:border-neon-green transition-all duration-300 flex items-center justify-center overflow-hidden"
              style={{ background: 'rgba(0,212,255,0.08)', boxShadow: '0 0 12px rgba(0,212,255,0.15)' }}
              title="Mi Perfil"
              aria-label="Mi Perfil"
            >
              {user?.picture ? (
                <img src={user.picture} alt={user?.name || 'Usuario'} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neon-cyan">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              )}
            </button>
          </div>
          <h1 className="text-5xl font-bold text-neon-green mb-2">
            ✦ New Coders ✦
          </h1>
          <p className="text-neon-cyan text-lg">Elige la experiencia que quieres explorar</p>
        </header>

        <main className="flex-1 p-8 flex items-center justify-center relative z-10">
          <div className="w-full max-w-4xl grid grid-cols-1 gap-6">
            <button
              onClick={() => setCurrentView('hackatones')}
              className="relative p-8 rounded-lg border-2 border-neon-yellow transition-all duration-300 text-left hover:shadow-lg hover:shadow-neon-yellow/50"
              style={{ background: 'linear-gradient(135deg, rgba(255,0,153,0.06) 0%, rgba(191,0,255,0.06) 100%)' }}
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs font-bold text-neon-yellow uppercase tracking-widest mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                    Próxima sección
                  </p>
                  <h2 className="text-3xl font-bold text-neon-yellow" style={{ fontFamily: 'Orbitron, monospace' }}>
                    🚀 Hackatones
                  </h2>
                  <p className="text-text-light text-sm mt-2">Explora la sección de hackatones. Por ahora verás una pantalla de próximamente.</p>
                </div>
              </div>
            </button>
          </div>
        </main>

        <footer className="border-t border-border-dark p-6 text-center relative z-10" style={{ background: 'linear-gradient(180deg, #0a0a1e 0%, #04040f 100%)' }}>
          <p className="text-neon-cyan mb-2">✦ Elige tu siguiente paso dentro de New Coders ✦</p>
          <SocialLinks />
        </footer>

        {renderChatWidget()}
      </div>
    );
  }

  if (currentView === 'hackatones') {
    return (
      <div className="min-h-screen bg-dark-bg text-text-light font-mono flex flex-col">
        <header className="border-b border-border-dark p-6 relative" style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(191,0,255,0.10) 0%, transparent 70%), linear-gradient(180deg, #04040f 0%, #0a0a1e 100%)' }}>
          <button onClick={() => setCurrentView('selector')} className="text-neon-cyan hover:text-neon-green transition mb-4">
            ← Volver a secciones
          </button>
          <h1 className="text-4xl font-bold text-neon-yellow" style={{ fontFamily: 'Orbitron, monospace' }}>
            🚀 Hackatones
          </h1>
          <p className="text-neon-cyan mt-1 text-lg">Próximamente en New Coders</p>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col gap-8">
          <section className="w-full rounded-lg p-8 border-2 border-neon-yellow text-center" style={{ background: 'linear-gradient(135deg, rgba(255,0,153,0.06) 0%, rgba(191,0,255,0.06) 100%)', boxShadow: '0 0 24px rgba(255,213,0,0.12)' }}>
            <p className="text-xs font-bold text-neon-yellow uppercase tracking-widest mb-3" style={{ fontFamily: 'Orbitron, monospace' }}>
              En preparación
            </p>
            <h2 className="text-3xl font-bold text-neon-yellow mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
                🏆 Hackathon New Coders — Primera Ronda
            </h2>
              <div className="text-text-light max-w-3xl mx-auto leading-relaxed text-left space-y-6">
                <p>
                  ¡Llegó el momento, <strong>New Coders</strong>! 🚀 Prepárense para la primera ronda de nuestra hackathon.
                </p>

                <div>
                  <h3 className="text-neon-cyan font-bold text-lg mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                    📅 Fecha y hora
                  </h3>
                  <p><strong>Martes 14 de abril</strong></p>
                  <ul className="mt-2 space-y-1 list-none">
                    <li>🇦🇷 Argentina: <strong>14:00 hs</strong></li>
                    <li>🇵🇪 Perú: <strong>12:00 hs</strong></li>
                    <li>🇲🇽 México (CDMX): <strong>11:00 hs</strong></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-neon-cyan font-bold text-lg mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                    ⚔️ Formato
                  </h3>
                  <p>Competencia <strong>por parejas</strong> (1 vs 1). Varias parejas en paralelo.</p>
                </div>

                <div>
                  <h3 className="text-neon-cyan font-bold text-lg mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                    👥 Categorías
                  </h3>
                  <ul className="space-y-2 list-none">
                    <li><strong>Starters</strong>: desarrollan en local y envían <strong>video</strong> de su proyecto.</li>
                    <li><strong>Deployers</strong>: despliegan su web y envían <strong>link en producción</strong>.</li>
                  </ul>
                  <p className="mt-2">Starters compiten contra Starters. Deployers contra Deployers. <strong>Cada categoría tiene su propio reto.</strong></p>
                </div>

                <div>
                  <h3 className="text-neon-cyan font-bold text-lg mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                    🛠️ Herramientas recomendadas
                  </h3>
                  <ul className="space-y-2 list-none">
                    <li>Editor como <strong>VS Code</strong> con IA para vibe coding.</li>
                    <li>Deployers: cualquier servicio de hosting/deploy.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-neon-cyan font-bold text-lg mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                    📤 Entregas
                  </h3>
                  <p>Se envían al grupo de WhatsApp <strong>"Chat Global"</strong>.</p>
                  <ul className="mt-2 space-y-2 list-none">
                    <li>⏱️ <strong>Plazo</strong>: 90 minutos tras iniciar el reto.</li>
                    <li>🎥 <strong>Starters</strong>: video de <strong>2 a 5 minutos</strong> mostrando las funcionalidades pedidas.</li>
                    <li>🔗 <strong>Deployers</strong>: link funcional de la web en producción.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-neon-cyan font-bold text-lg mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                    🗳️ Votación
                  </h3>
                  <ul className="space-y-2 list-none">
                    <li>Se realiza en la <strong>web oficial de New Coders</strong>.</li>
                    <li>Cualquier usuario <strong>logueado</strong> puede votar.</li>
                    <li>⏳ <strong>Duración</strong>: 1 hora desde que abren las listas.</li>
                    <li>Votación por pareja: <strong>un ganador por pareja</strong>.</li>
                    <li><strong>No se permiten empates.</strong></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-neon-cyan font-bold text-lg mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                    ❌ Descalificación
                  </h3>
                  <p>Revisión en los 10 minutos tras iniciar la votación:</p>
                  <ul className="mt-2 space-y-2 list-none">
                    <li><strong>Deployers</strong>: si el link no funciona.</li>
                    <li><strong>Starters</strong>: si el video no cumple la duración (2-5 min) o no muestra lo pedido por el reto.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-neon-cyan font-bold text-lg mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                    🏅 Avance
                  </h3>
                  <p>Un ganador por pareja. El número de clasificados a la siguiente ronda se anunciará pronto.</p>
                </div>

                <p className="pt-2 border-t border-border-dark">
                  ¡Prepárense, afilen sus editores y nos vemos el martes! 💻🔥<br />
                  <strong>— Equipo New Coders</strong>
                </p>
              </div>
          </section>

          <section className="w-full rounded-lg p-8 border-2 border-neon-cyan" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.07) 0%, rgba(4,4,15,0.92) 100%)', boxShadow: '0 0 24px rgba(0,212,255,0.12)' }}>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-bold text-neon-cyan uppercase tracking-widest mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Inscripción oficial
                </p>
                <h2 className="text-2xl font-bold text-neon-cyan" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Casilla de inscripción Hackathon
                </h2>
                <p className="text-text-light mt-2 max-w-2xl">
                  Completa tus datos para entrar a la hackathon. Al enviar este formulario tu rol se actualizará a <strong>New hackers</strong>.
                </p>
              </div>
              {hackathonRegistration ? (
                <span className="inline-flex items-center justify-center rounded-full border border-neon-green px-4 py-2 text-sm text-neon-green" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Inscripción guardada
                </span>
              ) : null}
            </div>

            <form className="mt-6 grid gap-5" onSubmit={handleHackathonSubmit}>
              <label className="block">
                <span className="block text-sm font-bold text-neon-yellow mb-2">Nombre</span>
                <input
                  type="text"
                  value={hackathonForm.display_name}
                  onChange={(e) => handleHackathonFieldChange('display_name', e.target.value)}
                  placeholder="Tu nombre para competir"
                  className="w-full rounded-lg border border-neon-yellow/40 bg-dark-bg px-4 py-3 text-text-light focus:outline-none focus:border-neon-yellow"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-bold text-neon-yellow mb-2">Perfil de GitHub</span>
                <input
                  type="text"
                  value={hackathonForm.github_profile}
                  onChange={(e) => handleHackathonFieldChange('github_profile', e.target.value)}
                  placeholder="https://github.com/tuusuario o @tuusuario"
                  className="w-full rounded-lg border border-neon-yellow/40 bg-dark-bg px-4 py-3 text-text-light focus:outline-none focus:border-neon-yellow"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-bold text-neon-yellow mb-2">Competencia</span>
                <select
                  value={hackathonForm.category}
                  onChange={(e) => handleHackathonFieldChange('category', e.target.value)}
                  className="w-full rounded-lg border border-neon-yellow/40 bg-dark-bg px-4 py-3 text-text-light focus:outline-none focus:border-neon-yellow"
                >
                  <option value="starter">Starter</option>
                  <option value="deployer">Deployer</option>
                </select>
              </label>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-h-[24px] text-sm">
                  {loadingHackathonRegistration ? <p className="text-neon-cyan">Cargando inscripción actual...</p> : null}
                  {!loadingHackathonRegistration && hackathonError ? <p className="text-red-400">{hackathonError}</p> : null}
                  {!loadingHackathonRegistration && !hackathonError && hackathonSuccess ? <p className="text-neon-green">{hackathonSuccess}</p> : null}
                </div>

                <button
                  type="submit"
                  disabled={savingHackathonRegistration || loadingHackathonRegistration}
                  className="rounded-lg border-2 border-neon-cyan px-6 py-3 font-bold text-neon-cyan transition hover:bg-neon-cyan hover:text-dark-bg disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  {savingHackathonRegistration ? 'Guardando...' : hackathonRegistration ? 'Actualizar inscripción' : 'Inscribirme ahora'}
                </button>
              </div>
            </form>
          </section>

          <section className="w-full rounded-lg p-8 border-2 border-neon-green" style={{ background: 'linear-gradient(135deg, rgba(0,255,135,0.06) 0%, rgba(4,4,15,0.94) 100%)', boxShadow: '0 0 24px rgba(0,255,135,0.10)' }}>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-bold text-neon-green uppercase tracking-widest mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Rondas y votación
                </p>
                <h2 className="text-2xl font-bold text-neon-green" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Emparejamientos activos de la comunidad
                </h2>
                <p className="text-text-light mt-2 max-w-2xl">
                  Aquí verás las parejas creadas para cada ronda. Puedes votar una sola vez por cada emparejamiento activo.
                </p>
              </div>
            </div>

            <div className="min-h-[24px] mt-5 text-sm">
              {hackathonRoundsError ? <p className="text-red-400">{hackathonRoundsError}</p> : null}
              {!hackathonRoundsError && hackathonVoteError ? <p className="text-red-400">{hackathonVoteError}</p> : null}
              {!hackathonRoundsError && !hackathonVoteError && hackathonVoteMessage ? <p className="text-neon-green">{hackathonVoteMessage}</p> : null}
            </div>

            {loadingHackathonRounds ? (
              <div className="py-12 text-center text-neon-cyan">Cargando emparejamientos...</div>
            ) : null}

            {!loadingHackathonRounds && visibleHackathonRounds.length === 0 ? (
              <div className="py-12 text-center text-text-light/50">
                <p>Todavía no hay rondas activas o cerradas para mostrar.</p>
              </div>
            ) : null}

            {!loadingHackathonRounds && visibleHackathonRounds.length > 0 ? (
              <div className="mt-6 space-y-5">
                {visibleHackathonRounds.map((round) => (
                  <article key={`${round.category}-${round.id}`} className="rounded-lg border border-border-dark overflow-hidden" style={{ background: 'rgba(0,0,0,0.28)' }}>
                    <div className="p-4 border-b border-border-dark flex flex-col gap-2 md:flex-row md:items-center md:justify-between" style={{ background: 'rgba(0,255,135,0.06)' }}>
                      <div>
                        <h3 className="text-neon-green font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>
                          Ronda {round.round_number} · {round.category === 'starter' ? 'Starter' : 'Deployer'}
                        </h3>
                        <p className="text-text-light/60 text-xs mt-1">
                          {round.status === 'active' ? 'Votación abierta' : 'Resultados cerrados'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${round.status === 'active' ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-neon-green/20 text-neon-green'}`}>
                        {round.status === 'active' ? 'Activa' : 'Cerrada'}
                      </span>
                    </div>

                    <div className="p-4 grid gap-4">
                      {round.pairings.map((pairing) => {
                        const voteLocked = pairing.viewer_voted_for_user_id !== null || round.status !== 'active' || pairing.bye;

                        return (
                          <div key={pairing.id} className="rounded-lg border border-border-dark p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <div className="flex items-center justify-between gap-3 mb-4">
                              <p className="text-neon-yellow text-sm font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>Pareja {pairing.pair_number}</p>
                              {pairing.bye ? (
                                <span className="text-xs font-bold text-neon-yellow">Pase automático</span>
                              ) : pairing.viewer_voted_for_user_id ? (
                                <span className="text-xs font-bold text-neon-cyan">Ya votaste</span>
                              ) : null}
                            </div>

                            {pairing.bye ? (
                              <div className="rounded-lg border border-neon-yellow/40 p-4">
                                <p className="font-bold text-text-light">{pairing.participant_a.display_name}</p>
                                <p className="text-xs text-neon-cyan mt-1">{pairing.participant_a.github_profile}</p>
                                <p className="text-sm text-neon-yellow mt-3">Clasifica automáticamente por cantidad impar de inscritos.</p>
                              </div>
                            ) : (
                              <div className="grid gap-4 md:grid-cols-2">
                                {[pairing.participant_a, pairing.participant_b].map((participant) => {
                                  const isWinner = pairing.winner_user_id === participant.user_id;
                                  const isSelected = pairing.viewer_voted_for_user_id === participant.user_id;

                                  return (
                                    <div key={participant.user_id} className={`rounded-lg border p-4 ${isWinner ? 'border-neon-green' : isSelected ? 'border-neon-cyan' : 'border-border-dark'}`}>
                                      <p className="font-bold text-text-light text-lg">{participant.display_name}</p>
                                      <p className="text-xs text-neon-cyan mt-1 break-all">{participant.github_profile}</p>
                                      {round.status === 'closed' ? (
                                        <p className="text-xs text-neon-yellow mt-3">
                                          Votos: {participant.user_id === pairing.participant_a.user_id ? pairing.votes_for_a : pairing.votes_for_b}
                                        </p>
                                      ) : null}
                                      <button
                                        onClick={() => handleHackathonVote(pairing.id, participant.user_id)}
                                        disabled={voteLocked || votingHackathonPairingId === pairing.id}
                                        className={`mt-4 w-full rounded-lg border px-4 py-2 text-sm font-bold transition ${isSelected ? 'border-neon-cyan text-neon-cyan' : 'border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg'} disabled:cursor-not-allowed disabled:opacity-50`}
                                        style={{ fontFamily: 'Orbitron, monospace' }}
                                      >
                                        {round.status === 'closed'
                                          ? isWinner ? 'Ganador' : 'Resultado cerrado'
                                          : isSelected
                                            ? 'Tu voto'
                                            : votingHackathonPairingId === pairing.id
                                              ? 'Enviando...'
                                              : `Votar por ${participant.display_name}`}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        </main>

        <footer className="border-t border-border-dark p-6 text-center" style={{ background: 'linear-gradient(180deg, #0a0a1e 0%, #04040f 100%)' }}>
            <p className="text-neon-cyan mb-2">✦ Primera ronda de hackathon activa para la comunidad ✦</p>
          <SocialLinks />
        </footer>

        {renderChatWidget()}
      </div>
    );
  }

  if (currentView === 'herramientas') {
    return (
      <div className="min-h-screen bg-dark-bg text-text-light font-mono">
        <header className="border-b border-border-dark p-6 relative" style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(191,0,255,0.10) 0%, transparent 70%), linear-gradient(180deg, #04040f 0%, #0a0a1e 100%)' }}>
          <button onClick={() => setCurrentView('selector')} className="text-neon-cyan hover:text-neon-green transition mb-4">
            ← Secciones
          </button>
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setCurrentView('perfil')}
              className="w-10 h-10 rounded-full border-2 border-neon-cyan hover:border-neon-green transition-all duration-300 flex items-center justify-center overflow-hidden"
              style={{ background: 'rgba(0,212,255,0.08)', boxShadow: '0 0 12px rgba(0,212,255,0.15)' }}
              title="Mi Perfil"
              aria-label="Mi Perfil"
            >
              {user?.picture ? (
                <img src={user.picture} alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neon-cyan">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              )}
            </button>
          </div>
          <h1 className="text-4xl font-bold text-neon-green">Herramientas del curso</h1>
          <p className="text-neon-yellow mt-1 text-lg">New Coders — 30 días</p>
        </header>

        <main className="max-w-4xl mx-auto p-6 space-y-8">
          <section className="card-base p-6 border-2 border-neon-cyan">
            <p className="text-text-light leading-relaxed">
              Todo lo que necesitas instalar para completar el curso. Descarga siempre desde los sitios oficiales.
            </p>
          </section>

          {/* Obligatorias */}
          <section className="card-base p-6 border-2 border-neon-green">
            <h2 className="text-2xl font-bold text-neon-green mb-5">🛠️ Obligatorias</h2>
            <ul className="space-y-5">
              {[
                {
                  name: 'VS Code',
                  desc: 'Editor de código gratuito de Microsoft. Es donde escribirás todo tu código durante los 30 días.',
                  detail: 'Descárgalo desde code.visualstudio.com/download, ejecuta el instalador y en Windows marca "Agregar a PATH".',
                  url: 'https://code.visualstudio.com/download',
                },
                {
                  name: 'Google Chrome',
                  desc: 'Navegador con herramientas de desarrollo (DevTools) que usarás para inspeccionar HTML, depurar JS y probar CSS.',
                  detail: 'Descárgalo desde google.com/chrome, la instalación es automática.',
                  url: 'https://www.google.com/chrome',
                },
                {
                  name: 'Python',
                  desc: 'Lenguaje para crear tu primer servidor web (día 24 en adelante).',
                  detail: 'Descárgalo desde python.org/downloads. En Windows es crítico marcar "Add to PATH" durante la instalación. En macOS/Linux el comando es python3.',
                  url: 'https://www.python.org/downloads',
                },
                {
                  name: 'Git',
                  desc: 'Sistema de control de versiones que registra cada cambio en tu código (día 29).',
                  detail: 'Descárgalo desde git-scm.com, acepta las opciones por defecto y luego configura tu nombre y email con git config --global.',
                  url: 'https://git-scm.com',
                },
                {
                  name: 'GitHub (cuenta)',
                  desc: 'Plataforma donde almacenas tu código en la nube y despliegas tus proyectos.',
                  detail: 'Crea una cuenta gratuita en github.com con un nombre de usuario profesional.',
                  url: 'https://github.com',
                },
              ].map(tool => (
                <li key={tool.name} className="border border-border-dark rounded-lg p-4" style={{ background: 'rgba(0,212,255,0.03)' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="text-neon-green font-bold text-lg">{tool.name}</span>
                      <p className="text-text-light text-sm mt-1">{tool.desc}</p>
                      <p className="text-neon-yellow text-xs mt-2 leading-relaxed">{tool.detail}</p>
                    </div>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-bold px-3 py-1 rounded border border-neon-cyan text-neon-cyan hover:text-neon-green hover:border-neon-green transition whitespace-nowrap">
                      Descargar ↗
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Opcionales */}
          <section className="card-base p-6 border-2 border-neon-yellow">
            <h2 className="text-2xl font-bold text-neon-yellow mb-5">⚡ Opcionales</h2>
            <ul className="space-y-5">
              {[
                {
                  name: 'Node.js',
                  desc: 'Permite ejecutar JavaScript fuera del navegador.',
                  detail: 'Descarga la versión LTS desde nodejs.org.',
                  url: 'https://nodejs.org',
                },
                {
                  name: 'Netlify / Render (cuentas)',
                  desc: 'Hosting gratuito para publicar tus proyectos en internet el día 30.',
                  detail: 'Netlify (netlify.com) para frontend, Render (render.com) para backend. Regístrate con tu cuenta de GitHub.',
                  url: 'https://netlify.com',
                },
              ].map(tool => (
                <li key={tool.name} className="border border-border-dark rounded-lg p-4" style={{ background: 'rgba(255,0,153,0.03)' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="text-neon-yellow font-bold text-lg">{tool.name}</span>
                      <p className="text-text-light text-sm mt-1">{tool.desc}</p>
                      <p className="text-neon-cyan text-xs mt-2 leading-relaxed">{tool.detail}</p>
                    </div>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-bold px-3 py-1 rounded border border-neon-yellow text-neon-yellow hover:text-neon-green hover:border-neon-green transition whitespace-nowrap">
                      Ver ↗
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Extensiones VS Code */}
          <section className="card-base p-6 border-2 border-neon-cyan">
            <h2 className="text-2xl font-bold text-neon-cyan mb-3">🧩 Extensiones de VS Code</h2>
            <p className="text-neon-yellow text-xs mb-4">Instálalas con <code className="bg-dark-bg px-2 py-0.5 rounded border border-border-dark">Ctrl+Shift+X</code></p>
            <ul className="space-y-2">
              {[
                { name: 'Live Server',       desc: 'Recarga automática al guardar.' },
                { name: 'Prettier',          desc: 'Formatea tu código.' },
                { name: 'Python (Microsoft)', desc: 'Autocompletado para archivos .py.' },
                { name: 'ES7+ Snippets',     desc: 'Atajos de teclado para JavaScript.' },
              ].map(ext => (
                <li key={ext.name} className="flex gap-3 text-sm">
                  <span className="text-neon-green font-bold min-w-fit">{ext.name}</span>
                  <span className="text-text-light">— {ext.desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 text-center">
            <a
              href="https://notebooklm.google.com/notebook/8167d8cc-9006-4d0b-97ae-256aa7b74790?pli=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-bold py-3 px-6 rounded-lg border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg transition-all duration-300"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Aprende a instalar los recursos con IA
            </a>
          </div>
        </main>

        <footer className="border-t border-border-dark p-6 mt-12 text-center" style={{ background: 'linear-gradient(180deg, #0a0a1e 0%, #04040f 100%)' }}>
          <p className="text-neon-cyan">✦ Instala todo antes del Día 1 y arranca sin fricciones ✦</p>
          <SocialLinks />
        </footer>
        {renderChatWidget()}
      </div>
    );
  }

  if (currentView === 'intro') {
    return (
      <div className="min-h-screen bg-dark-bg text-text-light font-mono">
        {/* Header */}
        <header className="border-b border-border-dark p-6 relative" style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(191,0,255,0.10) 0%, transparent 70%), linear-gradient(180deg, #04040f 0%, #0a0a1e 100%)' }}>
          <button
            onClick={() => setCurrentView('selector')}
            className="text-neon-cyan hover:text-neon-green transition mb-4"
          >
            ← Secciones
          </button>
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setCurrentView('perfil')}
              className="w-10 h-10 rounded-full border-2 border-neon-cyan hover:border-neon-green transition-all duration-300 flex items-center justify-center overflow-hidden"
              style={{ background: 'rgba(0,212,255,0.08)', boxShadow: '0 0 12px rgba(0,212,255,0.15)' }}
              title="Mi Perfil"
              aria-label="Mi Perfil"
            >
              {user?.picture ? (
                <img src={user.picture} alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neon-cyan">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              )}
            </button>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-bold px-3 py-1 rounded-full border border-neon-cyan text-neon-cyan uppercase tracking-widest" style={{ fontFamily: 'Orbitron, monospace' }}>
              Temporada 1
            </span>
          </div>
          <h1 className="text-4xl font-bold text-neon-green">
            New Coders
          </h1>
          <p className="text-neon-yellow mt-1 text-lg">First Commit</p>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Bienvenida */}
          <section className="card-base p-6 border-2 border-neon-cyan">
            <h2 className="text-2xl font-bold text-neon-cyan mb-4">🚀 Bienvenida al Calendario Practico</h2>
            <p className="text-text-light leading-relaxed">
              <strong className="text-neon-green">New Coders</strong> es un programa 100% practico de 30 días diseñado para llevarte paso a paso desde cero en programación con los lenguajes mas usados en 2026. Cada día Practicaras un concepto nuevo: desde cómo funciona la web, hasta escribir código real en HTML, CSS, JavaScript y Python. No necesitas experiencia previa — solo ganas de aprender y constancia.
            </p>
          </section>

          {/* Cómo funciona */}
          <section className="card-base p-6 border-2 border-neon-green">
            <h2 className="text-2xl font-bold text-neon-green mb-4">⚙️ ¿Cómo funciona?</h2>
            <ul className="text-text-light space-y-3 leading-relaxed">
              <li>📅 <strong className="text-neon-yellow">Una lección por día</strong> — cada lección se desbloquea automáticamente en su fecha correspondiente.</li>
              <li>📚 <strong className="text-neon-yellow">Teoría + Ejemplo + Reto</strong> — cada lección tiene explicación, código de ejemplo y un desafío práctico para que lo hagas tú mismo.</li>
              <li>✅ <strong className="text-neon-yellow">Marca tu progreso</strong> — cuando termines una lección, haz clic en "Marcar como Completada" y verás avanzar tu barra de progreso.</li>
              <li>🔒 <strong className="text-neon-yellow">Lecciones bloqueadas</strong> — las lecciones futuras aparecen con candado hasta que llegue su día. ¡La espera forma parte del aprendizaje!</li>
            </ul>
          </section>

          {/* Por dónde empezar */}
          <section className="card-base p-6 border-2 border-neon-yellow">
            <h2 className="text-2xl font-bold text-neon-yellow mb-4">🎯 ¿Por dónde empezar?</h2>
            <p className="text-text-light leading-relaxed mb-3">
              Únete a nuestra comunidad en WhatsApp, sigue nuestro contenido en X y mantente atento a las próximas temporadas de New Coders.
            </p>
          </section>

          {/* Carrusel Aliados New Coders */}
          {CAROUSEL_ITEMS.length > 0 && (
            <section className="card-base p-6 border-2 border-neon-purple">
              <h2 className="text-2xl font-bold text-neon-purple mb-4">🤝 Aliados New Coders</h2>

              <div className="overflow-hidden">
                <div
                  className={`flex ${carouselTransition ? 'transition-transform duration-700 ease-in-out' : ''}`}
                  style={{ transform: `translateX(-${carouselIndex * (100 / itemsPerView)}%)` }}
                >
                  {[...CAROUSEL_ITEMS, ...CAROUSEL_ITEMS].map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 px-2"
                      style={{ width: `${100 / itemsPerView}%` }}
                    >
                      <div className="group relative rounded-lg border border-border-dark overflow-hidden transition-all duration-300 hover:border-neon-purple hover:shadow-lg hover:shadow-neon-purple/30">
                        <div className="aspect-video bg-dark-bg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.alt}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-3 bg-dark-card">
                          <p className="text-sm font-bold text-neon-purple group-hover:text-neon-green transition-colors truncate">
                            {item.title} ↗
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border-dark p-6 mt-12 text-center" style={{ background: 'linear-gradient(180deg, #0a0a1e 0%, #04040f 100%)' }}>
          <p className="text-neon-cyan">✦ Tu viaje empieza con un solo paso — el Día 1 ✦</p>
          <SocialLinks />
        </footer>
        {renderChatWidget()}
      </div>
    );
  }

  if (currentView === 'nosotros') {
    return (
      <div className="min-h-screen bg-dark-bg text-text-light font-mono">
        {/* Header */}
        <header className="border-b border-border-dark p-6 relative" style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(255,102,0,0.10) 0%, transparent 70%), linear-gradient(180deg, #04040f 0%, #0a0a1e 100%)' }}>
          <button
            onClick={() => setCurrentView('selector')}
            className="text-neon-cyan hover:text-neon-green transition mb-4"
          >
            ← Secciones
          </button>
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setCurrentView('perfil')}
              className="w-10 h-10 rounded-full border-2 border-neon-cyan hover:border-neon-green transition-all duration-300 flex items-center justify-center overflow-hidden"
              style={{ background: 'rgba(0,212,255,0.08)', boxShadow: '0 0 12px rgba(0,212,255,0.15)' }}
              title="Mi Perfil"
              aria-label="Mi Perfil"
            >
              {user?.picture ? (
                <img src={user.picture} alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neon-cyan">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              )}
            </button>
          </div>
          <h1 className="text-4xl font-bold text-neon-orange" style={{ fontFamily: 'Orbitron, monospace' }}>
            Nosotros
          </h1>
          <p className="text-neon-yellow mt-1 text-lg">El equipo detrás de New Coders</p>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Quiénes somos */}
          <section className="card-base p-6 border-2 border-neon-orange">
            <h2 className="text-2xl font-bold text-neon-orange mb-4">🚀 ¿Quiénes somos?</h2>
            <p className="text-text-light leading-relaxed">
              Somos <strong className="text-neon-green">New Coders</strong>, un equipo apasionado por la tecnología y la educación. Creemos que aprender a programar debe ser accesible, práctico y divertido para todos. Nuestro objetivo es guiar a personas sin experiencia previa en sus primeros pasos en el mundo del desarrollo de software.
            </p>
          </section>

          {/* Nuestra misión */}
          <section className="card-base p-6 border-2 border-neon-green">
            <h2 className="text-2xl font-bold text-neon-green mb-4">🎯 Nuestra Misión</h2>
            <p className="text-text-light leading-relaxed">
              Democratizar el acceso a la educación en programación, ofreciendo un programa estructurado de <strong className="text-neon-yellow">30 días</strong> que transforma a principiantes en personas capaces de escribir código real. Queremos que cada persona que empiece este camino termine con las habilidades y la confianza para seguir creciendo como desarrollador.
            </p>
          </section>

          {/* Qué nos hace diferentes */}
          <section className="card-base p-6 border-2 border-neon-cyan">
            <h2 className="text-2xl font-bold text-neon-cyan mb-4">✦ ¿Qué nos hace diferentes?</h2>
            <ul className="text-text-light space-y-3 leading-relaxed">
              <li>💻 <strong className="text-neon-yellow">100% Práctico</strong> — Cada lección incluye código real que puedes escribir y ejecutar desde el primer día.</li>
              <li>📅 <strong className="text-neon-yellow">Estructura día a día</strong> — Un plan de 30 días diseñado para que avances sin sentirte perdido.</li>
              <li>🤖 <strong className="text-neon-yellow">Aprendizaje con IA</strong> — Integramos herramientas de inteligencia artificial para potenciar tu aprendizaje.</li>
              <li>🤝 <strong className="text-neon-yellow">Comunidad activa</strong> — No estás solo: nuestra comunidad en WhatsApp te acompaña en cada paso.</li>
              <li>🆓 <strong className="text-neon-yellow">Acceso libre</strong> — Creemos que la educación en tecnología no debería tener barreras de entrada.</li>
            </ul>
          </section>

          {/* Nuestros valores */}
          <section className="card-base p-6 border-2 border-neon-yellow">
            <h2 className="text-2xl font-bold text-neon-yellow mb-4">⚡ Nuestros Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border-dark bg-dark-card">
                <h3 className="text-lg font-bold text-neon-orange mb-2">Constancia</h3>
                <p className="text-text-light text-sm">30 días, un paso a la vez. El progreso se construye con disciplina diaria.</p>
              </div>
              <div className="p-4 rounded-lg border border-border-dark bg-dark-card">
                <h3 className="text-lg font-bold text-neon-cyan mb-2">Comunidad</h3>
                <p className="text-text-light text-sm">Aprender juntos es más poderoso que aprender solo. Nos apoyamos mutuamente.</p>
              </div>
              <div className="p-4 rounded-lg border border-border-dark bg-dark-card">
                <h3 className="text-lg font-bold text-neon-green mb-2">Práctica</h3>
                <p className="text-text-light text-sm">Menos teoría, más código. Se aprende haciendo, no solo leyendo.</p>
              </div>
              <div className="p-4 rounded-lg border border-border-dark bg-dark-card">
                <h3 className="text-lg font-bold text-neon-yellow mb-2">Accesibilidad</h3>
                <p className="text-text-light text-sm">Sin requisitos previos, sin costo. Solo necesitas ganas de aprender.</p>
              </div>
            </div>
          </section>

          {/* Comunidad WhatsApp */}
          <section className="card-base p-6 border-2" style={{ borderColor: '#25D366' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#25D366' }}>💬 Únete a la Comunidad</h2>
            <p className="text-text-light leading-relaxed mb-4">
              Forma parte de nuestra comunidad en WhatsApp donde compartimos dudas, avances y nos apoyamos mutuamente durante los 30 días del programa.
            </p>
            <a
              href="https://chat.whatsapp.com/EBB9GtaKths1ND1CrgAobi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all duration-300"
              style={{
                borderColor: '#25D366',
                background: 'linear-gradient(135deg, rgba(37,211,102,0.08) 0%, rgba(18,140,126,0.08) 100%)',
                boxShadow: 'none',
                textDecoration: 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(37,211,102,0.4)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="36" height="36" fill="#25D366">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.74 5.494 2.035 7.807L0 32l8.418-2.01A15.94 15.94 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.25a13.21 13.21 0 0 1-6.73-1.84l-.482-.286-4.997 1.194 1.222-4.862-.314-.5A13.22 13.22 0 0 1 2.75 16C2.75 8.682 8.682 2.75 16 2.75S29.25 8.682 29.25 16 23.318 29.25 16 29.25zm7.27-9.77c-.398-.199-2.355-1.162-2.72-1.295-.366-.133-.633-.199-.9.2-.266.398-1.031 1.295-1.264 1.562-.233.266-.465.299-.863.1-.398-.2-1.682-.62-3.203-1.977-1.184-1.056-1.983-2.36-2.216-2.759-.233-.398-.025-.613.175-.811.18-.179.398-.465.597-.698.199-.233.266-.398.398-.664.133-.266.067-.498-.033-.697-.1-.199-.9-2.169-1.232-2.967-.325-.779-.655-.673-.9-.686l-.765-.013c-.266 0-.697.1-1.063.498-.365.398-1.396 1.364-1.396 3.326 0 1.963 1.43 3.86 1.63 4.126.199.266 2.814 4.296 6.82 6.026.954.412 1.698.657 2.279.842.957.305 1.83.262 2.519.159.768-.115 2.355-.963 2.688-1.893.332-.93.332-1.729.232-1.893-.1-.166-.366-.266-.764-.465z"/>
              </svg>
              <div>
                <h3 className="text-lg font-bold" style={{ color: '#25D366' }}>Comunidad New Coders</h3>
                <p className="text-sm" style={{ color: '#a7f3d0' }}>Únete a nuestro grupo en WhatsApp ↗</p>
              </div>
            </a>
          </section>

          {/* X (Twitter) */}
          <section className="card-base p-6 border-2 border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">𝕏 Síguenos en X</h2>
            <p className="text-text-light leading-relaxed mb-4">
              Mantente al día con las últimas novedades, tips y contenido de programación siguiéndonos en X.
            </p>
            <a
              href="https://x.com/NewCodersOrg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-lg border-2 border-white/20 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(150,150,150,0.05) 100%)',
                boxShadow: 'none',
                textDecoration: 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(255,255,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <div>
                <h3 className="text-lg font-bold text-white">@NewCodersOrg</h3>
                <p className="text-sm text-gray-400">Síguenos en X ↗</p>
              </div>
            </a>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border-dark p-6 mt-12 text-center" style={{ background: 'linear-gradient(180deg, #0a0a1e 0%, #04040f 100%)' }}>
          <p className="text-neon-orange">✦ Hecho con pasión por el equipo New Coders ✦</p>
          <SocialLinks />
        </footer>
        {renderChatWidget()}
      </div>
    );
  }

  // Admin View
  if (currentView === 'admin' && user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-dark-bg text-text-light font-mono">
        <header className="border-b border-border-dark p-6" style={{ background: 'linear-gradient(180deg, #04040f 0%, #0a0a1e 100%)' }}>
          <button onClick={() => setCurrentView('selector')} className="text-neon-cyan hover:text-neon-green transition mb-4">
            ← Secciones
          </button>
          <h1 className="text-4xl font-bold text-neon-yellow" style={{ fontFamily: 'Orbitron, monospace' }}>Panel Admin</h1>
          <p className="text-neon-cyan mt-1">Gestión de usuarios</p>
        </header>
        <main className="max-w-6xl mx-auto p-6">
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => { setAdminSection('users'); loadAdminUsers(1); }}
              className={`px-5 py-2 rounded-lg border-2 transition-all text-sm font-bold ${adminSection === 'users' ? 'bg-neon-cyan text-dark-bg border-neon-cyan' : 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark-bg'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              {loadingAdmin ? 'Cargando...' : 'Cargar usuarios'}
            </button>
            <button
              onClick={loadAdminStats}
              className={`px-5 py-2 rounded-lg border-2 transition-all text-sm font-bold ${adminSection === 'stats' ? 'bg-neon-green text-dark-bg border-neon-green' : 'border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              {loadingAdminStats ? 'Cargando...' : 'Stats'}
            </button>
            <button
              onClick={handleLoadAdminHackathon}
              className={`px-5 py-2 rounded-lg border-2 transition-all text-sm font-bold ${adminSection === 'hackathon' ? 'bg-neon-yellow text-dark-bg border-neon-yellow' : 'border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-dark-bg'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              {loadingHackathonRounds && adminSection === 'hackathon' ? 'Cargando...' : 'Hackathon'}
            </button>
          </div>

          {/* Sección Usuarios */}
          {adminSection === 'users' && (
            <>
              {adminUsers.length > 0 && (
                <div className="rounded-lg border border-border-dark overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border-dark" style={{ background: 'rgba(0,212,255,0.06)' }}>
                        <th className="text-left p-3 text-neon-cyan">Usuario</th>
                        <th className="text-left p-3 text-neon-cyan hidden md:table-cell">Email</th>
                        <th className="text-center p-3 text-neon-cyan">Días</th>
                        <th className="text-center p-3 text-neon-cyan">Logins</th>
                        <th className="text-center p-3 text-neon-cyan">Estado</th>
                        <th className="text-center p-3 text-neon-cyan">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((u) => (
                        <tr key={u.id} className="border-b border-border-dark hover:bg-white/5 transition-colors">
                          <td className="p-3">
                            <div className="text-text-light font-semibold">{u.name}</div>
                            <div className="text-border-dark text-xs">{u.role}</div>
                          </td>
                          <td className="p-3 text-text-light/60 hidden md:table-cell text-xs">{u.email}</td>
                          <td className="p-3 text-center">
                            <span className="text-neon-green font-bold">{u.lessons_completed}</span>
                            <span className="text-border-dark">/30</span>
                          </td>
                          <td className="p-3 text-center text-neon-cyan">{u.login_count}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${u.is_active ? 'bg-neon-green/20 text-neon-green' : 'bg-red-500/20 text-red-400'}`}>
                              {u.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleToggleUserActive(u.id, u.is_active)}
                              className={`px-3 py-1 rounded text-xs font-bold border transition-all ${
                                u.is_active
                                  ? 'border-red-400 text-red-400 hover:bg-red-400 hover:text-dark-bg'
                                  : 'border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg'
                              }`}
                            >
                              {u.is_active ? 'Desactivar' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {adminPagination.pages > 1 && (
                    <div className="flex justify-center gap-2 p-4">
                      {Array.from({ length: adminPagination.pages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => loadAdminUsers(p)}
                          className={`w-8 h-8 rounded text-xs font-bold border transition-all ${
                            p === adminPagination.page
                              ? 'border-neon-cyan bg-neon-cyan text-dark-bg'
                              : 'border-border-dark text-text-light hover:border-neon-cyan'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {adminUsers.length === 0 && !loadingAdmin && (
                <div className="text-center py-16 text-text-light/40">
                  <p className="text-lg mb-4">Presiona "Cargar usuarios" para ver la lista</p>
                </div>
              )}
            </>
          )}

          {/* Sección Stats */}
          {adminSection === 'stats' && (
            <>
              {loadingAdminStats && (
                <div className="text-center py-16 text-neon-green animate-pulse">Cargando stats...</div>
              )}
              {!loadingAdminStats && adminStats && (
                <div className="space-y-8">
                  {/* Tarjetas de resumen */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Usuarios activos', value: adminStats.total_users, color: 'neon-cyan' },
                      { label: 'Activos 7 días', value: adminStats.active_last_7_days, color: 'neon-green' },
                      { label: 'Activos 30 días', value: adminStats.active_last_30_days, color: 'neon-yellow' },
                      { label: 'Progreso promedio', value: `${adminStats.avg_progress_percent}%`, color: 'neon-pink' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className={`rounded-lg border border-${color}/40 p-5 text-center`} style={{ background: 'rgba(0,0,0,0.3)' }}>
                        <div className={`text-3xl font-bold text-${color}`} style={{ fontFamily: 'Orbitron, monospace' }}>{value}</div>
                        <div className="text-text-light/60 text-xs mt-1">{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Inscripciones por temporada */}
                  {Object.keys(adminStats.enrollments_by_season).length > 0 && (
                    <div className="rounded-lg border border-border-dark overflow-hidden">
                      <div className="p-4 border-b border-border-dark" style={{ background: 'rgba(0,212,255,0.06)' }}>
                        <h3 className="text-neon-cyan font-bold text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>Inscripciones por Temporada</h3>
                      </div>
                      <div className="flex flex-wrap gap-3 p-4">
                        {Object.entries(adminStats.enrollments_by_season).map(([season, count]) => (
                          <div key={season} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neon-yellow/30" style={{ background: 'rgba(255,213,0,0.05)' }}>
                            <span className="text-neon-yellow font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>{count}</span>
                            <span className="text-text-light/60 text-xs">Temporada {season}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasa de completado por lección */}
                  {adminStats.completion_rate_by_lesson.length > 0 && (
                    <div className="rounded-lg border border-border-dark overflow-hidden">
                      <div className="p-4 border-b border-border-dark" style={{ background: 'rgba(0,212,255,0.06)' }}>
                        <h3 className="text-neon-cyan font-bold text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>Completados por Lección</h3>
                      </div>
                      <div className="p-4 space-y-2">
                        {adminStats.completion_rate_by_lesson.map(({ day, completions, rate }) => (
                          <div key={day} className="flex items-center gap-3">
                            <span className="text-text-light/50 text-xs w-14 shrink-0">Día {day}</span>
                            <div className="flex-1 bg-white/5 rounded-full h-3 overflow-hidden">
                              <div
                                className="h-3 rounded-full transition-all"
                                style={{ width: `${Math.min(rate, 100)}%`, background: rate >= 50 ? 'var(--neon-green, #00ff87)' : rate >= 25 ? 'var(--neon-yellow, #ffd500)' : '#f97316' }}
                              />
                            </div>
                            <span className="text-neon-green text-xs w-16 text-right shrink-0">{completions} ({rate}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {!loadingAdminStats && !adminStats && (
                <div className="text-center py-16 text-text-light/40">
                  <p className="text-lg">Error al cargar las estadísticas</p>
                </div>
              )}
            </>
          )}

          {adminSection === 'hackathon' && (
            <div className="space-y-6">
              <section className="rounded-lg border border-border-dark overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="p-4 border-b border-border-dark" style={{ background: 'rgba(255,213,0,0.06)' }}>
                  <h2 className="text-neon-yellow font-bold text-lg" style={{ fontFamily: 'Orbitron, monospace' }}>Participantes registrados</h2>
                  <p className="text-text-light/70 text-sm mt-1">Esta lista usa únicamente los datos enviados en el formulario de hackathon: nombre visible, GitHub y categoría.</p>
                </div>

                <div className="p-4 space-y-6">
                  {loadingHackathonRegistrants ? <p className="text-neon-cyan text-sm">Cargando participantes...</p> : null}
                  {!loadingHackathonRegistrants && hackathonRegistrantsError ? <p className="text-red-400 text-sm">{hackathonRegistrantsError}</p> : null}

                  {!loadingHackathonRegistrants && !hackathonRegistrantsError && hackathonRegistrants.length === 0 ? (
                    <p className="text-text-light/50 text-sm">Todavía no hay formularios enviados para la hackathon.</p>
                  ) : null}

                  {!loadingHackathonRegistrants && !hackathonRegistrantsError && hackathonRegistrants.length > 0 ? (
                    <>
                      <div className="rounded-lg border border-border-dark overflow-hidden">
                        <div className="p-3 border-b border-border-dark" style={{ background: 'rgba(0,212,255,0.06)' }}>
                          <h3 className="text-neon-cyan font-bold text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>Orden global de participantes</h3>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border-dark">
                                <th className="text-left p-3 text-neon-cyan">#</th>
                                <th className="text-left p-3 text-neon-cyan">Participante</th>
                                <th className="text-left p-3 text-neon-cyan">GitHub</th>
                                <th className="text-left p-3 text-neon-cyan">Categoría</th>
                                <th className="text-left p-3 text-neon-cyan hidden md:table-cell">Registro</th>
                              </tr>
                            </thead>
                            <tbody>
                              {hackathonRegistrants.map((registrant, index) => (
                                <tr key={`${registrant.user_id}-${registrant.category}`} className="border-b border-border-dark hover:bg-white/5 transition-colors">
                                  <td className="p-3 text-neon-yellow font-bold">{index + 1}</td>
                                  <td className="p-3">
                                    <div className="text-text-light font-semibold">{registrant.display_name}</div>
                                    <div className="text-border-dark text-xs">{registrant.email}</div>
                                  </td>
                                  <td className="p-3 text-xs">
                                    <a href={registrant.github_profile} target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:text-neon-green transition break-all">
                                      {registrant.github_profile}
                                    </a>
                                  </td>
                                  <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${registrant.category === 'starter' ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-neon-green/20 text-neon-green'}`}>
                                      {registrant.category === 'starter' ? 'Starter' : 'Deployer'}
                                    </span>
                                  </td>
                                  <td className="p-3 text-text-light/60 text-xs hidden md:table-cell">
                                    {new Date(registrant.registered_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="grid gap-4 xl:grid-cols-2">
                        {['starter', 'deployer'].map((categoryKey) => {
                          const categoryRegistrants = registrantsByCategory[categoryKey] || [];
                          return (
                            <div key={categoryKey} className="rounded-lg border border-border-dark overflow-hidden">
                              <div className="p-3 border-b border-border-dark flex items-center justify-between" style={{ background: categoryKey === 'starter' ? 'rgba(0,212,255,0.06)' : 'rgba(0,255,135,0.06)' }}>
                                <h3 className={categoryKey === 'starter' ? 'text-neon-cyan font-bold text-sm' : 'text-neon-green font-bold text-sm'} style={{ fontFamily: 'Orbitron, monospace' }}>
                                  {categoryKey === 'starter' ? 'Starter' : 'Deployer'}
                                </h3>
                                <span className="text-text-light/60 text-xs">{categoryRegistrants.length} participantes</span>
                              </div>
                              <div className="p-4 space-y-3">
                                {categoryRegistrants.length === 0 ? (
                                  <p className="text-text-light/50 text-sm">Sin participantes registrados en esta categoría.</p>
                                ) : categoryRegistrants.map((registrant, index) => (
                                  <div key={`${categoryKey}-${registrant.user_id}`} className="rounded-lg border border-border-dark p-3" style={{ background: 'rgba(0,0,0,0.25)' }}>
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <p className="text-text-light font-semibold">{index + 1}. {registrant.display_name}</p>
                                        <a href={registrant.github_profile} target="_blank" rel="noopener noreferrer" className="text-neon-cyan text-xs hover:text-neon-green transition break-all">
                                          {registrant.github_profile}
                                        </a>
                                      </div>
                                      <span className="text-border-dark text-xs shrink-0">
                                        {new Date(registrant.registered_at).toLocaleDateString('es-ES')}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : null}
                </div>
              </section>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-lg border border-border-dark p-5" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <div>
                  <h2 className="text-neon-yellow font-bold text-lg" style={{ fontFamily: 'Orbitron, monospace' }}>Gestión de rondas Hackathon</h2>
                  <p className="text-text-light/70 text-sm mt-1">Crea una ronda por categoría, genera las parejas y cierra la votación cuando corresponda.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleCreateHackathonRound('starter')}
                    disabled={Boolean(creatingHackathonRoundCategory)}
                    className="px-4 py-2 rounded-lg border-2 border-neon-cyan text-neon-cyan font-bold transition hover:bg-neon-cyan hover:text-dark-bg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Orbitron, monospace' }}
                  >
                    {creatingHackathonRoundCategory === 'starter' ? 'Creando...' : 'Crear ronda Starter'}
                  </button>
                  <button
                    onClick={() => handleCreateHackathonRound('deployer')}
                    disabled={Boolean(creatingHackathonRoundCategory)}
                    className="px-4 py-2 rounded-lg border-2 border-neon-green text-neon-green font-bold transition hover:bg-neon-green hover:text-dark-bg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Orbitron, monospace' }}
                  >
                    {creatingHackathonRoundCategory === 'deployer' ? 'Creando...' : 'Crear ronda Deployer'}
                  </button>
                </div>
              </div>

              <div className="min-h-[24px] text-sm">
                {hackathonAdminError ? <p className="text-red-400">{hackathonAdminError}</p> : null}
                {!hackathonAdminError && hackathonAdminMessage ? <p className="text-neon-green">{hackathonAdminMessage}</p> : null}
              </div>

              {loadingHackathonRounds ? (
                <div className="text-center py-12 text-neon-cyan">Cargando rondas...</div>
              ) : null}

              {!loadingHackathonRounds && hackathonRounds.length === 0 ? (
                <div className="text-center py-16 text-text-light/40">
                  <p className="text-lg">Todavía no hay rondas creadas para la hackathon.</p>
                </div>
              ) : null}

              {!loadingHackathonRounds && hackathonRounds.length > 0 ? (
                <div className="space-y-4">
                  {hackathonRounds.map((round) => (
                    <section key={`${round.category}-${round.id}`} className="rounded-lg border border-border-dark overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="p-4 border-b border-border-dark flex flex-col gap-3 md:flex-row md:items-center md:justify-between" style={{ background: 'rgba(0,212,255,0.06)' }}>
                        <div>
                          <h3 className="text-neon-cyan font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>
                            Ronda {round.round_number} · {round.category === 'starter' ? 'Starter' : 'Deployer'}
                          </h3>
                          <p className="text-text-light/60 text-xs mt-1">Estado: {round.status}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {round.status === 'draft' ? (
                            <button
                              onClick={() => handleTriggerHackathonRound(round.id)}
                              disabled={processingHackathonRoundId === round.id}
                              className="px-4 py-2 rounded-lg border border-neon-yellow text-neon-yellow text-sm font-bold transition hover:bg-neon-yellow hover:text-dark-bg disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ fontFamily: 'Orbitron, monospace' }}
                            >
                              {processingHackathonRoundId === round.id ? 'Emparejando...' : 'Emparejar ronda'}
                            </button>
                          ) : null}
                          {round.status === 'active' ? (
                            <button
                              onClick={() => handleCloseHackathonRound(round.id)}
                              disabled={processingHackathonRoundId === round.id}
                              className="px-4 py-2 rounded-lg border border-neon-green text-neon-green text-sm font-bold transition hover:bg-neon-green hover:text-dark-bg disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ fontFamily: 'Orbitron, monospace' }}
                            >
                              {processingHackathonRoundId === round.id ? 'Cerrando...' : 'Cerrar ronda'}
                            </button>
                          ) : null}
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        {round.pairings.length === 0 ? (
                          <p className="text-text-light/60 text-sm">Esta ronda todavía no tiene emparejamientos.</p>
                        ) : round.pairings.map((pairing) => (
                          <div key={pairing.id} className="rounded-lg border border-border-dark p-4" style={{ background: 'rgba(0,0,0,0.25)' }}>
                            <div className="flex items-center justify-between gap-3 mb-3">
                              <p className="text-neon-yellow text-sm font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>Pareja {pairing.pair_number}</p>
                              <span className={`px-2 py-1 rounded text-xs font-bold ${pairing.status === 'closed' ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-cyan/20 text-neon-cyan'}`}>
                                {pairing.status === 'closed' ? 'Cerrada' : 'Activa'}
                              </span>
                            </div>
                            {pairing.bye ? (
                              <p className="text-text-light text-sm">
                                <strong>{pairing.participant_a.display_name}</strong> avanza automáticamente por cantidad impar de inscritos.
                              </p>
                            ) : (
                              <div className="grid gap-3 md:grid-cols-2">
                                <div className={`rounded-lg border p-3 ${pairing.winner_user_id === pairing.participant_a.user_id ? 'border-neon-green' : 'border-border-dark'}`}>
                                  <p className="font-bold text-text-light">{pairing.participant_a.display_name}</p>
                                  <p className="text-xs text-neon-cyan mt-1">{pairing.participant_a.github_profile}</p>
                                  {pairing.votes_for_a !== null ? <p className="text-xs text-neon-yellow mt-2">Votos: {pairing.votes_for_a}</p> : null}
                                </div>
                                <div className={`rounded-lg border p-3 ${pairing.winner_user_id === pairing.participant_b?.user_id ? 'border-neon-green' : 'border-border-dark'}`}>
                                  <p className="font-bold text-text-light">{pairing.participant_b?.display_name}</p>
                                  <p className="text-xs text-neon-cyan mt-1">{pairing.participant_b?.github_profile}</p>
                                  {pairing.votes_for_b !== null ? <p className="text-xs text-neon-yellow mt-2">Votos: {pairing.votes_for_b}</p> : null}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </main>
        {renderChatWidget()}
      </div>
    );
  }

  // Profile View
  if (currentView === 'perfil') {
    return (
      <div className="min-h-screen bg-dark-bg text-text-light font-mono">
        {/* Header */}
        <header className="border-b border-border-dark p-6 relative" style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(0,212,255,0.10) 0%, transparent 70%), linear-gradient(180deg, #04040f 0%, #0a0a1e 100%)' }}>
          <button
            onClick={() => setCurrentView('selector')}
            className="text-neon-cyan hover:text-neon-green transition mb-4"
          >
            ← Secciones
          </button>
          <h1 className="text-4xl font-bold text-neon-green" style={{ fontFamily: 'Orbitron, monospace' }}>
            Mi Perfil
          </h1>
          <p className="text-neon-cyan mt-1 text-lg">Tu información personal</p>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Avatar + Name Card */}
          <section className="rounded-lg bg-dark-card p-6 border-2 border-neon-cyan" style={{ boxShadow: '0 0 20px rgba(0,212,255,0.08)' }}>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user?.name || 'Usuario'}
                  className="w-24 h-24 rounded-full border-2 border-neon-green"
                  referrerPolicy="no-referrer"
                  style={{ boxShadow: '0 0 20px rgba(0,212,255,0.4)' }}
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full border-2 border-neon-green flex items-center justify-center"
                  style={{ background: 'rgba(0,212,255,0.1)', boxShadow: '0 0 20px rgba(0,212,255,0.4)' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-neon-green">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </div>
              )}
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-neon-green" style={{ fontFamily: 'Orbitron, monospace' }}>
                  {user?.name || 'Usuario'}
                </h2>
                <p className="text-neon-cyan text-sm mt-1">Miembro de New Coders</p>
              </div>
            </div>
          </section>

          {/* Profile Form Fields */}
          <section className="rounded-lg bg-dark-card p-6 border-2 border-neon-green" style={{ boxShadow: '0 0 20px rgba(0,255,100,0.06)' }}>
            <h2 className="text-2xl font-bold text-neon-green mb-5" style={{ fontFamily: 'Orbitron, monospace' }}>Datos personales</h2>
            <div className="space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-neon-yellow text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Nombre
                </label>
                <input
                  type="text"
                  defaultValue={user?.name || ''}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-dark-bg border border-border-dark rounded-lg px-4 py-3 text-text-light focus:border-neon-cyan focus:outline-none transition-colors"
                  style={{ boxShadow: 'inset 0 0 8px rgba(0,212,255,0.05)' }}
                  placeholder="Tu nombre"
                />
              </div>
              {/* Correo */}
              <div>
                <label className="block text-neon-yellow text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  readOnly
                  className="w-full bg-dark-bg border border-border-dark rounded-lg px-4 py-3 text-text-light/50 cursor-not-allowed"
                  style={{ boxShadow: 'inset 0 0 8px rgba(0,212,255,0.05)' }}
                />
                <p className="text-xs text-border-dark mt-1">El correo está vinculado a tu cuenta de Google.</p>
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="mt-5 px-6 py-2 rounded-lg border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg transition-all duration-300 text-sm font-bold disabled:opacity-50"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              {savingProfile ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </section>


          {/* Admin Panel Link */}
          {user?.role === 'admin' && (
            <section className="rounded-lg bg-dark-card p-4 border border-neon-yellow/40 flex items-center justify-between">
              <div>
                <p className="text-neon-yellow text-sm font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>Panel de Administración</p>
                <p className="text-text-light/50 text-xs mt-1">Gestiona usuarios y estadísticas</p>
              </div>
              <button
                onClick={() => { loadAdminUsers(1); setCurrentView('admin'); }}
                className="px-4 py-2 rounded-lg border border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-dark-bg transition-all text-xs font-bold"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                Abrir →
              </button>
            </section>
          )}

          {/* Exportar datos */}
          <section className="rounded-lg bg-dark-card p-4 border border-border-dark">
            <h3 className="text-text-light text-sm font-bold mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>Mis Datos (GDPR)</h3>
            <p className="text-text-light/50 text-xs mb-3">Descarga una copia de todos tus datos almacenados en New Coders.</p>
            <a
              href="/api/users/export"
              download
              className="inline-block px-4 py-2 rounded-lg border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark-bg transition-all text-xs font-bold"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Descargar mis datos
            </a>
          </section>

          {/* Logout */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => { if (window.confirm('¿Deseas cerrar tu sesión?')) logout(); }}
              className="text-sm font-bold py-3 px-8 rounded-lg border-2 border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-dark-bg transition-all duration-300"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Cerrar sesión
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
              className="text-sm font-bold py-3 px-8 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-dark-bg transition-all duration-300 disabled:opacity-50"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              {deletingAccount ? 'Eliminando...' : 'Eliminar cuenta'}
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border-dark p-6 mt-12 text-center" style={{ background: 'linear-gradient(180deg, #0a0a1e 0%, #04040f 100%)' }}>
          <p className="text-neon-cyan">✦ Tu perfil en New Coders ✦</p>
          <SocialLinks />
        </footer>

        {renderChatWidget()}

        {/* Modal Certificado */}
        {showCertificate && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(4,4,15,0.95)' }}
            onClick={() => setShowCertificate(false)}
          >
            <div
              className="max-w-2xl w-full rounded-2xl p-8 border-2 border-neon-cyan"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(191,0,255,0.06) 100%)',
                boxShadow: '0 0 60px rgba(0,212,255,0.3), 0 0 120px rgba(191,0,255,0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🏆</div>
                <div className="text-neon-cyan text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  New Coders — Certificado de Completación
                </div>
                <h2 className="text-3xl font-bold text-neon-green mt-4 mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  {user?.name}
                </h2>
                <p className="text-text-light/70 text-base mb-1">ha completado satisfactoriamente el programa</p>
                <p className="text-neon-yellow text-xl font-bold mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Dev Path — 30 Días
                </p>
                <div className="border-t border-border-dark pt-4 mt-4">
                  <p className="text-text-light/50 text-xs">HTML · CSS · JavaScript · Python · Git</p>
                  <p className="text-border-dark text-xs mt-2">
                    Emitido el {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => setShowCertificate(false)}
                    className="px-5 py-2 rounded-lg border border-border-dark text-text-light/60 hover:border-neon-cyan hover:text-neon-cyan transition-all text-sm"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2 rounded-lg border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg transition-all text-sm font-bold"
                    style={{ fontFamily: 'Orbitron, monospace' }}
                  >
                    Imprimir
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
