import { getAuthenticatedUser } from '../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse } from '../../lib/cors.js';

function calculateStreaks(dates) {
  if (dates.length === 0) return { current_streak: 0, longest_streak: 0 };

  // Obtener fechas únicas ordenadas descendentemente
  const uniqueDays = [...new Set(dates.map((d) => d.split('T')[0]))].sort().reverse();

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400_000).toISOString().split('T')[0];

  // Racha actual: contar hacia atrás desde hoy o ayer
  let currentStreak = 0;
  let checkDate = uniqueDays[0] === today || uniqueDays[0] === yesterday ? uniqueDays[0] : null;

  if (checkDate) {
    for (const day of uniqueDays) {
      if (day === checkDate) {
        currentStreak++;
        const prev = new Date(checkDate);
        prev.setDate(prev.getDate() - 1);
        checkDate = prev.toISOString().split('T')[0];
      } else if (day < checkDate) {
        break;
      }
    }
  }

  // Mejor racha: escanear todas las fechas
  let longestStreak = 0;
  let streak = 1;
  const sorted = [...uniqueDays].sort();

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = (curr - prev) / 86400_000;

    if (diffDays === 1) {
      streak++;
    } else {
      longestStreak = Math.max(longestStreak, streak);
      streak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, streak);

  return { current_streak: currentStreak, longest_streak: longestStreak };
}

export async function onRequestOptions(context) {
  return handleOptions(context.request);
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;

  const user = await getAuthenticatedUser(db, request);
  if (!user) return errorResponse('Not authenticated', 401, request);

  const rows = await db
    .prepare('SELECT day_number, completed_at FROM lesson_completions WHERE user_id = ? ORDER BY day_number')
    .bind(user.id)
    .all();

  const completed = rows.results.map((r) => r.day_number);
  const dates = rows.results.map((r) => r.completed_at);
  const { current_streak, longest_streak } = calculateStreaks(dates);
  const lastCompletion = dates.length > 0 ? dates[dates.length - 1] : null;

  return jsonResponse(
    {
      completed,
      count: completed.length,
      percent: Math.round((completed.length / 30) * 1000) / 10,
      current_streak,
      longest_streak,
      last_completed_at: lastCompletion,
    },
    200,
    request
  );
}
