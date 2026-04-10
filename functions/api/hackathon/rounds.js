import { getAuthenticatedUser } from '../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse } from '../../lib/cors.js';
import { checkRateLimit, getClientIP } from '../../lib/rate-limit.js';
import { logAudit } from '../../lib/audit.js';

const VALID_CATEGORIES = new Set(['starter', 'deployer']);

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

function normalizeRoundNumber(value) {
  if (value === undefined || value === null || value === '') {
    return { value: null };
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return { error: 'round_number must be a positive integer' };
  }

  return { value: parsed };
}

function buildRoundResponse(roundRow, pairingsByRound) {
  return {
    id: roundRow.id,
    round_number: roundRow.round_number,
    category: roundRow.category,
    status: roundRow.status,
    created_at: roundRow.created_at,
    started_at: roundRow.started_at,
    closed_at: roundRow.closed_at,
    pairings: pairingsByRound.get(roundRow.id) || [],
  };
}

export async function onRequestOptions(context) {
  return handleOptions(context.request, context.env);
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;

  const viewer = await getAuthenticatedUser(db, request);
  if (!viewer) return errorResponse('Not authenticated', 401, request, env);

  const roundsResult = await db
    .prepare(
      `SELECT id, round_number, category, status, created_at, started_at, closed_at
       FROM hackathon_rounds
       ORDER BY round_number DESC, category ASC, id DESC`
    )
    .all();

  const rounds = roundsResult.results || [];
  if (rounds.length === 0) {
    return jsonResponse({ rounds: [] }, 200, request, env);
  }

  const placeholders = rounds.map(() => '?').join(', ');
  const pairingsQuery = `
    SELECT p.id, p.round_id, p.pair_number, p.participant_a_user_id, p.participant_b_user_id,
           p.winner_user_id, p.votes_for_a, p.votes_for_b, p.status, p.created_at, p.closed_at,
           ra.display_name AS participant_a_name, ra.github_profile AS participant_a_github,
           rb.display_name AS participant_b_name, rb.github_profile AS participant_b_github,
           vv.voted_for_user_id AS viewer_voted_for_user_id
    FROM hackathon_pairings p
    LEFT JOIN hackathon_registrations ra ON ra.user_id = p.participant_a_user_id
    LEFT JOIN hackathon_registrations rb ON rb.user_id = p.participant_b_user_id
    LEFT JOIN hackathon_votes vv ON vv.pairing_id = p.id AND vv.voter_user_id = ?
    WHERE p.round_id IN (${placeholders})
    ORDER BY p.round_id DESC, p.pair_number ASC
  `;

  const pairingsResult = await db.prepare(pairingsQuery).bind(viewer.id, ...rounds.map((round) => round.id)).all();
  const pairingsByRound = new Map();

  for (const pairing of pairingsResult.results || []) {
    const round = rounds.find((entry) => entry.id === pairing.round_id);
    const showVoteCounts = viewer.role === 'admin' || round?.status === 'closed';
    const normalized = {
      id: pairing.id,
      round_id: pairing.round_id,
      pair_number: pairing.pair_number,
      status: pairing.status,
      created_at: pairing.created_at,
      closed_at: pairing.closed_at,
      winner_user_id: pairing.winner_user_id,
      viewer_voted_for_user_id: pairing.viewer_voted_for_user_id || null,
      votes_for_a: showVoteCounts ? pairing.votes_for_a : null,
      votes_for_b: showVoteCounts ? pairing.votes_for_b : null,
      participant_a: {
        user_id: pairing.participant_a_user_id,
        display_name: pairing.participant_a_name,
        github_profile: pairing.participant_a_github,
      },
      participant_b: pairing.participant_b_user_id
        ? {
            user_id: pairing.participant_b_user_id,
            display_name: pairing.participant_b_name,
            github_profile: pairing.participant_b_github,
          }
        : null,
      bye: pairing.participant_b_user_id == null,
    };

    if (!pairingsByRound.has(pairing.round_id)) {
      pairingsByRound.set(pairing.round_id, []);
    }
    pairingsByRound.get(pairing.round_id).push(normalized);
  }

  return jsonResponse({ rounds: rounds.map((round) => buildRoundResponse(round, pairingsByRound)) }, 200, request, env);
}

export async function onRequestPost(context) {
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

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid request body', 400, request, env);
  }

  const category = normalizeCategory(body?.category);
  if (category.error) return errorResponse(category.error, 400, request, env);

  const roundNumber = normalizeRoundNumber(body?.round_number);
  if (roundNumber.error) return errorResponse(roundNumber.error, 400, request, env);

  const existingOpenRound = await db
    .prepare(
      `SELECT id FROM hackathon_rounds
       WHERE category = ? AND status IN ('draft', 'active')
       LIMIT 1`
    )
    .bind(category.value)
    .first();
  if (existingOpenRound) {
    return errorResponse('There is already an open round for this category', 409, request, env);
  }

  let nextRoundNumber = roundNumber.value;
  if (nextRoundNumber == null) {
    const current = await db
      .prepare('SELECT COALESCE(MAX(round_number), 0) AS max_round FROM hackathon_rounds WHERE category = ?')
      .bind(category.value)
      .first();
    nextRoundNumber = (current?.max_round || 0) + 1;
  }

  try {
    const insert = await db
      .prepare(
        `INSERT INTO hackathon_rounds (round_number, category, status)
         VALUES (?, ?, 'draft')`
      )
      .bind(nextRoundNumber, category.value)
      .run();

    await logAudit(db, {
      userId: user.id,
      action: 'hackathon_round_created',
      details: { round_number: nextRoundNumber, category: category.value },
      ip: getClientIP(request),
    });

    return jsonResponse(
      {
        ok: true,
        round: {
          id: insert.meta.last_row_id,
          round_number: nextRoundNumber,
          category: category.value,
          status: 'draft',
        },
      },
      201,
      request,
      env
    );
  } catch (err) {
    console.error('Hackathon round create error:', err.message);
    if (/UNIQUE constraint failed/i.test(err.message)) {
      return errorResponse('Round already exists for this category', 409, request, env);
    }
    return errorResponse('Failed to create hackathon round', 500, request, env);
  }
}