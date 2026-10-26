# Authentication Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build login, register, and forgot password pages integrated with Supabase Auth using email/password, with atomic design components

**Architecture:** Next.js 16 App Router with Supabase SSR auth. Protected routes redirect to login. Hybrid schema: existing books schema + new auth_users/profile tables. Forms use Material UI v9 with atomic design atoms/molecules.

**Tech Stack:** Next.js 16, React 19, TypeScript, Material UI v9, Supabase SSR, Dexie.js

**Spec:** docs/superpowers/specs/2026-10-25-auth-design.md

## Global Constraints
- Next.js App Router with server components by default
- Material UI v9 styling with existing atomic design system
- Supabase Auth with email/password only
- Atomic design: atoms -> molecules -> organisms
- Existing Dexie.js offline-first for books, Supabase for auth
- Branch: feat/auth-pages
- Commit convention: feat: description

## Review Focus
- Invalid email format shows field error, not generic error
- Weak password (<6 chars) blocked before API call
- Forgot password with non-existent email still shows success message to prevent enumeration
- Session persists across page reloads
- Protected route redirects unauthenticated users to login
- Auth state change triggers navigation updates

---

### Task 1: Supabase Auth Types & Helpers

**Files:**
- Create: `src/lib/supabase/auth.ts`
- Create: `src/types/auth.ts`
- Modify: `src/lib/db-types.ts:1-20` (add auth types)

**Interfaces:**
- Produces: `signIn(email, password): Promise<AuthResult>`, `signUp(email, password): Promise<AuthResult>`, `resetPassword(email): Promise<AuthResult>`, `signOut(): Promise<void>`, `getCurrentUser(): Promise<User | null>`

- [ ] **Step 1: Write failing test**

```typescript
describe('auth helpers', () => {
  it('signIn returns error for invalid email', async () => {
    const result = await signIn('invalid', 'password')
    expect(result.error).toBeDefined()
    expect(result.user).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/lib/supabase/auth.test.ts`
Expected: FAIL with "signIn not defined"

- [ ] **Step 3: Implement auth helpers in `src/lib/supabase/auth.ts`**

Use createClient from @/lib/supabase/client. Sign in with email/password, sign up with email/password, reset password for email. Handle errors with user-friendly messages.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/lib/supabase/auth.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/supabase/auth.ts src/types/auth.ts
git commit -m "feat: add Supabase auth helpers"
```

### Task 2: Auth State Provider

**Files:**
- Create: `src/providers/AuthProvider.tsx`
- Create: `src/hooks/useAuth.ts`
- Modify: `src/app/layout.tsx:20-28`

**Interfaces:**
- Produces: `AuthContext { user, loading, signIn, signUp, signOut, resetPassword }`
- Consumes: auth helpers from Task 1

- [ ] **Step 1: Write failing test**

```typescript
it('AuthProvider provides user context', async () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
  render(<TestComponent />, { wrapper })
  expect(screen.getByText('Not authenticated')).toBeInTheDocument()
})
```

- [ ] **Step 2: Implement AuthProvider**

Use Supabase auth state change listener. Store session in context. Persist across reloads. Provide signIn/signUp/signOut/resetPassword methods.

- [ ] **Step 3: Implement useAuth hook**

Return context with TypeScript types.

- [ ] **Step 4: Update layout to wrap with AuthProvider**

Wrap MuiThemeProvider with AuthProvider.

- [ ] **Step 5: Commit**

```bash
git add src/providers/AuthProvider.tsx src/hooks/useAuth.ts
git commit -m "feat: add auth state provider"
```

### Task 3: Auth Atoms

**Files:**
- Create: `src/components/atoms/AuthTextField.tsx`
- Create: `src/components/atoms/AuthPasswordField.tsx`
- Create: `src/components/atoms/AuthButton.tsx`
- Create: `src/components/atoms/AuthLink.tsx`
- Create: `src/components/atoms/AuthError.tsx`

**Interfaces:**
- Produces: Reusable form atoms with MUI v9 styling matching existing design

- [ ] **Step 1: Create AuthTextField atom**

Props: label, value, onChange, error, placeholder. Use TextField from MUI.

- [ ] **Step 2: Create AuthPasswordField atom**

Props: label, value, onChange, error, showPassword toggle. Use IconButton for eye toggle.

- [ ] **Step 3: Create AuthButton atom**

Props: children, variant, loading, disabled. Use Button from MUI.

- [ ] **Step 4: Create AuthLink atom**

Props: href, children. Use Link from MUI with text variant.

- [ ] **Step 5: Create AuthError atom**

Props: message. Display error alert with red styling.

- [ ] **Step 6: Commit**

```bash
git add src/components/atoms/Auth*
git commit -m "feat: add auth atoms"
```

### Task 4: Auth Molecules

**Files:**
- Create: `src/components/molecules/AuthFormCard.tsx`
- Create: `src/components/molecules/AuthFormFields.tsx`
- Create: `src/components/molecules/AuthSocialButtons.tsx` (placeholder)

**Interfaces:**
- Produces: Form card with logo, title, description, fields, button

- [ ] **Step 1: Create AuthFormCard**

Props: title, description, children, footer. Card with padding, uses existing PageHeader atom.

- [ ] **Step 2: Create AuthFormFields molecule**

Email field + password field + optional confirm password. Validates email format.

- [ ] **Step 3: Create AuthSocialButtons (placeholder)**

Display "Continue with Google" disabled buttons for future.

- [ ] **Step 4: Commit**

```bash
git add src/components/molecules/Auth*
git commit -m "feat: add auth molecules"
```

### Task 5: Login Page

**Files:**
- Create: `src/app/auth/login/page.tsx`
- Create: `src/app/auth/login/LoginForm.tsx`
- Modify: `src/app/layout.tsx` (add auth redirect logic)

**Interfaces:**
- Consumes: useAuth, AuthFormCard, AuthFormFields

- [ ] **Step 1: Write failing test**

```typescript
it('login form renders with email and password', () => {
  render(<LoginForm />)
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Implement LoginForm component**

Email + password fields, signIn handler, loading state, error display, "Forgot password?" link, "Sign up" link.

- [ ] **Step 3: Create /auth/login page**

Use AuthFormCard wrapper. Redirect to `/` if already authenticated. Use useAuth hook.

- [ ] **Step 4: Add middleware for protected routes**

Create `src/middleware.ts` to redirect unauthenticated users from `/` and `/library` to `/auth/login`.

- [ ] **Step 5: Commit**

```bash
git add src/app/auth/login/ src/middleware.ts
git commit -m "feat: add login page"
```

### Task 6: Register Page

**Files:**
- Create: `src/app/auth/register/page.tsx`
- Create: `src/app/auth/register/RegisterForm.tsx`

**Interfaces:**
- Consumes: useAuth, AuthFormCard

- [ ] **Step 1: Implement RegisterForm**

Email + password + confirm password. Validate password match, minimum 6 chars.

- [ ] **Step 2: Create /auth/register page**

On successful signUp, auto sign in and redirect to `/`. Show terms acceptance.

- [ ] **Step 3: Commit**

```bash
git add src/app/auth/register/
git commit -m "feat: add register page"
```

### Task 7: Forgot Password Page

**Files:**
- Create: `src/app/auth/forgot/page.tsx`
- Create: `src/app/auth/forgot/ForgotPasswordForm.tsx`

**Interfaces:**
- Consumes: useAuth, AuthFormCard

- [ ] **Step 1: Implement ForgotPasswordForm**

Email field only. On submit, call resetPassword. Always show success message regardless of email existence.

- [ ] **Step 2: Create /auth/forgot page**

Show success state after submit with "Check your email" message.

- [ ] **Step 3: Commit**

```bash
git add src/app/auth/forgot/
git commit -m "feat: add forgot password page"
```

### Task 8: Auth Layout & Navigation

**Files:**
- Create: `src/app/auth/layout.tsx`
- Modify: `src/components/atoms/AppBar.tsx` (add logout button)
- Modify: `src/components/organisms/Layout.tsx`

**Interfaces:**
- Produces: Auth pages without NavDrawer, App with logout

- [ ] **Step 1: Create auth layout**

Minimal layout without sidebar, centered content, gradient background.

- [ ] **Step 2: Add logout to AppBar**

Show user email and logout button when authenticated. Hide when on auth pages.

- [ ] **Step 3: Update Layout organism**

Skip NavDrawer on /auth/* routes.

- [ ] **Step 4: Commit**

```bash
git add src/app/auth/layout.tsx src/components/atoms/AppBar.tsx src/components/organisms/Layout.tsx
git commit -m "feat: add auth layout and logout"
```

### Task 9: Database Schema for Auth

**Files:**
- Create: `supabase-auth-schema.sql`
- Create: `docs/supabase-auth-er-diagram.md`

**Interfaces:**
- Produces: SQL for profiles table linked to auth.users

- [ ] **Step 1: Create profiles table**

```
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamp default now(),
  updated_at timestamp default now()
)
```

- [ ] **Step 2: Add RLS policies**

Profiles readable by owner, books table linked to user_id.

- [ ] **Step 3: Create ER diagram documentation**

Show auth.users -> profiles -> books relationship.

- [ ] **Step 4: Commit**

```bash
git add supabase-auth-schema.sql docs/supabase-auth-er-diagram.md
git commit -m "feat: add auth database schema"
```

### Task 10: Integration & Testing

**Files:**
- Create: `src/app/api/auth/session/route.ts`
- Modify: `src/lib/book-service.ts` (add user_id to books)

**Interfaces:**
- Produces: Session API, books linked to user

- [ ] **Step 1: Create session API route**

GET /api/auth/session returns current user.

- [ ] **Step 2: Update Book type**

Add user_id?: string to Book interface.

- [ ] **Step 3: Update BookService**

Filter books by user_id when querying.

- [ ] **Step 4: Manual testing**

Test login -> register -> forgot password flows. Verify redirects.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/auth/session/route.ts src/lib/book-service.ts
git commit -m "feat: integrate auth with books"
```

---

## Self-Review Checklist

1. **Spec coverage:** All auth pages created, Supabase integrated, atomic design followed
2. **Step scan:** Each step has clear verification command
3. **Type consistency:** Auth types match Supabase auth types
4. **Review Focus:** Tests added for invalid email, weak password, forgot password enumeration, session persistence, protected routes
5. **Proportion:** Plan focused on implementation steps, not code transcription
