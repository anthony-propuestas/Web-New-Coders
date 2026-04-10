import { beforeEach, describe, expect, it, vi } from 'vitest';

function encodeSegment(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function createJwt(payloadOverrides = {}, headerOverrides = {}) {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'RS256',
    kid: 'test-key',
    typ: 'JWT',
    ...headerOverrides,
  };
  const payload = {
    iss: 'https://accounts.google.com',
    aud: 'test-client-id',
    exp: now + 3600,
    sub: 'google-sub-123',
    email: 'test@example.com',
    name: 'Test User',
    picture: 'https://example.com/avatar.png',
    ...payloadOverrides,
  };

  return `${encodeSegment(header)}.${encodeSegment(payload)}.signature`;
}

async function loadModule() {
  vi.resetModules();
  return import('../../functions/lib/google-jwt.js');
}

describe('verifyGoogleJwt', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        async json() {
          return {
            keys: [{ kid: 'test-key', kty: 'RSA', n: 'abc', e: 'AQAB', alg: 'RS256' }],
          };
        },
      }))
    );

    vi.spyOn(globalThis.crypto.subtle, 'importKey').mockResolvedValue({ type: 'public' });
    vi.spyOn(globalThis.crypto.subtle, 'verify').mockResolvedValue(true);
  });

  it('accepts a valid Google JWT', async () => {
    const { verifyGoogleJwt } = await loadModule();

    await expect(verifyGoogleJwt(createJwt(), 'test-client-id')).resolves.toEqual({
      sub: 'google-sub-123',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/avatar.png',
    });
  });

  it('rejects tokens with an invalid audience', async () => {
    const { verifyGoogleJwt } = await loadModule();

    await expect(
      verifyGoogleJwt(createJwt({ aud: 'different-client-id' }), 'test-client-id')
    ).rejects.toThrow('Invalid audience');
  });

  it('rejects expired tokens', async () => {
    const { verifyGoogleJwt } = await loadModule();
    const now = Math.floor(Date.now() / 1000);

    await expect(
      verifyGoogleJwt(createJwt({ exp: now - 30 }), 'test-client-id')
    ).rejects.toThrow('Token expired');
  });

  it('rejects tokens without email or sub claims', async () => {
    const { verifyGoogleJwt } = await loadModule();

    await expect(
      verifyGoogleJwt(createJwt({ email: undefined }), 'test-client-id')
    ).rejects.toThrow('Missing email claim');

    await expect(
      verifyGoogleJwt(createJwt({ sub: undefined }), 'test-client-id')
    ).rejects.toThrow('Missing sub claim');
  });

  it('rejects unsupported algorithms before verifying', async () => {
    const { verifyGoogleJwt } = await loadModule();

    await expect(
      verifyGoogleJwt(createJwt({}, { alg: 'HS256' }), 'test-client-id')
    ).rejects.toThrow('Unsupported algorithm: HS256');

    expect(globalThis.crypto.subtle.verify).not.toHaveBeenCalled();
  });

  it('caches Google certs for repeated validations', async () => {
    const { verifyGoogleJwt } = await loadModule();

    await verifyGoogleJwt(createJwt(), 'test-client-id');
    await verifyGoogleJwt(createJwt({ sub: 'another-user' }), 'test-client-id');

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});