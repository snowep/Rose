-- Personal Shelf System Schema
-- Supabase PostgreSQL
-- DROP ALL TABLES FOR CLEAN REBUILD
drop table if exists reading_logs cascade;
drop table if exists user_books cascade;
drop table if exists book_authors cascade;
drop table if exists book_people cascade;
drop table if exists book_genres cascade;
drop table if exists book_series cascade;
drop table if exists authors cascade;
drop table if exists books cascade;
drop table if exists publishers cascade;
drop table if exists series cascade;
drop table if exists genres cascade;
drop table if exists people cascade;
drop table if exists roles cascade;
drop table if exists reading_statuses cascade;

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Grant schema access for anon + authenticated roles
grant usage on schema public to anon;
grant usage on schema public to authenticated;

-- People
create table people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_name text
);
create index idx_people_sort_name on people(sort_name);

-- Roles
create table roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);
insert into roles (name) values
  ('Author'),
  ('Editor'),
  ('Translator'),
  ('Illustrator')
on conflict (name) do nothing;

-- Publishers
create table publishers (
  id uuid primary key default gen_random_uuid(),
  name text not null
);
create index idx_publishers_name on publishers(name);

-- Series
create table series (
  id uuid primary key default gen_random_uuid(),
  name text not null
);
create index idx_series_name on series(name);

-- Genres
create table genres (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);
create index idx_genres_name on genres(name);

-- Reading statuses enum table
create table reading_statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  display_name text not null,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  color varchar(7),
  created_at timestamptz not null default now()
);
insert into reading_statuses (name, slug, display_name, description, sort_order, is_active, color) values
  ('want-to-read', 'want-to-read', 'Want to Read', 'You plan to read this book', 1, true, '#0288d1'),
  ('reading', 'reading', 'Reading', 'You are currently reading this book', 2, true, '#1976d2'),
  ('read', 'read', 'Read', 'You have finished reading this book', 3, true, '#2e7d32'),
  ('on-hold', 'on-hold', 'On Hold', 'You have paused reading this book', 4, true, '#f57c00'),
  ('dnf', 'dnf', 'Did Not Finish', 'You stopped reading this book', 5, true, '#c62828')
on conflict (name) do nothing;

-- Outbox for manual sync engine idempotency
create table outbox (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  operation text not null check (operation in ('create', 'update', 'delete')),
  entity text not null check (entity in ('book', 'author', 'publisher', 'person', 'user_book', 'reading_log')),
  entity_id uuid not null,
  revision int not null default 1,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  processed boolean not null default false
);
create index idx_outbox_user on outbox(user_id);
create index idx_outbox_entity on outbox(entity, entity_id);
create index idx_outbox_processed on outbox(processed);

-- Catalog submissions table for moderated workflow
create table catalog_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid references books(id) on delete set null,
  title text not null,
  subtitle text,
  author text,
  isbn13 text,
  publisher text,
  genre text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'request-changes')),
  rejection_reason text,
  submitted_at timestamptz not null default now(),
  approved_at timestamptz,
  notes text,
  unique(user_id, book_id)
);
create index idx_catalog_submissions_user on catalog_submissions(user_id);
create index idx_catalog_submissions_book on catalog_submissions(book_id);
create index idx_catalog_submissions_status on catalog_submissions(status);

-- Authors (dedicated table)
create table authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_name text,
  created_at timestamptz not null default now()
);
create index idx_authors_name on authors(name);

-- Books (shared catalog)
create table books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  isbn10 char(10),
  isbn13 char(13),
  publication_year int,
  pages int,
  description text,
  publisher_id uuid references publishers(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_books_title on books(title);
create index idx_books_publisher on books(publisher_id);
create index idx_books_publication_year on books(publication_year);

-- Unique constraints for ISBNs where not null
create unique index books_isbn13_key on books(isbn13) where isbn13 is not null;
create unique index books_isbn10_key on books(isbn10) where isbn10 is not null;

-- User Books
create table user_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  book_id uuid not null references books(id) on delete cascade,
  read_count int not null default 0,
  status text not null default 'want-to-read' check (status in ('want-to-read', 'reading', 'read', 'on-hold', 'dnf')),
  progress int not null default 0 check (progress between 0 and 100),
  rating int check (rating between 1 and 5),
  cover_image text,
  notes text,
  tags text[],
  added_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, book_id)
);
create index idx_user_books_user on user_books(user_id);
create index idx_user_books_book on user_books(book_id);

-- Reading Logs
create table reading_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  book_id uuid not null references books(id) on delete cascade,
  log_date date not null default current_date,
  logged_at timestamptz not null default now(),
  pages_read int not null check (pages_read > 0),
  status text not null default 'want-to-read' check (status in ('want-to-read', 'reading', 'read', 'on-hold', 'dnf'))
);
create index idx_reading_logs_user_book on reading_logs(user_id, book_id);
create index idx_reading_logs_logged_at on reading_logs(logged_at desc);
create index idx_reading_logs_date on reading_logs(log_date desc);

-- Book Authors junction (many-to-many)
create table book_authors (
  book_id uuid not null references books(id) on delete cascade,
  author_id uuid not null references authors(id) on delete cascade,
  is_primary boolean not null default false,
  position int,
  primary key (book_id, author_id)
);
create index idx_book_authors_book on book_authors(book_id);
create index idx_book_authors_author on book_authors(author_id);

-- Book People junction (for editors, translators, illustrators)
create table book_people (
  book_id uuid not null references books(id) on delete cascade,
  person_id uuid not null references people(id) on delete cascade,
  role_id uuid not null references roles(id) on delete restrict,
  is_primary boolean not null default false,
  position int,
  primary key (book_id, person_id, role_id)
);
create index idx_book_people_book on book_people(book_id);
create index idx_book_people_person on book_people(person_id);

-- Book Series junction
create table book_series (
  book_id uuid not null references books(id) on delete cascade,
  series_id uuid not null references series(id) on delete cascade,
  book_number numeric,
  primary key (book_id, series_id)
);
create index idx_book_series_series on book_series(series_id);

-- Book Genres junction
create table book_genres (
  book_id uuid not null references books(id) on delete cascade,
  genre_id uuid not null references genres(id) on delete cascade,
  primary key (book_id, genre_id)
);
create index idx_book_genres_genre on book_genres(genre_id);

-- Updated_at trigger helper
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists books_updated_at on books;
create trigger books_updated_at
before update on books
for each row execute function set_updated_at();

drop trigger if exists user_books_updated_at on user_books;
create trigger user_books_updated_at
before update on user_books
for each row execute function set_updated_at();

-- RLS policies for anon + authenticated inserts and selects
-- Single policy per table using to public to cover both anon and authenticated roles

-- Enable RLS on reading_statuses first, then create policy
alter table reading_statuses enable row level security;
create policy "Allow public reading_statuses" on reading_statuses for all to public using (true) with check (true);

-- Catalog submissions — moderated workflow
alter table catalog_submissions enable row level security;
create policy "Allow public catalog_submissions" on catalog_submissions for all to public using (true) with check (true);

-- Now other tables
alter table books enable row level security;
create policy "Allow public books" on books for all to public using (true) with check (true);
alter table people enable row level security;
create policy "Allow public people" on people for all to public using (true) with check (true);
alter table authors enable row level security;
create policy "Allow public authors" on authors for all to public using (true) with check (true);
alter table book_authors enable row level security;
create policy "Allow public book_authors" on book_authors for all to public using (true) with check (true);
alter table user_books enable row level security;
create policy "Allow public user_books" on user_books for all to public using (true) with check (true);
alter table reading_logs enable row level security;
create policy "Allow public reading_logs" on reading_logs for all to public using (true) with check (true);
alter table publishers enable row level security;
create policy "Allow public publishers" on publishers for all to public using (true) with check (true);
alter table genres enable row level security;
create policy "Allow public genres" on genres for all to public using (true) with check (true);
alter table series enable row level security;
create policy "Allow public series" on series for all to public using (true) with check (true);
alter table roles enable row level security;
create policy "Allow public roles" on roles for all to public using (true) with check (true);