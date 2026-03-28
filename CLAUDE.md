# CLAUDE.md — Web-New-Coders

This file provides essential context for Claude Code when working on this repository.

---

## Project Overview

**New Coders: Dev Path** is an interactive educational SPA (Single Page Application) for Spanish-speaking beginners to learn web development through a structured 30-day curriculum. It is a free bootcamp-style platform deployed at [newcoders.org](https://newcoders.org).

- **Primary language**: Spanish (UI, content, and comments)
- **Course start date**: April 1, 2026
- **Curriculum**: HTML (days 1-7), CSS (8-14), JavaScript (15-21), Events/Projects/Python (22-26), Fullstack/Deployment (27-30)

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 18.2.0 + Vite 6.2.0 | ES6 modules, `"type": "module"` |
| Styling | Tailwind CSS 3.3.0 | Cyberpunk/neon theme |
| Auth | `@react-oauth/google` 0.13.4 | Google OAuth 2.0 |
| Backend | Cloudflare Pages Functions | Serverless, JS |
| Database | Cloudflare D1 (SQLite) | Bound as `DB` |
| Deployment | Cloudflare Pages + Wrangler 3.x | |
| Image processing | sharp 0.34.5 | OG image generation |

---

## Commands

```bash
# Development — starts Vite (:5173) and Wrangler Pages (:8788) concurrently
npm run dev

# Production build to /dist
npm run build

# Preview production build locally
npm run preview

# Deploy to Cloudflare Pages
npm run build && wrangler pages deploy dist/
```

> The Vite dev server proxies `/api/*` requests to `http://localhost:8788` (Wrangler).
> There are no test or lint scripts configured at this time.

---

## Project Structure

```
/
├── src/
│   ├── App.jsx              # Main app — all views, routing, state (~2200 lines)
│   ├── main.jsx             # Entry point — mounts AuthProvider
│   ├── index.css            # Global styles, cyberpunk animations
│   ├── hooks/
│   │   └── useAuth.jsx      # Auth context (login, logout, session restore)
│   └── views/
│       └── LoginPage.jsx    # Google OAuth login screen
│
├── functions/               # Cloudflare Pages Functions (serverless API)
│   ├── api/
│   │   ├── auth/            # google.js, logout.js, me.js
│   │   ├── users/           # me.js, achievements.js, certificate.js, export.js, delete.js
│   │   ├── progress/        # index.js, [day].js, migrate.js
│   │   └── admin/           # stats.js, users.js
│   └── lib/                 # cors.js, google-jwt.js, session.js, rate-limit.js, audit.js
│
├── public/
│   ├── _headers             # Cloudflare security headers (HSTS, CSP)
│   ├── _redirects           # SPA fallback: /* -> /index.html 200
│   ├── robots.txt / sitemap.xml
│   └── llms.txt             # LLM context file
│
├── scripts/
│   └── generate-og-image.mjs
│
├── schema.sql               # D1 database schema (8 tables)
├── wrangler.toml            # Cloudflare Workers/Pages config
├── vite.config.js
├── tailwind.config.js
└── SECURITY.md
```

---

## Architecture

### Frontend
- **Single file SPA**: `src/App.jsx` contains all views and routing logic. Do not split unless the user explicitly requests refactoring.
- **Auth context**: Managed via `src/hooks/useAuth.jsx`. Session is restored from cookies on load via `GET /api/auth/me`.
- **Routing**: Client-side via React state (no React Router). Views are conditionally rendered.

### Backend (Cloudflare Pages Functions)
- Each file under `functions/api/` maps to a URL route.
- Dynamic segments use the `[param].js` convention (e.g., `progress/[day].js`).
- Shared utilities live in `functions/lib/`.
- The D1 database is accessed via the `DB` binding available in the function context.

### Database (Cloudflare D1)
Key tables:

| Table | Purpose |
|---|---|
| `users` | OAuth accounts (google_sub, email, role) |
| `sessions` | Server-side sessions (72h absolute, 24h idle) |
| `enrollments` | Per-season course enrollment |
| `lesson_completions` | Completed days (1-30) per user |
| `achievements` | Earned badges per user |
| `rate_limit` | Sliding window rate limiting |
| `audit_log` | Sensitive action audit trail |
| `user_settings` | Per-user preferences |

---

## Environment Variables

**Frontend** (`.env.local` — not committed):
```
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

**Backend** (`.dev.vars` for local, Cloudflare Dashboard for production):
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Never commit `.env`, `.env.local`, `.env.*.local`, or `.dev.vars`.

---

## API Reference

All endpoints are under `/api`. Authentication uses HTTP-only cookies (`session_id`).

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/google` | No | Login with Google credential |
| POST | `/api/auth/logout` | Yes | Logout, delete session |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/users/me` | Yes | Full profile |
| PATCH | `/api/users/me` | Yes | Update `display_name` |
| DELETE | `/api/users/me` | Yes | Delete account (GDPR) |
| GET | `/api/users/achievements` | Yes | Earned badges |
| GET | `/api/users/certificate` | Yes | Completion certificate |
| GET | `/api/users/export` | Yes | Export personal data |
| GET | `/api/progress` | Yes | Completed days, streaks, stats |
| POST | `/api/progress/:day` | Yes | Mark day (1-30) complete |
| POST | `/api/progress/migrate` | Yes | Migrate from localStorage |
| GET | `/api/admin/stats` | Admin | Global statistics |
| GET/PATCH | `/api/admin/users` | Admin | User management |

---

## Security Constraints

These are intentional and must not be changed without careful consideration:

1. **Sessions are HTTP-only cookies** — Do not expose session tokens to JavaScript.
2. **JWT verification is RS256 only** — Uses Web Crypto API and Google JWKS. Never accept HS256.
3. **JWKS cache is 1 hour** — Do not reduce this; it would cause excessive Google API calls.
4. **Rate limiting is enforced server-side** — Auth: 10/min per IP. Progress: 30/min per user. Profile: 20/min per user.
5. **`display_name` sanitization** — Max 100 chars, strip `<>&"'` and null bytes.
6. **Admin endpoints check `role = 'admin'`** — Never relax this guard.
7. **GDPR soft-delete** — `DELETE /api/users/me` anonymizes data; do not hard-delete.
8. **CSP is configured in both `index.html` and `public/_headers`** — Keep both in sync.

---

## UI Theme

The UI uses a **cyberpunk/neon aesthetic**. Tailwind custom colors:

| Token | Value | Use |
|---|---|---|
| `dark-bg` | `#04040f` | Page background |
| `neon-green` | `#00d4ff` | Primary accent (cyan) |
| `neon-cyan` | `#bf00ff` | Secondary accent (purple) |
| `neon-yellow` | `#ff0099` | Tertiary accent (magenta) |

Fonts: **Orbitron** (display headings), **Source Code Pro** (monospace/code).

---

## Development Guidelines

- **Do not refactor `App.jsx`** unless explicitly asked. It is large by design and the user is aware.
- **ES6 modules are required** — All files must use `import`/`export`. CommonJS (`require`) is not supported.
- **Cloudflare Workers runtime** — The `functions/` backend runs in the Workers runtime, not Node.js. Do not use Node built-ins (`fs`, `path`, `crypto` module — use Web Crypto API instead).
- **D1 is SQLite-compatible** — Use standard SQLite syntax. Prepared statements are required for all queries (no string interpolation with user data).
- **No testing framework is configured** — When adding tests, prefer Vitest (compatible with Vite).
- **No linter is configured** — When adding a linter, prefer ESLint with the React and recommended presets.
- **Content is in Spanish** — All UI text, error messages, and lesson content must remain in Spanish unless explicitly asked to change.

---

## Deployment

```bash
# 1. Build the frontend
npm run build

# 2. Deploy to Cloudflare Pages
wrangler pages deploy dist/

# 3. Database migrations (if schema changes)
wrangler d1 execute new-coders-db --file=schema.sql
```

Production environment variables are set in the **Cloudflare Pages dashboard**, not in code.

---

## Key Files Quick Reference

| File | What it does |
|---|---|
| `src/App.jsx` | Entire frontend app — views, state, lesson content |
| `src/hooks/useAuth.jsx` | Auth context provider |
| `functions/lib/session.js` | Session create/validate/clear |
| `functions/lib/google-jwt.js` | RS256 JWT verification + JWKS caching |
| `functions/lib/rate-limit.js` | Sliding window rate limiter |
| `functions/lib/audit.js` | Audit log writer |
| `schema.sql` | Full D1 database schema |
| `wrangler.toml` | Cloudflare project config (name, D1 binding) |
| `public/_headers` | Security headers for all responses |
| `SECURITY.md` | Detailed security implementation notes |
