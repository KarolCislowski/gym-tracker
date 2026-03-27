# Profile

## Purpose
Manages editable personal context used by analytics, reports, and settings-aware calculations.

## Responsibilities
- View and update profile data.
- Resolve display-friendly profile values.
- Support height, birth date, location, biological sex, and activity level inputs.

## Structure
- `application/` contains profile services and presentation helpers.
- `domain/` contains profile types and validation.
- `infrastructure/` contains DB access, actions, and external helpers such as places lookup.
- `ui/` contains the profile page, read-only view, and edit form.

## Main Flows
- Review current profile details.
- Switch into edit mode and save changes.
- Reuse profile data in dashboard and daily-report context.

## Key Files
- `ui/profile-page.tsx`
- `ui/profile-edit-form.tsx`
- `application/profile.service.ts`
- `application/profile-view.ts`

## Notes
This feature now includes unsaved-changes protection because losing edits here is high-friction for users.
