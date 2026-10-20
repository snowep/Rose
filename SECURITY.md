# SECURITY.md — Home Library Dashboard

## Threat Model
- Local SQLite only, no network
- Password stored plaintext in MVP — needs hashing

## Controls
- Input validation on all forms
- SQL parameterization
- XSS prevention via React escaping

## Secrets
- No secrets in repo
- .env ignored

## Compliance
- Dual license
- No PII collection beyond email

## Recommendations
- Use bcrypt for passwords
- Add rate limiting on login
- Encrypt SQLite file
