# GIT_CONVENTIONS.md — Home Library Dashboard

## Branching
- Main: `main`
- Feature branches: `feat/<short-name>`
- Pattern from dev.to Feature Branching
- Example: `feat/book-crud`, `feat/auth`

## Commit Messages
- Conventional Commits
- Types: feat, fix, chore, docs, test, refactor, style
- Format: `type(scope): description`
- Examples:
  - `feat(auth): add email/password login`
  - `feat(books): add create/edit/delete CRUD`
  - `fix(ui): correct MUI theme auto switch`
  - `docs(prd): update free tier limit`

## Versioning
- SemVer: MAJOR.MINOR.PATCH
- MAJOR: breaking API changes
- MINOR: new feature backward compatible
- PATCH: bug fixes
- Start: `0.1.0`

## Tagging
- Tag releases: `v0.1.0`
- Tag after tests pass on main

## PR Workflow
- Branch from main
- Commit with conventional messages
- Open PR, require review
- Merge to main, tag release

## Git Hooks
- Pre-commit: lint + typecheck
- Commit-msg: validate conventional

## Do Not Commit
- .env files
- node_modules
- db.sqlite
- .gitignore already set

## Reset Plan
- Code base currently non-empty. Starting over: keep docs, archive src.
- Archive old src to `src/archive` before scaffold
