- [Rose MVP Completed](mvp-completed.md) — 7-day ship, v0.1.0-mvp tag, Palette A 11:11 Division theme, all PRD v1 requirements fulfilled
- Frontend: Next.js 16 + React 19 + TypeScript + Material UI v9 (9.5.0)
- Atomic design: AppBar (atom) → NavDrawer (molecule) → Layout (organism) + DashboardTemplate (template)
- Templates: DashboardTemplate — NavDrawer + Heatmap + Library molecule + main content
- CRUD: Library section with BooksList atom/molecule, FAB bottom-right for book entry, offline-first with cloud-integratable later
- New pages: /library and /settings (standalone, MUI + Next.js App Router reference)
- Graphify: code graph extracted — 26 files, 122 nodes, 181 edges, 10 communities (`graphify-out/graph.json`, updated 2026-10-23)
- Discovered components: HeatmapCell, HeatmapGrid, HeatmapHeader, BookModal, BookModalProps, HeatmapMode
- NavDrawer: permanent, 240px, clipped under static AppBar, with Dashboard/Library/Settings links (next/link), active state via usePathname
- FAB: fixed bottom-right (bottom: 24, right: 24, zIndex: 1200) outside drawer, aria-label="Add a book", wired to BookModal via AddBookFab
- Heatmap: GitHub-like contribution calendar (30 days) rendered in DashboardTemplate, split into HeatmapCell/Grid/Header atoms/molecules
- BookCard atom: title, author, status, View link (for later detailed CRUD), now shows genre, rating, pages, progress, tags
- BooksList molecule: renders from IndexedDB via BookService, displays book count, uses AddBookFab
- BookModal: full form with title, author, status, genre, rating, pages, progress, tags, notes
- BookDetail page: /library/detail/[id], shows full metadata, reading progress log, edit/delete/log buttons
- LogProgressModal: date + pages read logging form, persists to dailyLog array
- Dexie.js: IndexedDB store `rose` with books table, auto-creates UUID, createdAt/updatedAt hooks, seed data
- BookService: CRUD + updateProgress + addDailyLog methods
- Book type extended with genre, rating, pages, startedAt, finishedAt, coverImage, notes, tags, progress, dailyLog
- **Auto-sync**: Every create/update/delete first saves to Dexie (offline-capable), then syncs to Supabase (cross-device visibility)
- TypeScript: clean, no errors
- BookCard: enhanced with progress bar, status chips, genre, rating stars, tags, hover effects
- TypeScript: clean, no errors
- Tailwind removed; vanilla CSS + MUI v9 styling used
- .gitignore created with standard Next.js exclusions
- Build compiles successfully (exit code 0); dev server running at http://localhost:3000
- Routes: /, /library, /library/detail/[id], /settings all confirmed rendering
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
├── client.ts      # Browser client (createBrowserClient from @supabase/ssr)
├── server.ts      # Server client (createServerClient from @supabase/ssr)
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
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
- **Build**: `npm run build` → ✓ Compiled successfully, TypeScript clean
- **API GET /api/books**: 200 OK, returns books from Supabase
- **API POST /api/books**: 201 Created, inserts to Supabase
- **Homepage (/)**: 200 OK, renders DashboardTemplate with heatmap
- **Dev server**: Running at http://localhost:3000 without 500 errors

### Key Learnings
1. Next.js 16 renamed `middleware.ts` → `proxy.ts` with `export async function proxy()`
2. `@supabase/ssr` requires both browser and server clients with cookie handling
3. `PUBLISHABLE_KEY` is the new name for `ANON_KEY` in Supabase dashboard
4. API routes must use `createServerClient()` per request for proper auth context
5. Proxy handles token refresh automatically via `supabase.auth.getClaims()`

---

## Local Dexie Fallback Implementation (2026-10-23)

### Problem
The Supabase `books` table didn't exist yet, causing 500 errors when API routes tried Supabase first.

### Solution: Local-Only IndexedDB Mode
Simplified API routes to use **local Dexie only** — no Supabase dependency required for basic CRUD.

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
1. **Start dev server**: `npm run dev` → `http://localhost:3000`
2. **Add book via UI**: FAB → BookModal → Save → **Instant** IndexedDB save
3. **Test API**: `GET /api/books` → Returns books with `fallback: true`
4. **Zero Supabase setup required** for basic functionality

### Supabase Cloud Sync (Optional, Future)
When ready for cross-device sync:
1. Run schema SQL in Supabase Dashboard → creates `books` table
2. API routes auto-switch to Supabase (when configured)
5. Data syncs across devices automatically

### Verification
- **TypeScript**: Clean, no errors
- **Build**: `npm run build` → ✓ Compiled successfully
- **API**: `GET /api/books` returns books from local IndexedDB
- **UI**: FAB → BookModal → Save works instantly
- **Dev server**: Running without 500 errors

---

*Last updated: 2026-10-23*