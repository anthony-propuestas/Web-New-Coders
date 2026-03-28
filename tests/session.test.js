import { describe, it, expect, vi } from 'vitest';
import {
  generateSessionId,
  sessionCookie,
  clearSessionCookie,
  getSessionId,
  getAuthenticatedUser,
} from '../functions/lib/session.js';

// Helper: construye un Request con cookie opcional
function makeRequest(cookie) {
  return new Request('https://newcoders.org/api/auth/me', {
    headers: cookie ? { Cookie: cookie } : {},
  });
}

// Helper: crea un mock de D1Database
function createMockDB({ firstResult = null } = {}) {
  const run = vi.fn().mockResolvedValue({});
  const first = vi.fn().mockResolvedValue(firstResult);
  const bind = vi.fn().mockReturnValue({ run, first });
  const prepare = vi.fn().mockReturnValue({ bind });
  return { prepare };
}

// Sesión válida de 64 chars hexadecimales
const VALID_SESSION_ID = 'a'.repeat(64);

// Fechas auxiliares
const future = () => new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
const recentActivity = () => new Date(Date.now() - 1000 * 60 * 60).toISOString(); // hace 1h
const longInactivity = () => new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(); // hace 25h

// Fila de usuario ficticia válida
function userRow(overrides = {}) {
  return {
    id: 1,
    google_sub: 'google_sub_123',
    email: 'usuario@test.com',
    name: 'Nombre Real',
    display_name: 'Nombre Mostrado',
    picture_url: 'https://foto.url',
    role: 'user',
    created_at: '2024-01-01',
    expires_at: future(),
    last_used_at: recentActivity(),
    ...overrides,
  };
}

// ─── generateSessionId ───────────────────────────────────────────────────────

describe('generateSessionId', () => {
  it('devuelve una cadena de 64 caracteres hexadecimales', () => {
    const id = generateSessionId();
    expect(id).toMatch(/^[a-f0-9]{64}$/);
  });

  it('devuelve valores únicos en cada llamada', () => {
    const ids = Array.from({ length: 10 }, generateSessionId);
    const unique = new Set(ids);
    expect(unique.size).toBe(10);
  });
});

// ─── sessionCookie ───────────────────────────────────────────────────────────

describe('sessionCookie', () => {
  it('incluye el session id en el valor', () => {
    expect(sessionCookie('mitoken')).toContain('session=mitoken');
  });

  it('incluye la flag HttpOnly', () => {
    expect(sessionCookie('tok')).toContain('HttpOnly');
  });

  it('incluye la flag Secure', () => {
    expect(sessionCookie('tok')).toContain('Secure');
  });

  it('incluye SameSite=Strict', () => {
    expect(sessionCookie('tok')).toContain('SameSite=Strict');
  });

  it('limita el path a /api', () => {
    expect(sessionCookie('tok')).toContain('Path=/api');
  });

  it('usa Max-Age de 72 horas por defecto (259200 segundos)', () => {
    expect(sessionCookie('tok')).toContain('Max-Age=259200');
  });

  it('acepta un Max-Age personalizado', () => {
    expect(sessionCookie('tok', 1800)).toContain('Max-Age=1800');
  });
});

// ─── clearSessionCookie ──────────────────────────────────────────────────────

describe('clearSessionCookie', () => {
  it('pone Max-Age=0 para eliminar la cookie', () => {
    expect(clearSessionCookie()).toContain('Max-Age=0');
  });

  it('limpia el valor de session', () => {
    expect(clearSessionCookie()).toContain('session=;');
  });

  it('mantiene las flags de seguridad', () => {
    const cookie = clearSessionCookie();
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('Secure');
    expect(cookie).toContain('SameSite=Strict');
  });
});

// ─── getSessionId ────────────────────────────────────────────────────────────

describe('getSessionId', () => {
  it('extrae el session id de una cookie válida', () => {
    const req = makeRequest(`session=${VALID_SESSION_ID}`);
    expect(getSessionId(req)).toBe(VALID_SESSION_ID);
  });

  it('extrae el session id cuando hay otras cookies presentes', () => {
    const req = makeRequest(`otro=xyz; session=${VALID_SESSION_ID}; mas=abc`);
    expect(getSessionId(req)).toBe(VALID_SESSION_ID);
  });

  it('devuelve null si no hay header Cookie', () => {
    expect(getSessionId(makeRequest(null))).toBeNull();
  });

  it('devuelve null si el session id tiene longitud incorrecta', () => {
    expect(getSessionId(makeRequest('session=abc123'))).toBeNull();
  });

  it('devuelve null si el session id contiene caracteres no hexadecimales', () => {
    const badId = 'z'.repeat(64);
    expect(getSessionId(makeRequest(`session=${badId}`))).toBeNull();
  });

  it('devuelve null si la cookie session no está presente', () => {
    expect(getSessionId(makeRequest('otracookie=valor'))).toBeNull();
  });
});

// ─── getAuthenticatedUser ────────────────────────────────────────────────────

describe('getAuthenticatedUser', () => {
  it('devuelve null si no hay cookie de sesión', async () => {
    const db = createMockDB();
    const user = await getAuthenticatedUser(db, makeRequest(null));
    expect(user).toBeNull();
  });

  it('devuelve null si la sesión no existe en la base de datos', async () => {
    const db = createMockDB({ firstResult: null });
    const user = await getAuthenticatedUser(db, makeRequest(`session=${VALID_SESSION_ID}`));
    expect(user).toBeNull();
  });

  it('devuelve null y elimina la sesión si está expirada', async () => {
    const db = createMockDB({
      firstResult: userRow({ expires_at: new Date(Date.now() - 1000).toISOString() }),
    });
    const user = await getAuthenticatedUser(db, makeRequest(`session=${VALID_SESSION_ID}`));
    expect(user).toBeNull();
    // Debe haber llamado DELETE
    expect(db.prepare).toHaveBeenCalledWith(expect.stringContaining('DELETE'));
  });

  it('devuelve null y elimina la sesión si supera el idle timeout (>24h)', async () => {
    const db = createMockDB({
      firstResult: userRow({ last_used_at: longInactivity() }),
    });
    const user = await getAuthenticatedUser(db, makeRequest(`session=${VALID_SESSION_ID}`));
    expect(user).toBeNull();
    expect(db.prepare).toHaveBeenCalledWith(expect.stringContaining('DELETE'));
  });

  it('devuelve los datos del usuario para una sesión válida', async () => {
    const db = createMockDB({ firstResult: userRow() });
    const user = await getAuthenticatedUser(db, makeRequest(`session=${VALID_SESSION_ID}`));
    expect(user).not.toBeNull();
    expect(user.email).toBe('usuario@test.com');
    expect(user.role).toBe('user');
  });

  it('usa display_name como nombre cuando está disponible', async () => {
    const db = createMockDB({
      firstResult: userRow({ display_name: 'Apodo', name: 'Nombre Real' }),
    });
    const user = await getAuthenticatedUser(db, makeRequest(`session=${VALID_SESSION_ID}`));
    expect(user.name).toBe('Apodo');
  });

  it('usa name cuando display_name es null', async () => {
    const db = createMockDB({
      firstResult: userRow({ display_name: null, name: 'Nombre Real' }),
    });
    const user = await getAuthenticatedUser(db, makeRequest(`session=${VALID_SESSION_ID}`));
    expect(user.name).toBe('Nombre Real');
  });

  it('actualiza last_used_at en sesiones válidas', async () => {
    const db = createMockDB({ firstResult: userRow() });
    await getAuthenticatedUser(db, makeRequest(`session=${VALID_SESSION_ID}`));
    expect(db.prepare).toHaveBeenCalledWith(expect.stringContaining('UPDATE sessions'));
  });

  it('incluye todos los campos del usuario en el resultado', async () => {
    const db = createMockDB({
      firstResult: userRow({ role: 'admin', picture_url: 'https://img.url' }),
    });
    const user = await getAuthenticatedUser(db, makeRequest(`session=${VALID_SESSION_ID}`));
    expect(user).toMatchObject({
      id: expect.any(Number),
      email: expect.any(String),
      role: 'admin',
      picture: 'https://img.url',
    });
  });
});
