-- RLS Policy Fixes (Phase 0)
-- Run AFTER personal_shelf_schema.sql base has been applied
-- Idempotent: uses IF NOT EXISTS / DROP POLICY IF EXISTS patterns
-- Ensures all referenced tables exist before applying policies

-- ============================================================
-- 0. ENSURE BASE TABLES EXIST (idempotent; base schema should already have these)
-- ============================================================

CREATE TABLE IF NOT EXISTS outbox (
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
CREATE INDEX IF NOT EXISTS idx_outbox_user ON outbox(user_id);
CREATE INDEX IF NOT EXISTS idx_outbox_entity ON outbox(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_outbox_processed ON outbox(processed);

-- ============================================================
-- 1. ENSURE profiles TABLE EXISTS (before any policies reference it)
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Idempotent policy drop/create
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_moderator_all" ON profiles;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_moderator_all" ON profiles
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

-- ============================================================
-- 2. ENABLE RLS ON ALL OTHER TABLES (idempotent)
-- ============================================================

-- Private user tables: owner-scoped CRUD
ALTER TABLE IF EXISTS user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reading_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS outbox ENABLE ROW LEVEL SECURITY;

-- Drop existing permissive policies (idempotent)
DROP POLICY IF EXISTS "Allow authenticated user_books" ON user_books;
DROP POLICY IF EXISTS "Allow authenticated reading_logs" ON reading_logs;
DROP POLICY IF EXISTS "Allow authenticated outbox" ON outbox;

-- User books: users own their shelf entries only
CREATE POLICY "user_books_select_own" ON user_books
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "user_books_insert_own" ON user_books
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_books_update_own" ON user_books
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_books_delete_own" ON user_books
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Reading logs: users own their reading history only
CREATE POLICY "reading_logs_select_own" ON reading_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "reading_logs_insert_own" ON reading_logs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "reading_logs_update_own" ON reading_logs
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "reading_logs_delete_own" ON reading_logs
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Outbox: client-side sync queue, owner-scoped
CREATE POLICY "outbox_select_own" ON outbox
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "outbox_insert_own" ON outbox
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "outbox_update_own" ON outbox
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "outbox_delete_own" ON outbox
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- 3. SHARED CATALOG TABLES: Moderator-controlled policies
-- ============================================================

-- Enable RLS on shared tables
ALTER TABLE IF EXISTS books ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS people ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS book_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS series ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reading_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS catalog_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS book_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS book_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS book_genres ENABLE ROW LEVEL SECURITY;

-- Drop existing overly-permissive policies (idempotent)
DROP POLICY IF EXISTS "Allow authenticated books" ON books;
DROP POLICY IF EXISTS "Allow authenticated people" ON people;
DROP POLICY IF EXISTS "Allow authenticated authors" ON authors;
DROP POLICY IF EXISTS "Allow authenticated book_authors" ON book_authors;
DROP POLICY IF EXISTS "Allow authenticated user_books" ON user_books;
DROP POLICY IF EXISTS "Allow authenticated reading_logs" ON reading_logs;
DROP POLICY IF EXISTS "Allow authenticated publishers" ON publishers;
DROP POLICY IF EXISTS "Allow authenticated genres" ON genres;
DROP POLICY IF EXISTS "Allow authenticated series" ON series;
DROP POLICY IF EXISTS "Allow authenticated roles" ON roles;
DROP POLICY IF EXISTS "Allow public reading_statuses" ON reading_statuses;
DROP POLICY IF EXISTS "Allow moderator catalog_submissions" ON catalog_submissions;

-- Books catalog: read always; write moderator-only
CREATE POLICY "books_select_authenticated" ON books
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "books_insert_moderator" ON books
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

CREATE POLICY "books_update_moderator" ON books
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

CREATE POLICY "books_delete_moderator" ON books
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

-- People: read always; write moderator-only
CREATE POLICY "people_select_authenticated" ON people
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "people_write_moderator" ON people
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

-- Authors: read always; write moderator-only
CREATE POLICY "authors_select_authenticated" ON authors
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authors_write_moderator" ON authors
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

-- Publishers: read always; write moderator-only
CREATE POLICY "publishers_select_authenticated" ON publishers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "publishers_write_moderator" ON publishers
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

-- Genres: read always; write moderator-only
CREATE POLICY "genres_select_authenticated" ON genres
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "genres_write_moderator" ON genres
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

-- Series: read always; write moderator-only
CREATE POLICY "series_select_authenticated" ON series
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "series_write_moderator" ON series
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

-- Roles: read always; write moderator-only
CREATE POLICY "roles_select_authenticated" ON roles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "roles_write_moderator" ON roles
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

-- Reading statuses: public SELECT; moderator DML
CREATE POLICY "reading_statuses_select_public" ON reading_statuses
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "reading_statuses_write_moderator" ON reading_statuses
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

-- Book authors junction: read always; write moderator-only
CREATE POLICY "book_authors_select_authenticated" ON book_authors
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "book_authors_write_moderator" ON book_authors
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

-- Book people junction: read always; write moderator-only
CREATE POLICY "book_people_select_authenticated" ON book_people
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "book_people_write_moderator" ON book_people
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

-- Book series junction: read always; write moderator-only
CREATE POLICY "book_series_select_authenticated" ON book_series
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "book_series_write_moderator" ON book_series
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

-- Book genres junction: read always; write moderator-only
CREATE POLICY "book_genres_select_authenticated" ON book_genres
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "book_genres_write_moderator" ON book_genres
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

-- Catalog submissions: owner can create/read own; moderator full control
CREATE POLICY "catalog_submissions_select_own" ON catalog_submissions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "catalog_submissions_insert_own" ON catalog_submissions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "catalog_submissions_moderator_all" ON catalog_submissions
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

-- ============================================================
-- 4. ADDITIONAL SHARED TABLE POLICIES (documentation/redundancy removal)
-- ============================================================

-- Ensure all shared table policies are in place (idempotent duplicates removed)
DROP POLICY IF EXISTS "book_people_select_authenticated" ON book_people;
DROP POLICY IF EXISTS "book_people_write_moderator" ON book_people;
CREATE POLICY "book_people_select_authenticated" ON book_people
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "book_people_write_moderator" ON book_people
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

DROP POLICY IF EXISTS "book_series_select_authenticated" ON book_series;
DROP POLICY IF EXISTS "book_series_write_moderator" ON book_series;
CREATE POLICY "book_series_select_authenticated" ON book_series
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "book_series_write_moderator" ON book_series
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

DROP POLICY IF EXISTS "book_genres_select_authenticated" ON book_genres;
DROP POLICY IF EXISTS "book_genres_write_moderator" ON book_genres;
CREATE POLICY "book_genres_select_authenticated" ON book_genres
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "book_genres_write_moderator" ON book_genres
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

-- ============================================================
-- 5. INDEXES (idempotent)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_catalog_submissions_user ON catalog_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_catalog_submissions_book ON catalog_submissions(book_id);
CREATE INDEX IF NOT EXISTS idx_catalog_submissions_status ON catalog_submissions(status);