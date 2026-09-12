-- Swarm Collective: member-curated tools directory with up/down voting.
-- RLS enabled with NO permissive policies; service-role only, gated in app code.

create table if not exists public.swarm_tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  added_by uuid not null references public.swarm_members(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists swarm_tools_added_by_idx on public.swarm_tools(added_by);
alter table public.swarm_tools enable row level security;
revoke all on public.swarm_tools from anon, authenticated;

create table if not exists public.swarm_tool_votes (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid not null references public.swarm_tools(id) on delete cascade,
  member_id uuid not null references public.swarm_members(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  unique (tool_id, member_id)
);
create index if not exists swarm_tool_votes_tool_idx on public.swarm_tool_votes(tool_id);
alter table public.swarm_tool_votes enable row level security;
revoke all on public.swarm_tool_votes from anon, authenticated;
