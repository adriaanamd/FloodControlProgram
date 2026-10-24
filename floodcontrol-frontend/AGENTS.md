# FloodControl dashboard

React 19 + TanStack Start + TanStack Router + Vite + Tailwind CSS 4 application. All dashboard data is local mock data; do not add live APIs, databases, persistence, analytics, or server functions for product data.

## Development

- Required runtime: Node `22.23.4` or newer.
- Package manager: pnpm `10.34.3` or compatible.
- Start development: `pnpm dev`.
- Typecheck: `pnpm typecheck`.
- Build: `pnpm build`.
- Start the production server: `pnpm start`.
- Format: `pnpm format`.
- Tests live in the sibling `floodcontrol-tests/` package and run with `corepack pnpm --dir floodcontrol-tests test`.

## Architecture

This frontend uses Feature-Sliced Design:

- `src/app/` - router factory and global styles.
- `src/routes/` - TanStack Start document and file-based routes.
- `src/pages/` - route-level page composition.
- `src/widgets/` - complete dashboard sections and shell composition.
- `src/features/` - user-facing interactions such as authentication, filters, acknowledgement, and navigation.
- `src/entities/` - typed mock domain records and selectors for users, sensors, and alerts.
- `src/shared/` - reusable UI primitives and framework-agnostic helpers.

Respect the one-way import direction: `app → pages → widgets → features → entities → shared`. Shared code must not import product entities. Keep the only product route at `/` and preserve the existing in-app navigation state.

## Styling

Global CSS is `src/app/styles/index.css`. It imports the DM Sans font and Tailwind CSS v4, defines the theme font, global body background, and map-grid utility. Preserve the existing Tailwind class values, copy, spacing, responsive breakpoints, colors, and SVG paths when moving UI code.

## Security

Use the patched Node runtime required by `.mise.toml`. Do not add `node:zlib`, shell execution, dynamic code evaluation, attacker-controlled filesystem handling, or unvalidated server input processing. The TanStack Start document shell must stay free of dynamic script injection and product data loading.
