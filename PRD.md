# PRD — Rose

## Product Overview
- Type: Web SaaS dashboard
- Name: Rose
- Stack: React + MUI, Vite
- Start: empty code base, start over
- Scope: Personal home library manager for books

## Problem
- Core problem v1: Reduce manual work / automate
- Target users: Developers / engineers
- Pain: Manual tracking of library content is time-consuming, fragmented across tools.

## Goals
- MVP timeline: 2 weeks
- Monetization: Freemium with paid tier
- Success metric v1: Free-to-paid conversion

## Non-Goals v1
- Mobile app
- Real-time chat
- Advanced AI

## Library Scope v1
- Items tracked: Books/ebooks
- Data entry methods: Manual entry forms, Scan barcodes/ISBN via camera
- Dashboard primary view: Grid
- Core library features: Search + filters, Tags/categories, Reading/watching progress

## Core Features v1
- User auth + profiles (OAuth Google/GitHub)
- Library dashboard/analytics
- Grid view for books/ebooks
- Integrations/API skeleton for future
- Out of scope for v1: Automation workflows

## Tech Stack
- Frontend: Next.js / React
- Language: TypeScript
- DB: SQLite (offline-first compatible)
- UI theme: System auto dark/light
- Hosting/deployment: Self-hosted, manual setup guide
- Compliance: None / not yet

## MVP Scope
Must have:
- Auth OAuth Google/GitHub, user profile
- Library dashboard with Grid view for Books/ebooks
- Data entry: manual forms + barcode/ISBN scan
- Library features: Search + filters, Tags/categories, Reading/watching progress
- Basic analytics
- Integration/API skeleton

Nice to have, defer:
- Advanced automation workflows
- Real-time features

## Success Metrics
- Primary: Free-to-paid conversion
- Secondary: Daily active users, time saved per task

## Monetization
- Freemium: free tier with core dashboard
- Paid tier for advanced analytics/integrations

## Risks & Assumptions
- Self-hosted requires user setup docs
- 2-week timeline is aggressive for auth + analytics + integration layer
- SQLite chosen for future offline-first sync

## Next Steps
1. Set up Next.js + TypeScript + SQLite scaffold self-hosted, manual setup guide
2. Implement OAuth Google/GitHub auth + profiles
3. Build library dashboard grid view with search/filters/tags/progress
4. Add manual entry forms + barcode/ISBN scan stub
5. Stub integrations/API
