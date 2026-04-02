# I18n

## Purpose
Provides localized strings and language resolution for the whole application.

## Responsibilities
- Define the translation dictionary shape.
- Resolve the active language with English fallbacks.
- Store localized message catalogs.

## Structure
- `application/` contains translation resolution.
- `domain/` contains language and dictionary types.
- `infrastructure/messages/` contains language-specific message sets.
- `ui/` is reserved for any presentation helpers if needed.

## Main Flows
- Resolve the active language from user settings.
- Return a merged translation dictionary with safe fallbacks.

## Key Files
- `application/i18n.service.ts`
- `domain/i18n.types.ts`
- `infrastructure/messages/en.ts`
- `infrastructure/messages/pl.ts`
- `infrastructure/messages/sv.ts`

## Notes
New cross-feature UI should prefer adding copy here instead of hardcoding strings in components. This is especially important for dashboard widgets and form actions that now appear across multiple features.
