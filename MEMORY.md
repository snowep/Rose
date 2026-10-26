- [Rose MVP Completed](mvp-completed.md) -- 7-day ship, v0.1.0-mvp tag, Palette A 11:11 Division theme, all PRD v1 requirements fulfilled
- Frontend: Next.js 16 + React 19 + TypeScript + Material UI v9 (9.5.0)
- Atomic design: AppBar (atom) -> NavDrawer (molecule) -> Layout (organism) + DashboardTemplate (template)
- Templates: DashboardTemplate -- NavDrawer + Heatmap + Library molecule + main content
- CRUD: Library section with BooksList atom/molecule, FAB bottom-right for book entry, offline-first with cloud-integratable later
- New pages: /library and /settings (standalone, MUI + Next.js App Router reference)
- Graphify: code graph extracted -- 150 files, 420 nodes, 583 edges, 52 communities (`graphify-out/graph.json`, updated 2026-10-24)
- Discovered components: HeatmapCell, HeatmapGrid, HeatmapHeader, BookCard, BookTitle, BookAuthor, GenreChip, RatingDisplay, ProgressBar, TagList, StatusChip, NavItem, PageHeader, BooksCount, BookMeta, HeatmapContainer, HeatmapGridContainer, HeatmapLoading, NavList, PageContainer, ReadingProgressSection, BookDetailHeader, BookDetailsSection, BooksListView, AddBookModalSimple, LogProgressModal, AppShell, BookDetailFixed, BooksList, Heatmap, BookCardCover, BookCardMeta, BookCardStatus, BookCardActions, BookSection, AddPersonModal, LogoutConfirmDialog, PeopleFab
- NavDrawer: permanent, 240px, clipped under static AppBar, with Dashboard/Library/All Books/People/Settings links (next/link), active state via usePathname
- FAB: fixed bottom-right (bottom: 24, right: 24, zIndex: 1200) outside drawer, aria-label="Add a book", wired to BookModal via AddBookFab
- Heatmap: GitHub-like contribution calendar (30 days) rendered in DashboardTemplate, integrated with real reading data from dailyLog
- BookCard molecule: cover image (300px) + title/author + genre/rating + progress bar + tags, click -> detail page, ellipsis truncation (composed of BookCardCover, BookCardMeta, BookCardStatus, BookCardActions atoms)
- BooksList molecule: Grid layout (xs:1, sm:2, md:3, lg:4), renders from IndexedDB via BookService
- BookModal: full form with title, author, status, genre, rating, pages, progress, tags, notes (used in Library via AddBookModalSimple)
- BookDetail page: /library/detail/[id], shows full metadata, reading progress log, edit/delete/log buttons
- LogProgressModal: date + pages read logging form, persists to dailyLog array
- Dexie.js: IndexedDB store `rose` with books table, auto-creates UUID, createdAt/updatedAt hooks
- BookService: CRUD + updateProgress + addDailyLog + manual syncToSupabase/pullFromSupabase (local Dexie IndexedDB)
- Book type extended with genre, rating, pages, startedAt, finishedAt, coverImage, notes, tags, progress, dailyLog
- **Manual sync only**: All CRUD local-first (Dexie), sync to Supabase only via Settings button
- Supabase personal shelf schema (personal_shelf_schema.sql): books (ISBN dedupe), people, roles, publishers, series, genres, book_people, book_series, book_genres, user_books (join), reading_logs
- Supabase service layer: src/lib/supabase/books.ts (getAllBooks, createBook, addBookToShelf with ISBN dedupe)
- Book title ellipsis: 2-line clamp with -webkit-line-clamp
- BooksListView: Grid layout (xs:1, sm:2, md:3, lg:4) consistent card widths
- BookDetail: auto-progress from dailyLog, auto-status (want-to-read->reading->read), auto timestamps
- Heatmap: real reading data from dailyLog, weekly/monthly/yearly views
- Settings: manual sync to Supabase (push/pull), clear local data with confirmation
- TypeScript: clean, no errors
- Tailwind removed; vanilla CSS + MUI v9 styling used
- .gitignore created with standard Next.js exclusions
- Build compiles successfully (exit code 0); dev server running at http://localhost:3000
- Routes: /, /dashboard, /library, /library/detail/[id], /books, /people, /settings, /login, /register, /forgot all confirmed rendering
- Data state: IndexedDB via Dexie.js, no state management layer, offline-first

## Supabase 500 Error Fix Progression (2026-10-23)

### Root Cause Analysis
The 500 errors originated from three interconnected issues:
1. **Environment variable mismatch**: `.env.local` used `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` but `supabase.ts` read `NEXT_PUBLIC_SUPABASE_ANON_KEY` (legacy naming)
2. **Missing SSR cookie handling**: Next.js 16 requires `@supabase/ssr` with proper cookie-based session management via Proxy (formerly middleware)
3. **API routes using legacy client**: API routes imported `supabase` from `@/lib/supabase` which created a basic client without auth context

### Step-by-Step Fix

#### 1. Fixed Environment Variable Resolution (supabase.ts)
```typescript
// Before: Only checked ANON_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

// After: Checks PUBLISHABLE_KEY first (current Supabase naming)
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
```

#### 2. Created SSR Client Architecture
**New file structure:**
```
src/lib/supabase/
|-- client.ts      # Browser client (createBrowserClient from @supabase/ssr)
|-- server.ts      # Server client (createServerClient from @supabase/ssr)
```

**client.ts** - Client Component client:
```typescript
'use client'
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
```

**server.ts** - Server Component/Route Handler client:
```typescript
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerClient() {
  const cookieStore = await cookies()
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch { /* ignore in Server Components */ }
        },
      },
    }
  )
}
```

#### 3. Created Proxy (Next.js 16 Middleware Replacement)
**File:** `src/proxy.ts` (replaces `middleware.ts` in Next.js 16)
```typescript
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  
  const supabase = createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh auth token on every request
  const { data: claimsData } = await supabase.auth.getClaims()
  const userClaims = claimsData?.claims ?? null

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

#### 4. Updated API Routes to Use Server Client
**Before (route.ts):**
```typescript
import { supabase } from '@/lib/supabase'  // Legacy basic client
const { data, error } = await supabase.from('books')...
```

**After (route.ts):**
```typescript
import { createServerClient } from '@/lib/supabase/server'
const supabase = await createServerClient()
const { data, error } = await supabase.from('books')...
```

Applied to:
- `src/app/api/books/route.ts` (GET, POST, PUT, DELETE)
- `src/app/api/books/[id]/route.ts` (GET, PUT, DELETE)

#### 5. Updated BookService to Use Browser Client
**File:** `src/lib/book-service.ts`
```typescript
// Before: import { supabase } from '@/lib/supabase'
// After:
import { createClient } from '@/lib/supabase/client'

async function syncBookToSupabase(book: Book) {
  const supabase = createClient()  // Creates browser client per call
  // ... upsert logic
}
```

#### 6. Fixed TypeScript Errors
- Renamed `createServerClient` export in `server.ts` to avoid naming collision with imported `createServerClient` from `@supabase/ssr`
- Fixed `getClaims()` return type handling with proper null checks
- Build passes with zero TypeScript errors

### Verification Results
- **Build**: `npm run build` -> Compiled successfully, TypeScript clean
- **API GET /api/books**: 200 OK, returns books from Supabase
- **API POST /api/books**: 201 Created, inserts to Supabase
- **Homepage (/)**: 200 OK, renders DashboardTemplate with heatmap
- **Dev server**: Running at http://localhost:3000 without 500 errors

### Key Learnings
1. Next.js 16 renamed `middleware.ts` -> `proxy.ts` with `export async function proxy()`
2. `@supabase/ssr` requires both browser and server clients with cookie handling
3. `PUBLISHABLE_KEY` is the new name for `ANON_KEY` in Supabase dashboard
4. API routes must use `createServerClient()` per request for proper auth context
5. Proxy handles token refresh automatically via `supabase.auth.getClaims()`

---

## Local Dexie Fallback Implementation (2026-10-23)

### Problem
The Supabase `books` table didn't exist yet, causing 500 errors when API routes tried Supabase first.

### Solution: Local-Only IndexedDB Mode
Simplified API routes to use **local Dexie only** -- no Supabase dependency required for basic CRUD.

### Changes Made

#### 1. Fixed Dexie Schema (`src/lib/book-service.ts`)
```typescript
db.version(1).stores({
  books: 'id, title, author, status, genre, rating, pages, progress, createdAt, updatedAt, dailyLog'
})
```
Added all Book fields to the index for proper retrieval.

#### 2. Simplified API Routes (`src/app/api/books/route.ts`)
**GET** - Uses local Dexie only:
```typescript
export async function GET() {
  const { BookService } = await import('@/lib/book-service')
  const localBooks = await BookService.getAll()
  return NextResponse.json({ success: true, count: localBooks.length, data: localBooks, fallback: true })
}
```

**POST** - Uses local Dexie only:
```typescript
export async function POST(request: Request) {
  const { BookService } = await import('@/lib/book-service')
  const body = await request.json()
  const id = await BookService.create(body)
  return NextResponse.json({ success: true, data: { id }, fallback: true }, { status: 201 })
}
```

**PUT/DELETE** - Similar local-only patterns.

#### 3. Removed Supabase Fallback Logic
- API routes now **only** use local Dexie (no Supabase dependency)
- No more 500 errors when Supabase table doesn't exist
- `fallback: true` flag indicates local data source

### How It Works (Local-First)
1. **Start dev server**: `npm run dev` -> `http://localhost:3000`
2. **Add book via UI**: FAB -> BookModal -> Save -> **Instant** IndexedDB save
3. **Test API**: `GET /api/books` -> Returns books with `fallback: true`
4. **Zero Supabase setup required** for basic functionality

### Supabase Cloud Sync (Optional, Future)
When ready for cross-device sync:
1. Run schema SQL in Supabase Dashboard -> creates `books` table
2. API routes auto-switch to Supabase (when configured)
3. Data syncs across devices automatically

### Verification
- **TypeScript**: Clean, no errors
- **Build**: `npm run build` -> Compiled successfully
- **API**: `GET /api/books` returns books from local IndexedDB
- **UI**: FAB -> BookModal -> Save works instantly
- **Dev server**: Running without 500 errors

---

## Manual Supabase Sync (2026-10-23)

### Problem
Auto-sync on every CRUD operation was unwanted. User wants full offline-first control with manual sync.

### Solution: Manual Sync via Settings
Removed auto-sync from BookService CRUD. Added dedicated manual sync in Settings.

### Changes Made

#### 1. BookService (`src/lib/book-service.ts`)
- Removed auto-sync from `create`, `update`, `delete`, `updateProgress`, `addDailyLog`
- Added manual `syncToSupabase()` -- pushes all local books to Supabase
- Added manual `pullFromSupabase()` -- pulls all books from Supabase to local

#### 2. Settings Page (`src/app/settings/page.tsx`)
- Added "Sync to Supabase" button (pushes local -> cloud)
- Added "Pull from Supabase" button (pulls cloud -> local)
- Shows success/failed counts with error details
- Loading states during sync
- **Clear Local Data** with confirmation dialog (wipes IndexedDB, Supabase unaffected)

### How It Works (Manual Sync)
1. **Start dev server**: `npm run dev` -> `http://localhost:3000`
2. **Add/edit/delete books locally** -- works offline, instant
3. **When ready**: Settings -> "Sync to Supabase" button
4. **See results**: Success count / Failed count with error details
4. **Optional**: "Pull from Supabase" to merge cloud changes

---

## Book Progression Wired to Read Log (2026-10-23)

### Problem
Read log entries weren't connected to book progression.

### Solution: Auto-progress from dailyLog

### Changes in `src/lib/book-service.ts` -- `addDailyLog` method:
- Updates `dailyLog` (merges same date entries)
- **Calculates total pages read** from all log entries
- **Auto-calculates progress**: `(totalPagesRead / book.pages) * 100`
- **Auto-sets status**: `want-to-read` -> `reading` (first log)
- **Auto-sets status**: `reading` -> `read` (progress >= 100%)
- **Auto-sets timestamps**: `startedAt` (first log), `finishedAt` (100% progress)
- **Updates progress field** automatically

### Flow
1. User logs pages in BookDetail -> "Log" button
2. `addDailyLog` fires -> updates `dailyLog`, progress, status, timestamps
3. Heatmap updates with real data
4. Book detail shows updated progress %
5. All syncs to Supabase on manual sync

---

## BookCard Redesign (2026-10-24)

### Requirements
- **Rich layout**: cover + title/author + genre/rating + progress bar + tags
- **Progress bar**: full width at bottom
- **Click card** -> detail page
- **Cover image**: placeholder until user adds
- **Interactions**: hover lift + shadow, click navigates

### Implementation
- **Card-based layout** with cover image (300px height)
- **Click card** -> detail page (wrapped in Link)
- **Cover image** with SVG placeholder fallback
- **Progress bar** at bottom (full width, `sx={{ mt: 'auto' }}`)
- **Genre, rating, tags, progress bar** all displayed
- **Hover effects** (lift + shadow)
- **Removed BookActions** (click card navigates instead)
- **TypeScript clean**

---

## Consistent Book Card Width (2026-10-24)

### Grid Layout Breakpoints
| Breakpoint | Columns | Cards/Row |
|---|---|---|
| xs (< 600px) | 12 | 1 |
| sm (>= 600px) | 6 | 2 |
| md (>= 900px) | 4 | 3 |
| lg (>= 1200px) | 3 | 4 |

All cards now have **consistent width** within each breakpoint. Grid container with `spacing={3}` ensures equal gaps.

---

## Book Title Ellipsis (2026-10-24)

### BookTitle Component
- **Truncates** long titles with ellipsis (`...`)
- **Default 2 lines**, configurable via `lines` prop
- Uses `-webkit-line-clamp` for cross-browser support
- Gracefully handles overflow

---

## Heatmap Integration with Real Reading Data (2026-10-24)

### Before vs After
| Before | After |
|---|---|
| Deterministic pseudo-random data | **Actual reading data** from books' `dailyLog` |
| Random counts (0-5) per day | **Actual pages read** aggregated per date |
| Static cells | **Dynamic cells** loaded from IndexedDB |

### How It Works
1. **Heatmap loads** -> `BookService.getAll()` fetches all books
2. **Aggregates** -> `aggregateReadingData()` sums `pagesRead` per date across all books
3. **Displays** -> Weekly/Monthly/Yearly views show **actual pages read** per day
4. **Colors** -> GitHub-style intensity based on pages read (0 = dark, more = greener)

---

## Graphify Update (2026-10-24)
- **420 nodes**, **583 edges**, **52 communities**
- **God nodes**: @mui/material (41), compilerOptions (16), react (14), createServerClient (13)
- **No import cycles** detected
- Build from commit: `24c9e115`

---



## BookForm Atomic Design Components (2026-10-24) -- REMOVED

The complex multi-tab BookForm components (BookFormCoreIdentity, BookFormAuthors, BookFormSeries, BookFormPublisher, BookFormReading, BookFormContent, BookFormBasic, BookFormTabs, BookFormSection) and the original tabbed AddBookModal were removed in favor of a simpler approach.

### Current Atomic Form Components (Atoms)
- **FormTextField** - Text input with label, validation, placeholder
- **FormTextArea** - Multi-line text input with rows prop
- **FormSelectField** - Dropdown select with options
- **FormNumberField** - Number input with min/max/step
- **FormDatePicker** - Date picker component
- **FormFileUpload** / **FormDragDropUpload** - File upload
- **FormISBNInput** - ISBN input with validation
- **FormSegmentedControl** - Segmented control
- **FormTagInput** - Tag input with autocomplete
- **FormYearInput** - Year input

### Current Book Components
- **AddBookModalSimple** - Simple modal for adding books (Title, Author, ISBN10, ISBN13)
- **BookCard** - Card with cover, title, author, status (molecule)
- **BookCardCover**, **BookCardMeta**, **BookCardStatus**, **BookCardActions** - BookCard sub-components
- **BookSection** - Section wrapper for book lists

### Documentation
- **BOOK_FIELDS.md** - Complete field reference documentation

### TypeScript
- Clean, no errors
- All components typed

## AppBar Runtime Fix (2026-10-26)
- Fixed MUI MenuListContext error in AppBar
- Replaced MenuItem with Button for logout action (MenuItem requires Menu/MenuList parent)
- Changed import: MenuItem -> Button in src/components/atoms/AppBar.tsx
- Build verified: exit code 0, TypeScript clean

## Personal Shelf Design (2026-10-26)
- Design doc: docs/superpowers/specs/2026-10-26-personal-shelf-design.md
- Global books catalog with ISBN dedupe, user_books join, reading_logs separate
- Created /books discovery page at src/app/(app)/books/page.tsx
- Added All Books link to NavList
- Created BooksDiscoveryList component with right Drawer for details
- Build verified, route /books live
- Supabase service layer: src/lib/supabase/books.ts (getAllBooks, createBook, addBookToShelf)
- Simple Add Book modal with Title/Author/ISBN10/ISBN13 wired to Supabase
- Removed complex multi-tab AddBookModal and all BookForm* components
- Clean build with all personal shelf wiring

## AuthLink Hydration Fix (2026-10-26)
- Fixed nested `<p>` and `<a>` hydration errors in auth forms
- AuthLink now renders Typography as `span` inside Next.js Link
- Removed inline spacing props that caused invalid HTML nesting
- Cleaned up LoginForm, RegisterForm footer text spacing
- Build passes without hydration warnings

## Logout Confirmation Modal (2026-10-26)
- Removed logout button from NavDrawer (was at bottom of nav list)
- Added LogoutConfirmDialog component with confirmation dialog
- AppBar Sign Out button now opens dialog with Cancel/Sign Out options
- Prevents accidental logouts from mis-clicks
- Uses MUI Dialog with Alert for clear confirmation UX
- Build verified, TypeScript clean

*Last updated: 2026-10-26*

## Perf: Incremental TS + Server-Side Books (2026-10-26)
- tsconfig: tsBuildInfoFile for incremental TypeScript caching
- /books page: server component with server-side fetch via createServerClient
- Branch: feat/perf-incremental merged to main
- Graphify graph updated in graphify-out (via `graphify update` after code changes)
- Build verified

## Reading Status Feature (2026-10-26)
- Added 5 statuses: want-to-read, reading, read, on-hold, dnf
- BookService.updateStatus() with auto timestamps (startedAt, finishedAt)
- Status dropdown in ReadingProgressSection on detail page
- Status dropdown in AddBookModalSimple for new books
- StatusChip updated with on-hold (orange) and dnf (red)
- Book interface updated with full status union
- Build verified, TypeScript clean

## Supabase Schema Update (2026-10-26)
- reading_statuses lookup table with 5 seeded statuses
- books.author column added
- books.reading_status_id FK to reading_statuses
- authors table + book_authors junction for many-to-many
- user_books.reading_status_id for per-user status
- reading_logs.reading_status_id for per-log status
- Updated personal_shelf_schema.sql

## Personal Shelf Enhancements (2026-10-27)
- AddBookModalSimple: author field uses PersonPicker (search-as-you-type ≥2 chars, existing-person chips, add-new-person)
- PersonPicker: reads from BookService.getPeople() (legacy Dexie store) instead of normalizedDb — fixes "add person not showing" bug
- PeopleTemplate: await loadPeople() after add instead of router.refresh()
- BooksDiscoveryList: empty state for /books page
- BooksList: empty state for Library page with AddBookFab CTA
- BookSection: empty state per reading status section
- BookDetailHeader: await onDelete() before router.push so list refreshes
- BookService: syncPeopleToSupabase() syncs local people to Supabase
- Settings: sync button calls both books and people sync
- NavList: added Publishers nav item
- NavItem: fix useMemo import and usePathname usage
- Type-check: clean (except pre-existing publisher page JSX errors)
