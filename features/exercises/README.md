# Exercises

## Purpose
Provides the exercise atlas and exercise-detail experience used to browse training movements and mark favorites.

## Responsibilities
- List atlas exercises with filters and favorites.
- Show exercise details, variants, cues, and muscle engagement.
- Persist favorite exercise state for the current user.

## Structure
- `application/` contains grid shaping and service logic.
- `domain/` contains exercise types.
- `infrastructure/` contains atlas data access and favorite persistence.
- `ui/` contains the atlas page, details page, and related view components.

## Main Flows
- Browse the atlas with filters.
- Open exercise details.
- Add or remove favorites.

## Key Files
- `ui/exercise-atlas-page.tsx`
- `ui/exercise-details-page.tsx`
- `application/exercise-atlas.service.ts`
- `application/exercise-favorites.service.ts`

## Notes
This feature is primarily reference-oriented. It should stay easy to scan on larger screens and intentionally lighter on mobile portrait, while still supporting favorites that flow into dashboard context.
