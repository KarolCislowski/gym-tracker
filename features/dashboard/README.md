# Dashboard

## Purpose
Aggregates user context, next actions, history entry points, and analytics into the main home screen.

## Responsibilities
- Render the main landing experience after sign-in.
- Show high-priority context such as profile and healthy habits.
- Surface the next most useful action when data is sparse.
- Show a calendar-based history entry point for daily reports and workouts.
- Present analytics, charts, and summary states.
- Support a customizable widget layout.
- Explain missing-data conditions clearly, including first-entry and insufficient-data states.

## Structure
- `application/` contains analytics preparation, next-action logic, widget registry, and layout resolution.
- `ui/` contains the dashboard page, widget chrome, widget customizer, and masonry-based widget layout.

## Main Flows
- Show quick context widgets near the top of the page.
- Keep pinned widgets stable while packing the remaining widgets with `masonic`.
- Render richer analytics on larger screens.
- Render mobile-friendly status summaries on smaller screens.
- Let the user reorder, show, hide, and resize supported widgets.
- Let the user inspect a selected day from the activity calendar and jump to report details.
- Communicate missing analytics states in a product-friendly way.

## Key Files
- `ui/dashboard-home.tsx`
- `ui/layout/dashboard-masonry-layout.tsx`
- `ui/dashboard-layout-customizer.tsx`
- `ui/widgets/dashboard-activity-calendar-widget.tsx`
- `ui/widgets/dashboard-analytics-widget.tsx`
- `ui/widgets/dashboard-analytics-mobile-summary-widget.tsx`
- `application/dashboard-analytics.ts`
- `application/dashboard-next-action.ts`
- `application/dashboard-layout.service.ts`

## Notes
The dashboard is a read-heavy feature. It should guide the user toward the next useful action when data is sparse, while still feeling configurable and dense enough to reward returning on larger screens.
