-- Swarm Collective: invite-tree networking directory.
-- RLS is enabled with NO permissive policies, so neither the anon nor the
-- publishable key can read or write these tables. All access is server-side
-- via the service-role client and gated in application code.

create table if not exists public.swarm_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  interests text,
  career_title text,
  invited_by uuid references public.swarm_members(id) on delete set null,
  created_at timestamptz not null default now()
);

create unique index if not exists swarm_members_email_lower_idx
  on public.swarm_members (lower(email));

create table if not exists public.swarm_invites (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  inviter_id uuid not null references public.swarm_members(id) on delete cascade,
  invited_email text,
  accepted_by uuid references public.swarm_members(id) on delete set null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create index if not exists swarm_invites_inviter_idx
  on public.swarm_invites (inviter_id);

alter table public.swarm_members enable row level security;
alter table public.swarm_invites enable row level security;
