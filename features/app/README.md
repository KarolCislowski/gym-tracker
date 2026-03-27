# App

## Purpose
Provides the shared application shell: header, side navigation, and top-level layout behavior for authenticated screens.

## Responsibilities
- Render the main shell around feature pages.
- Expose primary navigation for mobile and desktop.
- Host shared app-level UI such as the header and drawer.
- Integrate cross-feature concerns already resolved elsewhere, such as onboarding entry points.

## Structure
- `ui/` contains the shell, header, and side drawer.

## Main Flows
- Open and collapse navigation.
- Render the page content inside a consistent authenticated frame.
- Adapt navigation visibility and ordering to screen size.

## Key Files
- `ui/app-shell.tsx`
- `ui/app-shell-client.tsx`
- `ui/app-header.tsx`
- `ui/app-side-drawer.tsx`

## Notes
This feature should stay thin. Business logic belongs in the feature that owns the underlying data.
