import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { generateSessionId } from '../../functions/lib/session.js';
import { createTestDb } from '../helpers/d1.js';
import { createContext, createJsonRequest, extractCookieValue } from '../helpers/http.js';

describe('auth session endpoints', () => {
  let db;
  let meHandler;
  let logoutHandler;

  beforeEach(async () => {
    db = createTestDb();
    ({ onRequestGet: meHandler } = await import('../../functions/api/auth/me.js'));
    ({ onRequestPost: logoutHandler } = await import('../../functions/api/auth/logout.js'));
  });

  afterEach(() => {
    db.close();
  });

  async function createSession({ email = 'user@example.com', name = 'User', expiresAt, lastUsedAt } = {}) {
    const userInsert = await db
      .prepare('INSERT INTO users (google_sub, email, name) VALUES (?, ?, ?)')
      .bind(generateSessionId(), email, name)
      .run();

    const sessionId = generateSessionId();
    await db
      .prepare('INSERT INTO sessions (id, user_id, expires_at, last_used_at) VALUES (?, ?, ?, ?)')
      .bind(
        sessionId,
        userInsert.meta.last_row_id,
        expiresAt || new Date(Date.now() + 72 * 3600_000).toISOString(),
        lastUsedAt || new Date().toISOString()
      )
      .run();

    return { sessionId, userId: userInsert.meta.last_row_id };
  }

  it('restores the authenticated user from a valid session cookie', async () => {
    const { sessionId } = await createSession({ email: 'session@example.com', name: 'Session User' });

    const response = await meHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/auth/me', {
          cookie: `session=${sessionId}`,
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      user: expect.objectContaining({ email: 'session@example.com', name: 'Session User' }),
    });
  });

  it('rejects requests without a valid session', async () => {
    const response = await meHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/auth/me'),
      })
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Not authenticated' });
  });

  it('removes expired and idle sessions during session validation', async () => {
    const expired = await createSession({
      expiresAt: new Date(Date.now() - 60_000).toISOString(),
      lastUsedAt: new Date(Date.now() - 60_000).toISOString(),
    });
    const idle = await createSession({
      expiresAt: new Date(Date.now() + 3600_000).toISOString(),
      lastUsedAt: new Date(Date.now() - 25 * 3600_000).toISOString(),
    });

    const expiredResponse = await meHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/auth/me', {
          cookie: `session=${expired.sessionId}`,
        }),
      })
    );
    const idleResponse = await meHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/auth/me', {
          cookie: `session=${idle.sessionId}`,
        }),
      })
    );

    expect(expiredResponse.status).toBe(401);
    expect(idleResponse.status).toBe(401);
    expect(await db.prepare('SELECT id FROM sessions WHERE id = ?').bind(expired.sessionId).first()).toBeNull();
    expect(await db.prepare('SELECT id FROM sessions WHERE id = ?').bind(idle.sessionId).first()).toBeNull();
  });

  it('logs out a session, clears the cookie, and records an audit event', async () => {
    const { sessionId, userId } = await createSession({ email: 'logout@example.com', name: 'Logout User' });

    const response = await logoutHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/auth/logout', {
          method: 'POST',
          cookie: `session=${sessionId}`,
        }),
      })
    );

    expect(response.status).toBe(200);
    expect(extractCookieValue(response.headers.get('Set-Cookie'), 'session')).toBeNull();
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(await db.prepare('SELECT id FROM sessions WHERE id = ?').bind(sessionId).first()).toBeNull();

    const audit = await db
      .prepare('SELECT user_id, action, ip_address FROM audit_log ORDER BY id DESC LIMIT 1')
      .first();
    expect(audit).toEqual({ user_id: userId, action: 'logout', ip_address: '127.0.0.1' });
  });
});