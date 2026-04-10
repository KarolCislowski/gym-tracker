# Auth

## Purpose
Owns authentication, account lifecycle, and authenticated user snapshots used across the app.

## Responsibilities
- Register accounts and sign users in.
- Handle email verification and password reset flows.
- Resolve the authenticated user snapshot consumed by other features.
- Persist and validate authentication-related data.

## Structure
- `application/` contains auth orchestration and service-level rules.
- `domain/` contains auth types and validation.
- `infrastructure/` contains DB access, actions, and email delivery.
- `ui/` contains login, register, verify-email, forgot-password, and reset-password screens plus shared auth-shell helpers.

## Main Flows
- Register -> sign in immediately in development or verify email first when `AUTH_REQUIRE_EMAIL_VERIFICATION=true`.
- Request password reset -> set a new password.
- Load the signed-in user snapshot for the app shell and feature pages.

## Key Files
- `application/auth.service.ts`
- `infrastructure/auth.actions.ts`
- `infrastructure/auth.db.ts`
- `domain/auth.types.ts`

## Notes
Other features should consume the authenticated snapshot instead of duplicating user-resolution logic. The snapshot is especially important for dashboard analytics, language resolution, and feature toggles used by reporting flows.
Email verification is intentionally environment-sensitive so local development can stay low-friction without changing the production-oriented flow.
