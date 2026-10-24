# Graph Report - Rose  (2026-10-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 138 nodes · 244 edges · 9 communities (7 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `351f82f5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- @mui/material
- compilerOptions
- package.json
- dependencies
- BooksList
- Heatmap.tsx
- BooksList.tsx
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `@mui/material` - 21 edges
2. `compilerOptions` - 16 edges
3. `BooksList()` - 13 edges
4. `Book` - 11 edges
5. `BookService` - 10 edges
6. `react` - 9 edges
7. `Heatmap()` - 8 edges
8. `Layout()` - 7 edges
9. `LibraryDetailPage()` - 7 edges
10. `next` - 6 edges

## Surprising Connections (you probably didn't know these)
- `BookDetailProps` --references--> `Book`  [EXTRACTED]
  src/components/molecules/BookDetailFixed.tsx → src/lib/db.ts
- `BookModalProps` --references--> `Book`  [EXTRACTED]
  src/components/molecules/BookModal.tsx → src/lib/db.ts
- `BooksList()` --calls--> `AddBookFab()`  [EXTRACTED]
  src/components/molecules/BooksList.tsx → src/components/organisms/AddBookFab.tsx
- `BooksList()` --calls--> `BookCard()`  [EXTRACTED]
  src/components/molecules/BooksList.tsx → src/components/atoms/BookCard.tsx
- `BooksList()` --calls--> `BookModal()`  [EXTRACTED]
  src/components/molecules/BooksList.tsx → src/components/molecules/BookModal.tsx

## Import Cycles
- None detected.

## Communities (9 total, 2 thin omitted)

### Community 0 - "@mui/material"
Cohesion: 0.17
Nodes (13): @mui/material, metadata, RootLayout(), AddBookModal(), BookForm, AppBar(), Logo(), menuItems (+5 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, scripts, build, dev, lint, start, version (+8 more)

### Community 3 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, dexie, @emotion/react, @emotion/styled, @mui/icons-material, @mui/material, next, react (+5 more)

### Community 4 - "BooksList"
Cohesion: 0.19
Nodes (8): LibraryPage(), BookDetailProps, BookModalProps, BooksList(), HomeTemplate(), LibraryTemplate(), BookService, Book

### Community 5 - "Heatmap.tsx"
Cohesion: 0.16
Nodes (15): Page(), getColor(), HeatmapCell(), HeatmapCellProps, HeatmapHeader(), HeatmapMode, generateMonthlyCells(), generateWeeklyCells() (+7 more)

### Community 6 - "BooksList.tsx"
Cohesion: 0.16
Nodes (14): nextConfig, @mui/icons-material, next, react, LibraryDetailPage(), BookCard(), BookProps, LogProgressModal() (+6 more)

## Knowledge Gaps
- **7 isolated node(s):** `@emotion/react`, `@emotion/styled`, `react-dom`, `@types/node`, `@types/react` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 60 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@mui/material` connect `@mui/material` to `package.json`, `BooksList`, `Heatmap.tsx`, `BooksList.tsx`?**
  _High betweenness centrality (0.340) - this node is a cross-community bridge._
- **What connects `@emotion/react`, `@emotion/styled`, `react-dom` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `react` connect `BooksList.tsx` to `@mui/material`, `package.json`, `Heatmap.tsx`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._