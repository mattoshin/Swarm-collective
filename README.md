# Swarm Collective

An **invite-only networking directory**. To get in, someone already in the
swarm sends you a one-time invite link. Once you join, you can see the full
member directory — and you can invite others. The network grows one
introduction at a time.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4**
- **Supabase** (Postgres) for member + invite data

## How it works

- **Members** (`swarm_members`) — name, email, interests, career title, and
  `invited_by` (who brought them in, forming the invite tree).
- **Invites** (`swarm_invites`) — one-time codes minted by a member. Redeeming
  a code creates a new member linked back to the inviter.
- **Access** — being a member unlocks the directory. Sessions are a signed,
  httpOnly cookie holding the member id; membership is always re-checked
  against the DB, never trusted from the cookie.

### Routes

| Route        | Purpose                                                        |
| ------------ | ------------------------------------------------------------- |
| `/`          | Landing page                                                  |
| `/join?code=`| Redeem an invite and join (name, email, title, interests)     |
| `/enter`     | Returning members sign in with their email                    |
| `/directory` | Gated member table + invite generator                         |

### Security model

RLS is enabled on `swarm_*` with **no permissive policies**, so the anon /
publishable key can't read or write them. All access goes through the
server-side service-role client (`src/lib/supabase.ts`) and is gated in
application code — the directory of real emails is never exposed to the browser.

> Sign-in is currently email-only (no verification code). That's fine for an
> MVP invite network; upgrade to emailed one-time codes before wider launch.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Required env (`.env.local`):

| Variable                    | Where to get it                                  |
| --------------------------- | ------------------------------------------------ |
| `SUPABASE_URL`              | Supabase → Project → Settings → API              |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page, `service_role` secret (server-only)   |
| `SWARM_SESSION_SECRET`      | Any random string — `openssl rand -hex 32`       |

### Database

The schema lives in `supabase/migrations/`. Apply
`20260727_swarm_collective_init.sql` to your Supabase project, then seed the
first (root) member directly, e.g.:

```sql
insert into public.swarm_members (name, email, career_title)
values ('Your Name', 'you@example.com', 'Founder');
```

That root member needs no invite and can start minting them from `/directory`.

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Local dev server           |
| `npm run build` | Production build           |
| `npm run start` | Serve the production build |
| `npm run lint`  | Run ESLint                 |
