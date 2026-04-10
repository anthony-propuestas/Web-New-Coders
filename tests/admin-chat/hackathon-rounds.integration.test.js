import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestDb } from '../helpers/d1.js';
import { createAuthenticatedSession } from '../helpers/fixtures.js';
import { createContext, createJsonRequest } from '../helpers/http.js';

async function insertHackathonRegistration(db, { userId, displayName, githubProfile, category, registeredAt }) {
  await db
    .prepare(
      `INSERT INTO hackathon_registrations (user_id, display_name, github_profile, category, registered_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(userId, displayName, githubProfile, category, registeredAt, registeredAt)
    .run();
}

describe('hackathon rounds endpoints', () => {
  let db;
  let roundsGetHandler;
  let roundsPostHandler;
  let triggerHandler;
  let closeHandler;
  let voteHandler;

  beforeEach(async () => {
    db = createTestDb();
    ({ onRequestGet: roundsGetHandler, onRequestPost: roundsPostHandler } = await import('../../functions/api/hackathon/rounds.js'));
    ({ onRequestPost: triggerHandler } = await import('../../functions/api/hackathon/rounds/[roundId]/trigger.js'));
    ({ onRequestPost: closeHandler } = await import('../../functions/api/hackathon/rounds/[roundId]/close.js'));
    ({ onRequestPost: voteHandler } = await import('../../functions/api/hackathon/pairings/[pairingId]/vote.js'));
  });

  afterEach(() => {
    db.close();
  });

  it('allows admins to create rounds and blocks non-admin users', async () => {
    const { sessionId: adminSessionId } = await createAuthenticatedSession(db, {
      email: 'admin-round@example.com',
      role: 'admin',
    });
    const { sessionId: studentSessionId } = await createAuthenticatedSession(db, {
      email: 'student-round@example.com',
      role: 'student',
    });

    const forbidden = await roundsPostHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/hackathon/rounds', {
          method: 'POST',
          cookie: `session=${studentSessionId}`,
          body: { category: 'starter' },
        }),
      })
    );

    expect(forbidden.status).toBe(403);

    const created = await roundsPostHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/hackathon/rounds', {
          method: 'POST',
          cookie: `session=${adminSessionId}`,
          body: { category: 'starter' },
        }),
      })
    );

    expect(created.status).toBe(201);
    await expect(created.json()).resolves.toEqual({
      ok: true,
      round: expect.objectContaining({
        round_number: 1,
        category: 'starter',
        status: 'draft',
      }),
    });

    const duplicate = await roundsPostHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/hackathon/rounds', {
          method: 'POST',
          cookie: `session=${adminSessionId}`,
          body: { category: 'starter' },
        }),
      })
    );

    expect(duplicate.status).toBe(409);
    await expect(duplicate.json()).resolves.toEqual({ error: 'There is already an open round for this category' });
  });

  it('triggers pairings by registration order and keeps categories separate', async () => {
    const { sessionId: adminSessionId } = await createAuthenticatedSession(db, {
      email: 'admin-trigger@example.com',
      role: 'admin',
    });

    const starterA = await createAuthenticatedSession(db, { email: 'starter-a@example.com', name: 'Starter A' });
    const starterB = await createAuthenticatedSession(db, { email: 'starter-b@example.com', name: 'Starter B' });
    const starterC = await createAuthenticatedSession(db, { email: 'starter-c@example.com', name: 'Starter C' });
    const deployerA = await createAuthenticatedSession(db, { email: 'deployer-a@example.com', name: 'Deployer A' });
    const deployerB = await createAuthenticatedSession(db, { email: 'deployer-b@example.com', name: 'Deployer B' });

    await insertHackathonRegistration(db, {
      userId: starterA.userId,
      displayName: 'Starter A',
      githubProfile: 'https://github.com/starter-a',
      category: 'starter',
      registeredAt: '2026-04-10 10:00:00',
    });
    await insertHackathonRegistration(db, {
      userId: starterB.userId,
      displayName: 'Starter B',
      githubProfile: 'https://github.com/starter-b',
      category: 'starter',
      registeredAt: '2026-04-10 10:05:00',
    });
    await insertHackathonRegistration(db, {
      userId: starterC.userId,
      displayName: 'Starter C',
      githubProfile: 'https://github.com/starter-c',
      category: 'starter',
      registeredAt: '2026-04-10 10:10:00',
    });
    await insertHackathonRegistration(db, {
      userId: deployerA.userId,
      displayName: 'Deployer A',
      githubProfile: 'https://github.com/deployer-a',
      category: 'deployer',
      registeredAt: '2026-04-10 10:00:00',
    });
    await insertHackathonRegistration(db, {
      userId: deployerB.userId,
      displayName: 'Deployer B',
      githubProfile: 'https://github.com/deployer-b',
      category: 'deployer',
      registeredAt: '2026-04-10 10:05:00',
    });

    const createRound = await roundsPostHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/hackathon/rounds', {
          method: 'POST',
          cookie: `session=${adminSessionId}`,
          body: { category: 'starter' },
        }),
      })
    );
    const createRoundBody = await createRound.json();

    const triggerResponse = await triggerHandler(
      createContext({
        db,
        params: { roundId: String(createRoundBody.round.id) },
        request: createJsonRequest(`https://newcoders.org/api/hackathon/rounds/${createRoundBody.round.id}/trigger`, {
          method: 'POST',
          cookie: `session=${adminSessionId}`,
        }),
      })
    );

    expect(triggerResponse.status).toBe(200);
    const pairings = await db
      .prepare(
        `SELECT pair_number, participant_a_user_id, participant_b_user_id, winner_user_id, status
         FROM hackathon_pairings
         WHERE round_id = ?
         ORDER BY pair_number ASC`
      )
      .bind(createRoundBody.round.id)
      .all();

    expect(pairings.results).toEqual([
      {
        pair_number: 1,
        participant_a_user_id: starterA.userId,
        participant_b_user_id: starterB.userId,
        winner_user_id: null,
        status: 'active',
      },
      {
        pair_number: 2,
        participant_a_user_id: starterC.userId,
        participant_b_user_id: null,
        winner_user_id: starterC.userId,
        status: 'closed',
      },
    ]);

    const round = await db.prepare('SELECT status FROM hackathon_rounds WHERE id = ?').bind(createRoundBody.round.id).first();
    expect(round).toEqual({ status: 'active' });
  });

  it('records one vote per pairing and exposes the viewer vote in rounds listing', async () => {
    const { sessionId: adminSessionId } = await createAuthenticatedSession(db, {
      email: 'admin-vote@example.com',
      role: 'admin',
    });
    const participantA = await createAuthenticatedSession(db, { email: 'vote-a@example.com', name: 'Vote A' });
    const participantB = await createAuthenticatedSession(db, { email: 'vote-b@example.com', name: 'Vote B' });
    const voter = await createAuthenticatedSession(db, { email: 'voter@example.com', name: 'Voter' });

    await insertHackathonRegistration(db, {
      userId: participantA.userId,
      displayName: 'Vote A',
      githubProfile: 'https://github.com/vote-a',
      category: 'starter',
      registeredAt: '2026-04-10 10:00:00',
    });
    await insertHackathonRegistration(db, {
      userId: participantB.userId,
      displayName: 'Vote B',
      githubProfile: 'https://github.com/vote-b',
      category: 'starter',
      registeredAt: '2026-04-10 10:05:00',
    });

    const createRound = await roundsPostHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/hackathon/rounds', {
          method: 'POST',
          cookie: `session=${adminSessionId}`,
          body: { category: 'starter' },
        }),
      })
    );
    const createRoundBody = await createRound.json();

    await triggerHandler(
      createContext({
        db,
        params: { roundId: String(createRoundBody.round.id) },
        request: createJsonRequest(`https://newcoders.org/api/hackathon/rounds/${createRoundBody.round.id}/trigger`, {
          method: 'POST',
          cookie: `session=${adminSessionId}`,
        }),
      })
    );

    const pairing = await db.prepare('SELECT id FROM hackathon_pairings WHERE round_id = ?').bind(createRoundBody.round.id).first();

    const firstVote = await voteHandler(
      createContext({
        db,
        params: { pairingId: String(pairing.id) },
        request: createJsonRequest(`https://newcoders.org/api/hackathon/pairings/${pairing.id}/vote`, {
          method: 'POST',
          cookie: `session=${voter.sessionId}`,
          body: { voted_for_user_id: participantB.userId },
        }),
      })
    );

    expect(firstVote.status).toBe(201);

    const duplicateVote = await voteHandler(
      createContext({
        db,
        params: { pairingId: String(pairing.id) },
        request: createJsonRequest(`https://newcoders.org/api/hackathon/pairings/${pairing.id}/vote`, {
          method: 'POST',
          cookie: `session=${voter.sessionId}`,
          body: { voted_for_user_id: participantA.userId },
        }),
      })
    );

    expect(duplicateVote.status).toBe(409);
    await expect(duplicateVote.json()).resolves.toEqual({ error: 'You have already voted in this pairing' });

    const roundsResponse = await roundsGetHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/hackathon/rounds', {
          cookie: `session=${voter.sessionId}`,
        }),
      })
    );

    expect(roundsResponse.status).toBe(200);
    const roundsBody = await roundsResponse.json();
    expect(roundsBody.rounds[0].pairings[0].viewer_voted_for_user_id).toBe(participantB.userId);
  });

  it('closes a round, persists vote counts, and resolves ties by registration order', async () => {
    const { sessionId: adminSessionId } = await createAuthenticatedSession(db, {
      email: 'admin-close@example.com',
      role: 'admin',
    });
    const participantA = await createAuthenticatedSession(db, { email: 'close-a@example.com', name: 'Close A' });
    const participantB = await createAuthenticatedSession(db, { email: 'close-b@example.com', name: 'Close B' });
    const voterA = await createAuthenticatedSession(db, { email: 'close-voter-a@example.com', name: 'Close Voter A' });
    const voterB = await createAuthenticatedSession(db, { email: 'close-voter-b@example.com', name: 'Close Voter B' });

    await insertHackathonRegistration(db, {
      userId: participantA.userId,
      displayName: 'Close A',
      githubProfile: 'https://github.com/close-a',
      category: 'starter',
      registeredAt: '2026-04-10 09:00:00',
    });
    await insertHackathonRegistration(db, {
      userId: participantB.userId,
      displayName: 'Close B',
      githubProfile: 'https://github.com/close-b',
      category: 'starter',
      registeredAt: '2026-04-10 09:05:00',
    });

    const createRound = await roundsPostHandler(
      createContext({
        db,
        request: createJsonRequest('https://newcoders.org/api/hackathon/rounds', {
          method: 'POST',
          cookie: `session=${adminSessionId}`,
          body: { category: 'starter' },
        }),
      })
    );
    const createRoundBody = await createRound.json();

    await triggerHandler(
      createContext({
        db,
        params: { roundId: String(createRoundBody.round.id) },
        request: createJsonRequest(`https://newcoders.org/api/hackathon/rounds/${createRoundBody.round.id}/trigger`, {
          method: 'POST',
          cookie: `session=${adminSessionId}`,
        }),
      })
    );

    const pairing = await db.prepare('SELECT id FROM hackathon_pairings WHERE round_id = ?').bind(createRoundBody.round.id).first();

    await voteHandler(
      createContext({
        db,
        params: { pairingId: String(pairing.id) },
        request: createJsonRequest(`https://newcoders.org/api/hackathon/pairings/${pairing.id}/vote`, {
          method: 'POST',
          cookie: `session=${voterA.sessionId}`,
          body: { voted_for_user_id: participantA.userId },
        }),
      })
    );

    await voteHandler(
      createContext({
        db,
        params: { pairingId: String(pairing.id) },
        request: createJsonRequest(`https://newcoders.org/api/hackathon/pairings/${pairing.id}/vote`, {
          method: 'POST',
          cookie: `session=${voterB.sessionId}`,
          body: { voted_for_user_id: participantB.userId },
        }),
      })
    );

    const closeResponse = await closeHandler(
      createContext({
        db,
        params: { roundId: String(createRoundBody.round.id) },
        request: createJsonRequest(`https://newcoders.org/api/hackathon/rounds/${createRoundBody.round.id}/close`, {
          method: 'POST',
          cookie: `session=${adminSessionId}`,
        }),
      })
    );

    expect(closeResponse.status).toBe(200);
    const closeBody = await closeResponse.json();
    expect(closeBody.winners[0]).toEqual({
      pairing_id: pairing.id,
      pair_number: 1,
      winner_user_id: participantA.userId,
      votes_for_a: 1,
      votes_for_b: 1,
    });

    const storedPairing = await db
      .prepare('SELECT winner_user_id, votes_for_a, votes_for_b, status FROM hackathon_pairings WHERE id = ?')
      .bind(pairing.id)
      .first();
    expect(storedPairing).toEqual({
      winner_user_id: participantA.userId,
      votes_for_a: 1,
      votes_for_b: 1,
      status: 'closed',
    });

    const lateVote = await voteHandler(
      createContext({
        db,
        params: { pairingId: String(pairing.id) },
        request: createJsonRequest(`https://newcoders.org/api/hackathon/pairings/${pairing.id}/vote`, {
          method: 'POST',
          cookie: `session=${voterA.sessionId}`,
          body: { voted_for_user_id: participantA.userId },
        }),
      })
    );

    expect(lateVote.status).toBe(409);
    await expect(lateVote.json()).resolves.toEqual({ error: 'Voting is closed for this pairing' });
  });
});