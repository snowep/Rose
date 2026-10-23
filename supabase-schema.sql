-- Supabase books table schema
-- Run this in Supabase SQL Editor

create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  status text not null check (status in ('reading', 'read', 'want-to-read')),
  genre text,
  rating numeric(2,1),
  pages integer,
  started_at timestamp with time zone,
  finished_at timestamp with time zone,
  cover_image text,
  notes text,
  tags text[],
  progress integer check (progress >= 0 and progress <= 100),
  daily_log jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table books enable row level security;

-- Allow all operations for authenticated users (adjust for your auth setup)
create policy "Allow all operations" on books for all using (true) with check (true);

-- Create updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_books_updated_at
  before update on books
  for each row
  execute function update_updated_at_column();
