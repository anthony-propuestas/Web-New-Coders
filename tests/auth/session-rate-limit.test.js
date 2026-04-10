import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { checkRateLimit, getClientIP } from '../../functions/lib/rate-limit.js';
import {
  clearSessionCookie,
  generateSessionId,
  getAuthenticatedUser,
  getSessionId,
  sessionCookie,
} from '../../functions/lib/session.js';
import { createTestDb } from '../helpers/d1.js';

describe('session helpers', () => {
  let db;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it('generates 64-char hexadecimal session ids', () => {
    const first = generateSessionId();
    const second = generateSessionId();

    expect(first).toMatch(/^[a-f0-9]{64}$/);
    expect(second).toMatch(/^[a-f0-9]{64}$/);
    expect(first).not.toBe(second);
  });

  it('creates and clears secure HTTP-only cookies', () => {
    expect(sessionCookie('abc123', 60)).toBe(
      'session=abc123; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=60'
    );
    expect(clearSessionCookie()).toContain('Max-Age=0');
  });

  it('extracts the session id from request cookies', () => {
    const sessionId = `abcd${'0'.repeat(60)}`;
    const request = new Request('https://newcoders.org/api/auth/me', {
      headers: { Cookie: `foo=bar; session=${sessionId}` },
    });

    expect(getSessionId(request)).toBe(sessionId);
  });

  it('returns the authenticated user and updates last_used_at', async () => {
    const userInsert = await db
      .prepare('INSERT INTO users (google_sub, email, name) VALUES (?, ?, ?)')
      .bind('sub-1', 'student@example.com', 'Student')
      .run();
    const sessionId = generateSessionId();

    await db
      .prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)')
      .bind(sessionId, userInsert.meta.last_row_id, new Date(Date.now() + 3600_000).toISOString())
      .run();

    const request = new Request('https://newcoders.org/api/auth/me', {
      headers: { Cookie: `session=${sessionId}` },
    });
    const before = await db
      .prepare('SELECT last_used_at FROM sessions WHERE id = ?')
      .bind(sessionId)
      .first();

    const user = await getAuthenticatedUser(db, request);
    const after = await db
      .prepare('SELECT last_used_at FROM sessions WHERE id = ?')
      .bind(sessionId)
      .first();

    expect(user).toMatchObject({ email: 'student@example.com', name: 'Student' });
    expect(after.last_used_at >= before.last_used_at).toBe(true);
  });

  it('invalidates expired or idle sessions', async () => {
    const userInsert = await db
      .prepare('INSERT INTO users (google_sub, email, name) VALUES (?, ?, ?)')
      .bind('sub-2', 'expired@example.com', 'Expired')
      .run();

    const expiredSession = generateSessionId();
    await db
      .prepare('INSERT INTO sessions (id, user_id, expires_at, last_used_at) VALUES (?, ?, ?, ?)')
      .bind(
        expiredSession,
        userInsert.meta.last_row_id,
        new Date(Date.now() - 3600_000).toISOString(),
        new Date(Date.now() - 3600_000).toISOString()
      )
      .run();

    const idleSession = generateSessionId();
    await db
      .prepare('INSERT INTO sessions (id, user_id, expires_at, last_used_at) VALUES (?, ?, ?, ?)')
      .bind(
        idleSession,
        userInsert.meta.last_row_id,
        new Date(Date.now() + 3600_000).toISOString(),
        new Date(Date.now() - 25 * 3600_000).toISOString()
      )
      .run();

    await expect(
      getAuthenticatedUser(
        db,
        new Request('https://newcoders.org/api/auth/me', {
          headers: { Cookie: `session=${expiredSession}` },
        })
      )
    ).resolves.toBeNull();

    await expect(
      getAuthenticatedUser(
        db,
        new Request('https://newcoders.org/api/auth/me', {
          headers: { Cookie: `session=${idleSession}` },
        })
      )
    ).resolves.toBeNull();

    expect(
      await db.prepare('SELECT id FROM sessions WHERE id = ?').bind(expiredSession).first()
    ).toBeNull();
    expect(await db.prepare('SELECT id FROM sessions WHERE id = ?').bind(idleSession).first()).toBeNull();
  });
});

describe('rate limit helpers', () => {
  let db;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it('extracts the client IP from Cloudflare headers', () => {
    const request = new Request('https://newcoders.org/api/auth/google', {
      headers: {
        'CF-Connecting-IP': '10.0.0.1',
        'X-Forwarded-For': '192.168.0.10, 192.168.0.11',
      },
    });

    expect(getClientIP(request)).toBe('10.0.0.1');
  });

  it('blocks requests that exceed the auth rate limit and resets after the window', async () => {
    for (let index = 0; index < 10; index += 1) {
      await expect(checkRateLimit(db, 'ip:127.0.0.1:auth', 'auth')).resolves.toEqual({ ok: true });
    }

    await expect(checkRateLimit(db, 'ip:127.0.0.1:auth', 'auth')).resolves.toEqual({
      ok: false,
      retryAfter: 60,
    });

    await db
      .prepare('UPDATE rate_limit SET window_start = ? WHERE key = ?')
      .bind('2000-01-01 00:00:00', 'ip:127.0.0.1:auth')
      .run();

    await expect(checkRateLimit(db, 'ip:127.0.0.1:auth', 'auth')).resolves.toEqual({ ok: true });
  });
});