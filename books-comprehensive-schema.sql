-- ============================================================
-- Comprehensive Relational Schema for Book Collection Management
-- Based on 180+ flat book fields
-- ============================================================

-- ============================================================
-- Enums and Lookup Types
-- ============================================================

-- Reading status enum
create type reading_status as enum ('want-to-read', 'reading', 'read');

-- Book format enum
create type book_format as enum ('hardcover', 'paperback', 'ebook', 'audiobook', 'board_book', 'picture_book', 'magazine', 'newspaper', 'other');

-- Binding type enum
create type binding_type as enum ('hardcover', 'paperback', 'spiral', 'board_book', 'trade paperback', 'mass market paperback', 'other');

-- Cover type enum
create type cover_type as enum ('hard', 'soft', 'dust jacket', 'other');

-- Paper type enum
create type paper_type as enum ('standard', 'glossy', 'recycled', 'other');

-- Inventory status enum
create type inventory_status as enum ('available', 'checked_out', 'reserved', 'lost', 'damaged', 'withdrawn', 'archived');

-- Condition enum
create type book_condition as enum ('like_new', 'very_good', 'good', 'fair', 'poor', 'damaged');

-- Acquisition method enum
create type acquisition_method as enum ('purchase', 'gift', 'donation', 'inheritance', 'exchange', 'library_copy', 'digital_copy', 'other');

-- Acquisition source enum
create type acquisition_source as enum ('bookstore', 'library', 'online', 'gift', 'donation', 'inheritance', 'swap', 'other');

-- Digital file format enum
create type file_format as enum ('epub', 'pdf', 'mobi', 'azw3', 'cbz', 'cbr', 'other');

-- License type enum
create type license_type as enum ('public_domain', 'creative_commons', 'commercial', 'library_loan', 'other');

-- Relationship type enum
create type relationship_type as enum ('sequel', 'prequel', 'companion', 'related', 'reprint', 'translation', 'other');

-- Content warning enum (common ones)
create type content_warning_type as enum (
  'violence', 'drugs', 'alcohol', 'smoking', 'sexual_content',
  'profanity', 'fear', 'gore', 'self_harm', 'suicide',
  'divorce', 'death', 'grief', 'abuse', 'neglect',
  'mental_illness', 'religious', 'cultural', 'other'
);

-- ============================================================
-- Core Tables
-- ============================================================

-- publishers table
create table if not exists publishers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  imprint text,
  website text,
  email text,
  phone text,
  city text,
  country text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add constraint for country codes (optional)
-- check (country ~* '^[A-Z]{2}$' or country is null);

-- Add unique constraint on name within city/country combo
-- (omitted for flexibility, can be added later)

-- retailers table
create table if not exists retailers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text,
  country text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- distributor_types table
create table if not exists distributor_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamp with time zone default now()
);

-- distributors table
create table if not exists distributors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type_id uuid references distributor_types(id),
  website text,
  contact_email text,
  contact_phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- retailers_books junction (many-to-many books-retailers)
create table if not exists book_retailers (
  book_id uuid references books(id) on delete cascade,
  retailer_id uuid references retailers(id) on delete cascade,
  price decimal(10,2),
  purchase_date timestamp with time zone,
  currency char(3) check (length(currency) = 3),
  stock_status text check (stock_status in ('available', 'out_of_stock', 'limited', 'discontinued')),
  acquired_at timestamp with time zone default now(),
  primary key (book_id, retailer_id)
);

-- ============================================================
-- People & Roles (Authors, Contributors, etc.)
-- ============================================================

-- people table - stores all people involved with books
create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  middle_name text,
  full_name text generated always as (
    case
      when last_name is not null then concat_ws(' ', coalesce(first_name), coalesce(middle_name), last_name)
      else coalesce(first_name, ' ', coalesce(middle_name))
    end
  ) stored,
  birth_date date,
  death_date date,
  biography text,
  nationality text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- roles table - defines roles people can have with books
create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamp with time zone default now()
);

-- Insert common roles
insert into roles (name, description) values
  ('author', 'Primary author of the work'),
  ('contributor', 'Contributor to the work'),
  ('translator', 'Translator of the work'),
  ('editor', 'Editor of the work'),
  ('illustrator', 'Illustrator of the work'),
  ('cover_artist', 'Cover artist'),
  ('series_editor', 'Series editor'),
  ('foreword_writer', 'Foreword writer'),
  ('intro_writer', 'Introduction writer');

-- book_people junction - links books to people with their roles
create table if not exists book_people (
  book_id uuid references books(id) on delete cascade,
  person_id uuid references people(id) on delete cascade,
  role_id uuid references roles(id),
  primary_sequence integer not null default 0, -- for ordering when multiple people have same role
  is_primary boolean default false,
  created_at timestamp with time zone default now(),
  primary key (book_id, person_id, role_id)
);

-- ============================================================
-- Series
-- ============================================================

-- series table
create table if not exists series (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  total_volumes integer check (total_volumes > 0),
  start_year integer,
  end_year integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- book_series junction - links books to series with volume number
create table if not exists book_series (
  book_id uuid references books(id) on delete cascade,
  series_id uuid references series(id) on delete cascade,
  volume_number integer check (volume_number > 0),
  is_main_volume boolean default true,
  primary key (book_id, series_id)
);

-- ============================================================
-- Genres
-- ============================================================

-- genres table
create table if not exists genres (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  parent_id uuid references genres(id), -- for hierarchical genres
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add self-referential constraint check
-- check (not (id = parent_id));

-- book_genres junction
create table if not exists book_genres (
  book_id uuid references books(id) on delete cascade,
  genre_id uuid references genres(id) on delete cascade,
  primary_key (book_id, genre_id)
);

-- ============================================================
-- Subjects/Keywords
-- ============================================================

-- subjects table
create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamp with time zone default now()
);

-- book_subjects junction
create table if not exists book_subjects (
  book_id uuid references books(id) on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,
  primary_key (book_id, subject_id)
);

-- ============================================================
-- Tags
-- ============================================================

-- tags table
create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text, -- e.g., 'genre', 'theme', 'award', 'reading_challenge'
  created_at timestamp with time zone default now()
);

-- book_tags junction
create table if not exists book_tags (
  book_id uuid references books(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary_key (book_id, tag_id)
);

-- ============================================================
-- Content Warnings
-- ============================================================

-- book_content_warnings junction (many-to-many)
create table if not exists book_content_warnings (
  book_id uuid references books(id) on delete cascade,
  warning_type content_warning_type not null,
  severity integer check (severity >= 1 and severity <= 5), -- 1=mild, 5=extreme
  notes text,
  primary_key (book_id, warning_type)
);

-- ============================================================
-- Publishers & Book Publishers
-- ============================================================

-- book_publishers junction
create table if not exists book_publishers (
  book_id uuid references books(id) on delete cascade,
  publisher_id uuid references publishers(id) on delete cascade,
  published_date timestamp with time zone,
  is_first_edition boolean default false,
  primary_key (book_id, publisher_id)
);

-- ============================================================
-- Rooms & Shelves (Location)
-- ============================================================

-- rooms table
create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  building text,
  floor integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- shelves table
create table if not exists shelves (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  room_id uuid references rooms(id) on delete set null,
  capacity integer check (capacity > 0),
  current_count integer default 0,
  position integer, -- for ordering within a room
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================
-- Book Copies (Physical copies tracking)
-- ============================================================

-- book_copies table - tracks individual physical copies
create table if not exists book_copies (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books(id) on delete cascade,
  copy_number integer not null, -- 1, 2, 3... for each physical copy
  condition book_condition default 'good',
  location_id uuid references shelves(id), -- which shelf it's on
  status inventory_status default 'available',
  acquired_method acquisition_method default 'purchase',
  acquired_source acquisition_source,
  acquired_at timestamp with time zone,
  purchased_price decimal(10,2),
  purchased_currency char(3) check (length(purchased_currency) = 3),
  msrp decimal(10,2), -- manufacturer's suggested retail price
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add constraint: each book must have at least one copy
-- (enforced at application level or trigger)

-- ============================================================
-- Ownership & Acquisition
-- ============================================================

-- owners table
create table if not exists owners (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text,
  phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- acquisition_sources table
create table if not exists acquisition_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type acquisition_source default 'other',
  contact_info text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- acquisition_methods table (already have as enum, but keeping table for extensibility)
create table if not exists acquisition_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamp with time zone default now()
);

-- book_ownership_records table - tracks ownership history
create table if not exists book_ownership_records (
  id uuid primary key default gen_random_uuid(),
  book_copy_id uuid references book_copies(id) on delete cascade,
  owner_id uuid references owners(id),
  acquired_method_id uuid references acquisition_methods(id),
  acquired_at timestamp with time zone default now(),
  source_id uuid references acquisition_sources(id),
  gift_donor text, -- name of person who gifted
  inheritance_from text, -- name of person inherited from
  notes text,
  created_at timestamp with time zone default now()
);

-- ============================================================
-- Reading Statuses & Logs
-- ============================================================

-- reading_statuses table (could use enum, but keeping table for history)
create table if not exists reading_statuses (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books(id) on delete cascade,
  user_id uuid references owners(id), -- who is reading
  status reading_status default 'want-to-read',
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  progress_page integer check (progress_page >= 0),
  rating numeric(2,1) check (rating >= 0 and rating <= 5),
  review text,
  read_date timestamp with time zone,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================
-- Borrowers & Loans
-- ============================================================

-- borrowers table
create table if not exists borrowers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  address text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- loans table - tracks book lending
create table if not exists loans (
  id uuid primary key default gen_random_uuid(),
  book_copy_id uuid references book_copies(id) on delete cascade,
  borrower_id uuid references borrowers(id) not null,
  loan_date timestamp with time zone default now(),
  due_date timestamp with time zone not null,
  return_date timestamp with time zone,
  status text default 'active' check (status in ('active', 'returned', 'overdue', 'lost', 'renewed')),
  renewal_count integer default 0 check (renewal_count >= 0),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================
-- Digital Files
-- ============================================================

-- file_formats table (already have enum, but keeping for extensibility)
create table if not exists file_formats (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamp with time zone default now()
);

-- license_types table (already have enum, but keeping for extensibility)
create table if not exists license_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamp with time zone default now()
);

-- digital_files table
create table if not exists digital_files (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books(id) on delete cascade,
  file_format_id uuid references file_formats(id),
  license_type_id uuid references license_types(id),
  file_size bigint check (file_size > 0), -- size in bytes
  storage_location text, -- e.g., 'cloud', 'local', 'external_drive'
  device_app text, -- e.g., 'kindle', 'apple_books', 'calibre'
  download_url text,
  drm_status text check (drm_status in ('enabled', 'disabled', 'none', 'unknown')),
  last_opened_at timestamp with time zone,
  times_opened integer default 0 check (times_opened >= 0),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================
-- Book Images
-- ============================================================

-- book_images table
create table if not exists book_images (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books(id) on delete cascade,
  image_url text not null,
  image_type text check (image_type in ('cover', 'interior', 'scan', 'signature', 'other')),
  description text,
  resolution text, -- e.g., '1200x1800'
  source text, -- e.g., 'amazon', 'library_scan', 'owned_scan'
  is_primary boolean default true,
  created_at timestamp with time zone default now()
);

-- ============================================================
-- Awards
-- ============================================================

-- awards table
create table if not exists awards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  year integer,
  category text,
  organization text,
  created_at timestamp with time zone default now()
);

-- book_awards junction
create table if not exists book_awards (
  book_id uuid references books(id) on delete cascade,
  award_id uuid references awards(id) on delete cascade,
  received boolean default true,
  notes text,
  primary_key (book_id, award_id)
);

-- ============================================================
-- Related Works
-- ============================================================

-- relationship_types table
create table if not exists relationship_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamp with time zone default now()
);

-- Insert common relationship types
insert into relationship_types (name, description) values
  ('sequel', 'Direct sequel to this work'),
  ('prequel', 'Direct prequel to this work'),
  ('companion', 'Companion book/set in same universe'),
  ('related', 'Thematically or loosely related'),
  ('reprint', 'New edition or reprint of this work'),
  ('translation', 'Translation of this work into another language'),
  ('omnibus', 'Collection containing this and other works'),
  ('other', 'Other relationship');

-- book_related_works junction
create table if not exists book_related_works (
  book_id uuid references books(id) on delete cascade,
  related_book_id uuid references books(id) on delete cascade,
  relationship_type_id uuid references relationship_types(id),
  primary_key (book_id, related_book_id)
);

-- Add check to prevent self-reference
-- check (book_id != related_book_id);

-- ============================================================
-- Classification Schemes
-- ============================================================

-- classification_schemes table
create table if not exists classification_schemes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamp with time zone default now()
);

-- classifications table
create table if not exists classifications (
  id uuid primary key default gen_random_uuid(),
  scheme_id uuid references classification_schemes(id),
  code text not null, -- e.g., 'LCC F', 'DD 735 .A1 2020'
  description text,
  valid_from date,
  valid_to date,
  created_at timestamp with time zone default now()
);

-- ============================================================
-- Core Books Table (expanded from existing Supabase schema)
-- ============================================================

create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  -- Core Identity
  title text not null,
  subtitle text,
  original_title text,
  isbn10 char(10),
  isbn13 char(13),
  barcode char(14),
  asin char(10),
  cover_thumbnail text,
  language text default 'eng',
  edition text,
  volume_number integer, -- for multi-volume works

  -- Authors/Contributors (de-normalized for quick access)
  -- Full normalization handled via book_people

  -- Series
  series_name text,
  series_number integer, -- volume number within series

  -- Publisher
  publisher_id uuid references publishers(id),
  imprint text,
  publisher_website text,
  publisher_email text,
  publisher_phone text,
  publisher_city text,
  publisher_country text,

  -- Publication
  publication_date timestamp with time zone,
  publication_year integer check (publication_year >= 1000 and publication_year <= year(current_date)),
  first_published_date timestamp with time zone,
  publication_country text,
  publication_city text,
  copyright_year integer check (copyright_year >= 1000 and copyright_year <= year(current_date)),

  -- Retail/Purchase
  purchase_source text, -- e.g., 'amazon', 'library', 'gift'
  purchase_price decimal(10,2),
  purchase_date timestamp with time zone,
  currency char(3) check (length(currency) = 3),
  msrp decimal(10,2),
  discounted_price decimal(10,2),
  retailer_name text,
  retailer_url text,
  stock_status text check (stock_status in ('available', 'out_of_stock', 'limited', 'discontinued')),

  -- Format/Physical
  format book_format default 'hardcover',
  binding binding_type,
  width decimal(5,2), -- in inches or cm
  height decimal(5,2),
  depth decimal(3,2),
  weight decimal(5,2), -- in pounds or kg
  cover_type cover_type default 'hard',
  paper_type paper_type default 'standard',
  dust_jacket boolean default true,
  signed boolean default false,
  first_edition boolean default false,
  rare_book boolean default false,
  condition book_condition default 'good',
  condition_notes text,

  -- Content
  description text,
  summary text,
  subjects text, -- comma-separated for quick search, normalized via book_subjects
  keywords text, -- comma-separated
  age_range text, -- e.g., '0-3', '4-8', '9-12', '13-17', 'adult'
  reading_level text, -- e.g., 'early_reader', 'middle_grade', 'young_adult', 'adult'
  content_warnings text, -- comma-separated
  table_of_contents text, -- JSON or text

  -- Classification
  dewey_decimal text,
  library_of_congress_classification text,
  collection_name text,
  reading_category text, -- e.g., 'fiction', 'non-fiction', 'children', 'ya'

  -- Location
  room_id uuid references rooms(id),
  shelf_id uuid references shelves(id),
  -- Additional location fields denormalized
  room_name text,
  shelf_name text,
  section text,
  row text,
  bin text,
  position text, -- e.g., 'A1', 'end_cap'
  location_notes text,

  -- Inventory
  inventory_status inventory_status default 'available',
  total_copies integer default 1 check (total_copies >= 1),
  available_copies integer default 1 check (available_copies >= 0),
  reserved_copies integer default 0 check (reserved_copies >= 0),
  lost_status integer default 0 check (lost_status >= 0),
  damaged_status integer default 0 check (damaged_status >= 0),
  withdrawn_status integer default 0 check (withdrawn_status >= 0),
  date_added timestamp with time zone default now(),
  last_checked_date timestamp with time zone,

  -- Ownership
  owned_status text check (owned_status in ('owned', 'borrowed', 'library', 'digital_only', 'other')),
  owner_name text,
  acquired_by text, -- e.g., 'purchase', 'gift', 'inheritance'
  gift boolean default false,
  donation boolean default false,
  inherited boolean default false,
  provenance text, -- history of ownership
  ownership_notes text,

  -- Reading
  progress_page integer check (progress_page >= 0),
  last_read_date timestamp with time zone,
  review text,
  reading_notes text,
  favorite boolean default false,
  recommended_by text,

  -- Lending
  loaned_status text default 'no' check (loaned_status in ('yes', 'no', 'currently_loaned', 'lost')),
  borrower_name text,
  borrower_email text,
  borrower_phone text,
  loan_date timestamp with time zone,
  due_date timestamp with time zone,
  return_date timestamp with time zone,
  loan_notes text,

  -- Digital
  digital_status text default 'no' check (digital_status in ('yes', 'no', 'partial', 'streaming')),
  file_format text, -- e.g., 'epub', 'pdf'
  file_size decimal(10,2), -- in MB or GB
  drm_status text check (drm_status in ('enabled', 'disabled', 'none', 'unknown')),
  storage_location text,
  device_app text,
  download_url text,
  license text,

  -- Related Works
  related_title text,
  relationship_type text check (relationship_type in ('sequel', 'prequel', 'companion', 'related', 'reprint', 'translation', 'other')),
  related_isbn13 char(13),
  related_notes text,

  -- Awards & Adaptations
  awards text, -- comma-separated
  adaptations text, -- comma-separated

  -- Citations
  citations text, -- comma-separated

  -- Data source tracking
  data_source text, -- e.g., 'manual', 'isbn_lookup', 'library_system'
  verified_status boolean default false,
  record_version integer default 1,

  -- Timestamps
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================
-- Indexes for Performance
-- ============================================================

-- Books table indexes
create index idx_books_title on books(title);
create index idx_books_isbn13 on books(isbn13) where isbn13 is not null;
create index idx_books_isbn10 on books(isbn10) where isbn10 is not null;
create index idx_books_asin on books(asin) where asin is not null;
create index idx_books_language on books(language);
create index idx_books_format on books(format);
create index idx_books_condition on books(condition);
create index idx_books_stock_status on books(stock_status);
create index idx_books_inventory_status on books(inventory_status);
create index idx_books_publisher_id on books(publisher_id);
create index idx_books_dewey on books(dewey_decimal);
create index idx_books_lcc on books(library_of_congress_classification);
create index idx_books_reading_category on books(reading_category);
create index idx_books_owner_name on books(owner_name);
create index idx_books_owned_status on books(owned_status);
create index idx_books_loaned_status on books(loaned_status);
create index idx_books_digital_status on books(digital_status);
create index idx_books_verified on books(verified_status);
create index idx_books_data_source on books(data_source);

-- Generated index for search on combined fields
create index idx_books_search on books(
  title, subtitle, original_title,
  dewey_decimal, library_of_congress_classification
);

-- Publishers indexes
create index idx_publishers_name on publishers(name);
create index idx_publishers_city_country on publishers(city, country);

-- Retailers indexes
create index idx_retailers_name on retailers(name);

-- Distributors indexes
create index idx_distributors_name on distributors(name);
create index idx_distributors_type on distributors(type_id);

-- Book Retailers indexes
create index idx_book_retailers_book on book_retailers(book_id);
create index idx_book_retailers_retailer on book_retailers(retailer_id);

-- People indexes
create index idx_people_full_name on people(full_name);
create index idx_people_last_name on people(last_name);

-- Roles indexes
create index idx_roles_name on roles(name);

-- Book People indexes
create index idx_book_people_book on book_people(book_id);
create index idx_book_people_person on book_people(person_id);
create index idx_book_people_role on book_people(role_id);

-- Series indexes
create index idx_series_name on series(name);
create index idx_series_total on series(total_volumes);

-- Book Series indexes
create index idx_book_series_book on book_series(book_id);
create index idx_book_series_series on book_series(series_id);

-- Genres indexes
create index idx_genres_name on genres(name);
create index idx_genres_parent on genres(parent_id);

-- Book Genres indexes
create index idx_book_genres_book on book_genres(book_id);
create index idx_book_genres_genre on book_genres(genre_id);

-- Subjects indexes
create index idx_subjects_name on subjects(name);

-- Book Subjects indexes
create index idx_book_subjects_book on book_subjects(book_id);
create index idx_book_subjects_subject on book_subjects(subject_id);

-- Tags indexes
create index idx_tags_name on tags(name);
create index idx_tags_category on tags(category);

-- Book Tags indexes
create index idx_book_tags_book on book_tags(book_id);
create index idx_book_tags_tag on book_tags(tag_id);

-- Content Warnings indexes
create index idx_book_content_warnings_book on book_content_warnings(book_id);

-- Book Publishers indexes
create index idx_book_publishers_book on book_publishers(book_id);
create index idx_book_publishers_publisher on book_publishers(publisher_id);

-- Rooms indexes
create index idx_rooms_name on rooms(name);
create index idx_rooms_building on rooms(building);

-- Shelves indexes
create index idx_shelves_name on shelves(name);
create index idx_shelves_room on shelves(room_id);
create index idx_shelves_position on shelves(position);

-- Book Copies indexes
create index idx_book_copies_book on book_copies(book_id);
create index idx_book_copies_location on book_copies(location_id);
create index idx_book_copies_status on book_copies(status);

-- Book Ownership Records indexes
create index idx_book_ownership_records_copy on book_ownership_records(book_copy_id);
create index idx_book_ownership_records_owner on book_ownership_records(owner_id);

-- Reading Statuses indexes
create index idx_reading_statuses_book on reading_statuses(book_id);
create index idx_reading_statuses_status on reading_statuses(status);

-- Borrowers indexes
create index idx_borrowers_name on borrowers(last_name, first_name);

-- Loans indexes
create index idx_loans_book_copy on loans(book_copy_id);
create index idx_loans_borrower on loans(borrower_id);
create index idx_loans_due_date on loans(due_date);
create index idx_loans_status on loans(status);

-- Digital Files indexes
create index idx_digital_files_book on digital_files(book_id);
create index idx_digital_files_format on digital_files(file_format_id);
create index idx_digital_files_drm on digital_files(drm_status);

-- Book Images indexes
create index idx_book_images_book on book_images(book_id);
create index idx_book_images_primary on book_images(book_id) where is_primary = true;

-- Awards indexes
create index idx_awards_name on awards(name);

-- Book Awards indexes
create index idx_book_awards_book on book_awards(book_id);
create index idx_book_awards_award on book_awards(award_id);

-- Relationship Types indexes
create index idx_relationship_types_name on relationship_types(name);

-- Book Related Works indexes
create index idx_book_related_works_book on book_related_works(book_id);
create index idx_book_related_works_related on book_related_works(related_book_id);
-- Self-reference check enforced at application level

-- Classification Schemes indexes
create index idx_classification_schemes_name on classification_schemes(name);

-- Classifications indexes
create index idx_classifications_scheme on classifications(scheme_id);
create index idx_classifications_code on classifications(code);

-- ============================================================
-- Triggers for Automatic Updated_at
-- ============================================================

-- Create updated_at trigger for books table
create or replace function update_books_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_books_updated_at
  before update on books
  for each row
  execute function update_books_updated_at_column();

-- Create updated_at trigger for publishers table
create or replace function update_publishers_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_publishers_updated_at
  before update on publishers
  for each row
  execute function update_publishers_updated_at_column();

-- Create updated_at trigger for series table
create or replace function update_series_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_series_updated_at
  before update on series
  for each row
  execute function update_series_updated_at_column();

-- Create updated_at trigger for people table
create or replace function update_people_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_people_updated_at
  before update on people
  for each row
  execute function update_people_updated_at_column();

-- Create updated_at trigger for tags table
create or replace function update_tags_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_tags_updated_at
  before update on tags
  for each row
  execute function update_tags_updated_at_column();

-- Create updated_at trigger for genres table
create or replace function update_genres_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_genres_updated_at
  before update on genres
  for each row
  execute function update_genres_updated_at_column();

-- Create updated_at trigger for awards table
create or replace function update_awards_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_awards_updated_at
  before update on awards
  for each row
  execute function update_awards_updated_at_column();

-- ============================================================
-- Row Level Security (RLS) - Example policies
-- ============================================================

-- Enable RLS on core tables
alter table books enable row level security;
alter table people enable row level security;
alter table publishers enable row level security;
alter table retailers enable row level security;
alter table distributors enable row level security;
alter table book_retailers enable row level security;
alter table book_people enable row level security;
alter table series enable row level security;
alter table genres enable row level security;
alter table book_genres enable row level security;
alter table subjects enable row level security;
alter table book_subjects enable row level security;
alter table tags enable row level security;
alter table book_tags enable row level security;
alter table book_content_warnings enable row level security;
alter table book_publishers enable row level security;
alter table book_copies enable row level security;
alter table book_ownership_records enable row level security;
alter table reading_statuses enable row level security;
alter table loans enable row level security;
alter table digital_files enable row level security;
alter table book_images enable row level security;
alter table awards enable row level security;
alter table book_awards enable row level security;
alter table relationship_types enable row level security;
alter table book_related_works enable row level security;
alter table classification_schemes enable row level security;
alter table classifications enable row level security;

-- Example RLS policy: authenticated users can read all books
create policy "Allow authenticated read on books" on books for select using (auth.role() = 'authenticated');

-- Example RLS policy: users can manage their own books
create policy "Users manage own books" on books for all using (owner_name = current_user or acquired_by = current_user);

-- Example RLS policy: people are visible to authenticated users
create policy "Allow authenticated read on people" on people for select using (auth.role() = 'authenticated');

-- Example RLS policy: loans are managed per user
create policy "Users manage own loans" on loans for all using (borrower_id = current_user or book_copy_id in (select id from book_copies where owned_status = 'owned'));

-- ============================================================
-- Helpful Comments
-- ============================================================

comment on table books is 'Core book entity with all metadata fields normalized into related lookup tables';
comment on table people is 'People involved with books (authors, contributors, editors, etc.)';
comment on table publishers is 'Book publishers and imprints';
comment on table retailers is 'Stores and where books can be purchased';
comment on table series is 'Book series organization';
comment on table genres is 'Book genres with hierarchical support';
comment on table subjects is 'Subjects or topics for books';
comment on table tags is 'Flexible tagging system for books';
comment on table book_content_warnings is 'Content warnings with severity levels';
comment on table book_copies is 'Individual physical copy tracking';
comment on table book_ownership_records is 'Ownership history and acquisition records';
comment on table reading_statuses is 'Reading progress and status tracking';
comment on table loans is 'Book lending records';
comment on table digital_files is 'Digital file formats and licenses';
comment on table book_images is 'Book cover and interior images';
comment on table awards is 'Awards and recognition';
comment on table book_awards is 'Which books have won which awards';
comment on table relationship_types is 'Types of relationships between books';
comment on table book_related_works is 'Related/connected works';
comment on table classification_schemes is 'Classification systems (Dewey, LCC, etc.)';
comment on table classifications is 'Specific classification codes per book';