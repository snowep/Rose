# AUDIT.md — Home Library Dashboard

## Audit Date
- 2026-10-20

## Findings
- Password storage insecure
- No free tier enforcement code yet
- No tests written
- Payment stub only

## Risks
- SQLite local only limits sync
- DANA QRIS integration not started

## Recommendations
- Hash passwords
- Add unit tests for CRUD
- Implement limit gate
- Draft payment flow
