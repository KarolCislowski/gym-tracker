# Workouts

## Purpose
Handles reusable workout templates and logged workout reports with structured blocks, entries, and sets.

## Responsibilities
- Create, edit, view, and delete workout templates.
- Create, edit, view, and delete workout reports.
- Support structured blocks such as singles, supersets, circuits, and dropsets.
- Snapshot completed training data for dashboard analytics.

## Structure
- `application/` contains workout services.
- `domain/` contains workout types and validation.
- `infrastructure/` contains DB access and server actions.
- `ui/` contains template/report composers, forms, editors, detail pages, and the workouts overview.

## Main Flows
- Build a reusable template.
- Start a report from scratch or from a template.
- Open report and template details.
- Edit or delete existing templates and reports with confirmation.

## Key Files
- `ui/workout-reports-page.tsx`
- `ui/workout-report-form.tsx`
- `ui/workout-report-details-page.tsx`
- `ui/workout-template-form.tsx`
- `ui/workout-template-details-page.tsx`
- `application/workout.service.ts`

## Notes
This is one of the heaviest input flows in the product, so mobile-first usability and unsaved-changes protection are especially important here.
