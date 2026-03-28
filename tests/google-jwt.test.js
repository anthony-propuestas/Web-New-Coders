import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Codifica un objeto/string en base64url */
function b64url(obj) {
  const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/** Construye un JWT falso con header, payload y firma opcionales */
function buildJwt(header, payload, sig = 'fakesig') {
  return `${b64url(header)}.${b64url(payload)}.${b64url(sig)}`;
}

const CLIENT_ID = 'test-client-id.apps.googleusercontent.com';
const FAKE_KID = 'kid-de-prueba';
const FAKE_JWK = { kid: FAKE_KID, kty: 'RSA', n: 'modulus', e: 'AQAB', alg: 'RS256' };

/** Crea un payload válido con opción de sobreescribir campos */
function validPayload(overrides = {}) {
  return {
    iss: 'accounts.google.com',
    aud: CLIENT_ID,
    sub: '1234567890',
    email: 'alumno@newcoders.org',
    name: 'Alumno Test',
    picture: 'https://photo.google/pic',
    exp: Math.floor(Date.now() / 1000) + 3600, // expira en 1h
    iat: Math.floor(Date.now() / 1000) - 10,
    ...overrides,
  };
}

// ─── Suite principal ─────────────────────────────────────────────────────────

describe('verifyGoogleJwt', () => {
  let verifyGoogleJwt;

  beforeEach(async () => {
    // Resetear módulos para limpiar la caché de JWKS entre tests
    vi.resetModules();

    // Mock de fetch → simula la respuesta de Google JWKS
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ keys: [FAKE_JWK] }),
      })
    );

    // Mock de crypto.subtle para no necesitar claves RSA reales
    vi.spyOn(globalThis.crypto.subtle, 'importKey').mockResolvedValue({});
    vi.spyOn(globalThis.crypto.subtle, 'verify').mockResolvedValue(true);

    // Importación dinámica tras resetear módulos
    const module = await import('../functions/lib/google-jwt.js');
    verifyGoogleJwt = module.verifyGoogleJwt;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // ── Validación estructural ────────────────────────────────────────────────

  it('lanza error si el JWT tiene menos de 3 partes', async () => {
    await expect(verifyGoogleJwt('solo.dospartes', CLIENT_ID))
      .rejects.toThrow('Invalid JWT structure');
  });

  it('lanza error si el JWT tiene más de 3 partes', async () => {
    await expect(verifyGoogleJwt('uno.dos.tres.cuatro', CLIENT_ID))
      .rejects.toThrow('Invalid JWT structure');
  });

  it('lanza error si el JWT está vacío', async () => {
    await expect(verifyGoogleJwt('', CLIENT_ID))
      .rejects.toThrow();
  });

  // ── Validación del algoritmo ──────────────────────────────────────────────

  it('lanza error si el algoritmo no es RS256 (HS256)', async () => {
    const token = buildJwt({ alg: 'HS256', kid: FAKE_KID }, validPayload());
    await expect(verifyGoogleJwt(token, CLIENT_ID))
      .rejects.toThrow('Unsupported algorithm');
  });

  it('lanza error si el algoritmo no es RS256 (none)', async () => {
    const token = buildJwt({ alg: 'none', kid: FAKE_KID }, validPayload());
    await expect(verifyGoogleJwt(token, CLIENT_ID))
      .rejects.toThrow('Unsupported algorithm');
  });

  // ── Validación del kid (key id) ───────────────────────────────────────────

  it('lanza error si el kid no coincide con ninguna clave de Google', async () => {
    const token = buildJwt({ alg: 'RS256', kid: 'kid-desconocido' }, validPayload());
    await expect(verifyGoogleJwt(token, CLIENT_ID))
      .rejects.toThrow('No matching Google key');
  });

  // ── Validación de la firma ────────────────────────────────────────────────

  it('lanza error si la firma es inválida', async () => {
    vi.spyOn(globalThis.crypto.subtle, 'verify').mockResolvedValue(false);
    const token = buildJwt({ alg: 'RS256', kid: FAKE_KID }, validPayload());
    await expect(verifyGoogleJwt(token, CLIENT_ID))
      .rejects.toThrow('Invalid JWT signature');
  });

  // ── Validación de claims ──────────────────────────────────────────────────

  it('lanza error si el token está expirado', async () => {
    const token = buildJwt(
      { alg: 'RS256', kid: FAKE_KID },
      validPayload({ exp: Math.floor(Date.now() / 1000) - 100 })
    );
    await expect(verifyGoogleJwt(token, CLIENT_ID))
      .rejects.toThrow('Token expired');
  });

  it('lanza error si el issuer es inválido', async () => {
    const token = buildJwt(
      { alg: 'RS256', kid: FAKE_KID },
      validPayload({ iss: 'https://sitio-malicioso.com' })
    );
    await expect(verifyGoogleJwt(token, CLIENT_ID))
      .rejects.toThrow('Invalid issuer');
  });

  it('lanza error si la audience no coincide con el client id', async () => {
    const token = buildJwt(
      { alg: 'RS256', kid: FAKE_KID },
      validPayload({ aud: 'otro-client-id.apps.googleusercontent.com' })
    );
    await expect(verifyGoogleJwt(token, CLIENT_ID))
      .rejects.toThrow('Invalid audience');
  });

  it('lanza error si falta el claim email', async () => {
    const payload = validPayload();
    delete payload.email;
    const token = buildJwt({ alg: 'RS256', kid: FAKE_KID }, payload);
    await expect(verifyGoogleJwt(token, CLIENT_ID))
      .rejects.toThrow('Missing email claim');
  });

  it('lanza error si falta el claim sub', async () => {
    const payload = validPayload();
    delete payload.sub;
    const token = buildJwt({ alg: 'RS256', kid: FAKE_KID }, payload);
    await expect(verifyGoogleJwt(token, CLIENT_ID))
      .rejects.toThrow('Missing sub claim');
  });

  it('lanza error si el token aún no es válido (nbf en el futuro)', async () => {
    const token = buildJwt(
      { alg: 'RS256', kid: FAKE_KID },
      validPayload({ nbf: Math.floor(Date.now() / 1000) + 3600 })
    );
    await expect(verifyGoogleJwt(token, CLIENT_ID))
      .rejects.toThrow('Token not yet valid');
  });

  // ── Fetch de certificados ─────────────────────────────────────────────────

  it('lanza error si la petición a Google JWKS falla', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const token = buildJwt({ alg: 'RS256', kid: FAKE_KID }, validPayload());
    await expect(verifyGoogleJwt(token, CLIENT_ID))
      .rejects.toThrow('Failed to fetch Google certs');
  });

  // ── Token válido ──────────────────────────────────────────────────────────

  it('devuelve los datos del usuario para un token completamente válido', async () => {
    const token = buildJwt({ alg: 'RS256', kid: FAKE_KID }, validPayload());
    const result = await verifyGoogleJwt(token, CLIENT_ID);
    expect(result).toMatchObject({
      sub: '1234567890',
      email: 'alumno@newcoders.org',
      name: 'Alumno Test',
      picture: 'https://photo.google/pic',
    });
  });

  it('acepta el issuer en formato sin protocolo: accounts.google.com', async () => {
    const token = buildJwt(
      { alg: 'RS256', kid: FAKE_KID },
      validPayload({ iss: 'accounts.google.com' })
    );
    await expect(verifyGoogleJwt(token, CLIENT_ID)).resolves.toBeDefined();
  });

  it('acepta el issuer en formato con protocolo: https://accounts.google.com', async () => {
    const token = buildJwt(
      { alg: 'RS256', kid: FAKE_KID },
      validPayload({ iss: 'https://accounts.google.com' })
    );
    await expect(verifyGoogleJwt(token, CLIENT_ID)).resolves.toBeDefined();
  });

  it('devuelve string vacío para name cuando no está en el payload', async () => {
    const payload = validPayload();
    delete payload.name;
    const token = buildJwt({ alg: 'RS256', kid: FAKE_KID }, payload);
    const result = await verifyGoogleJwt(token, CLIENT_ID);
    expect(result.name).toBe('');
  });

  it('devuelve string vacío para picture cuando no está en el payload', async () => {
    const payload = validPayload();
    delete payload.picture;
    const token = buildJwt({ alg: 'RS256', kid: FAKE_KID }, payload);
    const result = await verifyGoogleJwt(token, CLIENT_ID);
    expect(result.picture).toBe('');
  });
});
