const SESSION_DURATION_HOURS = 72;
const IDLE_TIMEOUT_HOURS = 24; // Sesiones inactivas por más de 24h se invalidan

export function generateSessionId() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function sessionCookie(sessionId, maxAge = SESSION_DURATION_HOURS * 3600) {
  return `session=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=${maxAge}`;
}

export function clearSessionCookie() {
  return 'session=; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=0';
}

export function getSessionId(request) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/(?:^|;\s*)session=([a-f0-9]{64})/);
  return match ? match[1] : null;
}

export async function getAuthenticatedUser(db, request) {
  const sessionId = getSessionId(request);
  if (!sessionId) return null;

  const row = await db
    .prepare(
      `SELECT u.id, u.google_sub, u.email, u.name, u.display_name, u.picture_url, u.role, u.created_at,
              s.expires_at, s.last_used_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND u.is_active = 1`
    )
    .bind(sessionId)
    .first();

  if (!row) return null;

  const now = new Date();

  // Verificar expiración de la sesión
  if (new Date(row.expires_at) < now) {
    await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
    return null;
  }

  // Verificar timeout por inactividad (24h sin actividad = sesión inválida)
  if (row.last_used_at) {
    const lastUsed = new Date(row.last_used_at);
    const idleHours = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60);
    if (idleHours > IDLE_TIMEOUT_HOURS) {
      await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
      return null;
    }
  }

  await db.prepare('UPDATE sessions SET last_used_at = datetime(\'now\') WHERE id = ?').bind(sessionId).run();

  return {
    id: row.id,
    google_sub: row.google_sub,
    email: row.email,
    name: row.display_name || row.name,
    picture: row.picture_url,
    role: row.role,
    created_at: row.created_at,
  };
}
