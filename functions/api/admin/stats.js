import { getAuthenticatedUser } from '../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse } from '../../lib/cors.js';
import { logAudit } from '../../lib/audit.js';
import { getClientIP } from '../../lib/rate-limit.js';

export async function onRequestOptions(context) {
  return handleOptions(context.request);
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;

  const user = await getAuthenticatedUser(db, request);
  if (!user) return errorResponse('Not authenticated', 401, request);

  if (user.role !== 'admin') {
    return errorResponse('Forbidden', 403, request);
  }

  // Registrar acceso al panel de admin
  await logAudit(db, {
    userId: user.id,
    action: 'admin_stats_view',
    ip: getClientIP(request),
  });

  // Total de usuarios
  const totalUsers = await db.prepare('SELECT COUNT(*) as count FROM users WHERE is_active = 1').first();

  // Activos últimos 7 días
  const active7 = await db
    .prepare(
      `SELECT COUNT(*) as count FROM users
       WHERE is_active = 1 AND last_login_at >= datetime('now', '-7 days')`
    )
    .first();

  // Activos últimos 30 días
  const active30 = await db
    .prepare(
      `SELECT COUNT(*) as count FROM users
       WHERE is_active = 1 AND last_login_at >= datetime('now', '-30 days')`
    )
    .first();

  // Tasa de completado por lección
  const completionsByLesson = await db
    .prepare(
      `SELECT day_number, COUNT(*) as completions
       FROM lesson_completions
       GROUP BY day_number
       ORDER BY day_number`
    )
    .all();

  const totalActive = totalUsers.count || 1;
  const completionRate = completionsByLesson.results.map((r) => ({
    day: r.day_number,
    completions: r.completions,
    rate: Math.round((r.completions / totalActive) * 1000) / 10,
  }));

  // Progreso promedio
  const avgProgress = await db
    .prepare(
      `SELECT AVG(cnt) as avg_count FROM (
         SELECT user_id, COUNT(*) as cnt
         FROM lesson_completions
         GROUP BY user_id
       )`
    )
    .first();

  // Inscripciones por temporada
  const enrollmentsBySeason = await db
    .prepare(
      `SELECT season, COUNT(*) as count
       FROM enrollments
       GROUP BY season
       ORDER BY season`
    )
    .all();

  const seasonMap = {};
  for (const row of enrollmentsBySeason.results) {
    seasonMap[row.season] = row.count;
  }

  return jsonResponse(
    {
      total_users: totalUsers.count,
      active_last_7_days: active7.count,
      active_last_30_days: active30.count,
      completion_rate_by_lesson: completionRate,
      avg_progress_percent: avgProgress.avg_count
        ? Math.round((avgProgress.avg_count / 30) * 1000) / 10
        : 0,
      enrollments_by_season: seasonMap,
    },
    200,
    request
  );
}
