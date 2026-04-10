import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestDb } from '../helpers/d1.js';
import { createContext, createJsonRequest } from '../helpers/http.js';

const { verifyGoogleJwtMock } = vi.hoisted(() => ({
  verifyGoogleJwtMock: vi.fn(),
}));

vi.mock('../../functions/lib/google-jwt.js', () => ({
  verifyGoogleJwt: verifyGoogleJwtMock,
}));

describe('POST /api/auth/google', () => {
  let db;
  let loginHandler;

  beforeEach(async () => {
    vi.resetModules();
    verifyGoogleJwtMock.mockReset();
    db = createTestDb();
    ({ onRequestPost: loginHandler } = await import('../../functions/api/auth/google.js'));
  });

  afterEach(() => {
    db.close();
  });

  it('creates a user, enrollment, session, and audit log on first login', async () => {
    verifyGoogleJwtMock.mockResolvedValue({
      sub: 'google-sub-001',
      email: 'new@student.dev',
      name: 'New Student',
      picture: 'https://example.com/new.png',
    });

    const response = await loginHandler(
      createContext({
        db,
        env: { GOOGLE_CLIENT_ID: 'test-client-id' },
        request: createJsonRequest('https://newcoders.org/api/auth/google', {
          method: 'POST',
          body: { credential: 'jwt-token' },
        }),
      })
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Set-Cookie')).toMatch(/^session=[a-f0-9]{64};/);
    expect(await response.json()).toEqual({
      user: expect.objectContaining({
        email: 'new@student.dev',
        name: 'New Student',
        role: 'student',
      }),
    });

    expect(await db.prepare('SELECT id FROM users WHERE google_sub = ?').bind('google-sub-001').first()).not.toBeNull();
    expect(await db.prepare('SELECT id FROM enrollments WHERE user_id = 1 AND season = ?').bind('S1').first()).not.toBeNull();
    expect(await db.prepare('SELECT id FROM sessions WHERE user_id = 1').first()).not.toBeNull();

    const audit = await db
      .prepare('SELECT action, details, ip_address FROM audit_log ORDER BY id DESC LIMIT 1')
      .first();
    expect(audit).toEqual({
      action: 'login_success',
      details: JSON.stringify({ email: 'new@student.dev' }),
      ip_address: '127.0.0.1',
    });
  });

  it('updates returning users and increments login_count', async () => {
    await db
      .prepare(
        `INSERT INTO users (google_sub, email, name, picture_url, login_count)
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind('google-sub-002', 'before@example.com', 'Before Name', 'https://example.com/old.png', 3)
      .run();

    verifyGoogleJwtMock.mockResolvedValue({
      sub: 'google-sub-002',
      email: 'after@example.com',
      name: 'After Name',
      picture: 'https://example.com/new.png',
    });

    const response = await loginHandler(
      createContext({
        db,
        env: { GOOGLE_CLIENT_ID: 'test-client-id' },
        request: createJsonRequest('https://newcoders.org/api/auth/google', {
          method: 'POST',
          body: { credential: 'jwt-token' },
        }),
      })
    );

    expect(response.status).toBe(200);

    const user = await db
      .prepare('SELECT email, name, picture_url, login_count FROM users WHERE google_sub = ?')
      .bind('google-sub-002')
      .first();
    expect(user).toEqual({
      email: 'after@example.com',
      name: 'After Name',
      picture_url: 'https://example.com/new.png',
      login_count: 4,
    });
  });

  it('rejects missing credentials and missing server configuration', async () => {
    const missingCredential = await loginHandler(
      createContext({
        db,
        env: { GOOGLE_CLIENT_ID: 'test-client-id' },
        request: createJsonRequest('https://newcoders.org/api/auth/google', {
          method: 'POST',
          body: {},
        }),
      })
    );

    expect(missingCredential.status).toBe(400);
    await expect(missingCredential.json()).resolves.toEqual({ error: 'Missing credential' });

    const missingConfig = await loginHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/auth/google', {
          method: 'POST',
          body: { credential: 'jwt-token' },
        }),
      })
    );

    expect(missingConfig.status).toBe(500);
    await expect(missingConfig.json()).resolves.toEqual({ error: 'Server configuration error' });
  });

  it('returns 401 on JWT verification failures and records the audit event', async () => {
    verifyGoogleJwtMock.mockRejectedValue(new Error('Invalid audience'));

    const response = await loginHandler(
      createContext({
        db,
        env: { GOOGLE_CLIENT_ID: 'test-client-id' },
        request: createJsonRequest('https://newcoders.org/api/auth/google', {
          method: 'POST',
          body: { credential: 'jwt-token' },
        }),
      })
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Authentication failed' });

    const audit = await db.prepare('SELECT action, details FROM audit_log ORDER BY id DESC LIMIT 1').first();
    expect(audit).toEqual({
      action: 'login_failed',
      details: JSON.stringify({ reason: 'Invalid audience' }),
    });
  });

  it('rate limits the eleventh auth attempt from the same IP', async () => {
    verifyGoogleJwtMock.mockResolvedValue({
      sub: 'google-sub-003',
      email: 'rate@example.com',
      name: 'Rate Limited',
      picture: '',
    });

    for (let index = 0; index < 10; index += 1) {
      const response = await loginHandler(
        createContext({
          db,
          env: { GOOGLE_CLIENT_ID: 'test-client-id' },
          request: createJsonRequest('https://newcoders.org/api/auth/google', {
            method: 'POST',
            body: { credential: `jwt-token-${index}` },
          }),
        })
      );

      expect(response.status).toBe(200);
    }

    const blocked = await loginHandler(
      createContext({
        db,
        env: { GOOGLE_CLIENT_ID: 'test-client-id' },
        request: createJsonRequest('https://newcoders.org/api/auth/google', {
          method: 'POST',
          body: { credential: 'jwt-token-11' },
        }),
      })
    );

    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBe('60');
    await expect(blocked.json()).resolves.toEqual({ error: 'Too many requests. Try again later.' });
  });
});