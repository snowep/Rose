# ARCHITECTURE.md — Home Library Dashboard

## Overview
- Frontend SPA React 19 + Vite
- UI: MUI v9 Material 3 auto theme
- DB: SQLite local via Dexie wrapper
- No backend server for MVP

## Layers
- Presentation: React pages
- Components: MUI + custom
- Lib: db, auth, utils
- Styles: MUI ThemeProvider auto

## Data Model
- users: id, email, password_hash, plan, created_at
- books: id, user_id, title, author, isbn, year, genre, status, notes, created_at
- subscriptions: id, user_id, status, payment_method

## Auth Flow
- Local SQLite users table
- Session stored in localStorage
- Protected routes via context

## Free Tier Enforcement
- Count books per user
- Block create >50 on free plan

## Future Extensibility
- Migrate to Postgres + API
- Add sync
