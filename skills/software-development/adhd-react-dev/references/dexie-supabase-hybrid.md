# Dexie + Supabase Hybrid Offline-First Storage

## Pattern Summary
Save data to Dexie.js IndexedDB first (instant, offline-capable), then async-synch to Supabase Postgres (cross-device visibility). This gives the best of both worlds.

## When to Use
- UI must work offline or on slow networks
- Data must persist across device/browser switches
- Budget allows one extra network call per write

## Core Flow (in BookService)

1. **Save to Dexie** — `db.books.add(record)` — immediate UI response, works offline
2. **Sync to Supabase** — `syncBookToSupabase(record)` — background, fire‑and‑forget
3. **On app load** — fetch from Supabase, populate Dexie cache so subsequent reads are instant

## Supabase Sync Helpers (src/lib/book-service.ts)

```typescript
async function syncBookToSupabase(book: Book) {
  try {
    const { error } = await supabase
      .from('books')
      .upsert({ /* full BookRecord */ })
    if (error) console.error('Supabase sync error:', error)
  } catch (err) {
    console.error('Supabase sync exception:', err)
  }
}

async function syncBookDeleteFromSupabase(id: string) {
  try {
    const { error } = await supabase.from('books').delete().eq('id', id)
    if (error) console.error('Supabase delete sync error:', error)
  } catch (err) {
    console.error('Supabase delete sync exception:', err)
  }
}
```

## API Routes (src/app/api/books/route.ts)
- `GET /api/books` — list from Supabase
- `POST /api/books` — create in Supabase
- `PUT /api/books` / `DELETE /api/books?id=` — update/delete in Supabase
- These are separate from the Dexie flow; they can be called directly by other apps or cron jobs

## Gotchas & Pitfalls

| Situation | Rule |
|---|---|
| **Sync fails silently** | `void syncBookToSupabase(record).catch(console.error)` — never block the UI on sync |
| **Stale Dexie cache** | On app start, `getBooks()` fetches from Supabase first, then Dexie becomes the read‑through cache |
| **Duplicate IDs** | `id = crypto.randomUUID()` in the create path — never reuse IDs |
| **Schema drift** | Keep `BookRecord` interface in `src/lib/supabase.ts` in sync with the Supabase SQL schema (`supabase-schema.sql`) |
| **Service role key** | Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client; keep it server‑only or in environment vars not bundled in the frontend |

## References
- `references/api-endpoints.md` — Dexie schema patterns, bookService CRUD signatures
- `references/react-conventions.md` — MUI Select, Conventional Commits, sx prop patterns
- Supabase docs: https://supabase.com/docs/guides/getting-started