-- Swarm Collective: agent-generated daily AI news digest.
-- RLS enabled with NO permissive policies; service-role only, gated in app code.

create table if not exists public.swarm_news_digest (
  id uuid primary key default gen_random_uuid(),
  digest_date date not null unique,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists swarm_news_digest_date_idx on public.swarm_news_digest(digest_date desc);
alter table public.swarm_news_digest enable row level security;
revoke all on public.swarm_news_digest from anon, authenticated;
