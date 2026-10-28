-- RLS Policy Fixes
-- Applies owner-scoped policies to private tables and moderator-controlled policies to catalog
-- Run against a disposable Supabase project first

-- Enable RLS on all tables (idempotent)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_genres ENABLE ROW LEVEL SECURITY;

-- Drop existing overly-permissive policies
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

-- ============================================================
-- SHARED CATALOG TABLES: Read for authenticated, write controlled
-- ============================================================

-- Books catalog: authenticated users can read, only moderators can write
CREATE POLICY "books_select_authenticated" ON books
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "books_insert_moderator" ON books
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'moderator'
    )
  );

CREATE POLICY "books_update_moderator" ON books
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'moderator'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'moderator'
    )
  );

CREATE POLICY "books_delete_moderator" ON books
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'moderator'
    )
  );

-- People: read for authenticated, write for moderators
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

-- Authors: read for authenticated, write for moderators
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

-- Publishers: read for authenticated, write for moderators
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

-- Genres: read for authenticated, write for moderators
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

-- Series: read for authenticated, write for moderators
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

-- Roles: read for authenticated, write for moderators
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

-- Reading statuses: public read (needed for unauthenticated UI)
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

-- Book authors junction: read for authenticated, write for moderators
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

-- Book people junction: read for authenticated, write for moderators
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

-- Book series junction: read for authenticated, write for moderators
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

-- Book genres junction: read for authenticated, write for moderators
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
-- USER-PRIVATE TABLES: Owner-scoped CRUD
-- ============================================================

-- User books: users can only CRUD their own shelf entries
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

-- Reading logs: users can only CRUD their own reading history
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

-- ============================================================
-- CATALOG SUBMISSIONS: Owner can create/read own; moderator can approve
-- ============================================================

-- Users can create and read their own submissions
CREATE POLICY "catalog_submissions_select_own" ON catalog_submissions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "catalog_submissions_insert_own" ON catalog_submissions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Moderators can read all submissions and update status
CREATE POLICY "catalog_submissions_moderator_all" ON catalog_submissions
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'moderator')
  );

-- ============================================================
-- OUTBOX: Owner-scoped (if client-side queue, may not need RLS)
-- ============================================================

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
-- HELPER: Create profiles table with role column if not exists
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

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

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();