# Graph Report - Rose  (2026-10-24)

## Corpus Check
- 150 files · ~30,638 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: .example 1, (none) 1)

## Summary
- 420 nodes · 583 edges · 52 communities (18 shown, 34 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `24c9e115`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- layout.tsx
- compilerOptions
- package.json
- @mui/material
- BooksList
- Heatmap.tsx
- BooksList.tsx
- Changelog
- AGENTS.md
- Local Dexie Fallback Implementation (2026-10-23)
- createServerClient
- Supabase
- supabase.ts
- Changelog
- Writing Guidelines for Postgres References
- AppShell.tsx
- Atomic Design Audit Report
- Section Definitions
- Supabase Postgres Best Practices
- advanced-full-text-search.md
- advanced-jsonb-indexing.md
- conn-idle-timeout.md
- conn-limits.md
- conn-pooling.md
- conn-prepared-statements.md
- data-batch-inserts.md
- data-n-plus-one.md
- data-pagination.md
- data-upsert.md
- lock-advisory.md
- lock-deadlock-prevention.md
- lock-short-transactions.md
- lock-skip-locked.md
- monitor-explain-analyze.md
- monitor-pg-stat-statements.md
- monitor-vacuum-analyze.md
- query-composite-indexes.md
- query-covering-indexes.md
- query-index-types.md
- query-missing-indexes.md
- query-partial-indexes.md
- schema-constraints.md
- schema-data-types.md
- schema-foreign-key-indexes.md
- schema-lowercase-identifiers.md
- schema-partitioning.md
- schema-primary-keys.md
- security-privileges.md
- security-rls-basics.md
- security-rls-performance.md
- _template.md

## God Nodes (most connected - your core abstractions)
1. `@mui/material` - 41 edges
2. `compilerOptions` - 16 edges
3. `react` - 14 edges
4. `createServerClient()` - 13 edges
5. `next` - 10 edges
6. `BookCard()` - 10 edges
7. `BooksList()` - 10 edges
8. `Heatmap()` - 9 edges
9. `Book` - 9 edges
10. `Section Definitions` - 9 edges

## Surprising Connections (you probably didn't know these)
- `6. Fixed TypeScript Errors` --references--> `createServerClient()`  [INFERRED]
  MEMORY.md → src/lib/supabase/server.ts
- `Key Learnings` --references--> `createServerClient()`  [INFERRED]
  MEMORY.md → src/lib/supabase/server.ts
- `Gotchas & Pitfalls` --references--> `BookRecord`  [INFERRED]
  skills/software-development/adhd-react-dev/references/dexie-supabase-hybrid.md → src/lib/supabase.ts
- `Gotchas & Pitfalls` --references--> `getBooks()`  [INFERRED]
  skills/software-development/adhd-react-dev/references/dexie-supabase-hybrid.md → src/lib/supabase.ts
- `GET()` --calls--> `createServerClient()`  [EXTRACTED]
  src/app/api/books/[id]/route.ts → src/lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (52 total, 34 thin omitted)

### Community 0 - "layout.tsx"
Cohesion: 0.18
Nodes (11): @emotion/react, metadata, RootLayout(), AddBookFab(), AddBookModal(), BookForm, Layout(), createEmotionCache() (+3 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "package.json"
Cohesion: 0.07
Nodes (29): dependencies, dexie, @emotion/react, @emotion/styled, @mui/icons-material, @mui/material, next, react (+21 more)

### Community 3 - "@mui/material"
Cohesion: 0.12
Nodes (16): @mui/material, BookAuthor(), BookTitle(), GenreChip(), BookStatus, ProgressBar(), statusColors, RatingDisplay() (+8 more)

### Community 4 - "BooksList"
Cohesion: 0.22
Nodes (10): LibraryPage(), Page(), PageHeader(), StatCard(), StatCardProps, PageContainer(), BooksList(), DashboardTemplate() (+2 more)

### Community 5 - "Heatmap.tsx"
Cohesion: 0.14
Nodes (17): getColor(), HeatmapCell(), HeatmapCellProps, HeatmapContainer(), HeatmapHeader(), HeatmapMode, HeatmapLoading(), generateMonthlyCells() (+9 more)

### Community 6 - "BooksList.tsx"
Cohesion: 0.11
Nodes (24): dexie, @mui/icons-material, react, LibraryDetailPage(), BooksCount(), useBooks(), BookDetailHeader(), BookDetailProps (+16 more)

### Community 7 - "Changelog"
Cohesion: 0.10
Nodes (20): [0.1.3](https://github.com/supabase/agent-skills/compare/v0.1.2...v0.1.3) (2026-06-02), [0.1.4](https://github.com/supabase/agent-skills/compare/v0.1.3...v0.1.4) (2026-06-05), [0.1.5](https://github.com/supabase/agent-skills/compare/v0.1.4...v0.1.5) (2026-07-10), [0.1.6](https://github.com/supabase/agent-skills/compare/v0.1.5...supabase-v0.1.6) (2026-07-30), [0.1.7](https://github.com/supabase/agent-skills/compare/v0.1.6...supabase-v0.1.7) (2026-08-12), [0.1.8](https://github.com/supabase/agent-skills/compare/v0.1.7...supabase-v0.1.8) (2026-09-24), [0.1.9](https://github.com/supabase/agent-skills/compare/v0.1.8...supabase-v0.1.9) (2026-09-28), Bug Fixes (+12 more)

### Community 9 - "Local Dexie Fallback Implementation (2026-10-23)"
Cohesion: 0.09
Nodes (21): 1. Fixed Dexie Schema (`src/lib/book-service.ts`), 1. Fixed Environment Variable Resolution (supabase.ts), 2. Created SSR Client Architecture, 2. Simplified API Routes (`src/app/api/books/route.ts`), 3. Created Proxy (Next.js 16 Middleware Replacement), 3. Removed Supabase Fallback Logic, 4. Updated API Routes to Use Server Client, 5. Updated BookService to Use Browser Client (+13 more)

### Community 10 - "createServerClient"
Cohesion: 0.18
Nodes (12): nextConfig, next, @supabase/ssr, DELETE(), GET(), PUT(), DELETE(), GET() (+4 more)

### Community 11 - "Supabase"
Cohesion: 0.11
Nodes (15): Fix suggestion, Source, What happened, Skill Feedback, Steps, Core Principles, Debugging, Making and Committing Schema Changes (+7 more)

### Community 12 - "supabase.ts"
Cohesion: 0.12
Nodes (12): @supabase/supabase-js, API Routes (src/app/api/books/route.ts), Core Flow (in BookService), Dexie + Supabase Hybrid Offline-First Storage, Gotchas & Pitfalls, Pattern Summary, References, Supabase Sync Helpers (src/lib/book-service.ts) (+4 more)

### Community 13 - "Changelog"
Cohesion: 0.12
Nodes (16): [1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02), [1.3.0](https://github.com/supabase/agent-skills/compare/v1.2.0...v1.3.0) (2026-06-05), [1.4.0](https://github.com/supabase/agent-skills/compare/v1.3.0...v1.4.0) (2026-07-10), [1.5.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.4.0...supabase-postgres-best-practices-v1.5.0) (2026-07-30), [1.6.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.5.0...supabase-postgres-best-practices-v1.6.0) (2026-07-30), Bug Fixes, Bug Fixes, Bug Fixes (+8 more)

### Community 14 - "Writing Guidelines for Postgres References"
Cohesion: 0.12
Nodes (15): 1. Concrete Transformation Patterns, 2. Error-First Structure, 3. Quantified Impact, 4. Self-Contained Examples, 5. Semantic Naming, Code Example Standards, Comments, Impact Level Guidelines (+7 more)

### Community 15 - "AppShell.tsx"
Cohesion: 0.28
Nodes (7): AppBar(), Logo(), NavItem(), NavDrawer(), menuItems, NavList(), AppShell()

### Community 16 - "Atomic Design Audit Report"
Cohesion: 0.17
Nodes (11): Atomic Design Audit Report, Atoms (20 components), Build Status, Component Hierarchy, Hooks (3 hooks), Improvements Made, Molecules (11 components), Organisms (6 components) (+3 more)

### Community 17 - "Section Definitions"
Cohesion: 0.20
Nodes (9): 1. Query Performance (query), 2. Connection Management (conn), 3. Security & RLS (security), 4. Schema Design (schema), 5. Concurrency & Locking (lock), 6. Data Access Patterns (data), 7. Monitoring & Diagnostics (monitor), 8. Advanced Features (advanced) (+1 more)

### Community 18 - "Supabase Postgres Best Practices"
Cohesion: 0.33
Nodes (5): How to Use, References, Rule Categories by Priority, Supabase Postgres Best Practices, When to Apply

## Knowledge Gaps
- **6 isolated node(s):** `@emotion/styled`, `@types/node`, `@types/react`, `@types/react-dom`, `react-dom` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 238 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@mui/material` connect `@mui/material` to `layout.tsx`, `package.json`, `BooksList`, `Heatmap.tsx`, `BooksList.tsx`, `AppShell.tsx`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `createServerClient()` (e.g. with `6. Fixed TypeScript Errors` and `Key Learnings`) actually correct?**
  _`createServerClient()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@emotion/styled`, `@types/node`, `@types/react` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `next` connect `createServerClient` to `layout.tsx`, `package.json`, `BooksList.tsx`, `AppShell.tsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Why does `createServerClient()` connect `createServerClient` to `Local Dexie Fallback Implementation (2026-10-23)`, `supabase.ts`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._