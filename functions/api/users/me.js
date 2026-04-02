import { getAuthenticatedUser, clearSessionCookie } from '../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse, corsHeaders } from '../../lib/cors.js';
import { checkRateLimit, getClientIP } from '../../lib/rate-limit.js';
import { logAudit } from '../../lib/audit.js';

export async function onRequestOptions(context) {
  return handleOptions(context.request, context.env);
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;

  const user = await getAuthenticatedUser(db, request);
  if (!user) return errorResponse('Not authenticated', 401, request, env);

  // Obtener progreso
  const progress = await db
    .prepare('SELECT COUNT(*) as count FROM lesson_completions WHERE user_id = ?')
    .bind(user.id)
    .first();

  // Obtener enrollment
  const enrollment = await db
    .prepare('SELECT season, enrolled_at FROM enrollments WHERE user_id = ? ORDER BY enrolled_at DESC LIMIT 1')
    .bind(user.id)
    .first();

  return jsonResponse(
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
        created_at: user.created_at,
      },
      progress: {
        count: progress.count,
        percent: Math.round((progress.count / 30) * 1000) / 10,
      },
      enrollment: enrollment || null,
    },
    200,
    request,
    env
  );
}

export async function onRequestPatch(context) {
  const { request, env } = context;
  const db = env.DB;

  const user = await getAuthenticatedUser(db, request);
  if (!user) return errorResponse('Not authenticated', 401, request, env);

  // Rate limiting: máximo 20 actualizaciones de perfil por minuto
  const rateCheck = await checkRateLimit(db, `user:${user.id}:profile`, 'profile');
  if (!rateCheck.ok) {
    return new Response(JSON.stringify({ error: 'Too many requests. Try again later.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': String(rateCheck.retryAfter) },
    });
  }

  try {
    const body = await request.json();
    const { display_name } = body;

    if (display_name !== undefined) {
      if (typeof display_name !== 'string') {
        return errorResponse('display_name must be a string', 400, request, env);
      }

      const trimmed = display_name.trim();

      if (trimmed.length > 100) {
        return errorResponse('display_name must be 100 characters or less', 400, request, env);
      }

      // Sanitización estricta: rechazar caracteres HTML peligrosos
      // Un nombre no necesita <, >, &, ", ' — si los contiene, es un intento de inyección
      if (/[<>&"']/.test(trimmed)) {
        return errorResponse('display_name contains invalid characters', 400, request, env);
      }
      // Eliminar null bytes y caracteres de control (excepto espacios normales)
      const sanitized = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

      await db
        .prepare('UPDATE users SET display_name = ? WHERE id = ?')
        .bind(sanitized || null, user.id)
        .run();

      await logAudit(db, { userId: user.id, action: 'profile_update', details: { field: 'display_name' } });
    }

    return jsonResponse({ ok: true }, 200, request, env);
  } catch (err) {
    console.error('Profile update error:', err.message);
    return errorResponse('Failed to update profile', 500, request, env);
  }
}

export async function onRequestDelete(context) {
  const { request, env } = context;
  const db = env.DB;

  const user = await getAuthenticatedUser(db, request);
  if (!user) return errorResponse('Not authenticated', 401, request, env);

  let deleteBody;
  try {
    deleteBody = await request.json();
  } catch {
    return errorResponse('Cuerpo de la petición inválido', 400, request, env);
  }
  if (!deleteBody?.confirm) {
    return errorResponse('Se requiere confirm: true para eliminar la cuenta', 400, request, env);
  }

  try {
    // Registrar antes de eliminar
    await logAudit(db, {
      userId: user.id,
      action: 'account_deleted',
      details: { email: user.email },
      ip: getClientIP(request),
    });

    // Eliminar todas las sesiones activas
    await db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(user.id).run();

    // Soft-delete: anonimizar datos personales (GDPR)
    await db
      .prepare(
        `UPDATE users
         SET email = ?, name = 'Usuario eliminado', display_name = NULL,
             picture_url = NULL, is_active = 0, google_sub = ?
         WHERE id = ?`
      )
      .bind(`deleted_${user.id}@deleted.invalid`, `deleted_${user.id}`, user.id)
      .run();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': clearSessionCookie(),
        ...corsHeaders(request, env),
      },
    });
  } catch (err) {
    console.error('Delete account error:', err.message);
    return errorResponse('Failed to delete account', 500, request, env);
  }
}
