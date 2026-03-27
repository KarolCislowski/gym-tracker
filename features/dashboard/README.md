# Dashboard

## Purpose
Aggregates user context, habit status, and analytics into the main home screen.

## Responsibilities
- Render the main landing experience after sign-in.
- Show high-priority context such as profile and healthy habits.
- Present analytics, charts, and summary states.
- Explain missing-data conditions clearly, including first-entry and insufficient-data states.

## Structure
- `application/` contains analytics preparation and empty-state resolution.
- `ui/` contains the dashboard page and widgets.

## Main Flows
- Show quick context widgets near the top of the page.
- Render richer analytics on larger screens.
- Render mobile-friendly status summaries on smaller screens.
- Communicate missing analytics states in a product-friendly way.

## Key Files
- `ui/dashboard-home.tsx`
- `ui/widgets/dashboard-analytics-widget.tsx`
- `ui/widgets/dashboard-analytics-mobile-summary-widget.tsx`
- `application/dashboard-analytics.ts`
- `application/dashboard-analytics-state.ts`

## Notes
The dashboard is a read-heavy feature. It should guide the user toward the next useful action when data is sparse.
