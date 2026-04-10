export function createJsonRequest(url, { method = 'GET', body, headers = {}, cookie } = {}) {
  const requestHeaders = new Headers(headers);

  if (body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (cookie) {
    requestHeaders.set('Cookie', cookie);
  }

  if (!requestHeaders.has('Origin')) {
    requestHeaders.set('Origin', 'https://newcoders.org');
  }

  if (!requestHeaders.has('CF-Connecting-IP')) {
    requestHeaders.set('CF-Connecting-IP', '127.0.0.1');
  }

  return new Request(url, {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function createContext({ request, db, env = {}, params = {} }) {
  return {
    request,
    params,
    env: {
      DB: db,
      ...env,
    },
  };
}

export function extractCookieValue(setCookieHeader, cookieName = 'session') {
  const match = setCookieHeader?.match(new RegExp(`${cookieName}=[^;]+`));
  return match ? match[0] : null;
}