import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestDb } from '../helpers/d1.js';
import { createAuthenticatedSession } from '../helpers/fixtures.js';
import { createContext, createJsonRequest } from '../helpers/http.js';

describe('admin endpoints', () => {
  let db;
  let statsHandler;
  let usersGetHandler;
  let usersPatchHandler;
  let hackathonRegistrationsHandler;
  let hackathonRegisterPostHandler;

  beforeEach(async () => {
    db = createTestDb();
    ({ onRequestGet: statsHandler } = await import('../../functions/api/admin/stats.js'));
    ({ onRequestGet: usersGetHandler, onRequestPatch: usersPatchHandler } = await import('../../functions/api/admin/users.js'));
    ({ onRequestGet: hackathonRegistrationsHandler } = await import('../../functions/api/admin/hackathon-registrations.js'));
    ({ onRequestPost: hackathonRegisterPostHandler } = await import('../../functions/api/hackathon/register.js'));
  });

  afterEach(() => {
    db.close();
  });

  it('returns aggregated admin stats for an authenticated admin', async () => {
    const { sessionId: adminSessionId, userId: adminId } = await createAuthenticatedSession(db, {
      email: 'admin@example.com',
      name: 'Admin',
      role: 'admin',
    });
    const { userId: studentA } = await createAuthenticatedSession(db, {
      email: 'student-a@example.com',
      name: 'Student A',
      season: 'S1',
    });
    const { userId: studentB } = await createAuthenticatedSession(db, {
      email: 'student-b@example.com',
      name: 'Student B',
      season: 'S2',
    });

    await db
      .prepare(
        `INSERT INTO lesson_completions (user_id, day_number)
         VALUES (?, ?), (?, ?), (?, ?), (?, ?)`
      )
      .bind(studentA, 1, studentA, 2, studentB, 1, studentB, 3)
      .run();
    await db
      .prepare("UPDATE users SET last_login_at = datetime('now', '-20 days') WHERE id = ?")
      .bind(studentB)
      .run();

    const response = await statsHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/admin/stats', {
          cookie: `session=${adminSessionId}`,
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      total_users: 3,
      active_last_7_days: 2,
      active_last_30_days: 3,
      completion_rate_by_lesson: [
        { day: 1, completions: 2, rate: 66.7 },
        { day: 2, completions: 1, rate: 33.3 },
        { day: 3, completions: 1, rate: 33.3 },
      ],
      avg_progress_percent: 6.7,
      enrollments_by_season: {
        S1: 2,
        S2: 1,
      },
    });

    const audit = await db
      .prepare("SELECT user_id, action, ip_address FROM audit_log WHERE action = 'admin_stats_view' AND user_id = ?")
      .bind(adminId)
      .first();
    expect(audit).toEqual({ user_id: adminId, action: 'admin_stats_view', ip_address: '127.0.0.1' });
  });

  it('lists users with pagination, search, and active filter for admins only', async () => {
    const { sessionId: adminSessionId, userId: adminId } = await createAuthenticatedSession(db, {
      email: 'admin-list@example.com',
      role: 'admin',
    });
    const { sessionId: studentSessionId } = await createAuthenticatedSession(db, {
      email: 'student-list@example.com',
      role: 'student',
    });
    const { userId: alphaId } = await createAuthenticatedSession(db, {
      email: 'alpha@example.com',
      name: 'Alpha User',
      displayName: 'Alpha Display',
    });
    const { userId: betaId } = await createAuthenticatedSession(db, {
      email: 'beta@example.com',
      name: 'Beta User',
    });

    await db.prepare('UPDATE users SET is_active = 0 WHERE id = ?').bind(betaId).run();
    await db.prepare('INSERT INTO lesson_completions (user_id, day_number) VALUES (?, ?), (?, ?)').bind(alphaId, 1, alphaId, 2).run();

    const forbidden = await usersGetHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/admin/users', {
          cookie: `session=${studentSessionId}`,
        }),
      })
    );
    expect(forbidden.status).toBe(403);

    const response = await usersGetHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/admin/users?page=1&limit=10&search=alpha&active=false', {
          cookie: `session=${adminSessionId}`,
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      users: [
        expect.objectContaining({
          id: alphaId,
          email: 'alpha@example.com',
          name: 'Alpha Display',
          lessons_completed: 2,
          is_active: true,
        }),
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        pages: 1,
      },
    });

    const audit = await db
      .prepare("SELECT user_id, action, details FROM audit_log WHERE action = 'admin_users_list' AND user_id = ? ORDER BY id DESC LIMIT 1")
      .bind(adminId)
      .first();
    expect(audit).toEqual({
      user_id: adminId,
      action: 'admin_users_list',
      details: JSON.stringify({ page: 1, limit: 10, search: 'alpha' }),
    });
  });

  it('deactivates a user, clears their sessions, and prevents self-deactivation', async () => {
    const { sessionId: adminSessionId, userId: adminId } = await createAuthenticatedSession(db, {
      email: 'admin-patch@example.com',
      role: 'admin',
    });
    const { userId: targetUserId } = await createAuthenticatedSession(db, {
      email: 'target@example.com',
      name: 'Target User',
    });

    const response = await usersPatchHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/admin/users', {
          method: 'PATCH',
          cookie: `session=${adminSessionId}`,
          body: { user_id: targetUserId, is_active: false },
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(await db.prepare('SELECT is_active FROM users WHERE id = ?').bind(targetUserId).first()).toEqual({ is_active: 0 });
    expect(await db.prepare('SELECT id FROM sessions WHERE user_id = ?').bind(targetUserId).first()).toBeNull();

    const audit = await db
      .prepare("SELECT user_id, action, details FROM audit_log WHERE action = 'admin_user_deactivated' AND user_id = ?")
      .bind(adminId)
      .first();
    expect(audit).toEqual({
      user_id: adminId,
      action: 'admin_user_deactivated',
      details: JSON.stringify({ target_user_id: targetUserId }),
    });

    const selfResponse = await usersPatchHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/admin/users', {
          method: 'PATCH',
          cookie: `session=${adminSessionId}`,
          body: { user_id: adminId, is_active: false },
        }),
      })
    );

    expect(selfResponse.status).toBe(400);
    await expect(selfResponse.json()).resolves.toEqual({ error: 'Cannot modify your own account status' });
  });

  it('lists hackathon registrants from form submissions for admins only', async () => {
    const { sessionId: adminSessionId, userId: adminId } = await createAuthenticatedSession(db, {
      email: 'admin-hackathon@example.com',
      role: 'admin',
    });
    const { sessionId: studentSessionId } = await createAuthenticatedSession(db, {
      email: 'student-hackathon@example.com',
      role: 'student',
    });
    const { userId: starterId } = await createAuthenticatedSession(db, {
      email: 'starter-registrant@example.com',
      role: 'student',
    });
    const { userId: deployerId } = await createAuthenticatedSession(db, {
      email: 'deployer-registrant@example.com',
      role: 'student',
    });
    await createAuthenticatedSession(db, {
      email: 'new-hacker-without-form@example.com',
      role: 'new_hacker',
    });

    await db
      .prepare(
        `INSERT INTO hackathon_registrations (user_id, display_name, github_profile, category, registered_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        starterId,
        'Equipo Starter',
        'https://github.com/equipo-starter',
        'starter',
        '2026-04-10 10:00:00',
        '2026-04-10 10:00:00',
        deployerId,
        'Equipo Deployer',
        'https://github.com/equipo-deployer',
        'deployer',
        '2026-04-10 10:05:00',
        '2026-04-10 10:05:00'
      )
      .run();

    const forbidden = await hackathonRegistrationsHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/admin/hackathon-registrations', {
          cookie: `session=${studentSessionId}`,
        }),
      })
    );
    expect(forbidden.status).toBe(403);

    const response = await hackathonRegistrationsHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/admin/hackathon-registrations', {
          cookie: `session=${adminSessionId}`,
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      registrants: [
        {
          user_id: starterId,
          display_name: 'Equipo Starter',
          github_profile: 'https://github.com/equipo-starter',
          category: 'starter',
          registered_at: '2026-04-10 10:00:00',
          updated_at: '2026-04-10 10:00:00',
          email: 'starter-registrant@example.com',
        },
        {
          user_id: deployerId,
          display_name: 'Equipo Deployer',
          github_profile: 'https://github.com/equipo-deployer',
          category: 'deployer',
          registered_at: '2026-04-10 10:05:00',
          updated_at: '2026-04-10 10:05:00',
          email: 'deployer-registrant@example.com',
        },
      ],
    });

    const audit = await db
      .prepare("SELECT user_id, action, details FROM audit_log WHERE action = 'admin_hackathon_registrations_list' AND user_id = ?")
      .bind(adminId)
      .first();
    expect(audit).toEqual({
      user_id: adminId,
      action: 'admin_hackathon_registrations_list',
      details: JSON.stringify({ total: 2 }),
    });
  });

  it('requires authentication and returns an empty list when no hackathon forms were submitted', async () => {
    const unauthenticated = await hackathonRegistrationsHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/admin/hackathon-registrations'),
      })
    );

    expect(unauthenticated.status).toBe(401);
    await expect(unauthenticated.json()).resolves.toEqual({ error: 'Not authenticated' });

    const { sessionId: adminSessionId, userId: adminId } = await createAuthenticatedSession(db, {
      email: 'admin-empty-hackathon@example.com',
      role: 'admin',
    });

    const response = await hackathonRegistrationsHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/admin/hackathon-registrations', {
          cookie: `session=${adminSessionId}`,
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ registrants: [] });

    const audit = await db
      .prepare("SELECT user_id, action, details FROM audit_log WHERE action = 'admin_hackathon_registrations_list' AND user_id = ?")
      .bind(adminId)
      .first();
    expect(audit).toEqual({
      user_id: adminId,
      action: 'admin_hackathon_registrations_list',
      details: JSON.stringify({ total: 0 }),
    });
  });

  it('reflects real hackathon form submissions in registration order', async () => {
    const { sessionId: adminSessionId } = await createAuthenticatedSession(db, {
      email: 'admin-form-order@example.com',
      role: 'admin',
    });
    const starter = await createAuthenticatedSession(db, {
      email: 'starter-form@example.com',
      name: 'Starter Form',
      role: 'student',
    });
    const deployer = await createAuthenticatedSession(db, {
      email: 'deployer-form@example.com',
      name: 'Deployer Form',
      role: 'student',
    });

    const starterSubmission = await hackathonRegisterPostHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/hackathon/register', {
          method: 'POST',
          cookie: `session=${starter.sessionId}`,
          body: {
            display_name: 'Equipo Primero',
            github_profile: '@equipo-primero',
            category: 'starter',
          },
        }),
      })
    );

    const deployerSubmission = await hackathonRegisterPostHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/hackathon/register', {
          method: 'POST',
          cookie: `session=${deployer.sessionId}`,
          body: {
            display_name: 'Equipo Segundo',
            github_profile: '@equipo-segundo',
            category: 'deployer',
          },
        }),
      })
    );

    expect(starterSubmission.status).toBe(201);
    expect(deployerSubmission.status).toBe(201);

    await db
      .prepare('UPDATE hackathon_registrations SET registered_at = ?, updated_at = ? WHERE user_id = ?')
      .bind('2026-04-10 09:00:00', '2026-04-10 09:00:00', starter.userId)
      .run();
    await db
      .prepare('UPDATE hackathon_registrations SET registered_at = ?, updated_at = ? WHERE user_id = ?')
      .bind('2026-04-10 09:05:00', '2026-04-10 09:05:00', deployer.userId)
      .run();

    const response = await hackathonRegistrationsHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/admin/hackathon-registrations', {
          cookie: `session=${adminSessionId}`,
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      registrants: [
        {
          user_id: starter.userId,
          display_name: 'Equipo Primero',
          github_profile: 'https://github.com/equipo-primero',
          category: 'starter',
          registered_at: '2026-04-10 09:00:00',
          updated_at: '2026-04-10 09:00:00',
          email: 'starter-form@example.com',
        },
        {
          user_id: deployer.userId,
          display_name: 'Equipo Segundo',
          github_profile: 'https://github.com/equipo-segundo',
          category: 'deployer',
          registered_at: '2026-04-10 09:05:00',
          updated_at: '2026-04-10 09:05:00',
          email: 'deployer-form@example.com',
        },
      ],
    });
  });
});