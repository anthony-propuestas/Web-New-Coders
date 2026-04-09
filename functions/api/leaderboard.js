// Leaderboard API endpoint for top users of the current season
// Returns top 10 users with most lessons completed in the current enrollment season
// Auth required

import { getAuthenticatedUser } from '../lib/session.js';


export async function onRequest(context) {
  const { DB, request } = context;
  try {
    const session = await getAuthenticatedUser(DB, request);
    if (!session || !session.id) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Get current season (latest season_id from enrollments)
    const seasonRes = await DB.prepare(`
      SELECT season_id FROM enrollments
      WHERE user_id = ?
      ORDER BY enrolled_at DESC LIMIT 1
    `).bind(session.id).first();
    if (!seasonRes || !seasonRes.season_id) {
      return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    const seasonId = seasonRes.season_id;

    // Get top 10 users by lessons completed in this season
    const result = await DB.prepare(`
      SELECT u.display_name, COUNT(lc.day) as completions
      FROM enrollments e
      JOIN users u ON u.id = e.user_id
      LEFT JOIN lesson_completions lc ON lc.user_id = e.user_id AND lc.season_id = e.season_id
      WHERE e.season_id = ?
      GROUP BY u.display_name
      ORDER BY completions DESC, u.display_name ASC
      LIMIT 10
    `).bind(seasonId).all();

    return new Response(JSON.stringify(result.results), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (err) {
    let message = 'Error interno en leaderboard';
    if (err && err.message) message += ': ' + err.message;
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
