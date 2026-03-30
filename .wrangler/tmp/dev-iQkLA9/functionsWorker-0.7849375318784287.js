var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-WcDaXQ/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// .wrangler/tmp/pages-WmGugp/functionsWorker-0.7849375318784287.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
function stripCfConnectingIPHeader2(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader2, "stripCfConnectingIPHeader");
__name2(stripCfConnectingIPHeader2, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader2.apply(null, argArray)
    ]);
  }
});
var SESSION_DURATION_HOURS = 72;
var IDLE_TIMEOUT_HOURS = 24;
function generateSessionId() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}
__name(generateSessionId, "generateSessionId");
__name2(generateSessionId, "generateSessionId");
function sessionCookie(sessionId, maxAge = SESSION_DURATION_HOURS * 3600) {
  return `session=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=${maxAge}`;
}
__name(sessionCookie, "sessionCookie");
__name2(sessionCookie, "sessionCookie");
function clearSessionCookie() {
  return "session=; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=0";
}
__name(clearSessionCookie, "clearSessionCookie");
__name2(clearSessionCookie, "clearSessionCookie");
function getSessionId(request) {
  const cookie = request.headers.get("Cookie") || "";
  const match2 = cookie.match(/(?:^|;\s*)session=([a-f0-9]{64})/);
  return match2 ? match2[1] : null;
}
__name(getSessionId, "getSessionId");
__name2(getSessionId, "getSessionId");
async function getAuthenticatedUser(db, request) {
  const sessionId = getSessionId(request);
  if (!sessionId)
    return null;
  const row = await db.prepare(
    `SELECT u.id, u.google_sub, u.email, u.name, u.display_name, u.picture_url, u.role, u.created_at,
              s.expires_at, s.last_used_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND u.is_active = 1`
  ).bind(sessionId).first();
  if (!row)
    return null;
  const now = /* @__PURE__ */ new Date();
  if (new Date(row.expires_at) < now) {
    await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
    return null;
  }
  if (row.last_used_at) {
    const lastUsed = new Date(row.last_used_at);
    const idleHours = (now.getTime() - lastUsed.getTime()) / (1e3 * 60 * 60);
    if (idleHours > IDLE_TIMEOUT_HOURS) {
      await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
      return null;
    }
  }
  await db.prepare("UPDATE sessions SET last_used_at = datetime('now') WHERE id = ?").bind(sessionId).run();
  return {
    id: row.id,
    google_sub: row.google_sub,
    email: row.email,
    name: row.display_name || row.name,
    picture: row.picture_url,
    role: row.role,
    created_at: row.created_at
  };
}
__name(getAuthenticatedUser, "getAuthenticatedUser");
__name2(getAuthenticatedUser, "getAuthenticatedUser");
var ALLOWED_ORIGIN = "https://newcoders.org";
function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const isAllowed = origin === ALLOWED_ORIGIN || origin === "http://localhost:5173" || origin === "http://localhost:8788";
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true"
  };
}
__name(corsHeaders, "corsHeaders");
__name2(corsHeaders, "corsHeaders");
function handleOptions(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request)
  });
}
__name(handleOptions, "handleOptions");
__name2(handleOptions, "handleOptions");
function jsonResponse(data, status = 200, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(request)
    }
  });
}
__name(jsonResponse, "jsonResponse");
__name2(jsonResponse, "jsonResponse");
function errorResponse(message, status = 400, request) {
  return jsonResponse({ error: message }, status, request);
}
__name(errorResponse, "errorResponse");
__name2(errorResponse, "errorResponse");
async function logAudit(db, { userId = null, action, details = null, ip = null }) {
  try {
    await db.prepare(
      `INSERT INTO audit_log (user_id, action, details, ip_address)
         VALUES (?, ?, ?, ?)`
    ).bind(userId, action, details ? JSON.stringify(details) : null, ip).run();
  } catch (err) {
    console.error("Audit log error:", err.message);
  }
}
__name(logAudit, "logAudit");
__name2(logAudit, "logAudit");
var LIMITS = {
  auth: { max: 10, windowSeconds: 60 },
  // 10 logins/minuto por IP
  progress: { max: 30, windowSeconds: 60 },
  // 30 peticiones/minuto por usuario
  migrate: { max: 3, windowSeconds: 300 },
  // 3 migraciones/5min por usuario
  profile: { max: 20, windowSeconds: 60 }
  // 20 actualizaciones/minuto por usuario
};
async function checkRateLimit(db, key, type) {
  const limit = LIMITS[type];
  if (!limit)
    return { ok: true };
  try {
    const windowStart = new Date(Date.now() - limit.windowSeconds * 1e3).toISOString();
    await db.prepare(
      `INSERT INTO rate_limit (key, count, window_start)
         VALUES (?, 1, datetime('now'))
         ON CONFLICT(key) DO UPDATE SET
           count = CASE
             WHEN window_start < ? THEN 1
             ELSE count + 1
           END,
           window_start = CASE
             WHEN window_start < ? THEN datetime('now')
             ELSE window_start
           END`
    ).bind(key, windowStart, windowStart).run();
    const row = await db.prepare("SELECT count FROM rate_limit WHERE key = ?").bind(key).first();
    if (row && row.count > limit.max) {
      return { ok: false, retryAfter: limit.windowSeconds };
    }
    return { ok: true };
  } catch (err) {
    console.error("Rate limit error:", err.message);
    return { ok: true };
  }
}
__name(checkRateLimit, "checkRateLimit");
__name2(checkRateLimit, "checkRateLimit");
function getClientIP(request) {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() || "unknown";
}
__name(getClientIP, "getClientIP");
__name2(getClientIP, "getClientIP");
async function onRequestOptions(context) {
  return handleOptions(context.request);
}
__name(onRequestOptions, "onRequestOptions");
__name2(onRequestOptions, "onRequestOptions");
async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;
  const user = await getAuthenticatedUser(db, request);
  if (!user)
    return errorResponse("Not authenticated", 401, request);
  if (user.role !== "admin") {
    return errorResponse("Forbidden", 403, request);
  }
  await logAudit(db, {
    userId: user.id,
    action: "admin_stats_view",
    ip: getClientIP(request)
  });
  const totalUsers = await db.prepare("SELECT COUNT(*) as count FROM users WHERE is_active = 1").first();
  const active7 = await db.prepare(
    `SELECT COUNT(*) as count FROM users
       WHERE is_active = 1 AND last_login_at >= datetime('now', '-7 days')`
  ).first();
  const active30 = await db.prepare(
    `SELECT COUNT(*) as count FROM users
       WHERE is_active = 1 AND last_login_at >= datetime('now', '-30 days')`
  ).first();
  const completionsByLesson = await db.prepare(
    `SELECT day_number, COUNT(*) as completions
       FROM lesson_completions
       GROUP BY day_number
       ORDER BY day_number`
  ).all();
  const totalActive = totalUsers.count || 1;
  const completionRate = completionsByLesson.results.map((r) => ({
    day: r.day_number,
    completions: r.completions,
    rate: Math.round(r.completions / totalActive * 1e3) / 10
  }));
  const avgProgress = await db.prepare(
    `SELECT AVG(cnt) as avg_count FROM (
         SELECT user_id, COUNT(*) as cnt
         FROM lesson_completions
         GROUP BY user_id
       )`
  ).first();
  const enrollmentsBySeason = await db.prepare(
    `SELECT season, COUNT(*) as count
       FROM enrollments
       GROUP BY season
       ORDER BY season`
  ).all();
  const seasonMap = {};
  for (const row of enrollmentsBySeason.results) {
    seasonMap[row.season] = row.count;
  }
  return jsonResponse(
    {
      total_users: totalUsers.count,
      active_last_7_days: active7.count,
      active_last_30_days: active30.count,
      completion_rate_by_lesson: completionRate,
      avg_progress_percent: avgProgress.avg_count ? Math.round(avgProgress.avg_count / 30 * 1e3) / 10 : 0,
      enrollments_by_season: seasonMap
    },
    200,
    request
  );
}
__name(onRequestGet, "onRequestGet");
__name2(onRequestGet, "onRequestGet");
async function onRequestOptions2(context) {
  return handleOptions(context.request);
}
__name(onRequestOptions2, "onRequestOptions2");
__name2(onRequestOptions2, "onRequestOptions");
async function onRequestGet2(context) {
  const { request, env } = context;
  const db = env.DB;
  const user = await getAuthenticatedUser(db, request);
  if (!user)
    return errorResponse("Not authenticated", 401, request);
  if (user.role !== "admin")
    return errorResponse("Forbidden", 403, request);
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));
  const offset = (page - 1) * limit;
  const search = url.searchParams.get("search") || "";
  const activeOnly = url.searchParams.get("active") !== "false";
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
      query += " AND u.is_active = 1";
    }
    if (search) {
      query += " AND (u.email LIKE ? OR u.name LIKE ?)";
      bindings.push(`%${search}%`, `%${search}%`);
    }
    query += " GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?";
    bindings.push(limit, offset);
    const users = await db.prepare(query).bind(...bindings).all();
    let countQuery = "SELECT COUNT(*) as total FROM users WHERE 1=1";
    const countBindings = [];
    if (activeOnly)
      countQuery += " AND is_active = 1";
    if (search) {
      countQuery += " AND (email LIKE ? OR name LIKE ?)";
      countBindings.push(`%${search}%`, `%${search}%`);
    }
    const total = await db.prepare(countQuery).bind(...countBindings).first();
    await logAudit(db, {
      userId: user.id,
      action: "admin_users_list",
      details: { page, limit, search: search || null },
      ip: getClientIP(request)
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
          lessons_completed: u.lessons_completed
        })),
        pagination: {
          page,
          limit,
          total: total.total,
          pages: Math.ceil(total.total / limit)
        }
      },
      200,
      request
    );
  } catch (err) {
    console.error("Admin users list error:", err.message);
    return errorResponse("Failed to list users", 500, request);
  }
}
__name(onRequestGet2, "onRequestGet2");
__name2(onRequestGet2, "onRequestGet");
async function onRequestPatch(context) {
  const { request, env } = context;
  const db = env.DB;
  const admin = await getAuthenticatedUser(db, request);
  if (!admin)
    return errorResponse("Not authenticated", 401, request);
  if (admin.role !== "admin")
    return errorResponse("Forbidden", 403, request);
  try {
    const body = await request.json();
    const { user_id, is_active } = body;
    if (!user_id || typeof is_active !== "boolean") {
      return errorResponse("user_id and is_active (boolean) are required", 400, request);
    }
    if (user_id === admin.id) {
      return errorResponse("Cannot modify your own account status", 400, request);
    }
    await db.prepare("UPDATE users SET is_active = ? WHERE id = ?").bind(is_active ? 1 : 0, user_id).run();
    if (!is_active) {
      await db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(user_id).run();
    }
    await logAudit(db, {
      userId: admin.id,
      action: is_active ? "admin_user_activated" : "admin_user_deactivated",
      details: { target_user_id: user_id },
      ip: getClientIP(request)
    });
    return jsonResponse({ ok: true }, 200, request);
  } catch (err) {
    console.error("Admin user update error:", err.message);
    return errorResponse("Failed to update user", 500, request);
  }
}
__name(onRequestPatch, "onRequestPatch");
__name2(onRequestPatch, "onRequestPatch");
var GOOGLE_CERTS_URL = "https://www.googleapis.com/oauth2/v3/certs";
var GOOGLE_ISSUERS = ["accounts.google.com", "https://accounts.google.com"];
var cachedCerts = null;
var cachedAt = 0;
var CACHE_DURATION_MS = 36e5;
function base64UrlDecode(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  return new Uint8Array([...binary].map((c) => c.charCodeAt(0)));
}
__name(base64UrlDecode, "base64UrlDecode");
__name2(base64UrlDecode, "base64UrlDecode");
function decodeJwtParts(token) {
  const parts = token.split(".");
  if (parts.length !== 3)
    throw new Error("Invalid JWT structure");
  const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[0])));
  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[1])));
  return { header, payload, signatureB64: parts[2], signedContent: `${parts[0]}.${parts[1]}` };
}
__name(decodeJwtParts, "decodeJwtParts");
__name2(decodeJwtParts, "decodeJwtParts");
async function fetchGoogleCerts() {
  const now = Date.now();
  if (cachedCerts && now - cachedAt < CACHE_DURATION_MS) {
    return cachedCerts;
  }
  const res = await fetch(GOOGLE_CERTS_URL);
  if (!res.ok)
    throw new Error("Failed to fetch Google certs");
  const jwks = await res.json();
  cachedCerts = jwks.keys;
  cachedAt = now;
  return cachedCerts;
}
__name(fetchGoogleCerts, "fetchGoogleCerts");
__name2(fetchGoogleCerts, "fetchGoogleCerts");
async function importKey(jwk) {
  return crypto.subtle.importKey(
    "jwk",
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: jwk.alg, ext: true },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
}
__name(importKey, "importKey");
__name2(importKey, "importKey");
async function verifyGoogleJwt(token, clientId) {
  const { header, payload, signatureB64, signedContent } = decodeJwtParts(token);
  if (header.alg !== "RS256") {
    throw new Error("Unsupported algorithm: " + header.alg);
  }
  const certs = await fetchGoogleCerts();
  const jwk = certs.find((k) => k.kid === header.kid);
  if (!jwk)
    throw new Error("No matching Google key found for kid: " + header.kid);
  const key = await importKey(jwk);
  const signature = base64UrlDecode(signatureB64);
  const data = new TextEncoder().encode(signedContent);
  const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, signature, data);
  if (!valid)
    throw new Error("Invalid JWT signature");
  if (!GOOGLE_ISSUERS.includes(payload.iss)) {
    throw new Error("Invalid issuer: " + payload.iss);
  }
  if (payload.aud !== clientId) {
    throw new Error("Invalid audience");
  }
  const now = Math.floor(Date.now() / 1e3);
  if (payload.exp < now) {
    throw new Error("Token expired");
  }
  if (payload.nbf && payload.nbf > now) {
    throw new Error("Token not yet valid");
  }
  if (!payload.email) {
    throw new Error("Missing email claim");
  }
  if (!payload.sub) {
    throw new Error("Missing sub claim");
  }
  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name || "",
    picture: payload.picture || ""
  };
}
__name(verifyGoogleJwt, "verifyGoogleJwt");
__name2(verifyGoogleJwt, "verifyGoogleJwt");
async function onRequestOptions3(context) {
  return handleOptions(context.request);
}
__name(onRequestOptions3, "onRequestOptions3");
__name2(onRequestOptions3, "onRequestOptions");
async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  try {
    const ip = getClientIP(request);
    const rateCheck = await checkRateLimit(db, `ip:${ip}:auth`, "auth");
    if (!rateCheck.ok) {
      return new Response(JSON.stringify({ error: "Too many requests. Try again later." }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rateCheck.retryAfter)
        }
      });
    }
    const body = await request.json();
    const { credential } = body;
    if (!credential) {
      return errorResponse("Missing credential", 400, request);
    }
    const clientId = env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return errorResponse("Server configuration error", 500, request);
    }
    const googleUser = await verifyGoogleJwt(credential, clientId);
    const existingUser = await db.prepare("SELECT id, login_count FROM users WHERE google_sub = ?").bind(googleUser.sub).first();
    let userId;
    if (existingUser) {
      await db.prepare(
        `UPDATE users
           SET email = ?, name = ?, picture_url = ?, last_login_at = datetime('now'), login_count = login_count + 1
           WHERE id = ?`
      ).bind(googleUser.email, googleUser.name, googleUser.picture, existingUser.id).run();
      userId = existingUser.id;
    } else {
      const result = await db.prepare(
        `INSERT INTO users (google_sub, email, name, picture_url)
           VALUES (?, ?, ?, ?)`
      ).bind(googleUser.sub, googleUser.email, googleUser.name, googleUser.picture).run();
      userId = result.meta.last_row_id;
      try {
        await db.prepare("INSERT OR IGNORE INTO enrollments (user_id, season) VALUES (?, ?)").bind(userId, "S1").run();
      } catch (enrollErr) {
        console.error("Enrollment error (non-fatal):", enrollErr.message);
      }
    }
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 72 * 3600 * 1e3).toISOString();
    await db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").bind(sessionId, userId, expiresAt).run();
    const user = await db.prepare(
      `SELECT id, email, name, display_name, picture_url, role, created_at
         FROM users WHERE id = ?`
    ).bind(userId).first();
    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          name: user.display_name || user.name,
          email: user.email,
          picture: user.picture_url,
          role: user.role,
          created_at: user.created_at
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": sessionCookie(sessionId),
          ...Object.fromEntries(
            Object.entries({
              "Access-Control-Allow-Origin": request.headers.get("Origin") || "https://newcoders.org",
              "Access-Control-Allow-Credentials": "true"
            })
          )
        }
      }
    );
  } catch (err) {
    console.error("Auth error:", err.message);
    return errorResponse("Authentication failed", 401, request);
  }
}
__name(onRequestPost, "onRequestPost");
__name2(onRequestPost, "onRequestPost");
async function onRequestOptions4(context) {
  return handleOptions(context.request);
}
__name(onRequestOptions4, "onRequestOptions4");
__name2(onRequestOptions4, "onRequestOptions");
async function onRequestPost2(context) {
  const { request, env } = context;
  const db = env.DB;
  const sessionId = getSessionId(request);
  if (sessionId) {
    await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clearSessionCookie(),
      ...corsHeaders(request)
    }
  });
}
__name(onRequestPost2, "onRequestPost2");
__name2(onRequestPost2, "onRequestPost");
async function onRequestOptions5(context) {
  return handleOptions(context.request);
}
__name(onRequestOptions5, "onRequestOptions5");
__name2(onRequestOptions5, "onRequestOptions");
async function onRequestGet3(context) {
  const { request, env } = context;
  const db = env.DB;
  const user = await getAuthenticatedUser(db, request);
  if (!user) {
    return errorResponse("Not authenticated", 401, request);
  }
  return jsonResponse({ user }, 200, request);
}
__name(onRequestGet3, "onRequestGet3");
__name2(onRequestGet3, "onRequestGet");
async function onRequestOptions6(context) {
  return handleOptions(context.request);
}
__name(onRequestOptions6, "onRequestOptions6");
__name2(onRequestOptions6, "onRequestOptions");
async function onRequestPost3(context) {
  const { request, env } = context;
  const db = env.DB;
  const user = await getAuthenticatedUser(db, request);
  if (!user)
    return errorResponse("Not authenticated", 401, request);
  try {
    const body = await request.json();
    const { completedDays } = body;
    if (!Array.isArray(completedDays)) {
      return errorResponse("completedDays must be an array", 400, request);
    }
    const validDays = completedDays.filter(
      (day) => Number.isInteger(day) && day >= 1 && day <= 30
    );
    if (validDays.length === 0) {
      return jsonResponse({ ok: true, migrated: 0 }, 200, request);
    }
    const stmt = db.prepare(
      "INSERT OR IGNORE INTO lesson_completions (user_id, day_number) VALUES (?, ?)"
    );
    const batch = validDays.map((day) => stmt.bind(user.id, day));
    await db.batch(batch);
    return jsonResponse({ ok: true, migrated: validDays.length }, 200, request);
  } catch (err) {
    console.error("Migration error:", err.message);
    return errorResponse("Migration failed", 500, request);
  }
}
__name(onRequestPost3, "onRequestPost3");
__name2(onRequestPost3, "onRequestPost");
async function onRequestOptions7(context) {
  return handleOptions(context.request);
}
__name(onRequestOptions7, "onRequestOptions7");
__name2(onRequestOptions7, "onRequestOptions");
async function onRequestGet4(context) {
  const { request, env } = context;
  const db = env.DB;
  const user = await getAuthenticatedUser(db, request);
  if (!user)
    return errorResponse("Not authenticated", 401, request);
  try {
    const achievements = await db.prepare("SELECT type, earned_at FROM achievements WHERE user_id = ? ORDER BY earned_at").bind(user.id).all();
    return jsonResponse({ achievements: achievements.results }, 200, request);
  } catch (err) {
    console.error("Achievements error:", err.message);
    return errorResponse("Failed to get achievements", 500, request);
  }
}
__name(onRequestGet4, "onRequestGet4");
__name2(onRequestGet4, "onRequestGet");
async function onRequestOptions8(context) {
  return handleOptions(context.request);
}
__name(onRequestOptions8, "onRequestOptions8");
__name2(onRequestOptions8, "onRequestOptions");
async function onRequestGet5(context) {
  const { request, env } = context;
  const db = env.DB;
  const user = await getAuthenticatedUser(db, request);
  if (!user)
    return errorResponse("Not authenticated", 401, request);
  try {
    const progress = await db.prepare("SELECT COUNT(*) as count FROM lesson_completions WHERE user_id = ?").bind(user.id).first();
    if (progress.count < 30) {
      return jsonResponse(
        { eligible: false, completed: progress.count, required: 30 },
        200,
        request
      );
    }
    const userData = await db.prepare("SELECT name, display_name, certificate_generated_at FROM users WHERE id = ?").bind(user.id).first();
    let certDate = userData?.certificate_generated_at;
    if (!certDate) {
      certDate = (/* @__PURE__ */ new Date()).toISOString();
      try {
        await db.prepare("UPDATE users SET certificate_generated_at = ? WHERE id = ?").bind(certDate, user.id).run();
      } catch {
        certDate = (/* @__PURE__ */ new Date()).toISOString();
      }
      await logAudit(db, { userId: user.id, action: "certificate_generated" });
    }
    return jsonResponse(
      {
        eligible: true,
        completed: 30,
        name: userData?.display_name || userData?.name || user.name,
        issued_at: certDate
      },
      200,
      request
    );
  } catch (err) {
    console.error("Certificate error:", err.message);
    return errorResponse("Failed to get certificate", 500, request);
  }
}
__name(onRequestGet5, "onRequestGet5");
__name2(onRequestGet5, "onRequestGet");
async function onRequestOptions9(context) {
  return handleOptions(context.request);
}
__name(onRequestOptions9, "onRequestOptions9");
__name2(onRequestOptions9, "onRequestOptions");
async function onRequestDelete(context) {
  return errorResponse("Use DELETE /api/users/me to delete your account", 410, context.request);
}
__name(onRequestDelete, "onRequestDelete");
__name2(onRequestDelete, "onRequestDelete");
async function onRequestOptions10(context) {
  return handleOptions(context.request);
}
__name(onRequestOptions10, "onRequestOptions10");
__name2(onRequestOptions10, "onRequestOptions");
async function onRequestGet6(context) {
  const { request, env } = context;
  const db = env.DB;
  const user = await getAuthenticatedUser(db, request);
  if (!user)
    return errorResponse("Not authenticated", 401, request);
  try {
    const completions = await db.prepare("SELECT day_number, completed_at FROM lesson_completions WHERE user_id = ? ORDER BY day_number").bind(user.id).all();
    const enrollments = await db.prepare("SELECT season, enrolled_at FROM enrollments WHERE user_id = ?").bind(user.id).all();
    const achievements = await db.prepare("SELECT type, earned_at FROM achievements WHERE user_id = ? ORDER BY earned_at").bind(user.id).all();
    const sessions = await db.prepare("SELECT created_at, expires_at, last_used_at FROM sessions WHERE user_id = ?").bind(user.id).all();
    const exportData = {
      exported_at: (/* @__PURE__ */ new Date()).toISOString(),
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      },
      progress: {
        lessons_completed: completions.results,
        total: completions.results.length
      },
      enrollments: enrollments.results,
      achievements: achievements.results,
      active_sessions: sessions.results.length
    };
    await logAudit(db, {
      userId: user.id,
      action: "data_export",
      ip: getClientIP(request)
    });
    return new Response(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="newcoders-datos-${user.id}.json"`,
        ...corsHeaders(request)
      }
    });
  } catch (err) {
    console.error("Export error:", err.message);
    return errorResponse("Failed to export data", 500, request);
  }
}
__name(onRequestGet6, "onRequestGet6");
__name2(onRequestGet6, "onRequestGet");
async function onRequestOptions11(context) {
  return handleOptions(context.request);
}
__name(onRequestOptions11, "onRequestOptions11");
__name2(onRequestOptions11, "onRequestOptions");
async function onRequestGet7(context) {
  const { request, env } = context;
  const db = env.DB;
  const user = await getAuthenticatedUser(db, request);
  if (!user)
    return errorResponse("Not authenticated", 401, request);
  const progress = await db.prepare("SELECT COUNT(*) as count FROM lesson_completions WHERE user_id = ?").bind(user.id).first();
  const enrollment = await db.prepare("SELECT season, enrolled_at FROM enrollments WHERE user_id = ? ORDER BY enrolled_at DESC LIMIT 1").bind(user.id).first();
  return jsonResponse(
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
        created_at: user.created_at
      },
      progress: {
        count: progress.count,
        percent: Math.round(progress.count / 30 * 1e3) / 10
      },
      enrollment: enrollment || null
    },
    200,
    request
  );
}
__name(onRequestGet7, "onRequestGet7");
__name2(onRequestGet7, "onRequestGet");
async function onRequestPatch2(context) {
  const { request, env } = context;
  const db = env.DB;
  const user = await getAuthenticatedUser(db, request);
  if (!user)
    return errorResponse("Not authenticated", 401, request);
  const rateCheck = await checkRateLimit(db, `user:${user.id}:profile`, "profile");
  if (!rateCheck.ok) {
    return new Response(JSON.stringify({ error: "Too many requests. Try again later." }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": String(rateCheck.retryAfter) }
    });
  }
  try {
    const body = await request.json();
    const { display_name } = body;
    if (display_name !== void 0) {
      if (typeof display_name !== "string") {
        return errorResponse("display_name must be a string", 400, request);
      }
      const trimmed = display_name.trim();
      if (trimmed.length > 100) {
        return errorResponse("display_name must be 100 characters or less", 400, request);
      }
      if (/[<>&"']/.test(trimmed)) {
        return errorResponse("display_name contains invalid characters", 400, request);
      }
      const sanitized = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
      await db.prepare("UPDATE users SET display_name = ? WHERE id = ?").bind(sanitized || null, user.id).run();
      await logAudit(db, { userId: user.id, action: "profile_update", details: { field: "display_name" } });
    }
    return jsonResponse({ ok: true }, 200, request);
  } catch (err) {
    console.error("Profile update error:", err.message);
    return errorResponse("Failed to update profile", 500, request);
  }
}
__name(onRequestPatch2, "onRequestPatch2");
__name2(onRequestPatch2, "onRequestPatch");
async function onRequestDelete2(context) {
  const { request, env } = context;
  const db = env.DB;
  const user = await getAuthenticatedUser(db, request);
  if (!user)
    return errorResponse("Not authenticated", 401, request);
  try {
    await logAudit(db, {
      userId: user.id,
      action: "account_deleted",
      details: { email: user.email },
      ip: getClientIP(request)
    });
    await db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(user.id).run();
    await db.prepare(
      `UPDATE users
         SET email = ?, name = 'Usuario eliminado', display_name = NULL,
             picture_url = NULL, is_active = 0, google_sub = ?
         WHERE id = ?`
    ).bind(`deleted_${user.id}@deleted.invalid`, `deleted_${user.id}`, user.id).run();
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": clearSessionCookie(),
        ...corsHeaders(request)
      }
    });
  } catch (err) {
    console.error("Delete account error:", err.message);
    return errorResponse("Failed to delete account", 500, request);
  }
}
__name(onRequestDelete2, "onRequestDelete2");
__name2(onRequestDelete2, "onRequestDelete");
var ACHIEVEMENT_CHECKS = [
  {
    type: "primer_dia",
    label: "Primer Paso",
    check: (completedCount) => completedCount >= 1
  },
  {
    type: "semana_html",
    label: "Maestro HTML",
    check: (completedCount) => completedCount >= 7
  },
  {
    type: "semana_css",
    label: "Maestro CSS",
    check: (completedCount) => completedCount >= 14
  },
  {
    type: "semana_js",
    label: "Maestro JS",
    check: (completedCount) => completedCount >= 21
  },
  {
    type: "completado",
    label: "Dev Path Completado",
    check: (completedCount) => completedCount >= 30
  }
];
async function checkAndGrantAchievements(db, userId) {
  const progress = await db.prepare("SELECT COUNT(*) as count FROM lesson_completions WHERE user_id = ?").bind(userId).first();
  const count = progress?.count ?? 0;
  const newAchievements = [];
  for (const achievement of ACHIEVEMENT_CHECKS) {
    if (!achievement.check(count))
      continue;
    try {
      const result = await db.prepare("INSERT OR IGNORE INTO achievements (user_id, type) VALUES (?, ?)").bind(userId, achievement.type).run();
      if (result.meta.changes > 0) {
        newAchievements.push({ type: achievement.type, label: achievement.label });
      }
    } catch (err) {
      console.error("Achievement insert error:", err.message);
    }
  }
  try {
    const { current_streak } = await getStreakData(db, userId);
    if (current_streak >= 7) {
      const result = await db.prepare("INSERT OR IGNORE INTO achievements (user_id, type) VALUES (?, ?)").bind(userId, "racha_7").run();
      if (result.meta.changes > 0) {
        newAchievements.push({ type: "racha_7", label: "Racha de 7 d\xEDas" });
      }
    }
  } catch (err) {
    console.error("Streak achievement error:", err.message);
  }
  return newAchievements;
}
__name(checkAndGrantAchievements, "checkAndGrantAchievements");
__name2(checkAndGrantAchievements, "checkAndGrantAchievements");
async function getStreakData(db, userId) {
  const completions = await db.prepare(
    "SELECT completed_at FROM lesson_completions WHERE user_id = ? ORDER BY completed_at DESC"
  ).bind(userId).all();
  const dates = completions.results.map((r) => r.completed_at.split("T")[0]);
  const uniqueDates = [...new Set(dates)].sort().reverse();
  if (uniqueDates.length === 0)
    return { current_streak: 0 };
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0];
  const mostRecent = uniqueDates[0];
  if (mostRecent !== today && mostRecent !== yesterday)
    return { current_streak: 0 };
  let streak = 0;
  let checkDate = new Date(mostRecent);
  for (const date of uniqueDates) {
    const d = new Date(date);
    const diff = Math.round((checkDate - d) / 864e5);
    if (diff === 0) {
      streak++;
      checkDate = d;
    } else if (diff === 1) {
      streak++;
      checkDate = d;
    } else
      break;
  }
  return { current_streak: streak };
}
__name(getStreakData, "getStreakData");
__name2(getStreakData, "getStreakData");
async function onRequestOptions12(context) {
  return handleOptions(context.request);
}
__name(onRequestOptions12, "onRequestOptions12");
__name2(onRequestOptions12, "onRequestOptions");
async function onRequestPost4(context) {
  const { request, env, params } = context;
  const db = env.DB;
  const user = await getAuthenticatedUser(db, request);
  if (!user)
    return errorResponse("Not authenticated", 401, request);
  const rateCheck = await checkRateLimit(db, `user:${user.id}:progress`, "progress");
  if (!rateCheck.ok) {
    return new Response(JSON.stringify({ error: "Too many requests. Try again later." }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": String(rateCheck.retryAfter) }
    });
  }
  const dayNumber = parseInt(params.day, 10);
  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 30) {
    return errorResponse("Invalid day number. Must be between 1 and 30.", 400, request);
  }
  try {
    await db.prepare("INSERT OR IGNORE INTO lesson_completions (user_id, day_number) VALUES (?, ?)").bind(user.id, dayNumber).run();
    const newAchievements = await checkAndGrantAchievements(db, user.id);
    return jsonResponse({ ok: true, day: dayNumber, new_achievements: newAchievements }, 200, request);
  } catch (err) {
    console.error("Progress error:", err.message);
    return errorResponse("Failed to save progress", 500, request);
  }
}
__name(onRequestPost4, "onRequestPost4");
__name2(onRequestPost4, "onRequestPost");
function calculateStreaks(dates) {
  if (dates.length === 0)
    return { current_streak: 0, longest_streak: 0 };
  const uniqueDays = [...new Set(dates.map((d) => d.split("T")[0]))].sort().reverse();
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0];
  let currentStreak = 0;
  let checkDate = uniqueDays[0] === today || uniqueDays[0] === yesterday ? uniqueDays[0] : null;
  if (checkDate) {
    for (const day of uniqueDays) {
      if (day === checkDate) {
        currentStreak++;
        const prev = new Date(checkDate);
        prev.setDate(prev.getDate() - 1);
        checkDate = prev.toISOString().split("T")[0];
      } else if (day < checkDate) {
        break;
      }
    }
  }
  let longestStreak = 0;
  let streak = 1;
  const sorted = [...uniqueDays].sort();
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = (curr - prev) / 864e5;
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
__name(calculateStreaks, "calculateStreaks");
__name2(calculateStreaks, "calculateStreaks");
async function onRequestOptions13(context) {
  return handleOptions(context.request);
}
__name(onRequestOptions13, "onRequestOptions13");
__name2(onRequestOptions13, "onRequestOptions");
async function onRequestGet8(context) {
  const { request, env } = context;
  const db = env.DB;
  const user = await getAuthenticatedUser(db, request);
  if (!user)
    return errorResponse("Not authenticated", 401, request);
  const rows = await db.prepare("SELECT day_number, completed_at FROM lesson_completions WHERE user_id = ? ORDER BY day_number").bind(user.id).all();
  const completed = rows.results.map((r) => r.day_number);
  const dates = rows.results.map((r) => r.completed_at);
  const { current_streak, longest_streak } = calculateStreaks(dates);
  const lastCompletion = dates.length > 0 ? dates[dates.length - 1] : null;
  return jsonResponse(
    {
      completed,
      count: completed.length,
      percent: Math.round(completed.length / 30 * 1e3) / 10,
      current_streak,
      longest_streak,
      last_completed_at: lastCompletion
    },
    200,
    request
  );
}
__name(onRequestGet8, "onRequestGet8");
__name2(onRequestGet8, "onRequestGet");
var routes = [
  {
    routePath: "/api/admin/stats",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/admin/stats",
    mountPath: "/api/admin",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions]
  },
  {
    routePath: "/api/admin/users",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/admin/users",
    mountPath: "/api/admin",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions2]
  },
  {
    routePath: "/api/admin/users",
    mountPath: "/api/admin",
    method: "PATCH",
    middlewares: [],
    modules: [onRequestPatch]
  },
  {
    routePath: "/api/auth/google",
    mountPath: "/api/auth",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions3]
  },
  {
    routePath: "/api/auth/google",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/auth/logout",
    mountPath: "/api/auth",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions4]
  },
  {
    routePath: "/api/auth/logout",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/auth/me",
    mountPath: "/api/auth",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/auth/me",
    mountPath: "/api/auth",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions5]
  },
  {
    routePath: "/api/progress/migrate",
    mountPath: "/api/progress",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions6]
  },
  {
    routePath: "/api/progress/migrate",
    mountPath: "/api/progress",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/users/achievements",
    mountPath: "/api/users",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/users/achievements",
    mountPath: "/api/users",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions7]
  },
  {
    routePath: "/api/users/certificate",
    mountPath: "/api/users",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet5]
  },
  {
    routePath: "/api/users/certificate",
    mountPath: "/api/users",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions8]
  },
  {
    routePath: "/api/users/delete",
    mountPath: "/api/users",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete]
  },
  {
    routePath: "/api/users/delete",
    mountPath: "/api/users",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions9]
  },
  {
    routePath: "/api/users/export",
    mountPath: "/api/users",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet6]
  },
  {
    routePath: "/api/users/export",
    mountPath: "/api/users",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions10]
  },
  {
    routePath: "/api/users/me",
    mountPath: "/api/users",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete2]
  },
  {
    routePath: "/api/users/me",
    mountPath: "/api/users",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet7]
  },
  {
    routePath: "/api/users/me",
    mountPath: "/api/users",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions11]
  },
  {
    routePath: "/api/users/me",
    mountPath: "/api/users",
    method: "PATCH",
    middlewares: [],
    modules: [onRequestPatch2]
  },
  {
    routePath: "/api/progress/:day",
    mountPath: "/api/progress",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions12]
  },
  {
    routePath: "/api/progress/:day",
    mountPath: "/api/progress",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/progress",
    mountPath: "/api/progress",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet8]
  },
  {
    routePath: "/api/progress",
    mountPath: "/api/progress",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions13]
  }
];
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: () => {
            isFailOpen = true;
          }
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = /* @__PURE__ */ __name(class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
}, "__Facade_ScheduledController__");
__name2(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-WcDaXQ/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-WcDaXQ/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__2, "__Facade_ScheduledController__");
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.7849375318784287.js.map
