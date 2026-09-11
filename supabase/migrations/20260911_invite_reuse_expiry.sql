alter table public.swarm_invites add column if not exists expires_at timestamptz;
alter table public.swarm_invites add column if not exists redemption_count integer not null default 0;

update public.swarm_invites
set expires_at = created_at + interval '6 months'
where expires_at is null;

alter table public.swarm_invites alter column expires_at set not null;
alter table public.swarm_invites alter column expires_at set default (now() + interval '6 months');
