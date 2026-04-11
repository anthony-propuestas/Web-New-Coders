# Tests del proyecto

Este documento explica qué tests existen en el repositorio, cómo ejecutarlos y cómo funciona la infraestructura de pruebas.

## Resumen

La suite usa `Vitest` en entorno `node` y prueba directamente los handlers de Cloudflare Pages Functions sin levantar Wrangler ni un servidor HTTP real.

La base de datos de pruebas se monta en memoria con `better-sqlite3` y un shim pequeño que imita la API mínima de D1 usada por el proyecto:

- `prepare().bind().first()`
- `prepare().bind().all()`
- `prepare().bind().run()`
- `batch()`

Eso permite validar lógica real de endpoints, sesiones, rate limits, auditoría, progreso y administración con bajo costo de ejecución.

## Comandos

```bash
# Ejecutar toda la suite
npm test

# Modo watch
npm run test:watch

# Ejecutar solo auth
npm run test:auth
```

## Configuración base

### `vitest.config.js`

- Usa entorno `node`.
- Carga `tests/setup.js` antes de las pruebas.
- Incluye todos los archivos `tests/**/*.test.js`.
- Limpia mocks automáticamente entre tests.

### `tests/setup.js`

Prepara APIs que el backend espera pero que no existen igual en Node puro:

- expone `crypto` desde `node:crypto`
- define `atob` y `btoa`
- restaura timers y mocks después de cada test

## Helpers de test

### `tests/helpers/d1.js`

Implementa `D1DatabaseMock` sobre SQLite en memoria.

Cómo funciona:

- carga `schema.sql` real al iniciar cada base de pruebas
- activa `foreign_keys = ON`
- expone `prepare()` con respuestas compatibles con los handlers actuales
- implementa `batch()` para cubrir migraciones como `progress/migrate`

Esto evita mocks frágiles de SQL y hace que la suite corra contra el esquema real del proyecto.

### `tests/helpers/http.js`

Construye objetos `Request` y `context` similares a Cloudflare:

- `createJsonRequest()` arma requests JSON con `Origin` e IP por defecto
- `createContext()` arma `request`, `env`, `params`
- `extractCookieValue()` ayuda a inspeccionar `Set-Cookie`

### `tests/helpers/fixtures.js`

Crea usuarios autenticados de forma rápida para tests de integración.

Qué hace:

- inserta un usuario en `users`
- opcionalmente lo inscribe en `enrollments`
- crea una sesión válida en `sessions`
- devuelve `sessionId` y `userId`

## Organización de la suite

La carpeta `tests/` está dividida por dominio:

- `tests/auth`
- `tests/profile-progress`
- `tests/admin-chat`
- `tests/helpers`

## Cobertura actual

### Auth

#### `tests/auth/google-jwt.test.js`

Prueba la verificación de JWT de Google en `functions/lib/google-jwt.js`.

Casos cubiertos:

- token válido
- audiencia inválida
- token expirado
- ausencia de `email`
- ausencia de `sub`
- algoritmo no soportado
- caché de certificados JWKS

Cómo funciona:

- mockea `fetch` para no salir a Google
- mockea `crypto.subtle.importKey` y `crypto.subtle.verify`
- genera JWTs de prueba con segmentos codificados en base64url

#### `tests/auth/session-rate-limit.test.js`

Prueba utilidades de `functions/lib/session.js` y `functions/lib/rate-limit.js`.

Casos cubiertos:

- generación de session ids hexadecimales
- formato de cookie segura
- limpieza de cookie
- extracción de `session` desde `Cookie`
- recuperación de usuario autenticado
- invalidación por expiración e inactividad
- lectura de IP desde headers Cloudflare
- bloqueo y reset de rate limit

Nota importante:

- aquí quedó cubierto un bug real del proyecto: la comparación de timestamps del rate limit no era compatible con `datetime('now')` de SQLite cuando se usaban strings ISO con `T` y `Z`

#### `tests/auth/login.integration.test.js`

Prueba `POST /api/auth/google` en `functions/api/auth/google.js`.

Casos cubiertos:

- login exitoso de usuario nuevo
- alta de sesión
- inscripción automática en temporada
- escritura de `audit_log`
- login de usuario existente con incremento de `login_count`
- falta de `credential`
- falta de `GOOGLE_CLIENT_ID`
- error de verificación JWT
- rate limit al intento 11

Cómo funciona:

- el handler se ejecuta directo
- `verifyGoogleJwt` está mockeado para aislar la lógica del endpoint de la criptografía

#### `tests/auth/session.integration.test.js`

Prueba `GET /api/auth/me` y `POST /api/auth/logout`.

Casos cubiertos:

- restauración de sesión válida
- rechazo sin sesión
- invalidación de sesiones expiradas
- invalidación por idle timeout
- logout con borrado de sesión
- limpieza de cookie
- escritura de auditoría de logout

### Perfil y progreso

#### `tests/profile-progress/users-me.integration.test.js`

Prueba `GET/PATCH/DELETE /api/users/me`.

Casos cubiertos:

- perfil autenticado con resumen de progreso e inscripción
- actualización de `display_name`
- sanitización de caracteres de control
- rechazo de nombres inválidos
- soft-delete GDPR
- borrado de sesiones al eliminar cuenta
- limpieza de cookie
- escritura de auditoría

#### `tests/profile-progress/progress.integration.test.js`

Prueba `GET /api/progress`, `POST /api/progress/:day` y `POST /api/progress/migrate`.

Casos cubiertos:

- lista de días completados
- porcentaje
- racha actual y mejor racha
- guardado de un día válido
- otorgamiento de logro inicial
- rechazo de día inválido
- rate limit de progreso
- migración de días válidos
- ignorar duplicados y datos inválidos

#### `tests/profile-progress/users-extras.integration.test.js`

Prueba endpoints extra del área de usuario:

- `GET /api/users/achievements`
- `GET /api/users/certificate`
- `GET /api/users/export`

Casos cubiertos:

- listado de logros ordenado por fecha
- certificado no elegible cuando faltan días
- generación de certificado al completar los 30 días
- persistencia de `certificate_generated_at`
- evitar regeneración de la fecha en llamadas posteriores
- exportación de perfil, progreso, inscripción, logros y sesiones activas
- auditoría de exportación

Nota importante:

- `schema.sql` fue alineado con el backend para incluir `deleted_at` y `certificate_generated_at`, porque el handler de certificado ya dependía de esas columnas

### Admin y chat

#### `tests/admin-chat/admin.integration.test.js`

Prueba:

- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/hackathon-registrations`
- `PATCH /api/admin/users`

Casos cubiertos:

- permisos de admin
- agregados de usuarios activos y progreso promedio
- tasa de completado por lección
- inscripciones por temporada
- listado paginado con búsqueda
- filtro por usuarios activos
- rechazo sin sesión para listar registrados de hackathon
- lista vacía de hackathon cuando no hay formularios enviados
- listado de registrados desde `hackathon_registrations` y no desde `users.role`
- exclusión de usuarios con rol `new_hacker` si no enviaron el formulario
- orden por `registered_at ASC, user_id ASC` en la lista de hackathon
- reflejo real de envíos al formulario `POST /api/hackathon/register`
- desactivación de usuarios
- limpieza de sesiones al desactivar
- protección contra auto-desactivación del admin
- auditoría de acciones admin

#### `tests/admin-chat/chat.integration.test.js`

Prueba `POST /api/chat`.

Casos cubiertos:

- servicio no disponible sin `OPENAI_API_KEY`
- payload vacío
- detección de prompt injection
- sanitización y recorte de historial
- construcción correcta del payload enviado a OpenAI
- respuesta correcta del asistente
- rate limit anónimo por IP

Cómo funciona:

- mockea `fetch` global hacia OpenAI
- en el test de rate limit, las primeras 10 llamadas fuerzan un `502` del proveedor de IA para consumir cuota; la llamada 11 debe responder `429`

## CI

La ejecución automática en GitHub Actions está definida en:

- `.github/workflows/ci.yml`

Qué hace:

- corre en `push` a `main`
- corre en `pull_request` hacia `main`
- usa Node 20
- ejecuta `npm ci`
- ejecuta `npm test`

## Cómo agregar nuevos tests

Recomendaciones para extender la suite:

1. Reutiliza `createTestDb()` en vez de mockear SQL manualmente.
2. Reutiliza `createAuthenticatedSession()` cuando el endpoint dependa de sesión.
3. Usa `createJsonRequest()` y `createContext()` para simular el runtime de Cloudflare.
4. Si el endpoint habla con servicios externos, mockea la frontera externa y deja el resto real.
5. Intenta probar comportamiento observable: status, body, headers y cambios en DB.
6. Si agregas columnas que el backend ya usa, actualiza también `schema.sql` para que la suite siga representando producción.

## Estado actual

Cobertura actual registrada:

- 11 archivos de tests
- 53 tests pasando
- cobertura sobre auth, perfil, progreso, extras de usuario, admin y chat

Nota:

- la cobertura de admin ahora incluye el flujo de participantes del hackathon visibles en el panel Admin > Hackathon a través del endpoint `GET /api/admin/hackathon-registrations`

La suite está pensada como integración liviana + unit tests selectivos, no como E2E de navegador.