alter table public.swarm_members add column if not exists phone text;
alter table public.swarm_members add column if not exists name text;
alter table public.swarm_members add column if not exists full_name text;
alter table public.swarm_members add column if not exists interests text;
alter table public.swarm_members add column if not exists career_title text;
alter table public.swarm_members add column if not exists invited_by uuid references public.swarm_members(id) on delete set null;
alter table public.swarm_members add column if not exists created_at timestamptz not null default now();
update public.swarm_members set name=coalesce(name,full_name),full_name=coalesce(full_name,name);
alter table public.swarm_members alter column user_id drop not null;
alter table public.swarm_members add column if not exists company text;
alter table public.swarm_members add column if not exists role_title text;
alter table public.swarm_members add column if not exists college text;
alter table public.swarm_members add column if not exists location text;
alter table public.swarm_members add column if not exists bio text;
alter table public.swarm_members add column if not exists linkedin_url text;
alter table public.swarm_members add column if not exists website_url text;
alter table public.swarm_members add column if not exists public_notes text;
alter table public.swarm_members add column if not exists admin_notes text;
alter table public.swarm_members add column if not exists role text not null default 'member';
alter table public.swarm_members add column if not exists email_verified_at timestamptz;
alter table public.swarm_members add column if not exists bookmark_prompt_seen boolean not null default false;
alter table public.swarm_members add column if not exists updated_at timestamptz not null default now();

create table if not exists public.swarm_login_tokens (
  id uuid primary key default gen_random_uuid(), member_id uuid not null references public.swarm_members(id) on delete cascade,
  token_hash text not null unique, expires_at timestamptz not null, used_at timestamptz, created_at timestamptz not null default now()
);
create index if not exists swarm_login_tokens_member_idx on public.swarm_login_tokens(member_id);
alter table public.swarm_login_tokens enable row level security;
revoke all on public.swarm_login_tokens from anon, authenticated;

create table if not exists public.swarm_meetings (
  id uuid primary key default gen_random_uuid(), title text not null, description text, starts_at timestamptz not null,
  duration_minutes integer not null default 60, location text, meeting_url text,
  created_by uuid not null references public.swarm_members(id), created_at timestamptz not null default now()
);
create table if not exists public.swarm_meeting_attendees (
  meeting_id uuid not null references public.swarm_meetings(id) on delete cascade,
  member_id uuid not null references public.swarm_members(id) on delete cascade,
  response text not null default 'invited', notified_at timestamptz, reminded_at timestamptz, responded_at timestamptz,
  primary key(meeting_id, member_id)
);
alter table public.swarm_meetings enable row level security;
alter table public.swarm_meeting_attendees enable row level security;
revoke all on public.swarm_meetings from anon, authenticated;
revoke all on public.swarm_meeting_attendees from anon, authenticated;
revoke all on public.swarm_members from anon, authenticated;
