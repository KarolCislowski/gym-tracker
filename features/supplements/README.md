# Supplements

## Purpose
Provides the supplement atlas used as the shared source of supplement definitions and variants.

## Responsibilities
- List supplement atlas entries.
- Render supplement details.
- Seed and load atlas data for supplementation features.

## Structure
- `application/` contains atlas shaping and services.
- `domain/` contains supplement types.
- `infrastructure/` contains atlas persistence and seed scripts.
- `ui/` contains atlas and details pages.

## Main Flows
- Browse supplement definitions.
- Open supplement details.
- Reuse supplement atlas entries while building stacks.

## Key Files
- `ui/supplement-atlas-page.tsx`
- `ui/supplement-details-page.tsx`
- `application/supplement-atlas.service.ts`
- `infrastructure/supplement-atlas.seed.ts`

## Notes
Like the exercise atlas, this is primarily a reference feature and should remain easy to scan rather than interaction-heavy.
