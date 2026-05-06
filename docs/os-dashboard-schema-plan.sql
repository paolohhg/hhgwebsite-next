-- Heard OS dashboard schema plan
-- Apply only after reviewing the current MVP screens. These fields are already
-- represented in the product checklist, but should not be added until the UI is
-- ready to use each one immediately.

-- Forward migration
alter table public.projects
  add column if not exists priority text default 'normal'
    check (priority in ('urgent', 'high', 'normal', 'low')),
  add column if not exists health text default 'on-track'
    check (health in ('on-track', 'at-risk', 'blocked', 'paused')),
  add column if not exists start_date date,
  add column if not exists target_date date,
  add column if not exists blocked_reason text;

alter table public.tasks
  add column if not exists priority text default 'normal'
    check (priority in ('urgent', 'high', 'normal', 'low')),
  add column if not exists blocked_reason text,
  add column if not exists updated_at timestamptz default now();

alter table public.assets
  add column if not exists owner text
    check (owner in ('Paolo', 'Mel', 'Both')),
  add column if not exists price numeric(12, 2),
  add column if not exists customer text,
  add column if not exists last_reviewed_at date;

-- Keep tasks.updated_at current when task rows change.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

-- Rollback migration
drop trigger if exists set_tasks_updated_at on public.tasks;
drop function if exists public.set_updated_at();

alter table public.assets
  drop column if exists last_reviewed_at,
  drop column if exists customer,
  drop column if exists price,
  drop column if exists owner;

alter table public.tasks
  drop column if exists updated_at,
  drop column if exists blocked_reason,
  drop column if exists priority;

alter table public.projects
  drop column if exists blocked_reason,
  drop column if exists target_date,
  drop column if exists start_date,
  drop column if exists health,
  drop column if exists priority;
