import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestDb } from '../helpers/d1.js';
import { createAuthenticatedSession } from '../helpers/fixtures.js';
import { createContext, createJsonRequest } from '../helpers/http.js';

describe('users extra endpoints', () => {
  let db;
  let achievementsHandler;
  let certificateHandler;
  let exportHandler;

  beforeEach(async () => {
    db = createTestDb();
    ({ onRequestGet: achievementsHandler } = await import('../../functions/api/users/achievements.js'));
    ({ onRequestGet: certificateHandler } = await import('../../functions/api/users/certificate.js'));
    ({ onRequestGet: exportHandler } = await import('../../functions/api/users/export.js'));
  });

  afterEach(() => {
    db.close();
  });

  it('returns earned achievements ordered by earned_at', async () => {
    const { sessionId, userId } = await createAuthenticatedSession(db, {
      email: 'achievements@example.com',
    });

    await db
      .prepare(
        `INSERT INTO achievements (user_id, type, earned_at)
         VALUES (?, ?, ?), (?, ?, ?)`
      )
      .bind(
        userId,
        'primer_dia',
        '2026-04-01 10:00:00',
        userId,
        'semana_html',
        '2026-04-02 10:00:00'
      )
      .run();

    const response = await achievementsHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/users/achievements', {
          cookie: `session=${sessionId}`,
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      achievements: [
        { type: 'primer_dia', earned_at: '2026-04-01 10:00:00' },
        { type: 'semana_html', earned_at: '2026-04-02 10:00:00' },
      ],
    });
  });

  it('returns certificate eligibility false when the user has not completed the 30 days', async () => {
    const { sessionId, userId } = await createAuthenticatedSession(db);
    await db
      .prepare('INSERT INTO lesson_completions (user_id, day_number) VALUES (?, ?), (?, ?)')
      .bind(userId, 1, userId, 2)
      .run();

    const response = await certificateHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/users/certificate', {
          cookie: `session=${sessionId}`,
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      eligible: false,
      completed: 2,
      required: 30,
    });
  });

  it('generates the certificate once, persists the issue date, and records the audit event', async () => {
    const { sessionId, userId } = await createAuthenticatedSession(db, {
      name: 'Certificate User',
      displayName: 'Certificado',
    });

    const values = [];
    for (let day = 1; day <= 30; day += 1) {
      values.push('(?, ?)');
    }

    const params = [];
    for (let day = 1; day <= 30; day += 1) {
      params.push(userId, day);
    }

    await db
      .prepare(`INSERT INTO lesson_completions (user_id, day_number) VALUES ${values.join(', ')}`)
      .bind(...params)
      .run();

    const firstResponse = await certificateHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/users/certificate', {
          cookie: `session=${sessionId}`,
        }),
      })
    );

    expect(firstResponse.status).toBe(200);
    const firstBody = await firstResponse.json();
    expect(firstBody).toEqual({
      eligible: true,
      completed: 30,
      name: 'Certificado',
      issued_at: expect.any(String),
    });

    const persisted = await db
      .prepare('SELECT certificate_generated_at FROM users WHERE id = ?')
      .bind(userId)
      .first();
    expect(persisted.certificate_generated_at).toBe(firstBody.issued_at);

    const secondResponse = await certificateHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/users/certificate', {
          cookie: `session=${sessionId}`,
        }),
      })
    );

    const secondBody = await secondResponse.json();
    expect(secondBody.issued_at).toBe(firstBody.issued_at);

    const auditRows = await db
      .prepare("SELECT action FROM audit_log WHERE user_id = ? AND action = 'certificate_generated'")
      .bind(userId)
      .all();
    expect(auditRows.results).toEqual([{ action: 'certificate_generated' }]);
  });

  it('exports profile, progress, enrollments, achievements, and active session count', async () => {
    const { sessionId, userId } = await createAuthenticatedSession(db, {
      email: 'export@example.com',
      name: 'Export User',
    });

    await db
      .prepare(
        `INSERT INTO lesson_completions (user_id, day_number, completed_at)
         VALUES (?, ?, ?), (?, ?, ?)`
      )
      .bind(userId, 1, '2026-04-01 10:00:00', userId, 2, '2026-04-02 10:00:00')
      .run();
    await db
      .prepare('INSERT INTO achievements (user_id, type, earned_at) VALUES (?, ?, ?)')
      .bind(userId, 'primer_dia', '2026-04-01 10:00:00')
      .run();

    const response = await exportHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/users/export', {
          cookie: `session=${sessionId}`,
        }),
      })
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Disposition')).toBe(
      `attachment; filename="newcoders-datos-${userId}.json"`
    );

    const body = await response.json();
    expect(body).toEqual({
      exported_at: expect.any(String),
      profile: {
        id: userId,
        name: 'Export User',
        email: 'export@example.com',
        role: 'student',
        created_at: expect.any(String),
      },
      progress: {
        lessons_completed: [
          { day_number: 1, completed_at: '2026-04-01 10:00:00' },
          { day_number: 2, completed_at: '2026-04-02 10:00:00' },
        ],
        total: 2,
      },
      enrollments: [
        expect.objectContaining({ season: 'S1' }),
      ],
      achievements: [
        { type: 'primer_dia', earned_at: '2026-04-01 10:00:00' },
      ],
      active_sessions: 1,
    });

    const audit = await db.prepare("SELECT action, ip_address FROM audit_log WHERE user_id = ? AND action = 'data_export'").bind(userId).first();
    expect(audit).toEqual({ action: 'data_export', ip_address: '127.0.0.1' });
  });
});