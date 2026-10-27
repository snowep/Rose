# Rose Implementation Plan

## Current State Analysis

**Three conflicting schemas exist:**

1. **`src/lib/book-service.ts`** — Flat Dexie database (`db`):
   - 3 tables: `books`, `user_books`, `people`
   - Uses flat `Book` interface from `src/lib/db`
   - Sync functions: `syncToSupabase()`, `pullFromSupabase()`, `syncPeopleToSupabase()`, `syncPublishersToSupabase()`

2. **`src/lib/db-normalized.ts`** — 21-table normalized Dexie database (`normalizedDb`):
   - Full entity model: `books`, `people`, `roles`, `book_people`, `publishers`, `book_publishers`, `series`, `book_series`, `genres`, `book_genres`, `reading_statuses`, etc.
   - Full junction tables: `book_people`, `book_genres`, `book_series`, `book_publishers`
   - Triggers for timestamps

3. **`docs/docs/DATABASE_SCHEMA.md`** — Target SQL schema:
   - Canonical Supabase PostgreSQL model with all tables
   - Junction tables: `book_authors`, `book_people`, `book_genres`, `book_series`, `book_publishers`
   - Enum status on `user_books` and `reading_logs`
   - RLS policies: `to public` on all tables

**Sync logic doesn't match protocol:**
- Upload order in `SYNC_PROTOCOL.md`: reference entities → submissions → junctions → shelf → copies → reading data
- Current code syncs books first, then authors, then user_books, then reading_logs — inconsistent ordering
- `pullFromSupabase` reads `user_books + books + reading_logs` — partially matches protocol

---

## Phase 0 — Baseline and Repository Control

### Tasks
1. ✅ Confirm current branch, commit, working tree, and package scripts.
2. ⬜ Inventory all Dexie database instances, schema versions, tables, indexes, imports, and data access services.
3. ⬜ Inventory SQL schema files and identify the deployed Supabase schema/migration history.
4. ⬜ Inventory all auth, shelf, reading, publisher, contributor, and sync routes/services.
5. ⬜ Establish `develop` and protect `main`; configure CI checks and PR template.
6. ⬜ Merge docs into the repository, preserving generated Next.js instructions.
7. ⬜ Record existing TypeScript/lint/build baseline without fixing unrelated failures silently.

### Acceptance criteria
- [ ] Baseline report includes exact commands, exit codes, and existing failures.
- [ ] One architecture diagram maps UI → hooks → services → Dexie/remote sync.
- [ ] Every schema file is classified as canonical, migration, generated snapshot, or obsolete candidate.
- [ ] No schema files or database modules are deleted before dependency/data review.
- [ ] `develop` exists and branch/PR rules are documented.
- [ ] Documentation distinguishes observed, verified, proposed, and decided facts.

### Commands
```bash
# Already done: git status shows clean main branch
# Need to: create develop branch, set up CI, verify build
git checkout -b develop
npm run build    # verify build passes
npm run lint     # verify lint passes
```

---

## Phase 1 — Canonical Data Layer and Local CRUD

### Tasks
1. Merge to single Dexie schema matching `DATABASE_SCHEMA.md` — choose normalizedDb or simplified flat schema
2. Define versioned migrations
3. Remove hidden `new Dexie(...)` instances; inject/use canonical repository
4. Make every persistence call awaited and return typed results
5. Add transactional use cases: create catalog proposal + own shelf entry, edit personal shelf entry, add/remove physical copy, record reading session
6. Ensure a local mutation and its outbox record commit in the same transaction
7. Add duplicate ISBN checks and candidate-warning service
8. Keep catalog metadata separate from shelf status, private notes, copy inventory, and reading sessions

### Acceptance criteria
- [ ] A failed Dexie write produces an error result and never shows success.
- [ ] Multi-table operations either commit fully or roll back fully.
- [ ] No UI/service uses a separate uncoordinated Dexie database instance.
- [ ] A user can add the same catalog book to their shelf only once.
- [ ] Two users can have separate shelf entries for one shared book.
- [ ] Removing a shelf entry never deletes the shared catalog book.
- [ ] Physical copy CRUD works offline and each copy belongs to one user's shelf entry.
- [ ] Reading sessions remain user-owned and do not mutate shared catalog metadata.
- [ ] Duplicate candidates show warnings; no fuzzy match is merged automatically.
- [ ] Migration tests preserve existing records and are repeatable/recoverable.

### File changes needed
1. **`src/lib/db.ts`** — Keep flat `Book` interface for backward compat; add `NormalizedBook` from `./db-types`
2. **`src/lib/db-normalized.ts`** — Refactor to single canonical database matching DATABASE_SCHEMA.md. Keep only tables needed: `books`, `people`, `roles`, `book_people`, `publishers`, `book_publishers`, `series`, `book_series`, `genres`, `book_genres`, `user_books`, `reading_logs`, `sync_outbox`, `sync_state`, `sync_conflicts`
3. **`src/lib/db-types.ts`** — Define normalized `NormalizedBook` interface and all typed tables
4. **`src/lib/book-service.ts`** — Rewrite all sync functions to use canonical database and match `SYNC_PROTOCOL.md` upload order
5. **Remove `src/lib/db-normalized.ts`** duplicate if converging to flat schema, or keep as canonical

### Migration strategy
- Clean rebuild using `personal_shelf_schema.sql` DROP ALL + recreate
- Export existing local Dexie data before schema change
- Import back after new schema is deployed
- Map flat fields to normalized entities per DATABASE_SCHEMA.md entity ownership map

---

## Phase 2 — Moderated Catalog Workflow

### Tasks
1. Implement `catalog_submissions` for new books and metadata changes
2. Define moderator authorization on the server and with Supabase RLS
3. Build submitter status view and moderator review queue
4. Approve/reject/request-changes actions with audit records
5. On approval, apply catalog updates transactionally and preserve related IDs
6. Support moderator-only duplicate merge with preview and relationship remapping

### Acceptance criteria
- [ ] Ordinary users cannot update canonical published catalog rows directly.
- [ ] New book proposals are visibly pending and cannot be mistaken for approved records.
- [ ] Only submitter and authorized moderators can access private submission details unless a public visibility policy is explicitly accepted.
- [ ] Approval updates canonical metadata and audit log atomically.
- [ ] Rejection does not remove the submitter's shelf entry, physical copies, or reading history.
- [ ] Catalog merge preserves all `user_books`, copy records, contributors, genres, publishers, series links, and reading history.
- [ ] Unauthorized moderator requests fail even if a client modifies UI state or request payload.

### File changes needed
1. **`src/lib/supabase/books-server.ts`** — Add moderator RPC/functions for approve/reject/merge
2. **`src/lib/supabase/books.ts`** — Add submit/cancel proposal flows
3. **New: `src/lib/database-types.sql`** — SQL types matching DATABASE_SCHEMA.md
4. **`src/app/(app)/catalog/`** — New page routes for submit/review queue
5. **`src/components/organisms/`** — ReviewQueueComponent, ProposalFormComponent

---

## Phase 3 — MUI Component and Form Contracts

### Tasks
1. Establish reusable text, numeric, ISBN, autocomplete, person, publisher, genre, date, and progress inputs
2. Standardize primary/secondary/destructive/icon-only buttons
3. Standardize Snackbar, Alert, Dialog, skeleton, empty-state, and inline error patterns
4. Refactor the book form into create/edit modes with progressive disclosure
5. Build physical-copy form and reading-session form using the same contracts
6. Apply atomic-design boundaries without splitting components solely by line count

### Acceptance criteria
- [ ] Every form has loading, validation-error, persistence-error, and success behavior.
- [ ] Failed saves preserve form values and keep the form open.
- [ ] Success feedback appears only after local persistence commits.
- [ ] Inputs have labels, helper/error text, normalization rules, and keyboard support.
- [ ] Icon-only buttons have accessible names.
- [ ] Delete/removal labels distinguish shelf membership, physical copies, and catalog records.
- [ ] No duplicated form/database logic remains in multiple page components.
- [ ] Mobile and desktop layouts work without hiding key actions or errors.
- [ ] Keyboard-only navigation and automated accessibility checks pass for critical flows.

### File changes needed
1. **MUI theme & sx config** — Standardize spacing, breakpoints, z-index
2. **`src/components/atoms/`** — Standardized FormTextField, FormNumberField, FormDatePicker, FormTagInput, FormISBNInput, FormSelectField
3. **`src/components/molecules/`** — BookCard, BookDetailsSection, LogProgressModal, AddPersonModal, AddPublisherModal
4. **`src/components/organisms/`** — BooksDiscoveryList, Heatmap, DashboardTemplate
5. **`src/components/templates/`** — LibraryTemplate, PeopleTemplate

---

## Phase 4 — Authentication and Offline Profile Lifecycle

### Tasks
1. Standardize login, registration, password recovery, and session restoration
2. Require network access for first authentication/registration
3. Support offline access only for a previously established local profile
4. Handle expired sessions and logout without deleting unsynced local data
5. Prevent local data leakage when switching accounts on one browser profile
6. Define behavior when IndexedDB is cleared or unavailable

### Acceptance criteria
- [ ] First login/registration correctly explains network requirement when offline.
- [ ] Existing local profile data opens offline without remote CRUD being required.
- [ ] Expired auth does not erase local data or falsely claim remote sync succeeded.
- [ ] Account switching cannot display another account's private shelf/copies/reading data.
- [ ] Logout clearly explains the fate of local and unsynced data.
- [ ] Storage initialization failure produces a recoverable page-level message.

### File changes needed
1. **`src/hooks/useAuth.ts`** — Standardize auth state, session restoration, account switching
2. **`src/providers/AuthProvider.tsx`** — Wrap all auth state, persist to IndexedDB
3. **`src/middleware.ts`** — Protect routes, handle session refresh
4. **`src/app/(auth)/`** — Login, Register, ForgotPassword pages (already exist)
5. **`src/app/layout.tsx`** — Global error boundary for auth failures

---

## Phase 5 — Manual Sync Engine

### Tasks
1. Implement outbox, operation IDs, revisions, tombstones, and sync state
2. Sync dependencies in order: people/publishers/genres/series → books or submissions → junctions → shelf entries → copies and reading sessions
3. Implement idempotent retries and a local sync lock
4. Implement download cursor/revision handling
5. Preserve base/local/remote snapshots for conflicts
6. Add explicit conflict-resolution UI
7. Implement manual Sync Center with partial result summaries
8. Verify Supabase RLS using two separate users

### Acceptance criteria
- [ ] Normal CRUD never waits for Supabase.
- [ ] Failed sync leaves local changes intact and retryable.
- [ ] Retrying after a timeout does not create duplicate records.
- [ ] A partial sync is never reported as fully successful.
- [ ] Same-record divergent edits create a visible conflict; neither version is silently discarded.
- [ ] Users can choose local or remote version, or a deliberate merged value, and resolution is itself synced safely.
- [ ] Deletes propagate through tombstones without accidental resurrection.
- [ ] Sync operations cannot cross account boundaries.
- [ ] RLS blocks user A from reading/writing user B's shelf, copies, sessions, and submissions.
- [ ] Moderator-only operations are rejected server-side for non-moderators.

### File changes needed
1. **`src/lib/sync/`** — New directory with sync engine
   - `outbox.ts` — operation_id, entity_type, entity_id, payload, status, attempt_count, error_code, timestamps
   - `sync-state.ts` — account/profile ID, last successful sync, remote cursor/revision, current sync lock metadata
   - `sync-conflicts.ts` — conflict_id, entity_type/id, base/local/remote snapshots, versions, detected_timestamp, resolution_state, chosen_result
   - `engine.ts` — main sync orchestration matching SYNC_PROTOCOL.md upload order
2. **`src/lib/book-service.ts`** — Rewrite `syncToSupabase()`, `pullFromSupabase()` to use sync engine
3. **`src/components/organisms/SyncCenter.tsx`** — Sync Center UI with partial results
4. **`src/components/atoms/Alert.tsx`** — Enhanced alert for sync results

### Sync sequence (from SYNC_PROTOCOL.md)
1. Require authenticated identity for remote operations
2. Acquire local sync lock
3. Read pending outbox operations
4. Validate ownership and payloads
5. Send operations with stable idempotency keys
6. Record acknowledged remote revision only after success
7. Download remote updates using a saved cursor/revision
8. Apply safe updates in Dexie transactions
9. Detect same-record divergence from base version
10. Save conflict snapshots and do not choose a winner silently
11. Advance cursor only after successful local application
12. Release lock and show counts/errors

### Upload order (from SYNC_PROTOCOL.md)
1. Shared reference entities and approved catalog dependencies
2. New catalog submissions and metadata proposals (not direct canonical edits)
3. Book relationship tables
4. User shelf membership
5. Physical copies and storage locations
6. Reading sessions and other private reading data

---

## Phase 6 — Dashboard, Library, Discovery, and Inventory Integration

### Tasks
1. Build dashboard aggregates from canonical local data
2. Add library search/sort/status filters and useful no-results states
3. Build catalog discovery and add-to-shelf flow
4. Add copy inventory and storage-location views
5. Add reading session history and progress summary
6. Display catalog moderation state and sync status clearly

### Acceptance criteria
- [ ] Dashboard counts match queries against the same local database.
- [ ] Search/filter reset works and does not mutate records.
- [ ] Adding an existing catalog book creates a shelf entry, not a duplicate catalog record.
- [ ] Duplicate warnings show enough metadata to distinguish editions.
- [ ] Users can manage multiple copies independently.
- [ ] Copy counts are derived, not manually maintained on shared books.
- [ ] Pending catalog submissions are clearly labeled.
- [ ] Each route handles loading, empty, populated, offline, and error states as relevant.

### File changes needed
1. **`src/app/(app)/library/`** — Library page with dashboard aggregates
2. **`src/app/(app)/discovery/`** — Discovery page with add-to-shelf flow
3. **`src/components/organisms/`** — DashboardTemplate with counts, recent activity
4. **`src/components/molecules/`** — HeatmapGrid, ReadingProgressSection (already exist)
5. **`src/components/atoms/`** — StatCard (already exists)
6. **New: `src/components/organisms/SyncStatusDisplay.tsx`** — Show sync status per book

---

## Phase 7 — Backup, Hardening, and Release

### Tasks
1. Define versioned export format for user-owned data
2. Validate imports with preview, duplicate report, transaction/recovery plan, and size limits
3. Test performance using realistic library sizes
4. Run accessibility, security, sync, and migration regression suites
5. Complete changelog, release notes, and migration guide

### Acceptance criteria
- [ ] Export includes shelf entries, physical copies, storage locations, reading sessions, and necessary references
- [ ] Export clearly distinguishes user-owned data from shared catalog metadata
- [ ] Import rejects malformed data without partially corrupting the library
- [ ] Export/import round trip preserves IDs, relationships, and private fields
- [ ] No secrets or private notes appear in logs
- [ ] Type-check, lint, production build, tests, and security/RLS tests pass
- [ ] All remaining limitations are documented before release tagging

### File changes needed
1. **`src/lib/export/`** — Export format definition, validation
2. **`src/lib/import/`** — Import with preview, duplicate report, recovery plan
3. **Performance testing scripts** — Realistic library sizes
4. **Accessibility tests** — Axe, screen reader testing
5. **Security/RLS test suite** — Two-user RLS verification
6. **`CHANGELOG.md`** — Versioned changelog
7. **`CHANGELOG.md`** — Release notes
8. **`docs/RELEASE_NOTES.md`** — Migration guide

---

## Branch & Commit Strategy

### Branch flow
- `main` — protected, stable releases only
- `develop` — integration branch, PRs merged via squash
- Feature branches: `feat/<short-desc>`, `fix/<short-desc>`
- Hotfix branches: `hotfix/<short-desc>` from main

### Conventional commits
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `style:` formatting, no code change
- `refactor:` structural change, no behavior change
- `perf:` performance improvement
- `test:` adding missing tests
- `build:` build tool changes
- `chore:` maintenance items

### Commit message format
```
<type>(<scope>): <subject>

<optional body>

<optional footer>
```

Footer: `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>` for all commits generated with Claude Code.

### Pull request template
- Title: `<type>: <subject>` (under 70 chars)
- Body: summary, test plan, checklist of acceptance criteria from ROADMAP.md phase

---

## Next Immediate Actions

1. **Create `develop` branch** (already done)
2. **Classify all schema files** as canonical/migration/generated/obsolete
3. **Choose single Dexie schema** — converge to normalizedDb matching DATABASE_SCHEMA.md
4. **Run `npm run build`** on current state and document failures
5. **Start Phase 1 task 1** — refactor Dexie schema to single canonical model