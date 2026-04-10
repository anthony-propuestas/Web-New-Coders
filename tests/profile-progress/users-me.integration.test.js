import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestDb } from '../helpers/d1.js';
import { createAuthenticatedSession } from '../helpers/fixtures.js';
import { createContext, createJsonRequest } from '../helpers/http.js';

describe('users/me endpoints', () => {
  let db;
  let getHandler;
  let patchHandler;
  let deleteHandler;

  beforeEach(async () => {
    db = createTestDb();
    ({ onRequestGet: getHandler, onRequestPatch: patchHandler, onRequestDelete: deleteHandler } = await import('../../functions/api/users/me.js'));
  });

  afterEach(() => {
    db.close();
  });

  it('returns profile, enrollment, and progress summary for the authenticated user', async () => {
    const { sessionId, userId } = await createAuthenticatedSession(db, {
      email: 'profile@example.com',
      name: 'Profile User',
      pictureUrl: 'https://example.com/profile.png',
    });

    await db.prepare('INSERT INTO lesson_completions (user_id, day_number) VALUES (?, ?), (?, ?)')
      .bind(userId, 1, userId, 2)
      .run();

    const response = await getHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/users/me', {
          cookie: `session=${sessionId}`,
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      user: expect.objectContaining({
        email: 'profile@example.com',
        name: 'Profile User',
        picture: 'https://example.com/profile.png',
        role: 'student',
      }),
      progress: {
        count: 2,
        percent: 6.7,
      },
      enrollment: expect.objectContaining({ season: 'S1' }),
    });
  });

  it('updates display_name, sanitizes control characters, and writes an audit row', async () => {
    const { sessionId, userId } = await createAuthenticatedSession(db, {
      email: 'patch@example.com',
      name: 'Patch User',
    });

    const response = await patchHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/users/me', {
          method: 'PATCH',
          cookie: `session=${sessionId}`,
          body: { display_name: '  Nombre\u0000 seguro  ' },
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });

    const user = await db.prepare('SELECT display_name FROM users WHERE id = ?').bind(userId).first();
    expect(user.display_name).toBe('Nombre seguro');

    const audit = await db.prepare('SELECT user_id, action, details FROM audit_log ORDER BY id DESC LIMIT 1').first();
    expect(audit).toEqual({
      user_id: userId,
      action: 'profile_update',
      details: JSON.stringify({ field: 'display_name' }),
    });
  });

  it('rejects invalid display_name payloads', async () => {
    const { sessionId } = await createAuthenticatedSession(db);

    const invalidChars = await patchHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/users/me', {
          method: 'PATCH',
          cookie: `session=${sessionId}`,
          body: { display_name: '<script>' },
        }),
      })
    );

    expect(invalidChars.status).toBe(400);
    await expect(invalidChars.json()).resolves.toEqual({ error: 'display_name contains invalid characters' });

    const invalidType = await patchHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/users/me', {
          method: 'PATCH',
          cookie: `session=${sessionId}`,
          body: { display_name: 123 },
        }),
      })
    );

    expect(invalidType.status).toBe(400);
    await expect(invalidType.json()).resolves.toEqual({ error: 'display_name must be a string' });
  });

  it('soft-deletes the account, clears sessions, and clears the cookie', async () => {
    const { sessionId, userId } = await createAuthenticatedSession(db, {
      email: 'delete@example.com',
      name: 'Delete User',
      displayName: 'Delete Me',
      pictureUrl: 'https://example.com/delete.png',
    });

    const response = await deleteHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/users/me', {
          method: 'DELETE',
          cookie: `session=${sessionId}`,
          body: { confirm: true },
        }),
      })
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Set-Cookie')).toContain('Max-Age=0');
    await expect(response.json()).resolves.toEqual({ ok: true });

    const user = await db
      .prepare('SELECT email, name, display_name, picture_url, is_active, google_sub FROM users WHERE id = ?')
      .bind(userId)
      .first();
    expect(user).toEqual({
      email: `deleted_${userId}@deleted.invalid`,
      name: 'Usuario eliminado',
      display_name: null,
      picture_url: null,
      is_active: 0,
      google_sub: `deleted_${userId}`,
    });
    expect(await db.prepare('SELECT id FROM sessions WHERE user_id = ?').bind(userId).first()).toBeNull();

    const audit = await db.prepare('SELECT action, ip_address FROM audit_log ORDER BY id DESC LIMIT 1').first();
    expect(audit).toEqual({ action: 'account_deleted', ip_address: '127.0.0.1' });
  });
});