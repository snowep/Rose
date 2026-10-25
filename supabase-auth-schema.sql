-- Auth Users profile table
-- References auth.users.id

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Users can read their own profile
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Add updated_at trigger
create or replace function update_profiles_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_profiles_updated_at_column();

-- Books table reference updated_at trigger
-- Already exists from supabase-schema.sql