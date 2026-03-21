import { getAuthenticatedUser } from '../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse } from '../../lib/cors.js';

export async function onRequestOptions(context) {
  return handleOptions(context.request);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;

  const user = await getAuthenticatedUser(db, request);
  if (!user) return errorResponse('Not authenticated', 401, request);

  try {
    const body = await request.json();
    const { completedDays } = body;

    if (!Array.isArray(completedDays)) {
      return errorResponse('completedDays must be an array', 400, request);
    }

    // Filtrar y validar días
    const validDays = completedDays.filter(
      (day) => Number.isInteger(day) && day >= 1 && day <= 30
    );

    if (validDays.length === 0) {
      return jsonResponse({ ok: true, migrated: 0 }, 200, request);
    }

    // Insertar cada día (ignorar duplicados)
    const stmt = db.prepare(
      'INSERT OR IGNORE INTO lesson_completions (user_id, day_number) VALUES (?, ?)'
    );

    const batch = validDays.map((day) => stmt.bind(user.id, day));
    await db.batch(batch);

    return jsonResponse({ ok: true, migrated: validDays.length }, 200, request);
  } catch (err) {
    console.error('Migration error:', err.message);
    return errorResponse('Migration failed', 500, request);
  }
}
