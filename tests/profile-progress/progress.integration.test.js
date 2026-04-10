import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestDb } from '../helpers/d1.js';
import { createAuthenticatedSession } from '../helpers/fixtures.js';
import { createContext, createJsonRequest } from '../helpers/http.js';

function isoDaysAgo(daysAgo) {
  return new Date(Date.now() - daysAgo * 86400_000).toISOString();
}

describe('progress endpoints', () => {
  let db;
  let indexHandler;
  let dayHandler;
  let migrateHandler;

  beforeEach(async () => {
    db = createTestDb();
    ({ onRequestGet: indexHandler } = await import('../../functions/api/progress/index.js'));
    ({ onRequestPost: dayHandler } = await import('../../functions/api/progress/[day].js'));
    ({ onRequestPost: migrateHandler } = await import('../../functions/api/progress/migrate.js'));
  });

  afterEach(() => {
    db.close();
  });

  it('returns completed days, percent, and streak data for the authenticated user', async () => {
    const { sessionId, userId } = await createAuthenticatedSession(db);

    await db
      .prepare(
        `INSERT INTO lesson_completions (user_id, day_number, completed_at)
         VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)`
      )
      .bind(userId, 1, isoDaysAgo(2), userId, 2, isoDaysAgo(1), userId, 3, isoDaysAgo(0))
      .run();

    const response = await indexHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/progress', {
          cookie: `session=${sessionId}`,
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      completed: [1, 2, 3],
      count: 3,
      percent: 10,
      current_streak: 3,
      longest_streak: 3,
      last_completed_at: expect.any(String),
    });
  });

  it('saves a completed day and grants the first achievement', async () => {
    const { sessionId, userId } = await createAuthenticatedSession(db);

    const response = await dayHandler(
      createContext({
        db,
        params: { day: '1' },
        request: createJsonRequest('https://newcoders.org/api/progress/1', {
          method: 'POST',
          cookie: `session=${sessionId}`,
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      day: 1,
      new_achievements: [{ type: 'primer_dia', label: 'Primer Paso' }],
    });

    expect(await db.prepare('SELECT day_number FROM lesson_completions WHERE user_id = ?').bind(userId).first()).toEqual({ day_number: 1 });
    expect(await db.prepare('SELECT type FROM achievements WHERE user_id = ?').bind(userId).first()).toEqual({ type: 'primer_dia' });
  });

  it('rejects invalid day numbers and rate limits excess progress requests', async () => {
    const { sessionId } = await createAuthenticatedSession(db);

    const invalidResponse = await dayHandler(
      createContext({
        db,
        params: { day: '31' },
        request: createJsonRequest('https://newcoders.org/api/progress/31', {
          method: 'POST',
          cookie: `session=${sessionId}`,
        }),
      })
    );

    expect(invalidResponse.status).toBe(400);
    await expect(invalidResponse.json()).resolves.toEqual({
      error: 'Invalid day number. Must be between 1 and 30.',
    });

    const { sessionId: rateLimitSessionId } = await createAuthenticatedSession(db, {
      email: 'rate-progress@example.com',
    });

    for (let index = 0; index < 30; index += 1) {
      const response = await dayHandler(
        createContext({
          db,
          params: { day: '1' },
          request: createJsonRequest('https://newcoders.org/api/progress/1', {
            method: 'POST',
            cookie: `session=${rateLimitSessionId}`,
          }),
        })
      );
      expect(response.status).toBe(200);
    }

    const rateLimited = await dayHandler(
      createContext({
        db,
        params: { day: '1' },
        request: createJsonRequest('https://newcoders.org/api/progress/1', {
          method: 'POST',
          cookie: `session=${rateLimitSessionId}`,
        }),
      })
    );

    expect(rateLimited.status).toBe(429);
    expect(rateLimited.headers.get('Retry-After')).toBe('60');
  });

  it('migrates only valid completed days and ignores duplicates', async () => {
    const { sessionId, userId } = await createAuthenticatedSession(db);
    await db
      .prepare('INSERT INTO lesson_completions (user_id, day_number) VALUES (?, ?)')
      .bind(userId, 2)
      .run();

    const response = await migrateHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/progress/migrate', {
          method: 'POST',
          cookie: `session=${sessionId}`,
          body: { completedDays: [1, 2, 31, -5, 3, 3, '4'] },
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, migrated: 4 });

    const rows = await db
      .prepare('SELECT day_number FROM lesson_completions WHERE user_id = ? ORDER BY day_number')
      .bind(userId)
      .all();
    expect(rows.results).toEqual([{ day_number: 1 }, { day_number: 2 }, { day_number: 3 }]);
  });
});