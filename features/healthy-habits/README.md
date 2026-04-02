# Healthy Habits

## Purpose
Stores the user’s target goals for recovery, hydration, nutrition, and training frequency.

## Responsibilities
- Create and update healthy-habit goals.
- Present current goals in view and edit modes.
- Support downstream features that compare daily reports against saved targets.

## Structure
- `application/` contains feature-facing view logic and service rules.
- `domain/` contains goal types and validation.
- `infrastructure/` contains DB access and server actions.
- `ui/` contains the section, edit form, and read-only view.

## Main Flows
- Edit habit and macro goals.
- Compute calories from macro targets.
- Reuse saved goals across dashboard and daily reports.

## Key Files
- `ui/healthy-habits-section.tsx`
- `ui/healthy-habits-edit-form.tsx`
- `application/healthy-habits.service.ts`
- `application/healthy-habits-view.ts`

## Notes
This feature is a setup dependency for better analytics, better daily-report guidance, and more useful next-action resolution on the dashboard.
