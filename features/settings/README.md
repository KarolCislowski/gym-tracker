# Settings

## Purpose
Owns user preferences, password management, and account deletion flows.

## Responsibilities
- Update language, unit system, and feature toggles.
- Change the current password.
- Handle destructive account deletion with confirmation.
- Surface clear success and error feedback for settings operations.

## Structure
- `application/` contains service logic.
- `domain/` contains settings types and validation.
- `infrastructure/` contains DB access and server actions.
- `ui/` contains the settings page and forms.

## Main Flows
- Save user preferences.
- Update password.
- Delete the account from the danger zone.

## Key Files
- `ui/settings-page.tsx`
- `ui/settings-preferences-form.tsx`
- `ui/settings-password-form.tsx`
- `ui/settings-delete-account-form.tsx`
- `application/settings.service.ts`

## Notes
This feature is preference-heavy and should remain explicit about destructive actions and validation feedback.
