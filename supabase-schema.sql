create extension if not exists pgcrypto;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  student_code text unique not null,
  student_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  level int not null,
  stage int not null,
  score int not null default 0,
  attempts int not null default 0,
  hints_used int not null default 0,
  completed boolean not null default false,
  completion_time_seconds int,
  created_at timestamptz not null default now()
);

create index if not exists progress_student_id_idx on public.progress(student_id);

alter table public.students enable row level security;
alter table public.progress enable row level security;

-- Development policy for classroom prototype.
-- Before public production, tighten these policies or use anonymous auth.
create policy "students read" on public.students for select using (true);
create policy "students insert" on public.students for insert with check (true);
create policy "progress read" on public.progress for select using (true);
create policy "progress insert" on public.progress for insert with check (true);
