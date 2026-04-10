import { getAuthenticatedUser } from '../../../../lib/session.js';
import { handleOptions, jsonResponse, errorResponse } from '../../../../lib/cors.js';
import { checkRateLimit, getClientIP } from '../../../../lib/rate-limit.js';
import { logAudit } from '../../../../lib/audit.js';

async function getParticipantsForRound(db, round) {
  if (round.round_number === 1) {
    const registrations = await db
      .prepare(
        `SELECT user_id, registered_at
         FROM hackathon_registrations
         WHERE category = ?
         ORDER BY registered_at ASC, user_id ASC`
      )
      .bind(round.category)
      .all();

    return registrations.results || [];
  }

  const previousRound = await db
    .prepare(
      `SELECT id, status
       FROM hackathon_rounds
       WHERE category = ? AND round_number = ?
       LIMIT 1`
    )
    .bind(round.category, round.round_number - 1)
    .first();

  if (!previousRound) {
    throw new Error('Previous round not found');
  }

  if (previousRound.status !== 'closed') {
    throw new Error('Previous round must be closed before creating the next one');
  }

  const winners = await db
    .prepare(
      `SELECT p.winner_user_id AS user_id, r.registered_at
       FROM hackathon_pairings p
       JOIN hackathon_registrations r ON r.user_id = p.winner_user_id
       WHERE p.round_id = ? AND p.winner_user_id IS NOT NULL
       ORDER BY r.registered_at ASC, p.pair_number ASC, p.winner_user_id ASC`
    )
    .bind(previousRound.id)
    .all();

  return winners.results || [];
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
    .prepare(
      `SELECT id, round_number, category, status
       FROM hackathon_rounds
       WHERE id = ?`
    )
    .bind(roundId)
    .first();

  if (!round) return errorResponse('Round not found', 404, request, env);
  if (round.status !== 'draft') return errorResponse('Only draft rounds can be paired', 409, request, env);

  const existingPairings = await db
    .prepare('SELECT COUNT(*) AS count FROM hackathon_pairings WHERE round_id = ?')
    .bind(roundId)
    .first();
  if ((existingPairings?.count || 0) > 0) {
    return errorResponse('This round already has pairings', 409, request, env);
  }

  let participants;
  try {
    participants = await getParticipantsForRound(db, round);
  } catch (err) {
    return errorResponse(err.message, 409, request, env);
  }

  if (!participants || participants.length === 0) {
    return errorResponse('No participants available for this round', 409, request, env);
  }

  const statements = [];
  const summary = [];

  for (let index = 0; index < participants.length; index += 2) {
    const participantA = participants[index];
    const participantB = participants[index + 1] || null;
    const pairNumber = Math.floor(index / 2) + 1;
    const hasBye = !participantB;

    statements.push(
      db.prepare(
        `INSERT INTO hackathon_pairings (
           round_id, pair_number, participant_a_user_id, participant_b_user_id, winner_user_id, status, closed_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        roundId,
        pairNumber,
        participantA.user_id,
        participantB?.user_id || null,
        hasBye ? participantA.user_id : null,
        hasBye ? 'closed' : 'active',
        hasBye ? new Date().toISOString() : null
      )
    );

    summary.push({
      pair_number: pairNumber,
      participant_a_user_id: participantA.user_id,
      participant_b_user_id: participantB?.user_id || null,
      bye: hasBye,
    });
  }

  statements.push(
    db.prepare(
      `UPDATE hackathon_rounds
       SET status = 'active', started_at = datetime('now')
       WHERE id = ?`
    ).bind(roundId)
  );

  try {
    await db.batch(statements);

    await logAudit(db, {
      userId: admin.id,
      action: 'hackathon_round_triggered',
      details: {
        round_id: roundId,
        category: round.category,
        pairings_created: summary.length,
      },
      ip: getClientIP(request),
    });

    return jsonResponse(
      {
        ok: true,
        round: {
          id: roundId,
          round_number: round.round_number,
          category: round.category,
          status: 'active',
        },
        pairings: summary,
      },
      200,
      request,
      env
    );
  } catch (err) {
    console.error('Hackathon trigger error:', err.message);
    return errorResponse('Failed to create pairings', 500, request, env);
  }
}