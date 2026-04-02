import { getAuthenticatedUser } from '../../lib/session.js';
import { handleOptions, errorResponse, corsHeaders } from '../../lib/cors.js';
import { logAudit } from '../../lib/audit.js';
import { checkRateLimit, getClientIP } from '../../lib/rate-limit.js';

export async function onRequestOptions(context) {
  return handleOptions(context.request, context.env);
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;

  const user = await getAuthenticatedUser(db, request);
  if (!user) return errorResponse('Not authenticated', 401, request, env);

  const rateCheck = await checkRateLimit(db, `user:${user.id}:export`, 'profile');
  if (!rateCheck.ok) {
    return new Response(JSON.stringify({ error: 'Too many requests. Try again later.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': String(rateCheck.retryAfter) },
    });
  }

  try {
    // Obtener progreso completo
    const completions = await db
      .prepare('SELECT day_number, completed_at FROM lesson_completions WHERE user_id = ? ORDER BY day_number')
      .bind(user.id)
      .all();

    // Obtener inscripciones
    const enrollments = await db
      .prepare('SELECT season, enrolled_at FROM enrollments WHERE user_id = ?')
      .bind(user.id)
      .all();

    // Obtener logros
    const achievements = await db
      .prepare('SELECT type, earned_at FROM achievements WHERE user_id = ? ORDER BY earned_at')
      .bind(user.id)
      .all();

    // Obtener sesiones activas (sin IDs por seguridad)
    const sessions = await db
      .prepare('SELECT created_at, expires_at, last_used_at FROM sessions WHERE user_id = ?')
      .bind(user.id)
      .all();

    const exportData = {
      exported_at: new Date().toISOString(),
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
      progress: {
        lessons_completed: completions.results,
        total: completions.results.length,
      },
      enrollments: enrollments.results,
      achievements: achievements.results,
      active_sessions: sessions.results.length,
    };

    await logAudit(db, {
      userId: user.id,
      action: 'data_export',
      ip: getClientIP(request),
    });

    return new Response(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="newcoders-datos-${user.id}.json"`,
        ...corsHeaders(request, env),
      },
    });
  } catch (err) {
    console.error('Export error:', err.message);
    return errorResponse('Failed to export data', 500, request, env);
  }
}
