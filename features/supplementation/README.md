# Supplementation

## Purpose
Tracks reusable supplement stacks and the history of supplement intake reports.

## Responsibilities
- Create, edit, view, and delete supplement stacks.
- Create, edit, view, and delete supplement intake reports.
- Persist stack composition and snapshot it into intake history.
- Provide mobile-friendly logging and history review.

## Structure
- `application/` contains supplementation services.
- `domain/` contains stack and report types plus validation.
- `infrastructure/` contains DB access and server actions.
- `ui/` contains stack/report composers, forms, editors, detail pages, and the main supplementation page.

## Main Flows
- Build a reusable supplement stack.
- Log a supplement intake report from a saved stack.
- Continue, clear, or discard an in-progress stack or intake form.
- Open stack and report details.
- Edit or delete existing stacks and reports with confirmation.

## Key Files
- `ui/supplementation-page.tsx`
- `ui/supplement-stack-form.tsx`
- `ui/supplement-stack-details-page.tsx`
- `ui/supplement-intake-form.tsx`
- `ui/supplement-intake-details-page.tsx`
- `application/supplementation.service.ts`

## Notes
Favorite state exists in the data model but is intentionally de-emphasized in the UI until it has a fuller product flow.
