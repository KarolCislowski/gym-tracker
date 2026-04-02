# Daily Reports

## Purpose
Captures daily recovery, habits, body metrics, and context in a single structured check-in.

## Responsibilities
- Create, edit, view, and delete daily reports.
- Snapshot goals and completion signals for later analytics.
- Validate daily report payloads before persistence.
- Provide mobile-friendly reporting and history browsing.

## Structure
- `application/` contains report services and transformation logic.
- `domain/` contains report types and validation.
- `infrastructure/` contains DB access and server actions.
- `ui/` contains composer, editor, details page, list page, and form.

## Main Flows
- Add a daily report from the mobile-first form.
- Start a fresh report from the main composer and continue or discard an in-progress form.
- Edit an existing report from its detail screen.
- Review history and open report details.
- Delete a mistaken report with confirmation.

## Key Files
- `ui/daily-report-form.tsx`
- `ui/daily-report-details-page.tsx`
- `ui/daily-reports-page.tsx`
- `application/daily-report.service.ts`

## Notes
This feature is one of the core data-entry paths of the product and should remain fast and low-friction on mobile. It also feeds several dashboard analytics and the activity-calendar widget, so report-date semantics and snapshot correctness matter.
