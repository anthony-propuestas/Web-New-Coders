import { getAuthenticatedUser } from '../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse } from '../../lib/cors.js';
import { checkRateLimit, getClientIP } from '../../lib/rate-limit.js';
import { logAudit } from '../../lib/audit.js';

const VALID_CATEGORIES = new Set(['starter', 'deployer']);

function sanitizeDisplayName(value) {
  if (typeof value !== 'string') {
    return { error: 'display_name must be a string' };
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return { error: 'display_name is required' };
  }

  if (trimmed.length > 100) {
    return { error: 'display_name must be 100 characters or less' };
  }

  if (/[<>&"']/.test(trimmed)) {
    return { error: 'display_name contains invalid characters' };
  }

  const sanitized = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  if (!sanitized) {
    return { error: 'display_name is required' };
  }

  return { value: sanitized };
}

function normalizeGithubProfile(value) {
  if (typeof value !== 'string') {
    return { error: 'github_profile must be a string' };
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return { error: 'github_profile is required' };
  }

  if (trimmed.length > 255) {
    return { error: 'github_profile must be 255 characters or less' };
  }

  let handle = trimmed;

  if (/^https?:\/\//i.test(trimmed)) {
    let parsed;
    try {
      parsed = new URL(trimmed);
    } catch {
      return { error: 'github_profile must be a valid GitHub profile' };
    }

    const hostname = parsed.hostname.toLowerCase();
    if (hostname !== 'github.com' && hostname !== 'www.github.com') {
      return { error: 'github_profile must be a valid GitHub profile' };
    }

    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments.length !== 1) {
      return { error: 'github_profile must point to a GitHub user profile' };
    }

    handle = segments[0];
  }

  if (handle.startsWith('@')) {
    handle = handle.slice(1);
  }

  if (!/^[A-Za-z\d](?:[A-Za-z\d-]{0,37}[A-Za-z\d])?$/.test(handle)) {
    return { error: 'github_profile must be a valid GitHub profile' };
  }

  return { value: `https://github.com/${handle}` };
}

function normalizeCategory(value) {
  if (typeof value !== 'string') {
    return { error: 'category must be a string' };
  }

  const normalized = value.trim().toLowerCase();
  if (!VALID_CATEGORIES.has(normalized)) {
    return { error: 'category must be starter or deployer' };
  }

  return { value: normalized };
}

export async function onRequestOptions(context) {
  return handleOptions(context.request, context.env);
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;

  const user = await getAuthenticatedUser(db, request);
  if (!user) return errorResponse('Not authenticated', 401, request, env);

  const registration = await db
    .prepare(
      `SELECT display_name, github_profile, category, registered_at, updated_at
       FROM hackathon_registrations
       WHERE user_id = ?`
    )
    .bind(user.id)
    .first();

  return jsonResponse({ registration: registration || null }, 200, request, env);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;

  const user = await getAuthenticatedUser(db, request);
  if (!user) return errorResponse('Not authenticated', 401, request, env);

  const rateCheck = await checkRateLimit(db, `user:${user.id}:hackathon`, 'hackathon');
  if (!rateCheck.ok) {
    return new Response(JSON.stringify({ error: 'Too many requests. Try again later.' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(rateCheck.retryAfter),
      },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid request body', 400, request, env);
  }

  const displayName = sanitizeDisplayName(body?.display_name);
  if (displayName.error) return errorResponse(displayName.error, 400, request, env);

  const githubProfile = normalizeGithubProfile(body?.github_profile);
  if (githubProfile.error) return errorResponse(githubProfile.error, 400, request, env);

  const category = normalizeCategory(body?.category);
  if (category.error) return errorResponse(category.error, 400, request, env);

  const existing = await db
    .prepare('SELECT id FROM hackathon_registrations WHERE user_id = ?')
    .bind(user.id)
    .first();

  try {
    await db
      .prepare(
        `INSERT INTO hackathon_registrations (user_id, display_name, github_profile, category)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET
           display_name = excluded.display_name,
           github_profile = excluded.github_profile,
           category = excluded.category,
           updated_at = datetime('now')`
      )
      .bind(user.id, displayName.value, githubProfile.value, category.value)
      .run();

    await db
      .prepare('UPDATE users SET display_name = ?, role = ? WHERE id = ?')
      .bind(displayName.value, 'new_hacker', user.id)
      .run();

    await logAudit(db, {
      userId: user.id,
      action: existing ? 'hackathon_registration_updated' : 'hackathon_registration_created',
      details: {
        category: category.value,
        github_profile: githubProfile.value,
      },
      ip: getClientIP(request),
    });

    return jsonResponse(
      {
        ok: true,
        registration: {
          display_name: displayName.value,
          github_profile: githubProfile.value,
          category: category.value,
        },
        user: {
          id: user.id,
          name: displayName.value,
          email: user.email,
          picture: user.picture,
          role: 'new_hacker',
          created_at: user.created_at,
        },
      },
      existing ? 200 : 201,
      request,
      env
    );
  } catch (err) {
    console.error('Hackathon registration error:', err.message);
    return errorResponse('Failed to save hackathon registration', 500, request, env);
  }
}