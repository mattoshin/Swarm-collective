-- Swarm Collective: one shared, member-editable notes doc (a live wiki page, not a tracker).
-- RLS enabled with NO permissive policies; service-role only, gated in app code.

create table if not exists public.swarm_collaborate_doc (
  id text primary key default 'default',
  content text not null default '',
  updated_by uuid references public.swarm_members(id) on delete set null,
  updated_at timestamptz not null default now()
);
alter table public.swarm_collaborate_doc enable row level security;
revoke all on public.swarm_collaborate_doc from anon, authenticated;

insert into public.swarm_collaborate_doc (id, content)
values ('default', '')
on conflict (id) do nothing;
