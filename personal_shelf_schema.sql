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

-- Reading Statuses (lookup)
create table reading_statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

insert into reading_statuses (name, slug) values
  ('Want to Read', 'want-to-read'),
  ('Reading', 'reading'),
  ('Read', 'read'),
  ('On Hold', 'on-hold'),
  ('Did Not Finish', 'dnf')
on conflict (slug) do nothing;

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

-- Authors (dedicated table)
create table authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_name text,
  created_at timestamptz not null default now()
);

create index idx_authors_name on authors(name);

-- Shared catalog
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

-- User Books
create table user_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  book_id uuid not null references books(id) on delete cascade,
  read_count int not null default 0,
  reading_status_id uuid references reading_statuses(id) on delete set null,
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
  reading_status_id uuid references reading_statuses(id) on delete set null
);

create index idx_reading_logs_user_book on reading_logs(user_id, book_id);
create index idx_reading_logs_logged_at on reading_logs(logged_at desc);
create index idx_reading_logs_date on reading_logs(log_date desc);

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
