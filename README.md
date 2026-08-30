# Portfolio CMS

A full-stack, CMS-driven developer portfolio built with **Next.js 16, TypeScript, and Tailwind CSS**. A highly animated public portfolio renders dynamically from structured content managed through an authenticated **Portfolio Studio** admin dashboard — toggle sections on/off, reorder them, and run full CRUD on projects, experience, skills, and site settings, all without touching the frontend code.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **SQLite** via Node's built-in `node:sqlite` module — zero-config, file-based, **no native compilation and no external database server needed**
- **Framer Motion** for hero animations, **Lucide** icons
- Cookie-based session auth (HMAC-signed, HttpOnly) — no third-party auth service required

> Note: the original spec called for PostgreSQL + Prisma. This build uses SQLite + a small hand-rolled data layer (`lib/db.ts`, `lib/data.ts`) instead, so the project runs immediately with `npm install` — no database setup, no native build tools required. The data layer is a thin abstraction — swapping in Postgres/Prisma later mainly means rewriting `lib/data.ts`.

**Requires Node.js ≥ 22** (for the built-in `node:sqlite` module, currently experimental — you'll see a one-line `ExperimentalWarning` on startup, which is expected and harmless).

## Getting started

```bash
npm install
npm run seed     # populates the database with sample content
npm run dev
```

Visit:
- **Public portfolio:** http://localhost:3000
- **Admin login:** http://localhost:3000/admin/login

**Default admin login:** `admin@example.com` / `admin123`

⚠️ **Change this before deploying.** See "Changing the admin password" below.

## Project structure

```
app/
├── page.tsx                  # public portfolio homepage
├── admin/
│   ├── login/                # public login page
│   └── (protected)/          # everything behind auth
│       ├── dashboard/
│       ├── sections/          # enable/disable + reorder
│       ├── projects/          # full CRUD
│       ├── experience/
│       ├── skills/
│       └── settings/
├── api/admin/                 # REST API, all auth-gated except /login
components/
├── portfolio/                  # public-facing section components
└── admin/                      # admin dashboard components
lib/
├── db.ts                      # SQLite connection + schema
├── data.ts                    # typed data-access layer (CRUD)
├── auth.ts                    # session token sign/verify
└── require-auth.ts            # API route auth guard
scripts/
└── seed.js                    # sample content seeder
```

## How it works

**Section registry.** The public homepage (`app/page.tsx`) reads the `sections` table, filters to `enabled = 1`, sorts by `order`, and renders each through a lookup map (`components/portfolio/*`). Turning a section off in `/admin/sections` removes it from the live site immediately — the app runs in dynamic (server-rendered) mode, so there's no rebuild step needed.

**Auth.** `/admin/login` posts credentials to `/api/admin/login`, which checks against `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` in `.env` and issues an HMAC-signed, HttpOnly session cookie. The `(protected)` route group's layout (`app/admin/(protected)/layout.tsx`) checks that cookie server-side and redirects to `/admin/login` if missing or invalid. Every write-capable API route re-checks the same session before touching the database.

**Data.** All content lives in a single SQLite file at `data/portfolio.db`, created automatically on first run.

## Changing the admin password

Generate a new bcrypt hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('your-new-password', 10))"
```

Then update `.env`:

```
ADMIN_EMAIL="you@example.com"
ADMIN_PASSWORD_HASH='$2b$10$...'
```

**Important:** wrap the hash in **single quotes**. Next.js's env loader expands `$name`-style variables in double-quoted values, which will corrupt a bcrypt hash (bcrypt hashes are full of `$`). Single-quoted values are treated literally.

Also set a real `SESSION_SECRET` (any long random string) before deploying.

## Deploying

This is a standard Next.js app — deploy it anywhere that runs Node **22+** (Vercel, Railway, Fly.io, a VPS, etc.). Keep in mind:

- The SQLite file at `data/portfolio.db` needs to live on **persistent** storage — on platforms with ephemeral filesystems (e.g. most serverless functions), point the data directory at a mounted volume, or swap in a hosted database.
- Cookies are marked `Secure` automatically in production (`NODE_ENV=production`), so the admin panel requires HTTPS in production.

## What's built (MVP)

- [x] Public portfolio with Hero, About, Projects, Experience, Skills, Contact sections
- [x] Section registry — sections render only when enabled, in the configured order
- [x] Admin login/logout with signed session cookies
- [x] Sections page — toggle visibility, reorder (up/down)
- [x] Projects — full CRUD, featured flag, draft/published state
- [x] Experience — add/remove entries
- [x] Skills — add/remove, grouped by category
- [x] Settings — hero copy, about text, contact email, resume link, social links, site-wide publish toggle
- [x] Responsive, dark, editorial-style design with Framer Motion entrance animations

## Ideas for V2 (from the original spec, not built here)

- Drag-and-drop section reordering (currently up/down buttons)
- Live split-screen preview while editing
- Image upload (currently a plain image-URL field)
- Custom section builder (arbitrary content blocks)
- Command palette (⌘K navigation)
- Theme/appearance customization panel
- GitHub activity / blog / stats integrations
