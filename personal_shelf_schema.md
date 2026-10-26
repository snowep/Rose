# Personal Shelf Schema Update – 2026-10-26

## Summary
Aligned `personal_shelf_schema.sql`, Supabase tables, and `BookService` manual sync to support catalog + user shelf + reading logs.

## Schema Changes

### personal_shelf_schema.sql
- Added columns to `user_books`: `progress int`, `rating int`, `cover_image text`, `notes text`, `tags text[]`, `updated_at`
- Added `log_date date` to `reading_logs` for heatmap aggregation
- Added `roles` seed + `book_people` junction for author/editor/translator/illustrator
- Added indexes and triggers for `user_books_updated_at`

### book-service.ts
```
syncToSupabase(userId: string)
  - upsert shared `books` catalog record (one per book)
  - upsert `user_books` per user
  - insert `reading_logs` per log entry

pullFromSupabase(userId: string)
  - select user_books join books join reading_logs
  - reconstruct Dexie Book with dailyLog from reading_logs
```

### settings/page.tsx
- Inject `useAuth()` to get `user.id`
- Pass `user.id` to sync/pull calls

## Flow
1. User adds book → Dexie flat Book
2. Manual sync → catalog `books` (shared) + `user_books` (per user) + `reading_logs` (per user per date)
3. Other user adds same book → catalog deduped, new `user_books` row
4. Heatmap reads `reading_logs.log_date` aggregated per user

## Manual sync retained
System not mature; no auto-sync yet.

## Next
- Add upsert on `reading_logs` to avoid duplicates on re-sync
- Add `reading_status_id` mapping from Dexie `status` to schema lookup
