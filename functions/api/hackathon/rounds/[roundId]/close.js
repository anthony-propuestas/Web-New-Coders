import { getAuthenticatedUser } from '../../../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse } from '../../../../lib/cors.js';
import { checkRateLimit, getClientIP } from '../../../../lib/rate-limit.js';
import { logAudit } from '../../../../lib/audit.js';

function chooseWinner(pairing) {
  if (!pairing.participant_b_user_id) {
    return {
      winner_user_id: pairing.participant_a_user_id,
      votes_for_a: pairing.votes_for_a,
      votes_for_b: pairing.votes_for_b,
    };
  }

  if (pairing.votes_for_a > pairing.votes_for_b) {
    return {
      winner_user_id: pairing.participant_a_user_id,
      votes_for_a: pairing.votes_for_a,
      votes_for_b: pairing.votes_for_b,
    };
  }

  if (pairing.votes_for_b > pairing.votes_for_a) {
    return {
      winner_user_id: pairing.participant_b_user_id,
      votes_for_a: pairing.votes_for_a,
      votes_for_b: pairing.votes_for_b,
    };
  }

  const registeredA = new Date(pairing.participant_a_registered_at).getTime();
  const registeredB = new Date(pairing.participant_b_registered_at).getTime();

  if (registeredB < registeredA) {
    return {
      winner_user_id: pairing.participant_b_user_id,
      votes_for_a: pairing.votes_for_a,
      votes_for_b: pairing.votes_for_b,
    };
  }

  return {
    winner_user_id: pairing.participant_a_user_id,
    votes_for_a: pairing.votes_for_a,
    votes_for_b: pairing.votes_for_b,
  };
}

export async function onRequestOptions(context) {
  return handleOptions(context.request, context.env);
}

export async function onRequestPost(context) {
  const { request, env, params } = context;
  const db = env.DB;

  const admin = await getAuthenticatedUser(db, request);
  if (!admin) return errorResponse('Not authenticated', 401, request, env);
  if (admin.role !== 'admin') return errorResponse('Forbidden', 403, request, env);

  const rateCheck = await checkRateLimit(db, `user:${admin.id}:admin`, 'profile');
  if (!rateCheck.ok) {
    return new Response(JSON.stringify({ error: 'Too many requests.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': String(rateCheck.retryAfter) },
    });
  }

  const roundId = Number(params?.roundId);
  if (!Number.isInteger(roundId) || roundId < 1) {
    return errorResponse('Invalid round id', 400, request, env);
  }

  const round = await db
    .prepare('SELECT id, round_number, category, status FROM hackathon_rounds WHERE id = ?')
    .bind(roundId)
    .first();
  if (!round) return errorResponse('Round not found', 404, request, env);
  if (round.status !== 'active') return errorResponse('Only active rounds can be closed', 409, request, env);

  const pairingsResult = await db
    .prepare(
      `SELECT p.id, p.pair_number, p.participant_a_user_id, p.participant_b_user_id,
              ra.registered_at AS participant_a_registered_at,
              rb.registered_at AS participant_b_registered_at,
              SUM(CASE WHEN v.voted_for_user_id = p.participant_a_user_id THEN 1 ELSE 0 END) AS votes_for_a,
              SUM(CASE WHEN v.voted_for_user_id = p.participant_b_user_id THEN 1 ELSE 0 END) AS votes_for_b
       FROM hackathon_pairings p
       JOIN hackathon_registrations ra ON ra.user_id = p.participant_a_user_id
       LEFT JOIN hackathon_registrations rb ON rb.user_id = p.participant_b_user_id
       LEFT JOIN hackathon_votes v ON v.pairing_id = p.id
       WHERE p.round_id = ?
       GROUP BY p.id, p.pair_number, p.participant_a_user_id, p.participant_b_user_id,
                ra.registered_at, rb.registered_at
       ORDER BY p.pair_number ASC`
    )
    .bind(roundId)
    .all();

  const pairings = pairingsResult.results || [];
  if (pairings.length === 0) {
    return errorResponse('This round has no pairings', 409, request, env);
  }

  const statements = [];
  const winners = [];

  for (const pairing of pairings) {
    const normalized = {
      ...pairing,
      votes_for_a: pairing.votes_for_a || 0,
      votes_for_b: pairing.votes_for_b || 0,
    };
    const decision = chooseWinner(normalized);

    statements.push(
      db.prepare(
        `UPDATE hackathon_pairings
         SET winner_user_id = ?, votes_for_a = ?, votes_for_b = ?, status = 'closed', closed_at = datetime('now')
         WHERE id = ?`
      ).bind(decision.winner_user_id, decision.votes_for_a, decision.votes_for_b, pairing.id)
    );

    winners.push({
      pairing_id: pairing.id,
      pair_number: pairing.pair_number,
      winner_user_id: decision.winner_user_id,
      votes_for_a: decision.votes_for_a,
      votes_for_b: decision.votes_for_b,
    });
  }

  statements.push(
    db.prepare(
      `UPDATE hackathon_rounds
       SET status = 'closed', closed_at = datetime('now')
       WHERE id = ?`
    ).bind(roundId)
  );

  try {
    await db.batch(statements);

    await logAudit(db, {
      userId: admin.id,
      action: 'hackathon_round_closed',
      details: {
        round_id: roundId,
        round_number: round.round_number,
        category: round.category,
        winners: winners.length,
      },
      ip: getClientIP(request),
    });

    return jsonResponse({ ok: true, winners }, 200, request, env);
  } catch (err) {
    console.error('Hackathon close error:', err.message);
    return errorResponse('Failed to close round', 500, request, env);
  }
}