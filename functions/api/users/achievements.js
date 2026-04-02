import { getAuthenticatedUser } from '../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse } from '../../lib/cors.js';

export async function onRequestOptions(context) {
  return handleOptions(context.request, context.env);
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;

  const user = await getAuthenticatedUser(db, request);
  if (!user) return errorResponse('Not authenticated', 401, request, env);

  try {
    const achievements = await db
      .prepare('SELECT type, earned_at FROM achievements WHERE user_id = ? ORDER BY earned_at')
      .bind(user.id)
      .all();

    return jsonResponse({ achievements: achievements.results }, 200, request, env);
  } catch (err) {
    console.error('Achievements error:', err.message);
    return errorResponse('Failed to get achievements', 500, request, env);
  }
}
