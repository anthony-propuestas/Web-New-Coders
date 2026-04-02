# New Coders: Dev Path — 30 Dias de Codigo

Plataforma educativa interactiva tipo calendario que guia a programadores principiantes a traves de un curriculo de 30 dias. Cada dia desbloquea una leccion con teoria, ejemplos de codigo, retos practicos y recursos externos.

**URL de produccion**: https://newcoders.org

**Inicio del curso**: 1 de abril de 2026

---

## Caracteristicas

- **Calendario interactivo de 30 dias** con desbloqueo progresivo por fecha (desde `2026-04-01`)
- **Autenticacion con Google OAuth 2.0** validada criptograficamente en servidor (RS256 + JWKS)
- **Sesiones server-side** con HTTP-only cookies (72h expiry, 24h idle timeout)
- **7 vistas**: Calendario, Leccion, Introduccion, Herramientas, Nosotros, Mi Perfil, Admin
- **Seguimiento de progreso** persistido en Cloudflare D1 (con fallback a localStorage si la API no responde)
- **Rachas de aprendizaje** — racha actual y racha maxima calculadas en servidor
- **Perfil editable** — nombre guardado en servidor via API con sanitizacion estricta
- **Logros (achievements)** — 5 badges: Primer Paso, Maestro HTML, Maestro CSS, Maestro JavaScript, Racha 7 dias, Dev Path Completado
- **Certificado de completado** — generado al completar los 30 dias
- **Exportacion de datos** — descarga JSON con datos completos (GDPR)
- **Eliminacion de cuenta** — soft-delete con anonimizacion de datos (GDPR)
- **Asistente virtual con IA** — chatbot flotante impulsado por OpenAI gpt-4o-mini, limitado al contenido del curso, con rate limiting de 3 niveles (10/min, 100/mes por usuario, 1000/mes global)
- **Rate limiting** — por IP (auth) y por usuario (progreso, perfil, migracion, chat)
- **Audit log** — registro de acciones sensibles y administrativas
- **Panel de administrador** — estadisticas y gestion de usuarios (role-gated)
- **API REST serverless** con Cloudflare Workers (auth, progreso, usuarios, admin)
- **Migracion automatica** de progreso de localStorage a servidor al iniciar sesion
- **Carrusel de aliados** con auto-scroll responsive (actualmente con imagenes placeholder)
- **Cuenta regresiva** hasta la fecha de inicio del curso
- **Tema cyberpunk/neon** — fuente Orbitron + Source Code Pro, fondo oscuro, bordes brillantes
- **Responsive** — grid de 2 columnas (movil) a 5 columnas (desktop)
- **SEO** — robots.txt, sitemap.xml, llms.txt, Open Graph, Twitter Card, Schema.org (Organization + Course)
- **Seguridad** — CSP headers, verificacion JWT criptografica server-side, HTTP-only cookies, headers Cloudflare

---

## Tech Stack

| Tecnologia | Version | Uso |
|---|---|---|
| React | 18.2 | UI y manejo de estado |
| Vite | 6.2 | Build tool y dev server |
| Tailwind CSS | 3.3 | Estilos utilitarios |
| @react-oauth/google | 0.13 | Google OAuth 2.0 (frontend — boton de login) |
| concurrently | 9.0 | Correr Vite + Wrangler en paralelo en dev |
| Cloudflare Workers | — | Backend serverless (API REST via Cloudflare Pages Functions) |
| Cloudflare D1 | — | Base de datos SQLite-compatible (binding: `DB`) |
| Cloudflare Pages | — | Hosting y despliegue |
| Wrangler | 3.x | CLI para dev server y deploy |
| PostCSS + Autoprefixer | — | Procesamiento de CSS |
| sharp | 0.34 | Optimizacion de imagenes en build |

---

## Estructura del Proyecto

```
Web New Coders/
├── src/
│   ├── App.jsx              # Componente principal: vistas, logica, lecciones, estado
│   ├── main.jsx             # Entry point — monta <AuthProvider><App /></AuthProvider>
│   ├── index.css            # Estilos globales (cyberpunk theme, animaciones)
│   ├── hooks/
│   │   └── useAuth.jsx      # AuthContext: login, logout, restauracion de sesion
│   └── views/
│       └── LoginPage.jsx    # Pantalla de login con boton Google
├── functions/               # Cloudflare Pages Functions — API REST
│   ├── api/
│   │   ├── auth/
│   │   │   ├── google.js    # POST: verifica JWT Google (RS256/JWKS) + crea sesion en D1
│   │   │   ├── logout.js    # POST: elimina sesion de D1 + limpia cookie
│   │   │   └── me.js        # GET: devuelve usuario de sesion activa
│   │   ├── users/
│   │   │   ├── me.js        # GET perfil / PATCH display_name / DELETE cuenta (GDPR)
│   │   │   ├── achievements.js  # GET logros del usuario
│   │   │   ├── certificate.js   # GET certificado (requiere 30 dias completados)
│   │   │   ├── export.js    # GET exportacion JSON de datos personales (GDPR)
│   │   │   └── delete.js    # Soft-delete con anonimizacion de datos
│   │   ├── progress/
│   │   │   ├── index.js     # GET progreso, rachas y estadisticas del usuario
│   │   │   ├── [day].js     # POST marcar dia (1-30) como completado
│   │   │   └── migrate.js   # POST migrar progreso de localStorage a servidor
│   │   ├── chat/
│   │   │   └── index.js     # POST proxy hacia OpenAI gpt-4o-mini (3 niveles de rate limit)
│   │   └── admin/
│   │       ├── stats.js     # GET estadisticas globales (solo admin)
│   │       └── users.js     # GET/PATCH gestion de usuarios (solo admin)
│   └── lib/
│       ├── cors.js          # Helpers CORS y respuestas JSON
│       ├── google-jwt.js    # Verificacion criptografica JWT Google (RS256 + JWKS, cache 1h)
│       ├── session.js       # Gestion de sesiones: generar, validar, limpiar
│       ├── rate-limit.js    # Rate limiting por ventana deslizante en D1
│       └── audit.js         # Registro de acciones en audit_log
├── public/
│   ├── _headers             # Headers de seguridad Cloudflare Pages (HSTS, X-Frame-Options)
│   ├── _redirects           # SPA routing: /* -> /index.html 200
│   ├── robots.txt           # SEO — instrucciones para crawlers
│   ├── sitemap.xml          # SEO — mapa del sitio
│   ├── llms.txt             # Contexto para LLMs
│   └── favicon.svg
├── schema.sql               # Esquema D1: 8 tablas
├── wrangler.toml            # Config Cloudflare: name, compatibility_date, binding D1
├── index.html               # HTML base: CSP, SEO meta, Open Graph, Schema.org, fonts
├── tailwind.config.js       # Colores neon y animaciones personalizadas
├── vite.config.js           # Config Vite: plugin React, security headers en dev
├── postcss.config.js        # Config PostCSS
├── package.json             # Dependencias y scripts
├── .env.local               # VITE_GOOGLE_CLIENT_ID (no incluido en repo)
└── readme.md
```

---

## Flujo de la Aplicacion

### Inicio
1. `main.jsx` monta `<AuthProvider>` que envuelve la app con `<GoogleOAuthProvider>`
2. `useAuth.jsx` llama `GET /api/auth/me` al cargar — si hay cookie valida, restaura la sesion
3. Limpia datos legacy de localStorage/sessionStorage de versiones anteriores
4. Si no hay sesion: muestra `<LoginPage />`; si hay sesion: muestra `<App />`

### Login
1. Usuario hace clic en "Continuar con Google" — Google OAuth devuelve un JWT credential
2. El JWT se envia al servidor via `POST /api/auth/google` (nunca se procesa en el cliente)
3. El servidor verifica la firma RS256 con las claves publicas de Google (JWKS)
4. Se hace upsert del usuario en la tabla `users` (actualiza email/nombre/foto si ya existe)
5. Para usuarios nuevos, se inscribe automaticamente en temporada `S1`
6. Se crea una sesion en la tabla `sessions` con expiracion a 72h
7. Se devuelve una HTTP-only cookie con el session ID
8. Al iniciar sesion, si hay progreso en `localStorage.completedLessons`, se migra al servidor

### Progreso
- Al cargar `<App />`, se consulta `GET /api/progress` para cargar dias completados y rachas
- Fallback a `localStorage` si la API no responde (solo lectura)
- `POST /api/progress/:day` marca un dia como completado (valida rango 1-30)
- Si hay nuevos logros, se recarga la lista de achievements
- Las rachas se recalculan en servidor en cada request a `/api/progress`

---

## Instalacion

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd "Web New Coders"

# 2. Instalar dependencias
npm install

# 3. Instalar Wrangler (CLI de Cloudflare)
npm install -g wrangler
wrangler login

# 4. Configurar variable de entorno del frontend
echo "VITE_GOOGLE_CLIENT_ID=tu-client-id-aqui" > .env.local

# 5. Inicializar la base de datos D1
wrangler d1 create new-coders-db
# Actualizar el database_id en wrangler.toml con el ID generado

# 6. Aplicar el esquema de la base de datos
wrangler d1 execute new-coders-db --file=schema.sql

# 7. Iniciar servidor de desarrollo (Vite + Wrangler Pages en paralelo)
npm run dev
# Vite corre en :5173, Wrangler Pages (API + proxy) en :8788
# Vite proxea automaticamente /api -> :8788, por lo que ambos puertos funcionan
# Recomendado: usar http://localhost:5173 (hot reload + proxy configurado)
```

### Variables de entorno en Cloudflare Dashboard (produccion)

Configurar en Cloudflare Pages > Settings > Environment Variables:

| Variable | Descripcion |
|---|---|
| `GOOGLE_CLIENT_ID` | Client ID de Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Client Secret de Google OAuth |
| `OPENAI_API_KEY` | API key de OpenAI para el chatbot (`wrangler secret put OPENAI_API_KEY`) |

### Scripts disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Dev completo: Vite (:5173) + Wrangler Pages (:8788) en paralelo con `concurrently`. Vite proxea `/api` a :8788 automaticamente. |
| `npm run build` | Build de produccion en `/dist` |
| `npm run preview` | Preview del build de produccion |
| `wrangler pages deploy dist/` | Deploy a Cloudflare Pages |

---

## API REST

### Autenticacion

| Metodo | Endpoint | Descripcion |
|---|---|---|
| `POST` | `/api/auth/google` | Login: verifica JWT Google, crea sesion, devuelve cookie HTTP-only |
| `POST` | `/api/auth/logout` | Logout: elimina sesion de DB y limpia cookie |
| `GET` | `/api/auth/me` | Devuelve usuario autenticado desde la sesion activa |

### Progreso

| Metodo | Endpoint | Descripcion |
|---|---|---|
| `GET` | `/api/progress` | Progreso: dias completados, rachas, porcentaje |
| `POST` | `/api/progress/:day` | Marcar dia (1-30) como completado + evaluar logros |
| `POST` | `/api/progress/migrate` | Migrar progreso de localStorage a servidor |

### Usuarios

| Metodo | Endpoint | Descripcion |
|---|---|---|
| `GET` | `/api/users/me` | Perfil + progreso + enrollment |
| `PATCH` | `/api/users/me` | Actualizar display_name (sanitizado, max 100 chars) |
| `DELETE` | `/api/users/me` | Eliminar cuenta (soft-delete GDPR) |
| `GET` | `/api/users/achievements` | Logros ganados por el usuario |
| `GET` | `/api/users/certificate` | Certificado de completado (requiere 30 dias) |
| `GET` | `/api/users/export` | Exportar datos personales en JSON (GDPR) |

### Administrador (role: admin)

| Metodo | Endpoint | Descripcion |
|---|---|---|
| `GET` | `/api/admin/stats` | Estadisticas globales, tasa de completado por leccion |
| `GET` | `/api/admin/users` | Lista de usuarios con paginacion (limit max 50) y busqueda |
| `PATCH` | `/api/admin/users` | Activar/desactivar usuario (no puede modificarse a si mismo) |

### Chatbot IA

| Metodo | Endpoint | Descripcion |
|---|---|---|
| `POST` | `/api/chat` | Enviar mensaje al asistente virtual (requiere `OPENAI_API_KEY`) |

---

## Vistas de la Aplicacion

### 1. Login
Pantalla de autenticacion con Google OAuth 2.0. El JWT credential se envia al servidor, que lo verifica criptograficamente, crea una sesion en D1 y devuelve una HTTP-only cookie.

### 2. Calendario (vista principal)
Grid de 30 casillas con estados visuales:
- **Bloqueada** — opacidad baja, icono de candado (fecha futura)
- **Disponible** — borde neon con efecto glow
- **Dia actual** — badge "HOY" con animacion pulse
- **Completada** — checkmark verde

Incluye barra de progreso global, cuenta regresiva al inicio del curso, y acceso a Intro, Herramientas y Nosotros.

### 3. Leccion
Para cada dia:
- Teoria explicativa
- Instrucciones paso a paso
- Prompt para aprender con IA
- Ejemplo de codigo con boton de copiar
- Reto practico
- Recursos externos
- Navegacion entre lecciones (anterior/siguiente)
- Boton "Marcar como completada" (POST a API + actualiza achievements)

### 4. Introduccion
Descripcion del programa, como funciona, y carrusel de aliados/partners (actualmente con imagenes placeholder).

### 5. Herramientas
Guia de instalacion de herramientas obligatorias (VS Code, Chrome, Python, Git, GitHub) y opcionales (Node.js, Netlify/Render). Incluye extensiones recomendadas de VS Code.

### 6. Nosotros
Mision del equipo, valores (Constancia, Comunidad, Practica, Accesibilidad) y enlaces a la comunidad.

### 7. Mi Perfil
Accesible desde el icono de persona (visible en todas las vistas):
- Avatar de Google con nombre y badge de miembro
- Campo de nombre editable — persiste en servidor via `PATCH /api/users/me`
- Email de Google (solo lectura)
- Barra de progreso con lecciones completadas
- Racha actual y racha maxima (calculadas en servidor)
- Logros ganados con iconos y descripciones
- Boton de certificado (visible al completar 30 dias)
- Exportar datos (GDPR) — descarga JSON
- Eliminar cuenta (GDPR) — doble confirmacion
- Boton de cierre de sesion

### 8. Admin (role: admin)
Panel con dos secciones:
- **Usuarios**: tabla paginada con busqueda, toggle activo/inactivo
- **Estadisticas**: metricas globales y tasa de completado por leccion

---

## Curriculo de 30 Dias

| Semana | Dias | Tema |
|---|---|---|
| 1 | 1–7 | **HTML** — Que es programar, herramientas, estructura HTML, etiquetas, formularios, enlaces, imagenes |
| 2 | 8–14 | **CSS** — Selectores, colores, box model, Flexbox, Grid, responsive design, mini proyecto |
| 3 | 15–21 | **JavaScript** — Variables, condicionales, bucles, funciones, arrays, objetos, DOM |
| 4 | 22–26 | **Eventos, Proyectos y Python** — Eventos JS, To-Do List, Python basico, funciones, estructuras de datos |
| 5 | 27–30 | **Fullstack y Deploy** — Flask, conexion frontend-backend, Git/GitHub, despliegue en produccion |

### Titulos por dia (todos implementados en `src/App.jsx`)

| Dia | Titulo | Semana |
|---|---|---|
| 1 | ¿Que es programar? | HTML |
| 2 | Conociendo las herramientas | HTML |
| 3 | Tu primera pagina web | HTML |
| 4 | Encabezados y parrafos | HTML |
| 5 | Enlaces e imagenes | HTML |
| 6 | Listas en HTML | HTML |
| 7 | Formularios basicos | HTML |
| 8 | Introduccion a CSS | CSS |
| 9 | Selectores y colores | CSS |
| 10 | El modelo de caja (Box Model) | CSS |
| 11 | Flexbox: disenos flexibles | CSS |
| 12 | CSS Grid: cuadriculas poderosas | CSS |
| 13 | Diseno responsive | CSS |
| 14 | Mini proyecto: landing page | CSS |
| 15 | JavaScript: tu primer script | JavaScript |
| 16 | Variables y tipos de datos | JavaScript |
| 17 | Condicionales: tomando decisiones | JavaScript |
| 18 | Bucles: repitiendo acciones | JavaScript |
| 19 | Funciones: bloques reutilizables | JavaScript |
| 20 | Arrays y objetos | JavaScript |
| 21 | El DOM: manipulando la pagina | JavaScript |
| 22 | Eventos: interactividad real | Eventos/Proyectos |
| 23 | Proyecto JS: lista de tareas | Eventos/Proyectos |
| 24 | Introduccion a Python | Eventos/Proyectos |
| 25 | Condicionales y bucles en Python | Eventos/Proyectos |
| 26 | Funciones y estructuras de datos en Python | Eventos/Proyectos |
| 27 | Tu primer servidor con Python | Fullstack/Deploy |
| 28 | Conectando frontend y backend | Fullstack/Deploy |
| 29 | Git y GitHub: guardando tu codigo | Fullstack/Deploy |
| 30 | Tu primera app en produccion | Fullstack/Deploy |

> **Estado del contenido**: Dias 1–4 tienen instrucciones paso a paso completas. Dias 5–30 tienen teoria, ejemplos de codigo, retos y recursos implementados.

---

## Esquema de Base de Datos (D1)

| Tabla | Descripcion |
|---|---|
| `users` | Usuarios registrados via Google OAuth (id, google_sub, email, name, display_name, picture_url, role, is_active, login_count, last_login_at, created_at) |
| `sessions` | Tokens de sesion HTTP-only: id (hex 64), user_id, expires_at (72h), last_used_at |
| `enrollments` | Inscripcion por temporada/cohorte (temporada S1 creada automaticamente al primer login) |
| `lesson_completions` | Progreso individual — user_id, day_number (1-30 CHECK), completed_at |
| `rate_limit` | Estado de rate limiting por clave (ip:...:auth o user:...) |
| `audit_log` | Registro de acciones: user_id, action, details (JSON), ip_address, created_at |
| `achievements` | Logros ganados: user_id, achievement_key, earned_at |
| `user_settings` | Preferencias del usuario (notificaciones, idioma) |

---

## Seguridad

- **Verificacion JWT criptografica** — RS256 + JWKS de Google, via Web Crypto API (`functions/lib/google-jwt.js`)
- **HTTP-only cookies** para sesiones (`HttpOnly; Secure; SameSite=Strict; Path=/api`)
- **Sesiones server-side** en D1 con expiracion absoluta (72h) e idle timeout (24h)
- **Rate limiting** en D1: auth (10/min por IP), progreso (30/min por user), migracion (3/5min), perfil (20/min), chat (10/min por user/IP, 100/mes por user, 1000/mes global)
- **Audit log** — acciones sensibles registradas (login, eliminacion, exportacion, admin)
- **Sanitizacion** — display_name: max 100 chars, sin `<>&"'`, sin null bytes ni caracteres de control
- **GDPR** — soft-delete con anonimizacion de datos (`deleted_USERID@deleted.invalid`), exportacion JSON
- **CSP** configurada en `index.html` — incluye `unsafe-inline` en script-src (requerido por Google OAuth SDK)
- **`public/_headers`** con HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy para Cloudflare Pages
- **Validacion de dia** — rango 1-30 en API y CHECK constraint en schema.sql
- **RBAC** — endpoints admin requieren `role = 'admin'` en DB; admin no puede modificarse a si mismo
- **`rel="noopener noreferrer"`** en todos los enlaces externos

---

## Despliegue en Produccion (Cloudflare Pages)

```bash
# 1. Generar build optimizado
npm run build

# 2. Desplegar en Cloudflare Pages
wrangler pages deploy dist/
```

**Notas:**
- Configurar `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` en el dashboard de Cloudflare Pages
- El binding D1 (`DB`) con `database_id = "df99f811-1623-4860-b6fe-369e0a77b634"` ya esta configurado en `wrangler.toml`
- El archivo `public/_headers` configura los headers de seguridad automaticamente
- El archivo `public/_redirects` maneja el SPA routing (`/* -> /index.html 200`)
- Para el chatbot: configurar `OPENAI_API_KEY` como secret con `wrangler secret put OPENAI_API_KEY`

---

## Comunidad

- **WhatsApp** — https://chat.whatsapp.com/EBB9GtaKths1ND1CrgAobi
- **X (Twitter)** — @NewCodersOrg / https://x.com/NewCodersOrg

