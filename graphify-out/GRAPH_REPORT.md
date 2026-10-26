# Graph Report - rose  (2026-10-27)

## Corpus Check
- 210 files · ~56,645 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 1, (none) 1, .log 1)

## Summary
- 907 nodes · 1294 edges · 98 communities (30 shown, 68 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b2add9ec`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app/layout.tsx
- compilerOptions
- package.json
- @mui/material
- BooksList.tsx
- Heatmap.tsx
- @mui/icons-material
- Changelog
- AGENTS.md
- MEMORY.md
- createServerClient
- Supabase
- createClient
- Changelog
- Writing Guidelines for Postgres References
- Atomic Design Audit Report
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
- db-types.ts
- react
- Updated Categories
- Changelog
- Supabase
- Changelog
- Writing Guidelines for Postgres References
- Review Focus
- Section Definitions
- Personal Shelf Schema Update – 2026-10-26
- Personal Shelf Design
- Supabase Postgres Best Practices
- .agents/skills/supabase-postgres-best-practices/references/advanced-full-text-search.md
- .agents/skills/supabase-postgres-best-practices/references/advanced-jsonb-indexing.md
- .agents/skills/supabase-postgres-best-practices/references/conn-idle-timeout.md
- .agents/skills/supabase-postgres-best-practices/references/conn-limits.md
- .agents/skills/supabase-postgres-best-practices/references/conn-pooling.md
- .agents/skills/supabase-postgres-best-practices/references/conn-prepared-statements.md
- .agents/skills/supabase-postgres-best-practices/references/data-batch-inserts.md
- .agents/skills/supabase-postgres-best-practices/references/data-n-plus-one.md
- .agents/skills/supabase-postgres-best-practices/references/data-pagination.md
- .agents/skills/supabase-postgres-best-practices/references/data-upsert.md
- .agents/skills/supabase-postgres-best-practices/references/lock-advisory.md
- .agents/skills/supabase-postgres-best-practices/references/lock-deadlock-prevention.md
- .agents/skills/supabase-postgres-best-practices/references/lock-short-transactions.md
- .agents/skills/supabase-postgres-best-practices/references/lock-skip-locked.md
- .agents/skills/supabase-postgres-best-practices/references/monitor-explain-analyze.md
- .agents/skills/supabase-postgres-best-practices/references/monitor-pg-stat-statements.md
- .agents/skills/supabase-postgres-best-practices/references/monitor-vacuum-analyze.md
- .agents/skills/supabase-postgres-best-practices/references/query-composite-indexes.md
- .agents/skills/supabase-postgres-best-practices/references/query-covering-indexes.md
- .agents/skills/supabase-postgres-best-practices/references/query-index-types.md
- .agents/skills/supabase-postgres-best-practices/references/query-missing-indexes.md
- .agents/skills/supabase-postgres-best-practices/references/query-partial-indexes.md
- .agents/skills/supabase-postgres-best-practices/references/schema-constraints.md
- .agents/skills/supabase-postgres-best-practices/references/schema-data-types.md
- .agents/skills/supabase-postgres-best-practices/references/schema-foreign-key-indexes.md
- .agents/skills/supabase-postgres-best-practices/references/schema-lowercase-identifiers.md
- .agents/skills/supabase-postgres-best-practices/references/schema-partitioning.md
- .agents/skills/supabase-postgres-best-practices/references/schema-primary-keys.md
- .agents/skills/supabase-postgres-best-practices/references/security-privileges.md
- .agents/skills/supabase-postgres-best-practices/references/security-rls-basics.md
- .agents/skills/supabase-postgres-best-practices/references/security-rls-performance.md
- .agents/skills/supabase-postgres-best-practices/references/_template.md
- Book

## God Nodes (most connected - your core abstractions)
1. `@mui/material` - 74 edges
2. `react` - 36 edges
3. `Updated Categories` - 22 edges
4. `createClient()` - 21 edges
5. `useAuth()` - 20 edges
6. `@mui/icons-material` - 19 edges
7. `next` - 18 edges
8. `createServerClient()` - 18 edges
9. `compilerOptions` - 17 edges
10. `RegisterForm()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Atoms Used Only in 1 Component (Candidate for Splitting or Removal)` --references--> `FormDatePicker()`  [INFERRED]
  audit-atomic-design.md → src/components/atoms/FormDatePicker.tsx
- `Atoms Used Only in 1 Component (Candidate for Splitting or Removal)` --references--> `FormTagInput()`  [INFERRED]
  audit-atomic-design.md → src/components/atoms/FormTagInput.tsx
- `settings/page.tsx` --references--> `useAuth()`  [INFERRED]
  personal_shelf_schema.md → src/hooks/useAuth.ts
- `Atoms Used Only in 1 Component (Candidate for Splitting or Removal)` --references--> `FormDragDropUpload()`  [INFERRED]
  audit-atomic-design.md → src/components/atoms/FormDragDropUpload.tsx
- `Frequently Used Atoms (Good Reusability)` --references--> `Logo()`  [INFERRED]
  audit-atomic-design.md → src/components/atoms/Logo.tsx

## Import Cycles
- None detected.

## Communities (98 total, 68 thin omitted)

### Community 0 - "app/layout.tsx"
Cohesion: 0.14
Nodes (15): @emotion/react, AuthGroupLayout(), metadata, RootLayout(), ThemeToggle(), LoginTemplate(), LoginTemplateProps, createEmotionCache() (+7 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "package.json"
Cohesion: 0.06
Nodes (31): dependencies, dexie, @emotion/react, @emotion/styled, @mui/icons-material, @mui/material, next, react (+23 more)

### Community 3 - "@mui/material"
Cohesion: 0.05
Nodes (37): Frequently Used Atoms (Good Reusability), @mui/material, BookAuthor(), BookCardSmall(), BookCardSmallProps, BookTitle(), FormDatePicker(), FormDatePickerProps (+29 more)

### Community 4 - "BooksList.tsx"
Cohesion: 0.17
Nodes (14): LibraryPage(), AddBookFab(), BooksCount(), PageHeader(), Person, PersonPicker(), PersonPickerProps, useBooks() (+6 more)

### Community 5 - "Heatmap.tsx"
Cohesion: 0.11
Nodes (21): DashboardPage(), Page(), getColor(), HeatmapCell(), HeatmapCellProps, HeatmapContainer(), HeatmapHeader(), HeatmapMode (+13 more)

### Community 6 - "@mui/icons-material"
Cohesion: 0.09
Nodes (24): Organisms with Good Reusability, dexie, @mui/icons-material, LibraryDetailPage(), PeoplePage(), FormFileUploadProps, PeopleFab(), AddPersonModal() (+16 more)

### Community 7 - "Changelog"
Cohesion: 0.10
Nodes (20): [0.1.3](https://github.com/supabase/agent-skills/compare/v0.1.2...v0.1.3) (2026-06-02), [0.1.4](https://github.com/supabase/agent-skills/compare/v0.1.3...v0.1.4) (2026-06-05), [0.1.5](https://github.com/supabase/agent-skills/compare/v0.1.4...v0.1.5) (2026-07-10), [0.1.6](https://github.com/supabase/agent-skills/compare/v0.1.5...supabase-v0.1.6) (2026-07-30), [0.1.7](https://github.com/supabase/agent-skills/compare/v0.1.6...supabase-v0.1.7) (2026-08-12), [0.1.8](https://github.com/supabase/agent-skills/compare/v0.1.7...supabase-v0.1.8) (2026-09-24), [0.1.9](https://github.com/supabase/agent-skills/compare/v0.1.8...supabase-v0.1.9) (2026-09-28), Bug Fixes (+12 more)

### Community 9 - "MEMORY.md"
Cohesion: 0.04
Nodes (46): 1. BookService (`src/lib/book-service.ts`), 1. Fixed Dexie Schema (`src/lib/book-service.ts`), 2. Settings Page (`src/app/settings/page.tsx`), 2. Simplified API Routes (`src/app/api/books/route.ts`), 3. Removed Supabase Fallback Logic, AppBar Runtime Fix (2026-10-26), AuthLink Hydration Fix (2026-10-26), Before vs After (+38 more)

### Community 10 - "createServerClient"
Cohesion: 0.12
Nodes (22): 1. Fixed Environment Variable Resolution (supabase.ts), 2. Created SSR Client Architecture, 3. Created Proxy (Next.js 16 Middleware Replacement), 4. Updated API Routes to Use Server Client, 5. Updated BookService to Use Browser Client, 6. Fixed TypeScript Errors, Key Learnings, Root Cause Analysis (+14 more)

### Community 11 - "Supabase"
Cohesion: 0.11
Nodes (15): Fix suggestion, Source, What happened, Skill Feedback, Steps, Core Principles, Debugging, Making and Committing Schema Changes (+7 more)

### Community 12 - "createClient"
Cohesion: 0.07
Nodes (35): @supabase/supabase-js, API Routes (src/app/api/books/route.ts), Core Flow (in BookService), Dexie + Supabase Hybrid Offline-First Storage, Gotchas & Pitfalls, Pattern Summary, References, Supabase Sync Helpers (src/lib/book-service.ts) (+27 more)

### Community 13 - "Changelog"
Cohesion: 0.12
Nodes (16): [1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02), [1.3.0](https://github.com/supabase/agent-skills/compare/v1.2.0...v1.3.0) (2026-06-05), [1.4.0](https://github.com/supabase/agent-skills/compare/v1.3.0...v1.4.0) (2026-07-10), [1.5.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.4.0...supabase-postgres-best-practices-v1.5.0) (2026-07-30), [1.6.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.5.0...supabase-postgres-best-practices-v1.6.0) (2026-07-30), Bug Fixes, Bug Fixes, Bug Fixes (+8 more)

### Community 14 - "Writing Guidelines for Postgres References"
Cohesion: 0.12
Nodes (15): 1. Concrete Transformation Patterns, 2. Error-First Structure, 3. Quantified Impact, 4. Self-Contained Examples, 5. Semantic Naming, Code Example Standards, Comments, Impact Level Guidelines (+7 more)

### Community 15 - "Atomic Design Audit Report"
Cohesion: 0.07
Nodes (28): 1. Atomic Design Structure Analysis, 3. Component Splitting Recommendations, 4. Dead Code & Unused Files Audit, 5. Recommended Actions, 6. Implementation Plan, 7. Quick Wins (Can Do in This Session), A. Component Splitting (Immediate Impact), Atomic Design Audit Report (+20 more)

### Community 16 - "Atomic Design Audit Report"
Cohesion: 0.17
Nodes (11): Atomic Design Audit Report, Atoms (20 components), Build Status, Component Hierarchy, Hooks (3 hooks), Improvements Made, Molecules (11 components), Organisms (6 components) (+3 more)

### Community 17 - "Section Definitions"
Cohesion: 0.20
Nodes (9): 1. Query Performance (query), 2. Connection Management (conn), 3. Security & RLS (security), 4. Schema Design (schema), 5. Concurrency & Locking (lock), 6. Data Access Patterns (data), 7. Monitoring & Diagnostics (monitor), 8. Advanced Features (advanced) (+1 more)

### Community 18 - "Supabase Postgres Best Practices"
Cohesion: 0.33
Nodes (5): How to Use, References, Rule Categories by Priority, Supabase Postgres Best Practices, When to Apply

### Community 52 - "db-types.ts"
Cohesion: 0.03
Nodes (67): AcquisitionMethod, AcquisitionMethodDef, AcquisitionSource, Award, AwardResult, BookAward, BookContentWarning, BookCopy (+59 more)

### Community 53 - "react"
Cohesion: 0.10
Nodes (37): 2. Reusability Analysis, Atoms Used Only in 1 Component (Candidate for Splitting or Removal), Molecules with Limited Reusability, nextConfig, next, react, SettingsPage(), ForgotPasswordForm() (+29 more)

### Community 54 - "Updated Categories"
Cohesion: 0.08
Nodes (23): 10. Retailers and Purchase Links, 11. Rooms and Shelves, 12. Book Copies / Inventory, 13. Ownership and Acquisition, 14. Reading History, 15. Lending, 16. Digital Files, 17. Cover Images (+15 more)

### Community 55 - "Changelog"
Cohesion: 0.10
Nodes (20): [0.1.3](https://github.com/supabase/agent-skills/compare/v0.1.2...v0.1.3) (2026-06-02), [0.1.4](https://github.com/supabase/agent-skills/compare/v0.1.3...v0.1.4) (2026-06-05), [0.1.5](https://github.com/supabase/agent-skills/compare/v0.1.4...v0.1.5) (2026-07-10), [0.1.6](https://github.com/supabase/agent-skills/compare/v0.1.5...supabase-v0.1.6) (2026-07-30), [0.1.7](https://github.com/supabase/agent-skills/compare/v0.1.6...supabase-v0.1.7) (2026-08-12), [0.1.8](https://github.com/supabase/agent-skills/compare/v0.1.7...supabase-v0.1.8) (2026-09-24), [0.1.9](https://github.com/supabase/agent-skills/compare/v0.1.8...supabase-v0.1.9) (2026-09-28), Bug Fixes (+12 more)

### Community 56 - "Supabase"
Cohesion: 0.11
Nodes (15): Fix suggestion, Source, What happened, Skill Feedback, Steps, Core Principles, Debugging, Making and Committing Schema Changes (+7 more)

### Community 57 - "Changelog"
Cohesion: 0.12
Nodes (16): [1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02), [1.3.0](https://github.com/supabase/agent-skills/compare/v1.2.0...v1.3.0) (2026-06-05), [1.4.0](https://github.com/supabase/agent-skills/compare/v1.3.0...v1.4.0) (2026-07-10), [1.5.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.4.0...supabase-postgres-best-practices-v1.5.0) (2026-07-30), [1.6.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.5.0...supabase-postgres-best-practices-v1.6.0) (2026-07-30), Bug Fixes, Bug Fixes, Bug Fixes (+8 more)

### Community 58 - "Writing Guidelines for Postgres References"
Cohesion: 0.12
Nodes (15): 1. Concrete Transformation Patterns, 2. Error-First Structure, 3. Quantified Impact, 4. Self-Contained Examples, 5. Semantic Naming, Code Example Standards, Comments, Impact Level Guidelines (+7 more)

### Community 59 - "Review Focus"
Cohesion: 0.13
Nodes (14): Authentication Pages Implementation Plan, Global Constraints, Review Focus, Self-Review Checklist, Task 10: Integration & Testing, Task 1: Supabase Auth Types & Helpers, Task 2: Auth State Provider, Task 3: Auth Atoms (+6 more)

### Community 60 - "Section Definitions"
Cohesion: 0.20
Nodes (9): 1. Query Performance (query), 2. Connection Management (conn), 3. Security & RLS (security), 4. Schema Design (schema), 5. Concurrency & Locking (lock), 6. Data Access Patterns (data), 7. Monitoring & Diagnostics (monitor), 8. Advanced Features (advanced) (+1 more)

### Community 61 - "Personal Shelf Schema Update – 2026-10-26"
Cohesion: 0.20
Nodes (9): book-service.ts, Flow, Manual sync retained, Next, personal_shelf_schema.sql, Personal Shelf Schema Update – 2026-10-26, Schema Changes, settings/page.tsx (+1 more)

### Community 62 - "Personal Shelf Design"
Cohesion: 0.25
Nodes (7): Constraints, Decisions, Goals, Intent, Non-goals, Personal Shelf Design, Schema

### Community 63 - "Supabase Postgres Best Practices"
Cohesion: 0.33
Nodes (5): How to Use, References, Rule Categories by Priority, Supabase Postgres Best Practices, When to Apply

## Knowledge Gaps
- **6 isolated node(s):** `@emotion/styled`, `@types/node`, `@types/react`, `@types/react-dom`, `react-dom` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 564 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **68 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@mui/material` connect `@mui/material` to `app/layout.tsx`, `package.json`, `BooksList.tsx`, `Heatmap.tsx`, `@mui/icons-material`, `createServerClient`, `createClient`, `Atomic Design Audit Report`, `react`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **What connects `@emotion/styled`, `@types/node`, `@types/react` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app/layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14492753623188406 - nodes in this community are weakly interconnected._
- **Why does `createServerClient()` connect `createServerClient` to `createClient`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `app/layout.tsx`, `package.json`, `@mui/material`, `BooksList.tsx`, `Heatmap.tsx`, `@mui/icons-material`, `createServerClient`, `createClient`, `Atomic Design Audit Report`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._