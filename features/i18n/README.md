# I18n

## Purpose
Provides localized strings and language resolution for the whole application.

## Responsibilities
- Define the translation dictionary shape.
- Resolve the active language with English fallbacks.
- Store localized message catalogs.
- Expose shared UI helpers such as the public-page language switcher.

## Structure
- The implementation lives under `shared/i18n/`, even though this README is kept under `features/` for discoverability.
- `shared/i18n/application/` contains translation resolution.
- `shared/i18n/domain/` contains language and dictionary types.
- `shared/i18n/infrastructure/messages/` contains language-specific message sets.
- `shared/i18n/ui/` contains shared presentation helpers such as the language switcher.

## Main Flows
- Resolve the active language from user settings.
- Return a merged translation dictionary with safe fallbacks.

## Key Files
- `shared/i18n/application/i18n.service.ts`
- `shared/i18n/domain/i18n.types.ts`
- `shared/i18n/infrastructure/messages/en.ts`
- `shared/i18n/infrastructure/messages/pl.ts`
- `shared/i18n/infrastructure/messages/sv.ts`
- `shared/i18n/ui/language-switcher.tsx`

## Notes
New cross-feature UI should prefer adding copy here instead of hardcoding strings in components. This is especially important for dashboard widgets and form actions that now appear across multiple features.
