const GOOGLE_CERTS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const GOOGLE_ISSUERS = ['accounts.google.com', 'https://accounts.google.com'];

let cachedCerts = null;
let cachedAt = 0;
const CACHE_DURATION_MS = 3600_000; // 1 hour

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  return new Uint8Array([...binary].map((c) => c.charCodeAt(0)));
}

function decodeJwtParts(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT structure');

  const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[0])));
  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[1])));

  return { header, payload, signatureB64: parts[2], signedContent: `${parts[0]}.${parts[1]}` };
}

async function fetchGoogleCerts() {
  const now = Date.now();
  if (cachedCerts && now - cachedAt < CACHE_DURATION_MS) {
    return cachedCerts;
  }

  const res = await fetch(GOOGLE_CERTS_URL);
  if (!res.ok) throw new Error('Failed to fetch Google certs');

  const jwks = await res.json();
  cachedCerts = jwks.keys;
  cachedAt = now;
  return cachedCerts;
}

async function importKey(jwk) {
  return crypto.subtle.importKey(
    'jwk',
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: jwk.alg, ext: true },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );
}

export async function verifyGoogleJwt(token, clientId) {
  const { header, payload, signatureB64, signedContent } = decodeJwtParts(token);

  // Verify algorithm
  if (header.alg !== 'RS256') {
    throw new Error('Unsupported algorithm: ' + header.alg);
  }

  // Fetch and find matching key
  const certs = await fetchGoogleCerts();
  const jwk = certs.find((k) => k.kid === header.kid);
  if (!jwk) throw new Error('No matching Google key found for kid: ' + header.kid);

  // Verify signature
  const key = await importKey(jwk);
  const signature = base64UrlDecode(signatureB64);
  const data = new TextEncoder().encode(signedContent);

  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, data);
  if (!valid) throw new Error('Invalid JWT signature');

  // Verify claims
  if (!GOOGLE_ISSUERS.includes(payload.iss)) {
    throw new Error('Invalid issuer: ' + payload.iss);
  }

  if (payload.aud !== clientId) {
    throw new Error('Invalid audience');
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    throw new Error('Token expired');
  }

  if (payload.nbf && payload.nbf > now) {
    throw new Error('Token not yet valid');
  }

  if (!payload.email) {
    throw new Error('Missing email claim');
  }

  if (!payload.sub) {
    throw new Error('Missing sub claim');
  }

  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name || '',
    picture: payload.picture || '',
  };
}
