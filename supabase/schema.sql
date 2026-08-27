create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  leetcode_handle text not null unique,
  global_rating integer not null default 0
);

create table if not exists public.solved_problems (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  problem_name text not null,
  difficulty text not null,
  platform text not null
);

create index if not exists solved_problems_user_id_idx
  on public.solved_problems (user_id);

alter table public.users enable row level security;
alter table public.solved_problems enable row level security;

create policy "Allow public select on users"
  on public.users for select using (true);

create policy "Allow public insert on users"
  on public.users for insert with check (true);

create policy "Allow public update on users"
  on public.users for update using (true);

create policy "Allow public select on solved_problems"
  on public.solved_problems for select using (true);

create policy "Allow public insert on solved_problems"
  on public.solved_problems for insert with check (true);
