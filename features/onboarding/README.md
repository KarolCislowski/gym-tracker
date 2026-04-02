# Onboarding

## Purpose
Introduces first-time users to the most important screens and lets them replay page-level guidance later.

## Responsibilities
- Run guided tours for supported pages.
- Expose per-page replay controls.
- Keep onboarding lightweight and route-aware.

## Structure
- `ui/` contains the onboarding driver integration and replay button.

## Main Flows
- Auto-run the tour on supported pages when appropriate.
- Replay the guide from the current page’s title panel.

## Key Files
- `ui/app-onboarding.tsx`
- `ui/onboarding-replay-button.tsx`

## Notes
The onboarding should stay short and task-oriented. It should help users start using the product, not explain every feature exhaustively, and it should remain compatible with the evolving dashboard widget layout.
