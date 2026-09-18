# Hogwarts Task Ledger

A full-stack, production-quality task management application with an immersive
Hogwarts-inspired magical theme. Students (users) register, get sorted into a house,
and manage their assignments — essays, potions, charms practice, and more — in a
secure, personal ledger.

This is a real, deployable application: authenticated users, a PostgreSQL database,
a REST API with server-side authorization, and a responsive dark-academia interface.
It is **not** a static mockup — every button is wired to a working endpoint.

---

## Features

- **Authentication** — email/password registration and login, hashed passwords
  (bcrypt), JWT sessions via NextAuth, protected routes via middleware.
- **Task CRUD** — create, read, update, delete assignments, each scoped to the
  signed-in user. Ownership is verified server-side on every request; a task ID
  supplied by the client is never trusted.
- **Dashboard** — live statistics (total / pending / in progress / completed), an
  overall completion charm (circular progress), and a preview of recent assignments.
- **Assignments workspace** — full search, filter (status / priority / subject),
  and sort (newest, oldest, due date, priority), all without a page reload.
- **Wizard profile** — name, house, email, join date, and completion stats; house
  and name are editable.
- **House system** — choose Gryffindor, Slytherin, Ravenclaw, or Hufflepuff at
  registration; house colors lightly accent the profile. Core functionality is
  identical for every house.
- **Settings** — reduced-motion toggle (persisted locally) and session controls.
- **Responsive design** — sidebar navigation on desktop, bottom tab bar on mobile,
  tested from 320px through large desktop breakpoints.
- **Accessibility** — semantic HTML, visible focus states, ARIA labels on dialogs
  and controls, status communicated with text/icons (not color alone), and full
  `prefers-reduced-motion` support plus an in-app override.
- **Magical UI** — parchment cards, gold glow borders, a drifting-dust starfield
  background, and a subtle "spell" animation when an assignment is mastered — all
  performant and skippable via reduced motion.

---

## Tech Stack

| Layer          | Technology                                   |
|----------------|-----------------------------------------------|
| Framework      | Next.js 14 (App Router), React 18, TypeScript (strict) |
| Styling        | Tailwind CSS, Framer Motion, Lucide icons     |
| Backend        | Next.js Route Handlers (REST API)             |
| Database       | PostgreSQL                                    |
| ORM            | Prisma                                        |
| Auth           | NextAuth.js (Credentials provider) + bcryptjs |
| Validation     | Zod (shared client/server schemas)            |
| Notifications  | Sonner (toasts)                               |
| Testing        | Vitest                                        |

---

## Architecture

```
User → Browser (Next.js/React UI)
     → Next.js Route Handlers (/src/app/api/**)
         → NextAuth session check (authentication)
         → Ownership check (authorization: task.userId === session.user.id)
         → Zod validation
         → Prisma Client
             → PostgreSQL
     ← JSON response
     ← UI updates (client fetch + toast notification)
```

Client and server responsibilities are separated cleanly:
- **Server** (Route Handlers, `middleware.ts`, server components in `(dashboard)/*/page.tsx`):
  session verification, authorization, validation, all database access.
- **Client** (`'use client'` components): forms, optimistic-feeling UI, calling the
  API, rendering toasts and dialogs. The client never talks to Prisma directly.

### Project structure

```
src/
  app/
    page.tsx                 # Landing page
    login/, register/        # Auth pages
    (dashboard)/              # Route group — protected by middleware + server session check
      layout.tsx               # Sidebar / navbar / mobile nav shell
      dashboard/page.tsx       # Great Hall overview (stats, progress, recent tasks)
      assignments/page.tsx     # Full task management workspace
      profile/page.tsx         # Wizard profile
      settings/page.tsx        # Preferences
    api/
      auth/[...nextauth]/       # NextAuth handler
      auth/register/            # Registration endpoint
      tasks/, tasks/[id]/        # Task CRUD
      profile/                   # Profile read/update
  components/                 # Reusable UI (TaskCard, TaskModal, Sidebar, ...)
  hooks/useTasks.ts            # Client data-fetching + mutation hook
  lib/                         # prisma client, auth config, zod schemas, utils
  types/                       # Shared TypeScript types + NextAuth augmentation
prisma/
  schema.prisma                # User, Task models + enums
  seed.ts                      # Demo user + sample assignments
__tests__/                    # Vitest suites (auth + task authorization/validation)
```

---

## Prerequisites

- Node.js 18.18+ (20.x recommended)
- A PostgreSQL database (local install, Docker, or a managed provider such as
  Neon, Supabase, or Railway)
- npm (or pnpm/yarn, adjusting commands accordingly)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/hogwarts_task_ledger?schema=public
AUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

### 3. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. (Optional) Seed demo data

```bash
npm run prisma:seed
```

This creates a demo account you can sign in with immediately:

```
Email:    hermione@hogwarts.edu
Password: WingardiumLev1osa!
```

### 5. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## Development Commands

| Command                  | Purpose                                      |
|---------------------------|-----------------------------------------------|
| `npm run dev`             | Start the dev server                          |
| `npm run build`           | Production build                              |
| `npm run start`           | Run the production build                      |
| `npm run lint`            | ESLint                                        |
| `npm run format`          | Prettier (writes formatted files)             |
| `npm run prisma:migrate`  | Create/apply a dev migration                  |
| `npm run prisma:deploy`   | Apply migrations in production                |
| `npm run prisma:seed`     | Seed demo data                                |
| `npm run prisma:studio`   | Open Prisma Studio (visual DB browser)        |
| `npm test`                | Run the Vitest suite once                     |
| `npm run test:watch`      | Run tests in watch mode                       |

---

## API Overview

All endpoints below except registration and the NextAuth handler require an
authenticated session (a valid NextAuth JWT cookie); missing/invalid sessions
receive `401`. Every task-scoped endpoint additionally verifies the task belongs
to the requesting user before reading or mutating it; a mismatch returns `404`
rather than leaking whether the task exists.

### Authentication
| Method | Path                     | Description                          |
|--------|--------------------------|----------------------------------------|
| POST   | `/api/auth/register`     | Create an account (name, email, password, house) |
| POST   | `/api/auth/callback/credentials` | NextAuth login (used by `signIn()`) |
| POST   | `/api/auth/signout`      | NextAuth logout (used by `signOut()`) |

### Tasks
| Method | Path              | Description                                             |
|--------|-------------------|----------------------------------------------------------|
| GET    | `/api/tasks`       | List the current user's tasks. Query params: `search`, `status`, `priority`, `category`, `sort` |
| POST   | `/api/tasks`       | Create a task                                            |
| GET    | `/api/tasks/:id`   | Get one task (must be owned by the user)                 |
| PUT    | `/api/tasks/:id`   | Replace/update a task                                    |
| PATCH  | `/api/tasks/:id`   | Partially update a task (e.g. toggle status)              |
| DELETE | `/api/tasks/:id`   | Delete a task                                             |

### Profile
| Method | Path             | Description                                    |
|--------|------------------|--------------------------------------------------|
| GET    | `/api/profile`   | Current user's profile + computed task stats     |
| PUT    | `/api/profile`    | Update `name` and/or `house`                     |

---

## Authentication Overview

- Passwords are hashed with **bcrypt** (cost factor 12) before ever touching the
  database; plaintext passwords are never stored or logged.
- Sessions use **NextAuth's JWT strategy** (no server-side session table needed),
  with a 30-day expiry.
- `middleware.ts` blocks unauthenticated access to `/dashboard`, `/assignments`,
  `/profile`, and `/settings` at the edge; each of those routes' shared layout
  also re-checks the session server-side (`getServerSession`) as defense in depth.
- Every mutating API route re-derives the user ID from the verified session —
  never from the request body — so a task's `userId` can't be spoofed by the client.

---

## Real-Time Updates

The current implementation refetches the task list after every mutation
(create/update/delete/toggle), which keeps the UI consistent without a full page
reload and works well for a single-user session. The architecture is ready for
WebSocket-based real-time sync if multi-device or collaborative use is added later:

1. Add a lightweight WebSocket (or Server-Sent Events) server, or a hosted service
   such as Pusher/Ably.
2. On each task mutation in `src/app/api/tasks/**`, broadcast an event
   (`task.created` / `task.updated` / `task.deleted`) scoped to the user's channel.
3. In `useTasks.ts`, subscribe to that channel and merge incoming events into
   local state instead of (or in addition to) the current refetch-on-mutation
   approach.

---

## Testing

```bash
npm test
```

Covers:
- Registration/login validation rules (password strength, email format, matching
  confirmation)
- Duplicate-email rejection on registration
- Authentication requirements on task endpoints (401 when signed out)
- Authorization: a user cannot read, update, or delete another user's task (404)
- Task creation ignores any client-supplied `userId` and always scopes to the
  authenticated session

---

## Deployment

### Recommended architecture
- **App (frontend + API):** any Next.js-compatible host (e.g. Vercel) — the API
  routes and pages ship together.
- **Database:** a managed PostgreSQL instance (e.g. Neon, Supabase, RDS, Railway).

### Steps
1. Provision a managed PostgreSQL database and copy its connection string.
2. Set the following environment variables on your hosting platform:
   - `DATABASE_URL`
   - `AUTH_SECRET` (a strong random value — do not reuse the dev value)
   - `NEXTAUTH_URL` (your production URL, e.g. `https://your-app.com`)
3. Run migrations against production before/during deploy:
   ```bash
   npx prisma migrate deploy
   ```
4. Build and start:
   ```bash
   npm run build
   npm run start
   ```
5. Confirm no `.env` file with real secrets is committed to version control
   (see `.gitignore`).

---

## Future Improvements

- WebSocket/SSE-based real-time sync across multiple open sessions (see above)
- Password reset / email verification flow
- Pagination or infinite scroll for very large task lists
- OAuth providers (Google, GitHub) alongside credentials login
- Task attachments and comments
- Per-house leaderboards for completed assignments
- Dark/light theme toggle in addition to the existing reduced-motion preference

---

## Notes on the Theme

All visual assets are original (CSS gradients, SVG, and typography) — no Harry
Potter movie stills, logos, or copyrighted artwork are used. The magical
atmosphere is created entirely through color palette, typography, terminology,
and CSS/SVG-based motifs.
