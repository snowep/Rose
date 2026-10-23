# Graph Report - Rose  (2026-10-23)

## Corpus Check
- 26 files · ~2,257 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 1 file(s) not represented in the graph (top: (none) 1)

## Summary
- 122 nodes · 181 edges · 10 communities (8 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f1d801af`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- @mui/material
- compilerOptions
- package.json
- dependencies
- BooksList.tsx
- Heatmap.tsx
- HeatmapGrid.tsx
- scripts
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `@mui/material` - 19 edges
2. `compilerOptions` - 16 edges
3. `Heatmap()` - 8 edges
4. `react` - 7 edges
5. `Layout()` - 7 edges
6. `BooksList()` - 6 edges
7. `scripts` - 5 edges
8. `next` - 4 edges
9. `AppBar()` - 4 edges
10. `HeatmapCell()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `HeatmapGrid()` --calls--> `HeatmapCell()`  [EXTRACTED]
  src/components/molecules/HeatmapGrid.tsx → src/components/atoms/HeatmapCell.tsx
- `HomeTemplate()` --calls--> `BooksList()`  [EXTRACTED]
  src/components/templates/HomeTemplate.tsx → src/components/molecules/BooksList.tsx
- `RootLayout()` --calls--> `Layout()`  [EXTRACTED]
  src/app/layout.tsx → src/components/organisms/Layout.tsx
- `RootLayout()` --calls--> `ThemeProvider()`  [EXTRACTED]
  src/app/layout.tsx → src/providers/ThemeProvider.tsx
- `LibraryPage()` --calls--> `LibraryTemplate()`  [EXTRACTED]
  src/app/library/page.tsx → src/components/templates/LibraryTemplate.tsx

## Import Cycles
- None detected.

## Communities (10 total, 2 thin omitted)

### Community 0 - "@mui/material"
Cohesion: 0.15
Nodes (15): @mui/icons-material, @mui/material, react, metadata, RootLayout(), AddBookModal(), BookForm, AppBar() (+7 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "package.json"
Cohesion: 0.11
Nodes (16): nextConfig, name, private, version, drizzle-orm, @emotion/react, @emotion/styled, lucide-react (+8 more)

### Community 3 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, drizzle-orm, @emotion/react, @emotion/styled, lucide-react, @mui/icons-material, @mui/material, next (+8 more)

### Community 4 - "BooksList.tsx"
Cohesion: 0.25
Nodes (9): LibraryPage(), BookCard(), BookProps, BookModal(), BookModalProps, BooksList(), initialBooks, HomeTemplate() (+1 more)

### Community 5 - "Heatmap.tsx"
Cohesion: 0.25
Nodes (10): Page(), HeatmapHeader(), HeatmapMode, generateMonthlyCells(), generateWeeklyCells(), generateYearCells(), Heatmap(), HeatmapCell (+2 more)

### Community 6 - "HeatmapGrid.tsx"
Cohesion: 0.38
Nodes (5): getColor(), HeatmapCell(), HeatmapCellProps, HeatmapCellData, HeatmapGridProps

### Community 7 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

## Knowledge Gaps
- **11 isolated node(s):** `@emotion/react`, `@emotion/styled`, `@types/node`, `@types/react`, `@types/react-dom` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 65 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@mui/material` connect `@mui/material` to `package.json`, `BooksList.tsx`, `Heatmap.tsx`, `HeatmapGrid.tsx`?**
  _High betweenness centrality (0.379) - this node is a cross-community bridge._
- **What connects `@emotion/react`, `@emotion/styled`, `@types/node` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `react` connect `@mui/material` to `package.json`, `BooksList.tsx`, `Heatmap.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._