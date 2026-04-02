import { getAuthenticatedUser } from '../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse } from '../../lib/cors.js';
import { logAudit } from '../../lib/audit.js';
import { checkRateLimit, getClientIP } from '../../lib/rate-limit.js';

export async function onRequestOptions(context) {
  return handleOptions(context.request, context.env);
}

// GET /api/admin/users — Lista usuarios con filtros y paginación
export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;

  const user = await getAuthenticatedUser(db, request);
  if (!user) return errorResponse('Not authenticated', 401, request, env);
  if (user.role !== 'admin') return errorResponse('Forbidden', 403, request, env);

  const rateCheckGet = await checkRateLimit(db, `user:${user.id}:admin`, 'profile');
  if (!rateCheckGet.ok) {
    return new Response(JSON.stringify({ error: 'Too many requests.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': String(rateCheckGet.retryAfter) },
    });
  }

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
  const offset = (page - 1) * limit;
  const rawSearch = url.searchParams.get('search') || '';
  const search = rawSearch.trim().slice(0, 100).replace(/^[%\s]+$/, '');
  const activeOnly = url.searchParams.get('active') !== 'false';

  try {
    let query = `
      SELECT u.id, u.email, u.name, u.display_name, u.role, u.is_active,
             u.created_at, u.last_login_at, u.login_count,
             COUNT(lc.id) as lessons_completed
      FROM users u
      LEFT JOIN lesson_completions lc ON lc.user_id = u.id
      WHERE 1=1
    `;
    const bindings = [];

    if (activeOnly) {
      query += ' AND u.is_active = 1';
    }

    if (search) {
      query += ' AND (u.email LIKE ? OR u.name LIKE ?)';
      bindings.push(`%${search}%`, `%${search}%`);
    }

    query += ' GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    bindings.push(limit, offset);

    const users = await db.prepare(query).bind(...bindings).all();

    // Contar total para paginación
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countBindings = [];
    if (activeOnly) countQuery += ' AND is_active = 1';
    if (search) {
      countQuery += ' AND (email LIKE ? OR name LIKE ?)';
      countBindings.push(`%${search}%`, `%${search}%`);
    }
    const total = await db.prepare(countQuery).bind(...countBindings).first();

    await logAudit(db, {
      userId: user.id,
      action: 'admin_users_list',
      details: { page, limit, search: search || null },
      ip: getClientIP(request),
    });

    return jsonResponse(
      {
        users: users.results.map((u) => ({
          id: u.id,
          email: u.email,
          name: u.display_name || u.name,
          role: u.role,
          is_active: u.is_active === 1,
          created_at: u.created_at,
          last_login_at: u.last_login_at,
          login_count: u.login_count,
          lessons_completed: u.lessons_completed,
        })),
        pagination: {
          page,
          limit,
          total: total.total,
          pages: Math.ceil(total.total / limit),
        },
      },
      200,
      request,
      env
    );
  } catch (err) {
    console.error('Admin users list error:', err.message);
    return errorResponse('Failed to list users', 500, request, env);
  }
}

// PATCH /api/admin/users — Activar/desactivar usuario
export async function onRequestPatch(context) {
  const { request, env } = context;
  const db = env.DB;

  const admin = await getAuthenticatedUser(db, request);
  if (!admin) return errorResponse('Not authenticated', 401, request, env);
  if (admin.role !== 'admin') return errorResponse('Forbidden', 403, request, env);

  const rateCheckPatch = await checkRateLimit(db, `user:${admin.id}:admin`, 'profile');
  if (!rateCheckPatch.ok) {
    return new Response(JSON.stringify({ error: 'Too many requests.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': String(rateCheckPatch.retryAfter) },
    });
  }

  try {
    const body = await request.json();
    const { user_id, is_active } = body;

    if (!user_id || typeof is_active !== 'boolean') {
      return errorResponse('user_id and is_active (boolean) are required', 400, request, env);
    }

    // No permitir que el admin se desactive a sí mismo
    if (user_id === admin.id) {
      return errorResponse('Cannot modify your own account status', 400, request, env);
    }

    await db
      .prepare('UPDATE users SET is_active = ? WHERE id = ?')
      .bind(is_active ? 1 : 0, user_id)
      .run();

    // Si se desactiva, eliminar sesiones activas del usuario
    if (!is_active) {
      await db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(user_id).run();
    }

    await logAudit(db, {
      userId: admin.id,
      action: is_active ? 'admin_user_activated' : 'admin_user_deactivated',
      details: { target_user_id: user_id },
      ip: getClientIP(request),
    });

    return jsonResponse({ ok: true }, 200, request, env);
  } catch (err) {
    console.error('Admin user update error:', err.message);
    return errorResponse('Failed to update user', 500, request, env);
  }
}
