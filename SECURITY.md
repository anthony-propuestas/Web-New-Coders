# Analisis de Seguridad

## Resumen Ejecutivo

- **Tipo de Aplicacion**: React SPA + API REST serverless (Cloudflare Pages Functions + D1)
- **Tipo de Datos**: Contenido educativo + Perfil Google (nombre, email, foto) + Progreso del curso
- **Autenticacion**: Google OAuth 2.0 con verificacion JWT criptografica server-side (RS256 + JWKS)
- **Sesiones**: HTTP-only cookies server-side persistidas en Cloudflare D1
- **URL**: https://newcoders.org
- **Nivel de Riesgo General**: BAJO

---

## Controles de Seguridad Implementados

### 1. Autenticacion Server-Side con Google OAuth

#### Flujo real (como esta implementado en el codigo)

```
Usuario
  -> <GoogleLogin> boton (LoginPage.jsx)
  -> Google OAuth devuelve { credential: JWT }
  -> login(credentialResponse) en useAuth.jsx
  -> POST /api/auth/google  { credential }
     [functions/api/auth/google.js]
       -> checkRateLimit(ip, 'auth')  — max 10/min por IP
       -> verifyGoogleJwt(credential, GOOGLE_CLIENT_ID)
          [functions/lib/google-jwt.js]
       -> db.prepare('SELECT ... WHERE google_sub = ?')  — upsert usuario
       -> Nuevo usuario: INSERT OR IGNORE INTO enrollments season='S1'
       -> INSERT INTO sessions (id, user_id, expires_at)
       -> Set-Cookie: session=<hex64>; HttpOnly; Secure; SameSite=Strict; Path=/api
  <- { user: { id, name, email, picture, role, created_at } }
  -> setUser(data.user) en React
  -> Si localStorage.completedLessons existe: POST /api/progress/migrate
```

#### Codigo en useAuth.jsx

```javascript
// Restaurar sesion al cargar la app — consulta al servidor, no lee storage
useEffect(() => {
  async function restoreSession() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch { /* sin sesion */ }
    finally {
      // Limpieza de datos legacy
      localStorage.removeItem('google_auth_credential');
      sessionStorage.removeItem('google_auth_user');
      setLoading(false);
    }
  }
  restoreSession();
}, []);

// Login: envia el JWT credential al servidor, nunca lo procesa en cliente
const login = useCallback(async (credentialResponse) => {
  const res = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ credential: credentialResponse.credential }),
  });
  if (res.ok) {
    const data = await res.json();
    setUser(data.user);
    // ...migracion de localStorage...
  }
}, []);

// Logout: elimina sesion en servidor + revoca token Google
const logout = useCallback(async () => {
  const email = user?.email;
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  setUser(null);
  if (email && window.google?.accounts?.id) {
    window.google.accounts.id.revoke(email, () => {});
  }
}, [user?.email]);
```

---

### 2. Verificacion Criptografica de JWT (RS256 + JWKS)

**Archivo**: `functions/lib/google-jwt.js`

```javascript
export async function verifyGoogleJwt(token, clientId) {
  const { header, payload, signatureB64, signedContent } = decodeJwtParts(token);

  // 1. Solo RS256 aceptado
  if (header.alg !== 'RS256') throw new Error('Unsupported algorithm: ' + header.alg);

  // 2. Obtener claves publicas de Google (cache en memoria, 1 hora)
  const certs = await fetchGoogleCerts(); // https://www.googleapis.com/oauth2/v3/certs
  const jwk = certs.find((k) => k.kid === header.kid);
  if (!jwk) throw new Error('No matching Google key found for kid: ' + header.kid);

  // 3. Verificar firma criptografica con Web Crypto API
  const key = await crypto.subtle.importKey(
    'jwk', { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: jwk.alg, ext: true },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']
  );
  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, data);
  if (!valid) throw new Error('Invalid JWT signature');

  // 4. Validar claims
  if (!GOOGLE_ISSUERS.includes(payload.iss)) throw new Error('Invalid issuer');
  if (payload.aud !== clientId) throw new Error('Invalid audience');
  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Token expired');
  if (payload.nbf && payload.nbf > now) throw new Error('Token not yet valid');
  if (!payload.email) throw new Error('Missing email claim');
  if (!payload.sub) throw new Error('Missing sub claim');
}
```

**Validaciones en orden:**

| # | Validacion | Descripcion |
|---|---|---|
| 1 | Estructura | JWT debe tener exactamente 3 partes (header.payload.signature) |
| 2 | Algoritmo | Solo `RS256` aceptado |
| 3 | Key ID | Debe existir una clave JWKS de Google que coincida con `kid` |
| 4 | Firma | Verificacion criptografica con Web Crypto API (no con librerias de terceros) |
| 5 | Issuer | `accounts.google.com` o `https://accounts.google.com` |
| 6 | Audience | Debe coincidir con `GOOGLE_CLIENT_ID` del servidor (no del cliente) |
| 7 | Expiracion | `payload.exp` mayor al tiempo actual |
| 8 | nbf | Token no valido antes de su tiempo de emision |
| 9 | Email | Campo `email` debe existir |
| 10 | Sub | Campo `sub` (Google ID unico) debe existir |

**Cache de certificados**: en memoria del Worker, duracion 1 hora. Se refrescan automaticamente si expiran.

---

### 3. Gestion de Sesiones Server-Side

**Archivo**: `functions/lib/session.js`

```javascript
// Cookie generada al crear sesion
export function sessionCookie(sessionId, maxAge = 72 * 3600) {
  return `session=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=${maxAge}`;
}

// Session ID: 32 bytes aleatorios criptograficamente seguros (hex 64 chars)
export function generateSessionId() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

// Validacion de sesion en cada request autenticado
export async function getAuthenticatedUser(db, request) {
  const sessionId = getSessionId(request); // valida formato hex 64 con regex
  if (!sessionId) return null;

  const row = await db.prepare(`
    SELECT u.*, s.expires_at, s.last_used_at
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.id = ? AND u.is_active = 1   -- usuario debe estar activo
  `).bind(sessionId).first();

  if (!row) return null;

  // Expiracion absoluta: 72h desde creacion
  if (new Date(row.expires_at) < new Date()) {
    await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
    return null;
  }

  // Idle timeout: 24h sin actividad
  const idleHours = (Date.now() - new Date(row.last_used_at)) / (1000 * 60 * 60);
  if (idleHours > 24) {
    await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
    return null;
  }

  // Renovar last_used_at en cada request autenticado
  await db.prepare("UPDATE sessions SET last_used_at = datetime('now') WHERE id = ?")
    .bind(sessionId).run();

  return { id, google_sub, email, name: display_name || name, picture, role, created_at };
}
```

**Atributos de la cookie:**

| Atributo | Valor | Proposito |
|---|---|---|
| `HttpOnly` | — | Inaccesible desde JavaScript (previene robo via XSS) |
| `Secure` | — | Solo se envia por HTTPS |
| `SameSite=Strict` | — | No se envia en requests cross-site (previene CSRF) |
| `Path=/api` | — | Solo se adjunta a endpoints de la API |
| `Max-Age=259200` | 72h | Expiracion absoluta en el navegador |

**Ciclo de vida:**
- Creada al hacer login exitoso
- Eliminada en logout (DELETE FROM sessions + Set-Cookie con Max-Age=0)
- Eliminada automaticamente si expira (72h absoluto) o si hay idle >24h
- Verificacion de `is_active = 1` en cada request (si el admin desactiva al usuario, la sesion deja de funcionar de inmediato)

---

### 4. Rate Limiting

**Archivo**: `functions/lib/rate-limit.js`

Implementado con ventana deslizante en D1. Si la DB falla, el request se permite (fail-open) para no bloquear usuarios legitimos.

| Tipo | Limite | Ventana | Identificador |
|---|---|---|---|
| `auth` | 10 requests | 60 segundos | `ip:<CF-Connecting-IP>:auth` |
| `progress` | 30 requests | 60 segundos | `user:<user_id>` |
| `migrate` | 3 requests | 300 segundos | `user:<user_id>` |
| `profile` | 20 requests | 60 segundos | `user:<user_id>` |

Respuesta al superar el limite:
```json
HTTP 429
Retry-After: <segundos>
{ "error": "Too many requests. Try again later." }
```

---

### 5. Audit Log

**Archivo**: `functions/lib/audit.js`

Registro en la tabla `audit_log` de acciones sensibles:

| Accion | Cuando |
|---|---|
| `profile_update` | Usuario actualiza display_name |
| `account_deleted` | Usuario elimina su cuenta |
| `data_export` | Usuario exporta sus datos |
| `certificate_generated` | Usuario genera certificado |
| `admin_stats_view` | Admin accede a estadisticas |
| `admin_users_list` | Admin lista usuarios |
| `admin_user_activated` | Admin activa/desactiva usuario |

Campos: `user_id`, `action`, `details` (JSON), `ip_address`, `created_at`.

---

### 6. Sanitizacion de Entrada

#### display_name — `PATCH /api/users/me`
```javascript
if (typeof display_name !== 'string') return error('must be string', 400);
const trimmed = display_name.trim();
if (trimmed.length > 100) return error('max 100 chars', 400);
if (/[<>&"']/.test(trimmed)) return error('invalid characters', 400);
const sanitized = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
```

#### Dia de progreso — `POST /api/progress/:day`
```sql
-- CHECK constraint en schema.sql
day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 30)
```

#### Paginacion admin — segura contra entradas maliciosas
```javascript
const page  = Math.max(1, parseInt(url.searchParams.get('page')  || '1',  10));
const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
```

#### SQL Injection
Todos los queries usan prepared statements con `.bind()` en D1. No hay concatenacion de strings en SQL.

---

### 7. GDPR y Privacidad

#### Soft-delete con anonimizacion
```javascript
// DELETE /api/users/me
await db.prepare(`
  UPDATE users
  SET email = ?, name = 'Usuario eliminado', display_name = NULL,
      picture_url = NULL, is_active = 0, google_sub = ?
  WHERE id = ?
`).bind(`deleted_${user.id}@deleted.invalid`, `deleted_${user.id}`, user.id).run();

// Eliminar todas las sesiones activas
await db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(user.id).run();
```
Los registros de progreso se conservan anonimizados (para estadisticas anonimas).

#### Exportacion JSON
```javascript
// GET /api/users/export
const exportData = {
  profile: { id, name, email, role, created_at },
  progress: { lessons_completed, total },
  enrollments,
  achievements,
  active_sessions: count, // sin IDs por seguridad
};
// Content-Disposition: attachment; filename="newcoders-datos-{id}.json"
```

Requiere doble confirmacion en el frontend antes de ejecutar la eliminacion.

---

### 8. Control de Acceso por Roles (RBAC)

```javascript
// Todos los endpoints admin
const user = await getAuthenticatedUser(db, request);
if (!user) return errorResponse('Not authenticated', 401, request);
if (user.role !== 'admin') return errorResponse('Forbidden', 403, request);

// Proteccion adicional: admin no puede desactivarse a si mismo
if (user_id === admin.id) {
  return errorResponse('Cannot modify your own account status', 400, request);
}
```

Roles disponibles: `user` (defecto), `admin`. Asignados en DB, no modificables desde el cliente.

---

### 9. Proteccion contra XSS

- **React escapa HTML automaticamente** en todas las expresiones `{variable}`
- **No se usa `dangerouslySetInnerHTML`**, `eval()`, ni `Function()` en ninguna parte de la app
- **Sanitizacion server-side** de todos los campos editables por el usuario
- **CSP** limita los origenes de scripts (ver seccion 10)

---

### 10. Content Security Policy (CSP)

**Configuracion actual en `index.html`:**

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline'
             https://accounts.google.com https://apis.google.com
             https://static.cloudflareinsights.com;
  style-src 'self' 'unsafe-inline'
            https://fonts.googleapis.com https://accounts.google.com;
  img-src 'self' data:
          https://lh3.googleusercontent.com https://placehold.co;
  font-src 'self' https://fonts.gstatic.com;
  frame-src https://accounts.google.com;
  connect-src 'self'
              https://accounts.google.com https://apis.google.com
              https://oauth2.googleapis.com https://cloudflareinsights.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests
" />
```

**Nota sobre `unsafe-inline` en script-src**: requerido por el SDK de Google OAuth (`@react-oauth/google`). El riesgo se mitiga porque `unsafe-eval` no esta incluido y el CSP bloquea scripts de origenes no autorizados.

**Nota sobre `frame-ancestors`**: no se puede aplicar via meta tag — esta directiva solo funciona como header HTTP. Se aplica en `public/_headers` con `X-Frame-Options: DENY`.

---

### 11. Security Headers

#### Produccion — `public/_headers`
```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
```

#### Desarrollo — `vite.config.js`
```javascript
headers: {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
}
```

---

### 12. Seguridad de Enlaces Externos

```jsx
// Prevencion de tabnabbing en todos los enlaces externos
<a href={url} target="_blank" rel="noopener noreferrer">...</a>

// Fotos de perfil: sin filtrado de referrer para privacidad
<img src={user.picture} referrerPolicy="no-referrer" />
```

---

### 13. Variables de Entorno

| Variable | Ubicacion | Descripcion |
|---|---|---|
| `VITE_GOOGLE_CLIENT_ID` | `.env.local` (no en repo) | Client ID visible en bundle (OAuth requiere exposicion en frontend) |
| `GOOGLE_CLIENT_ID` | Cloudflare Dashboard | Client ID para validacion server-side del JWT |
| `GOOGLE_CLIENT_SECRET` | Cloudflare Dashboard | Secret nunca expuesto al cliente |

- `.env.local` incluido en `.gitignore`
- `GOOGLE_CLIENT_SECRET` solo en el servidor (Cloudflare env vars), nunca en el bundle

---

## Checklist de Seguridad

| Aspecto | Estado | Notas |
|---|---|---|
| **XSS Protection** | BIEN | React escapa HTML, sin dangerouslySetInnerHTML, sanitizacion server-side |
| **Input Validation** | BIEN | display_name: tipo, longitud, chars HTML peligrosos, bytes de control |
| **JWT Verification** | BIEN | RS256 + JWKS via Web Crypto API, 10 validaciones en total |
| **HTTP-only Cookies** | BIEN | `HttpOnly; Secure; SameSite=Strict; Path=/api` |
| **Session Expiry** | BIEN | 72h absoluto + 24h idle timeout + eliminacion activa |
| **Rate Limiting** | BIEN | Por IP (auth) y por user_id (progreso, perfil, migrate) |
| **Audit Log** | BIEN | 7 acciones sensibles y administrativas registradas |
| **GDPR** | BIEN | Soft-delete con anonimizacion + exportacion JSON + doble confirmacion |
| **RBAC** | BIEN | role validado en DB, admin no puede modificarse a si mismo |
| **CSRF** | BIEN | `SameSite=Strict` + Google OAuth SDK |
| **SQL Injection** | BIEN | Prepared statements con `.bind()` en todos los queries D1 |
| **Tabnabbing** | BIEN | `rel="noopener noreferrer"` en todos los enlaces externos |
| **CSP** | IMPLEMENTADA | Meta tag completa; `unsafe-inline` en script-src por Google OAuth |
| **Security Headers** | BIEN | Dev (vite.config.js) + Prod (public/_headers con HSTS) |
| **Variables de Entorno** | BIEN | `.env.local` en gitignore, secrets solo en servidor |
| **Dependencias** | BIEN | 3 deps produccion (react, react-dom, @react-oauth/google) |
| **localStorage Auth** | ELIMINADO | Auth solo via HTTP-only cookie server-side |
| **Tests de Seguridad** | PENDIENTE | No existen tests automatizados |
| **CI/CD Security** | PENDIENTE | No hay pipeline de CI/CD |

---

## Vulnerabilidades Identificadas (Bajo Riesgo)

### 1. Progreso en localStorage antes del primer login
Antes del primer login, el progreso podria estar en localStorage si el usuario nunca inicio sesion. La migracion al hacer login lo valida (solo dias 1-30) y lo sube al servidor.

**Impacto**: BAJO — solo contenido educativo, validado al migrar.

### 2. `unsafe-inline` en script-src
Necesario para el SDK de Google OAuth. `unsafe-eval` no esta incluido y los scripts externos estan restringidos a dominios de Google + Cloudflare.

**Impacto**: BAJO

### 3. Rate limiting fail-open
Si la tabla `rate_limit` en D1 falla, los requests se permiten para no afectar usuarios legitimos.

**Impacto**: BAJO — un atacante necesitaria que D1 falle para explotar esto temporalmente.

### 4. Cache de JWKS en memoria del Worker
Las claves publicas de Google se cachean en memoria del Worker por 1 hora. Si Google rota claves, podria haber un lapso hasta que el cache expire.

**Impacto**: MUY BAJO — Google rota claves con aviso y mantiene ambas activas durante la transicion.

---

## Recomendaciones para Produccion

### 1. Tests automatizados
```javascript
// Tests criticos para verifyGoogleJwt()
// - Firma invalida -> debe lanzar error
// - Issuer invalido -> debe lanzar error
// - Audience incorrecta -> debe lanzar error
// - Token expirado -> debe lanzar error
// - Claims faltantes -> debe lanzar error
// - Token valido -> retorna { sub, email, name, picture }
```

### 2. CI/CD con escaneo de dependencias
```yaml
# GitHub Actions
- name: Security audit
  run: npm audit --audit-level=moderate
# Habilitar Dependabot para actualizaciones automaticas
```

### 3. Rotacion de sesiones
Considerar invalidar sesiones anteriores al hacer login desde un nuevo dispositivo.

### 4. Auditoria periodica
```bash
npm audit
npm audit fix
```

---

## Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Security Best Practices (RFC 8725)](https://datatracker.ietf.org/doc/html/rfc8725)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Google OAuth Security](https://developers.google.com/identity/protocols/oauth2)
- [Content Security Policy (MDN)](https://developer.mozilla.org/es/docs/Web/HTTP/CSP)

---

## Conclusion

La aplicacion tiene un nivel de seguridad **SOLIDO** para una plataforma educativa con autenticacion Google OAuth y backend serverless.

**Arquitectura de seguridad:**
- JWT verificado criptograficamente server-side (RS256 + JWKS + 10 validaciones)
- Sesion HTTP-only con doble timeout (absoluto 72h + idle 24h)
- Rate limiting multi-capa (IP para auth, user_id para todo lo demas)
- Audit log completo de acciones sensibles
- Cumplimiento GDPR con soft-delete y exportacion de datos
- Sin datos de autenticacion en localStorage o sessionStorage

**Datos manejados:**
- Contenido educativo (lecciones de programacion — publico)
- Perfil basico de Google (nombre, email, foto) — en D1, no en cliente
- Progreso del curso (dias completados) — en D1

---

**Fecha del Analisis:** Marzo 21, 2026
**Version de la App:** 2.0.0
**Nivel de Severidad:** BAJO
