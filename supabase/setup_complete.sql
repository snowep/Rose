-- Rose Personal Shelf - Complete Setup
-- Drop + Create in correct dependency order
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- DROP ALL FIRST
DROP TABLE IF EXISTS book_genres CASCADE;
DROP TABLE IF EXISTS book_series CASCADE;
DROP TABLE IF EXISTS book_people CASCADE;
DROP TABLE IF EXISTS book_authors CASCADE;
DROP TABLE IF EXISTS reading_logs CASCADE;
DROP TABLE IF EXISTS user_books CASCADE;
DROP TABLE IF EXISTS catalog_submissions CASCADE;
DROP TABLE IF EXISTS outbox CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS publishers CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS series CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS people CASCADE;
DROP TABLE IF EXISTS reading_statuses CASCADE;

-- Base tables (no FK to books)
CREATE TABLE people (id uuid primary key default gen_random_uuid(), name text not null, sort_name text);
CREATE INDEX idx_people_sort_name ON people(sort_name);

CREATE TABLE roles (id uuid primary key default gen_random_uuid(), name text not null unique);
INSERT INTO roles (name) VALUES ('Author'), ('Editor'), ('Translator'), ('Illustrator'), ('moderator') ON CONFLICT (name) DO NOTHING;

CREATE TABLE publishers (id uuid primary key default gen_random_uuid(), name text not null);
CREATE INDEX idx_publishers_name ON publishers(name);

CREATE TABLE series (id uuid primary key default gen_random_uuid(), name text not null);
CREATE INDEX idx_series_name ON series(name);

CREATE TABLE genres (id uuid primary key default gen_random_uuid(), name text not null unique);
CREATE INDEX idx_genres_name ON genres(name);

CREATE TABLE reading_statuses (id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique, display_name text not null, description text, sort_order int not null default 0, is_active boolean not null default true, color varchar(7), created_at timestamptz not null default now());
INSERT INTO reading_statuses (name, slug, display_name, description, sort_order, is_active, color) VALUES
  ('want-to-read','want-to-read','Want to Read','You plan to read this book',1,true,'#0288d1'),
  ('reading','reading','Reading','You are currently reading this book',2,true,'#1976d2'),
  ('read','read','Read','You have finished reading this book',3,true,'#2e7d32'),
  ('on-hold','on-hold','On Hold','You have paused reading this book',4,true,'#f57c00'),
  ('dnf','dnf','Did Not Finish','You stopped reading this book',5,true,'#c62828')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE authors (id uuid primary key default gen_random_uuid(), name text not null, sort_name text, created_at timestamptz not null default now());
CREATE INDEX idx_authors_name ON authors(name);

CREATE TABLE profiles (id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, email text, full_name text, role text DEFAULT 'user' CHECK (role IN ('user','moderator','admin')), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE outbox (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, operation text not null check (operation in ('create','update','delete')), entity text not null check (entity in ('book','author','publisher','person','user_book','reading_log')), entity_id uuid not null, revision int not null default 1, payload jsonb not null, created_at timestamptz not null default now(), processed boolean not null default false);
CREATE INDEX idx_outbox_user ON outbox(user_id);

-- Books (depends on publishers)
CREATE TABLE books (id uuid primary key default gen_random_uuid(), title text not null, subtitle text, isbn10 char(10), isbn13 char(13), publication_year int, pages int, description text, publisher_id uuid references publishers(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
CREATE INDEX idx_books_title ON books(title);
CREATE UNIQUE INDEX books_isbn13_key ON books(isbn13) WHERE isbn13 IS NOT NULL;
CREATE UNIQUE INDEX books_isbn10_key ON books(isbn10) WHERE isbn10 IS NOT NULL;

-- Tables dependent on books
CREATE TABLE catalog_submissions (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, book_id uuid references books(id) on delete set null, title text not null, subtitle text, author text, isbn13 text, publisher text, genre text, status text not null default 'pending' check (status in ('pending','approved','rejected','request-changes')), rejection_reason text, submitted_at timestamptz not null default now(), approved_at timestamptz, notes text, unique(user_id, book_id));
CREATE INDEX idx_catalog_submissions_user ON catalog_submissions(user_id);

CREATE TABLE user_books (id uuid primary key default gen_random_uuid(), user_id uuid not null, book_id uuid not null references books(id) on delete cascade, read_count int not null default 0, status text not null default 'want-to-read' check (status in ('want-to-read','reading','read','on-hold','dnf')), progress int not null default 0 check (progress between 0 and 100), rating int check (rating between 1 and 5), cover_image text, notes text, tags text[], added_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(user_id, book_id));
CREATE INDEX idx_user_books_user ON user_books(user_id);

CREATE TABLE reading_logs (id uuid primary key default gen_random_uuid(), user_id uuid not null, book_id uuid not null references books(id) on delete cascade, log_date date not null default current_date, logged_at timestamptz not null default now(), pages_read int not null check (pages_read > 0), status text not null default 'want-to-read' check (status in ('want-to-read','reading','read','on-hold','dnf')));
CREATE INDEX idx_reading_logs_user_book ON reading_logs(user_id, book_id);

CREATE TABLE book_authors (book_id uuid not null references books(id) on delete cascade, author_id uuid not null references authors(id) on delete cascade, is_primary boolean not null default false, position int, primary key (book_id, author_id));
CREATE TABLE book_people (book_id uuid not null references books(id) on delete cascade, person_id uuid not null references people(id) on delete cascade, role_id uuid not null references roles(id) on delete restrict, is_primary boolean not null default false, position int, primary key (book_id, person_id, role_id));
CREATE TABLE book_series (book_id uuid not null references books(id) on delete cascade, series_id uuid not null references series(id) on delete cascade, book_number numeric, primary key (book_id, series_id));
CREATE TABLE book_genres (book_id uuid not null references books(id) on delete cascade, genre_id uuid not null references genres(id) on delete cascade, primary key (book_id, genre_id));

-- Updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS books_updated_at ON books;
CREATE TRIGGER books_updated_at BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS user_books_updated_at ON user_books;
CREATE TRIGGER user_books_updated_at BEFORE UPDATE ON user_books FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_genres ENABLE ROW LEVEL SECURITY;

-- Policies (idempotent)
DO $$ BEGIN
  -- profiles
  DROP POLICY IF EXISTS profiles_select_own ON profiles;
  CREATE POLICY profiles_select_own ON profiles FOR SELECT TO authenticated USING (id = auth.uid());
  DROP POLICY IF EXISTS profiles_update_own ON profiles;
  CREATE POLICY profiles_update_own ON profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
  -- user_books (full owner-scoped CRUD)
  DROP POLICY IF EXISTS user_books_select_own ON user_books;
  CREATE POLICY user_books_select_own ON user_books FOR SELECT TO authenticated USING (user_id = auth.uid());
  DROP POLICY IF EXISTS user_books_insert_own ON user_books;
  CREATE POLICY user_books_insert_own ON user_books FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
  DROP POLICY IF EXISTS user_books_update_own ON user_books;
  CREATE POLICY user_books_update_own ON user_books FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  DROP POLICY IF EXISTS user_books_delete_own ON user_books;
  CREATE POLICY user_books_delete_own ON user_books FOR DELETE TO authenticated USING (user_id = auth.uid());
  -- reading_logs (full owner-scoped CRUD)
  DROP POLICY IF EXISTS reading_logs_select_own ON reading_logs;
  CREATE POLICY reading_logs_select_own ON reading_logs FOR SELECT TO authenticated USING (user_id = auth.uid());
  DROP POLICY IF EXISTS reading_logs_insert_own ON reading_logs;
  CREATE POLICY reading_logs_insert_own ON reading_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
  DROP POLICY IF EXISTS reading_logs_update_own ON reading_logs;
  CREATE POLICY reading_logs_update_own ON reading_logs FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  DROP POLICY IF EXISTS reading_logs_delete_own ON reading_logs;
  CREATE POLICY reading_logs_delete_own ON reading_logs FOR DELETE TO authenticated USING (user_id = auth.uid());
  -- outbox
  DROP POLICY IF EXISTS outbox_select_own ON outbox;
  CREATE POLICY outbox_select_own ON outbox FOR SELECT TO authenticated USING (user_id = auth.uid());
  -- books read
  DROP POLICY IF EXISTS books_select_authenticated ON books;
  CREATE POLICY books_select_authenticated ON books FOR SELECT TO authenticated USING (true);
  -- catalog_submissions
  DROP POLICY IF EXISTS catalog_submissions_select_own ON catalog_submissions;
  CREATE POLICY catalog_submissions_select_own ON catalog_submissions FOR SELECT TO authenticated USING (user_id = auth.uid());
  DROP POLICY IF EXISTS catalog_submissions_insert_own ON catalog_submissions;
  CREATE POLICY catalog_submissions_insert_own ON catalog_submissions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
  DROP POLICY IF EXISTS catalog_submissions_moderator_all ON catalog_submissions;
  CREATE POLICY catalog_submissions_moderator_all ON catalog_submissions FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')) WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator'));
END $$;
