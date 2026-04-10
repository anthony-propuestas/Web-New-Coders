import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestDb } from '../helpers/d1.js';
import { createAuthenticatedSession } from '../helpers/fixtures.js';
import { createContext, createJsonRequest } from '../helpers/http.js';

describe('hackathon register endpoint', () => {
  let db;
  let getHandler;
  let postHandler;

  beforeEach(async () => {
    db = createTestDb();
    ({ onRequestGet: getHandler, onRequestPost: postHandler } = await import('../../functions/api/hackathon/register.js'));
  });

  afterEach(() => {
    db.close();
  });

  it('returns null registration when the user is authenticated but not registered yet', async () => {
    const { sessionId } = await createAuthenticatedSession(db, {
      email: 'hackathon-null@example.com',
      name: 'Hackathon Null',
    });

    const response = await getHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/hackathon/register', {
          cookie: `session=${sessionId}`,
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ registration: null });
  });

  it('creates a registration, normalizes github profile, and upgrades the user role', async () => {
    const { sessionId, userId } = await createAuthenticatedSession(db, {
      email: 'hackathon-create@example.com',
      name: 'Hackathon Create',
    });

    const response = await postHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/hackathon/register', {
          method: 'POST',
          cookie: `session=${sessionId}`,
          body: {
            display_name: '  Equipo Neon  ',
            github_profile: '@equipo-neon',
            category: 'starter',
          },
        }),
      })
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      registration: {
        display_name: 'Equipo Neon',
        github_profile: 'https://github.com/equipo-neon',
        category: 'starter',
      },
      user: expect.objectContaining({
        id: userId,
        role: 'new_hacker',
        name: 'Equipo Neon',
      }),
    });

    const registration = await db
      .prepare('SELECT user_id, display_name, github_profile, category FROM hackathon_registrations WHERE user_id = ?')
      .bind(userId)
      .first();
    expect(registration).toEqual({
      user_id: userId,
      display_name: 'Equipo Neon',
      github_profile: 'https://github.com/equipo-neon',
      category: 'starter',
    });

    const user = await db.prepare('SELECT role, display_name FROM users WHERE id = ?').bind(userId).first();
    expect(user).toEqual({ role: 'new_hacker', display_name: 'Equipo Neon' });

    const audit = await db.prepare('SELECT action, details, ip_address FROM audit_log ORDER BY id DESC LIMIT 1').first();
    expect(audit).toEqual({
      action: 'hackathon_registration_created',
      details: JSON.stringify({
        category: 'starter',
        github_profile: 'https://github.com/equipo-neon',
      }),
      ip_address: '127.0.0.1',
    });
  });

  it('updates an existing registration and keeps a single row per user', async () => {
    const { sessionId, userId } = await createAuthenticatedSession(db, {
      email: 'hackathon-update@example.com',
      name: 'Hackathon Update',
    });

    await db
      .prepare(
        `INSERT INTO hackathon_registrations (user_id, display_name, github_profile, category)
         VALUES (?, ?, ?, ?)`
      )
      .bind(userId, 'Equipo Inicial', 'https://github.com/equipo-inicial', 'starter')
      .run();

    const response = await postHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/hackathon/register', {
          method: 'POST',
          cookie: `session=${sessionId}`,
          body: {
            display_name: 'Equipo Final',
            github_profile: 'https://github.com/equipo-final',
            category: 'deployer',
          },
        }),
      })
    );

    expect(response.status).toBe(200);

    const registration = await db
      .prepare('SELECT display_name, github_profile, category FROM hackathon_registrations WHERE user_id = ?')
      .bind(userId)
      .first();
    expect(registration).toEqual({
      display_name: 'Equipo Final',
      github_profile: 'https://github.com/equipo-final',
      category: 'deployer',
    });

    const count = await db.prepare('SELECT COUNT(*) as count FROM hackathon_registrations WHERE user_id = ?').bind(userId).first();
    expect(count.count).toBe(1);
  });

  it('rejects invalid payloads and unauthenticated access', async () => {
    const unauthenticated = await postHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/hackathon/register', {
          method: 'POST',
          body: {
            display_name: 'Anon',
            github_profile: '@anon',
            category: 'starter',
          },
        }),
      })
    );

    expect(unauthenticated.status).toBe(401);

    const { sessionId } = await createAuthenticatedSession(db, {
      email: 'hackathon-invalid@example.com',
      name: 'Hackathon Invalid',
    });

    const invalidCategory = await postHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/hackathon/register', {
          method: 'POST',
          cookie: `session=${sessionId}`,
          body: {
            display_name: 'Equipo',
            github_profile: '@equipo',
            category: 'pro',
          },
        }),
      })
    );

    expect(invalidCategory.status).toBe(400);
    await expect(invalidCategory.json()).resolves.toEqual({ error: 'category must be starter or deployer' });

    const invalidGithub = await postHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/hackathon/register', {
          method: 'POST',
          cookie: `session=${sessionId}`,
          body: {
            display_name: 'Equipo',
            github_profile: 'https://gitlab.com/equipo',
            category: 'starter',
          },
        }),
      })
    );

    expect(invalidGithub.status).toBe(400);
    await expect(invalidGithub.json()).resolves.toEqual({ error: 'github_profile must be a valid GitHub profile' });
  });

  it('applies rate limiting after repeated submissions', async () => {
    const { sessionId } = await createAuthenticatedSession(db, {
      email: 'hackathon-rate@example.com',
      name: 'Hackathon Rate',
    });

    let lastResponse;
    for (let attempt = 0; attempt < 11; attempt += 1) {
      lastResponse = await postHandler(
        createContext({
          db,
          request: createJsonRequest('https://newcoders.org/api/hackathon/register', {
            method: 'POST',
            cookie: `session=${sessionId}`,
            body: {
              display_name: `Equipo ${attempt}`,
              github_profile: `@equipo-${attempt}`,
              category: 'starter',
            },
          }),
        })
      );
    }

    expect(lastResponse.status).toBe(429);
    await expect(lastResponse.json()).resolves.toEqual({ error: 'Too many requests. Try again later.' });
  });
});