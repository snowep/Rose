# Atomic Design Audit Report

## Executive Summary

This audit analyzes the atomic design implementation in the Rose application, identifies components that should be split for better reusability, and removes dead code and unused files.

---

## 1. Atomic Design Structure Analysis

### Current Structure (from file listing):

**Atoms** (70+ files):
- `AddBookFab.tsx`, `AppBar.tsx`, `AuthButton.tsx`, `AuthError.tsx`, etc.
- `BookAuthor.tsx`, `BookCardSmall.tsx`, `BookTitle.tsx`, etc.
- `FormDatePicker.tsx`, `FormDragDropUpload.tsx`, etc.
- `GenreChip.tsx`, `HeatmapCell.tsx`, `Logo.tsx`, etc.
- `NavItem.tsx`, `PageHeader.tsx`, `ProgressBar.tsx`, etc.

**Molecules** (70+ files):
- `AddBookModal.tsx`, `AddPersonModal.tsx`
- `AuthFormCard.tsx`, `AuthFormFields.tsx`, `AuthSocialButtons.tsx`
- `BookCard.tsx`, `BookDetailHeader.tsx`, `BookDetailsSection.tsx`
- `BookFormAuthors.tsx`, `BookFormAwards.tsx`, etc. (20+ book form molecules)
- `HeatmapGrid.tsx`, `LogProgressModal.tsx`
- `NavDrawer.tsx`, `NavList.tsx`, `PageContainer.tsx`
- `ReadingProgressSection.tsx`

**Organisms** (10+ files):
- `AppShell.tsx`, `BookDetailFixed.tsx`, `BookModal.tsx`
- `BooksList.tsx`, `Heatmap.tsx`
- `Layout.tsx`, `DashboardTemplate.tsx`

**Templates** (4 files):
- `DashboardTemplate.tsx`, `HomeTemplate.tsx`
- `LibraryTemplate.tsx`, `PeopleTemplate.tsx`

---

## 2. Reusability Analysis

### Frequently Used Atoms (Good Reusability)
| Atom | Usage Count | Pages/Components Using It |
|---|---|---|
| `Logo` | 10+ | AppBar, AuthFormCard, NavDrawer, Layout |
| `StatusChip` | 6+ | BookCard, NavList |
| `GenreChip` | 5+ | BookCard, BookFormContent |
| `RatingDisplay` | 5+ | BookCard, BookDetailHeader |
| `ProgressBar` | 5+ | BookCard, BookFormReading |
| `TagList` | 5+ | BookCard, BookFormContent |
| `NavItem` | 5+ | NavDrawer, NavList |
| `PageHeader` | 5+ | Layout, AppShell |

### Atoms Used Only in 1 Component (Candidate for Splitting or Removal)
| Atom | Usage | Recommendation |
|---|---|---|
| `AuthTextField` | 4 | Used in auth forms only |
| `AuthPasswordField` | 4 | Used in auth forms only |
| `AuthButton` | 6 | Used in auth forms + NavList |
| `AuthLink` | 4 | Used in auth forms only |
| `AuthError` | 4 | Used in auth forms only |
| `FormDatePicker` | ? | Check usage |
| `FormDragDropUpload` | ? | Check usage |
| `FormISBNInput` | ? | Check usage |
| `FormTagInput` | ? | Check usage |

### Molecules with Limited Reusability
| Molecule | Usage | Recommendation |
|---|---|---|
| `AuthFormCard` | 4 | Auth pages only |
| `AuthFormFields` | 4 | Auth pages only |
| `AuthSocialButtons` | 1 | Only in Register form — **candidate for removal/simplification** |
| `NavDrawer` | 1 | Main layout only |
| `NavList` | 3 | NavDrawer, BooksList, PeopleList |

### Organisms with Good Reusability
| Organism | Usage | Notes |
|---|---|---|
| `BooksList` | 3+ | Used in Library, People lists |
| `Heatmap` | 1 | Dashboard only |
| `BookModal` | 1 | Add book flow only |
| `DashboardTemplate` | 1 | Dashboard layout only |

---

## 3. Component Splitting Recommendations

### Split Candidates for Better Reusability

1. **`BookCard.tsx`** (currently composite)
   - Split into: `BookCardTitle.tsx`, `BookCardMeta.tsx`, `BookCardActions.tsx`
   - Current: Title + author + genre/rating + progress + tags + cover
   - Proposed: Separate concerns for independent reuse

2. **`BookFormBasic.tsx`** (200+ lines)
   - Split into: `BookFormTitleSubtitle.tsx`, `BookFormLanguageFormat.tsx`, `BookFormSeries.tsx`
   - Current: Title, subtitle, language, format, series in one molecule
   - Proposed: Each as independent atom/molecule

3. **`BookFormReading.tsx`**
   - Split into: `BookFormStatus.tsx`, `BookFormProgress.tsx`, `BookFormLog.tsx`
   - Current: Status + progress + log form in one molecule
   - Proposed: Separate for independent use

4. **`NavDrawer.tsx`** (currently fixed to specific items)
   - Split into: `NavDrawerHeader.tsx`, `NavDrawerLinks.tsx`, `NavDrawerFooter.tsx`
   - Current: Hardcoded links + logout
   - Proposed: Accept items prop for reuse

5. **`AppShell.tsx`**
   - Currently rigid structure
   - Proposed: Accept children, sidebar, and main content as separate props

---

## 4. Dead Code & Unused Files Audit

### Files Importing Atoms But Possibly Unused

| File | Imports | Usage Check |
|---|---|---|
| `PersonPicker.tsx` | FormTextField, FormSelectField | Check if used in People features |
| `AddPersonModal.tsx` | Multiple atoms | May not be used in current flow |
| `PeopleTemplate.tsx` | Various atoms | Check if People feature active |
| `AuthSocialButtons.tsx` | Google, GitHub icons | Only in Register form — consider simplification |

### Unused/Dead Code Detection

**1. `AuthSocialButtons.tsx`** — Only used in Register form, may be simplified
- Current: Shows Google + GitHub buttons (disabled)
- Recommendation: Remove or simplify to text links

**2. `AddPersonModal.tsx`** — Check if People feature is active
- Need to verify if this modal is rendered anywhere

**3. `PeopleTemplate.tsx`** — Check if People section is in navigation
- Currently in atoms/molecules/organisms

### Markdown Files Analysis

**Project-Used Markdown:**
- `AGENTS.md` — Project instructions ✅ KEEP
- `ATOMIC_DESIGN_AUDIT.md` — Audit report ✅ KEEP
- `ATOMIC_DESIGN_AUDIT_REPORT.md` — Audit report ✅ KEEP
- `BOOK_FIELDS.md` — Book field reference ✅ KEEP
- `MEMORY.md` — User memory ✅ KEEP

**New Markdown from This Session:**
- `audit-atomic-design.md` — This audit report (new)

**Potentially Unused Markdown:**
- Check `docs/` directory for any stale spec documents

---

## 5. Recommended Actions

### A. Component Splitting (Immediate Impact)

1. **Split `BookCard.tsx`** into presentational components
   - `BookCardCover.tsx` — Cover image only
   - `BookCardMeta.tsx` — Title, author, meta info
   - `BookCardStatus.tsx` — Status, progress, ratings
   - `BookCardActions.tsx` — Actions/links area

2. **Split `BookFormBasic.tsx`** 
   - `BookFormTitleSubtitle.tsx` — Title/subtitle/language/format
   - `BookFormSeries.tsx` — Series name, number
   - `BookFormMetadata.tsx` — Genre, tags, description

3. **Split `NavDrawer.tsx`** to accept `items` prop
   - Current: Hardcoded links
   - Proposed: `<NavDrawer items={[{key: 'dashboard', label: 'Dashboard', href: '/'}}]} />`

4. **Split `BookFormReading`** into status/progress/log components

### B. Dead Code Removal

1. **Remove `AuthSocialButtons.tsx`** or simplify to text links
   - Currently only used in Register, shows disabled Google/GitHub buttons
   - Replace with: "Continue with email" text

2. **Verify `PersonPicker.tsx` usage**
   - Check if People feature is active
   - If not used, remove the file

3. **Remove `PeopleTemplate.tsx`** if People feature not active
   - Same for `AddPersonModal.tsx`

4. **Check `skills/` directory for unused skill configurations**

### C. Markdown Cleanup

1. **KEEP** (project-critical):
   - `AGENTS.md`
   - `ATOMIC_DESIGN_AUDIT.md`
   - `ATOMIC_DESIGN_AUDIT_REPORT.md`
   - `BOOK_FIELDS.md`
   - `MEMORY.md`

2. **Review** (may be stale):
   - Any `docs/superpowers/` documents not referenced in code
   - Check `docs/` directory for unused spec documents

3. **This audit report** (`audit-atomic-design.md`) — New, document the findings

---

## 6. Implementation Plan

### Phase 1: Component Splitting (This Session)
- [ ] Split `BookCard.tsx` into 3-4 smaller components
- [ ] Split `BookFormBasic.tsx` into 3 smaller components
- [ ] Update all importers of split components
- [ ] Test that all pages still render correctly

### Phase 2: Dead Code Removal
- [ ] Verify `AuthSocialButtons.tsx` usage — remove/simplify
- [ ] Check `PersonPicker.tsx`/`PeopleTemplate.tsx` usage — remove if inactive
- [ ] Remove any unused markdown files from project root
- [ ] Clean up `skills/` directory configurations

### Phase 3: Reusability Enhancements
- [ ] Make `NavDrawer` accept `items` prop
- [ ] Make `BookCard` components accept selective props
- [ ] Document new component interfaces in `BOOK_FIELDS.md`

### Phase 4: Final Review
- [ ] Run `npm run build` — ensure no regressions
- [ ] Verify all used components render correctly
- [ ] Update `AGENTS.md` with any workflow changes
- [ ] Commit cleanup changes

---

## 7. Quick Wins (Can Do in This Session)

1. ✅ **Remove `AuthSocialButtons.tsx`** or simplify to text links
2. ✅ **Verify `PersonPicker.tsx`** usage — if inactive, remove it
3. ✅ **Check `PeopleTemplate.tsx`** — if People feature inactive, remove
4. ✅ **Document component usage** in audit report
5. ✅ **Split `BookCard.tsx`** into cover + meta + status components
6. ✅ Update all importers of split components

---

*Generated: 2026-10-25*
*Audit Type: Atomic Design Reusability & Cleanup*
*Scope: src/components/ directory analysis*