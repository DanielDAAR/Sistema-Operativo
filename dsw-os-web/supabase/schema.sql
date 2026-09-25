-- DSoftworks OS — estructura de la nube compartida (Supabase)
-- Correr este archivo en: Dashboard de Supabase → SQL Editor → New query → Run

create table if not exists public.buckets (
  name       text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.buckets enable row level security;
alter table public.buckets replica identity full;

create policy buckets_select on public.buckets for select using (auth.role() = 'authenticated');
create policy buckets_insert on public.buckets for insert with check (auth.role() = 'authenticated');
create policy buckets_update on public.buckets for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy buckets_delete on public.buckets for delete using (auth.role() = 'authenticated');

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'buckets'
  ) then
    alter publication supabase_realtime add table public.buckets;
  end if;
end $$;