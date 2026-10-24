# FloodControl TanStack Start, FSD, and Node2Shell Hardening Design

## Goal

Remove legacy generator scaffolding, migrate the mock FloodControl dashboard to TanStack Start without `index.html`, reorganize the frontend into full Feature-Sliced Design, and harden the Node runtime contract against Node2Shell while preserving the existing UI, UX, and mock data.

## Current context

- The active frontend is `floodcontrol-frontend/`.
- Nearly all product UI, state, mock data, and SVG icon definitions currently live in `floodcontrol-frontend/src/App.tsx`.
- The project is a React 19 + Vite + Tailwind CSS 4 client-only app with no backend source, test suite, CI workflow, or Git metadata in this workspace.
- Legacy generator traces exist in the package name, `AGENTS.md`, `index.html`, `vite.config.ts`, and the workspace-level scaffolding directory.
- `floodcontrol-frontend/.mise.toml` currently specifies the broad Node range `22`.

## Security basis

Node2Shell refers here to CVE-2026-111497, the Node.js Brotli decoder out-of-bounds write that can lead to process memory corruption and remote code execution when attacker-controlled Brotli data is decompressed. The Node.js security release identifies fixed versions `22.23.4`, `24.22.1`, and `26.12.1`.

The implementation will:

1. Pin the development and deployment runtime to Node `22.23.4`.
2. Require Node `>=22.23.4` in `package.json`.
3. Avoid custom decompression, shell execution, dynamic evaluation, and attacker-controlled filesystem handling in application code and TanStack server routes.
4. Add a deterministic source/config security contract test that fails if forbidden sinks or an unsafe Node version floor are reintroduced.

Pinning the patched runtime is the primary mitigation. The app remains mock-only and will not add API endpoints or server functions for dashboard data.

## Architecture

TanStack Start will own the document shell through `src/routes/__root.tsx`, with a single typed `/` route in `src/routes/index.tsx`. The existing in-app navigation remains local state so the user-visible behavior does not change. TanStack Start is used as the application runtime and routing layer, not as a reason to add server-backed data.

The Feature-Sliced Design layers will be:

```text
src/
  app/
    router.tsx
    styles/index.css
  routes/
    __root.tsx
    index.tsx
  pages/
    dashboard/ui/DashboardPage.tsx
  widgets/
    dashboard-shell/ui/DashboardShell.tsx
    dashboard-overview/ui/DashboardOverview.tsx
    dashboard-workspace/ui/DashboardWorkspace.tsx
  features/
    authentication/ui/AuthScreen.tsx
    sensor-filter/ui/SensorFilter.tsx
    alert-acknowledgement/ui/AcknowledgeAlertButton.tsx
  entities/
    alert/model/
    sensor/model/
    user/model/
  shared/
    ui/
    lib/
    config/
```

Imports will follow the one-way FSD dependency direction: `app → pages → widgets → features → entities → shared`. Shared UI primitives will not import product-specific entities. Mock records will live with their entity models and remain static local values.

## UI and UX preservation contract

The following behavior and presentation are invariants:

- The unauthenticated screen, authentication interaction, signed-in dashboard, navigation labels, tab switching, mobile drawer, notification panel, sensor filters, map markers, selected sensor card, alert acknowledgement, and sign-out behavior remain available.
- All existing visible copy, mock values, colors, fonts, spacing, responsive breakpoints, Tailwind class values, SVG icon paths, animation classes, and layout hierarchy remain unchanged unless a move requires an import or prop boundary change.
- The route remains `/`; no new navigation affordances or URLs are introduced.
- No live API, database, persistence, analytics, or external data source is added.

The legacy favicon will be replaced with a neutral flood-control droplet favicon derived from the existing product mark. This is metadata/branding cleanup and does not alter the dashboard UI.

## Legacy scaffolding removal

- Delete the workspace-level generator scaffolding directory.
- Replace `vite.config.ts` with a minimal TanStack Start + React + Tailwind configuration using only standard `PORT` handling.
- Remove generator plugin functions, virtual routes, injected HTML comment slots, generator environment variables, and generator-specific comments.
- Remove `floodcontrol-frontend/index.html` and `floodcontrol-frontend/src/main.tsx`.
- Update `package.json` name and scripts for the TanStack Start runtime.
- Update project instructions and metadata so repository text contains no legacy generator references.

## Testing and verification

Because no existing tests or CI workflow are present, the implementation will establish a small local gate in a separate root-level `floodcontrol-tests/` package:

- Vitest tests for entity filtering and state transition helpers, written before their extracted implementations.
- A security contract test for the Node version floor and forbidden runtime sinks.
- TypeScript checking with `tsc --noEmit`.
- Formatting with the existing formatter.
- TanStack Start production build and server smoke check.
- Repository scans for legacy generator markers, shell/eval/decompression sinks, and stale `index.html` references.

The repository has Git metadata, but no GitHub Actions workflow was present during implementation. Verification results distinguish local checks from unavailable remote CI checks.

