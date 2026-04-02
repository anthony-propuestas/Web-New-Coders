import { getAuthenticatedUser } from '../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse } from '../../lib/cors.js';
import { checkRateLimit } from '../../lib/rate-limit.js';

// Definición de logros y sus condiciones
const ACHIEVEMENT_CHECKS = [
  {
    type: 'primer_dia',
    label: 'Primer Paso',
    check: (completedCount) => completedCount >= 1,
  },
  {
    type: 'semana_html',
    label: 'Maestro HTML',
    check: (completedCount) => completedCount >= 7,
  },
  {
    type: 'semana_css',
    label: 'Maestro CSS',
    check: (completedCount) => completedCount >= 14,
  },
  {
    type: 'semana_js',
    label: 'Maestro JS',
    check: (completedCount) => completedCount >= 21,
  },
  {
    type: 'completado',
    label: 'Dev Path Completado',
    check: (completedCount) => completedCount >= 30,
  },
];

async function checkAndGrantAchievements(db, userId) {
  const progress = await db
    .prepare('SELECT COUNT(*) as count FROM lesson_completions WHERE user_id = ?')
    .bind(userId)
    .first();

  const count = progress?.count ?? 0;
  const newAchievements = [];

  for (const achievement of ACHIEVEMENT_CHECKS) {
    if (!achievement.check(count)) continue;

    try {
      const result = await db
        .prepare('INSERT OR IGNORE INTO achievements (user_id, type) VALUES (?, ?)')
        .bind(userId, achievement.type)
        .run();

      if (result.meta.changes > 0) {
        newAchievements.push({ type: achievement.type, label: achievement.label });
      }
    } catch (err) {
      console.error('Achievement insert error:', err.message);
    }
  }

  // Racha de 7 días: verificar si existe racha actual >= 7
  try {
    const { current_streak } = await getStreakData(db, userId);
    if (current_streak >= 7) {
      const result = await db
        .prepare('INSERT OR IGNORE INTO achievements (user_id, type) VALUES (?, ?)')
        .bind(userId, 'racha_7')
        .run();
      if (result.meta.changes > 0) {
        newAchievements.push({ type: 'racha_7', label: 'Racha de 7 días' });
      }
    }
  } catch (err) {
    console.error('Streak achievement error:', err.message);
  }

  return newAchievements;
}

async function getStreakData(db, userId) {
  const completions = await db
    .prepare(
      'SELECT completed_at FROM lesson_completions WHERE user_id = ? ORDER BY completed_at DESC'
    )
    .bind(userId)
    .all();

  const dates = completions.results.map((r) => r.completed_at.split('T')[0]);
  const uniqueDates = [...new Set(dates)].sort().reverse();

  if (uniqueDates.length === 0) return { current_streak: 0 };

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const mostRecent = uniqueDates[0];

  if (mostRecent !== today && mostRecent !== yesterday) return { current_streak: 0 };

  let streak = 0;
  let checkDate = new Date(mostRecent);
  for (const date of uniqueDates) {
    const d = new Date(date);
    const diff = Math.round((checkDate - d) / 86400000);
    if (diff === 0) { streak++; checkDate = d; }
    else if (diff === 1) { streak++; checkDate = d; }
    else break;
  }

  return { current_streak: streak };
}

export async function onRequestOptions(context) {
  return handleOptions(context.request, context.env);
}

export async function onRequestPost(context) {
  const { request, env, params } = context;
  const db = env.DB;

  const user = await getAuthenticatedUser(db, request);
  if (!user) return errorResponse('Not authenticated', 401, request, env);

  // Rate limiting: máximo 30 peticiones de progreso por minuto
  const rateCheck = await checkRateLimit(db, `user:${user.id}:progress`, 'progress');
  if (!rateCheck.ok) {
    return new Response(JSON.stringify({ error: 'Too many requests. Try again later.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': String(rateCheck.retryAfter) },
    });
  }

  const dayNumber = parseInt(params.day, 10);

  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 30) {
    return errorResponse('Invalid day number. Must be between 1 and 30.', 400, request, env);
  }

  try {
    await db
      .prepare('INSERT OR IGNORE INTO lesson_completions (user_id, day_number) VALUES (?, ?)')
      .bind(user.id, dayNumber)
      .run();

    // Verificar y otorgar logros nuevos
    const newAchievements = await checkAndGrantAchievements(db, user.id);

    return jsonResponse({ ok: true, day: dayNumber, new_achievements: newAchievements }, 200, request, env);
  } catch (err) {
    console.error('Progress error:', err.message);
    return errorResponse('Failed to save progress', 500, request, env);
  }
}
