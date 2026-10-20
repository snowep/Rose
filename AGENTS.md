# AGENTS.md — Home Library Dashboard

## Roles
- Orchestrator: `/d/Project/Gardens/Rose` root
- Profiles: flutter-frontend, flutter-backend, flutter-orchestrator not used. Use react-frontend, react-backend.

## Agent Rules
- Follow PRD.md as source of truth
- Short bullet answers
- Never commit secrets

## Communication
- Shared folder not needed
- Kanban board: `rose-dashboard`

## Coding Standards
- React 19 + Vite + TypeScript
- MUI v9 Material 3 auto theme
- SQLite via `dexie` or `better-sqlite3`
- File structure: `src/components`, `src/pages`, `src/lib/db`

## Task Handoff
- Update PRD/IMPLEMENTATION_PLAN before starting
- Complete task with `kanban_complete` summary
