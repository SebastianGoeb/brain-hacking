-- R-001 Curriculum data model. Canonical copy lives in supabase/schema.sql.
-- This migration is what `supabase start` / `supabase db reset` applies locally.
-- Subject-agnostic: subjects live in items.meta (jsonb), never in columns.

create table if not exists curricula (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  subject     text not null,
  description text,
  is_public   boolean not null default false,
  owner       uuid references auth.users (id) default auth.uid(),
  created_at  timestamptz not null default now()
);

create table if not exists items (
  id            uuid primary key default gen_random_uuid(),
  curriculum_id uuid not null references curricula (id) on delete cascade,
  position      int not null default 0,
  prereq_ids    uuid[] not null default '{}',
  prompt        text not null,
  answer        text not null,
  media_url     text,
  meta          jsonb not null default '{}'
);

create table if not exists reviews (
  id               uuid primary key default gen_random_uuid(),
  item_id          uuid not null references items (id) on delete cascade,
  reviewer         uuid not null references auth.users (id) default auth.uid(),
  strategy         text not null,
  predicted_recall real,
  actual_recall    real,
  latency_ms       int,
  reviewed_at      timestamptz not null default now(),
  next_due         timestamptz
);

create index if not exists items_curriculum_idx on items (curriculum_id, position);
create index if not exists reviews_reviewer_idx  on reviews (reviewer, item_id);

alter table curricula enable row level security;
alter table items     enable row level security;
alter table reviews   enable row level security;

create policy curricula_read_public on curricula
  for select using (is_public or owner = auth.uid());
create policy curricula_write_own on curricula
  for all using (owner = auth.uid()) with check (owner = auth.uid());

create policy items_read on items
  for select using (exists (
    select 1 from curricula c
    where c.id = items.curriculum_id and (c.is_public or c.owner = auth.uid())));
create policy items_write_own on items
  for all using (exists (
    select 1 from curricula c where c.id = items.curriculum_id and c.owner = auth.uid()))
  with check (exists (
    select 1 from curricula c where c.id = items.curriculum_id and c.owner = auth.uid()));

create policy reviews_own on reviews
  for all using (reviewer = auth.uid()) with check (reviewer = auth.uid());
