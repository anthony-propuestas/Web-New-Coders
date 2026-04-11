import { getAuthenticatedUser } from '../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse } from '../../lib/cors.js';
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
  if (user.role !== 'admin') return errorResponse('Forbidden', 403, request, env);

  const rateCheck = await checkRateLimit(db, `user:${user.id}:admin`, 'profile');
  if (!rateCheck.ok) {
    return new Response(JSON.stringify({ error: 'Too many requests.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': String(rateCheck.retryAfter) },
    });
  }

  try {
    const registrants = await db
      .prepare(
        `SELECT hr.user_id, hr.display_name, hr.github_profile, hr.category, hr.registered_at, hr.updated_at,
                u.email
         FROM hackathon_registrations hr
         JOIN users u ON u.id = hr.user_id
         ORDER BY hr.registered_at ASC, hr.user_id ASC`
      )
      .all();

    await logAudit(db, {
      userId: user.id,
      action: 'admin_hackathon_registrations_list',
      details: { total: registrants.results?.length || 0 },
      ip: getClientIP(request),
    });

    return jsonResponse(
      {
        registrants: (registrants.results || []).map((entry) => ({
          user_id: entry.user_id,
          display_name: entry.display_name,
          github_profile: entry.github_profile,
          category: entry.category,
          registered_at: entry.registered_at,
          updated_at: entry.updated_at,
          email: entry.email,
        })),
      },
      200,
      request,
      env
    );
  } catch (err) {
    console.error('Admin hackathon registrations list error:', err.message);
    return errorResponse('Failed to list hackathon registrations', 500, request, env);
  }
}