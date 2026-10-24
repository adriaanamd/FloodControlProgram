# FloodControl TanStack Start, FSD, and Node2Shell Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the mock FloodControl dashboard from the legacy generator Vite SPA to TanStack Start with full Feature-Sliced Design and a patched Node runtime, while preserving the existing UI, UX, and mock data.

**Architecture:** TanStack Start will own the document through `src/routes/__root.tsx` and render one `/` route. Product code will be split into FSD layers: app, pages, widgets, features, entities, and shared. The dashboard remains a client-side mock experience with no server functions, APIs, persistence, or live data.

**Tech Stack:** React 19, TanStack Start, TanStack Router, Vite, TypeScript, Tailwind CSS 4, Vitest, pnpm, Node 22.23.4.

## Global Constraints

- Preserve all existing visible copy, mock values, colors, fonts, spacing, responsive breakpoints, Tailwind classes, SVG icon paths, animations, and interaction behavior.
- Keep the only application route at `/`; preserve in-app navigation as local state.
- Keep all data mocked and local; do not add API calls, database access, persistence, analytics, or server functions for dashboard data.
- Remove every legacy generator reference from source, configuration, metadata, and project instructions.
- Delete `index.html`; TanStack Start must render the document through `src/routes/__root.tsx`.
- Pin Node to `22.23.4` and require `>=22.23.4`.
- Do not add `node:zlib`, shell execution, dynamic evaluation, or attacker-controlled filesystem handling to application/runtime code.
- Run the smallest affected checks after each task and the complete local gate before completion.
- The workspace now has Git metadata; commit each independently testable task when its checks pass.

---

### Task 1: Establish the failing regression and security contract tests

**Files:**
- Create: `floodcontrol-tests/package.json`
- Create: `floodcontrol-tests/tsconfig.json`
- Create: `floodcontrol-tests/entities/sensor/filterSensors.test.ts`
- Create: `floodcontrol-tests/entities/alert/activeAlerts.test.ts`
- Create: `floodcontrol-tests/security/runtime-contract.test.ts`

**Interfaces:**
- Consumes: The intended extracted sensor and alert model functions from Tasks 3 and 4.
- Produces: A separate `floodcontrol-tests/` Vitest package and tests that define sensor filtering, alert acknowledgement, and Node2Shell/runtime constraints before production extraction.

- [ ] **Step 1: Add the test command and Vitest dependency.**

Create `floodcontrol-tests/package.json` with:

```json
{
  "name": "floodcontrol-tests",
  "private": true,
  "type": "module",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.7.0",
    "vitest": "^3.2.4"
  }
}
```

Create `floodcontrol-tests/tsconfig.json` with `target: ES2022`, `module: ESNext`, `moduleResolution: Bundler`, `types: ["node"]`, `strict: true`, `skipLibCheck: true`, and `noEmit: true`, including `**/*.test.ts`. Run `corepack pnpm install` from `floodcontrol-tests/` to create its `pnpm-lock.yaml`.

- [ ] **Step 2: Write the failing sensor selector test.**

Create `floodcontrol-tests/entities/sensor/filterSensors.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { filterSensors } from '../../../floodcontrol-frontend/src/entities/sensor/model/selectors'
import type { Sensor } from '../../../floodcontrol-frontend/src/entities/sensor/model/types'

const sensors: Sensor[] = [
  { id: 'A', street: 'A', zone: '1', level: 1, trend: 'Stable', state: 'Critical', x: 0, y: 0 },
  { id: 'B', street: 'B', zone: '2', level: 2, trend: 'Stable', state: 'Warning', x: 0, y: 0 },
]

describe('filterSensors', () => {
  it('returns every sensor for the all-sensors filter and only matching states otherwise', () => {
    expect(filterSensors(sensors, 'All sensors')).toEqual(sensors)
    expect(filterSensors(sensors, 'Critical')).toEqual([sensors[0]])
  })
})
```

- [ ] **Step 3: Write the failing alert acknowledgement test.**

Create `floodcontrol-tests/entities/alert/activeAlerts.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getActiveAlerts } from '../../../floodcontrol-frontend/src/entities/alert/model/selectors'
import type { Alert } from '../../../floodcontrol-frontend/src/entities/alert/model/types'

const alerts: Alert[] = [
  { title: 'Critical', place: 'A', time: 'Now', severity: 'Critical' },
  { title: 'Warning', place: 'B', time: 'Now', severity: 'Warning' },
]

describe('getActiveAlerts', () => {
  it('removes only the first alert after acknowledgement', () => {
    expect(getActiveAlerts(alerts, false)).toEqual(alerts)
    expect(getActiveAlerts(alerts, true)).toEqual([alerts[1]])
  })
})
```

- [ ] **Step 4: Write the failing runtime contract test.**

Create `floodcontrol-tests/security/runtime-contract.test.ts`:

```ts
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const projectRoot = resolve(import.meta.dirname, '..', '..', 'floodcontrol-frontend')
const packageJson = JSON.parse(readFileSync(resolve(projectRoot, 'package.json'), 'utf8')) as {
  engines?: { node?: string }
}
const mise = readFileSync(resolve(projectRoot, '.mise.toml'), 'utf8')

function readSourceTree(directory: string): string {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = resolve(directory, entry.name)
      return entry.isDirectory() ? readSourceTree(path) : [readFileSync(path, 'utf8')]
    })
    .join('\n')
}

describe('runtime security contract', () => {
  it('requires the patched Node.js release line', () => {
    expect(packageJson.engines?.node).toBe('>=22.23.4')
    expect(mise).toContain('node = "22.23.4"')
  })

  it('contains no dangerous runtime sinks in application/config code', () => {
    const source = [readSourceTree(resolve(projectRoot, 'src')), readFileSync(resolve(projectRoot, 'vite.config.ts'), 'utf8')].join('\n')

    expect(source).not.toMatch(/node:zlib|child_process|(?:^|[^\w])exec(?:Sync)?\s*\(|spawn(?:Sync)?\s*\(|eval\s*\(|new Function\s*\(/)
  })
})
```

- [ ] **Step 5: Run the new tests and verify they fail for missing production modules.**

Run from the repository root:

```powershell
corepack pnpm --dir floodcontrol-tests test
```

Expected: FAIL because the extracted selector/type modules and patched runtime contract do not exist yet. Fix only test setup errors; do not add production implementations in this step.

- [ ] **Step 6: Commit the red tests.**

```powershell
git add floodcontrol-tests
git commit -m "test: define dashboard extraction and runtime security contracts"
```

### Task 2: Replace legacy Vite integration with TanStack Start configuration

**Files:**
- Modify: `floodcontrol-frontend/package.json`
- Modify: `floodcontrol-frontend/pnpm-lock.yaml`
- Modify: `floodcontrol-frontend/.mise.toml`
- Modify: `floodcontrol-frontend/tsconfig.json`
- Replace: `floodcontrol-frontend/vite.config.ts`
- Create: `floodcontrol-frontend/src/app/router.tsx`

**Interfaces:**
- Consumes: The existing React/Vite/Tailwind dependency set and generated route tree contract.
- Produces: A TanStack Start Vite build with typed router creation and a patched Node version floor.

- [ ] **Step 1: Add TanStack Start and Router dependencies and runtime metadata.**

Add `@tanstack/react-start` and `@tanstack/react-router` to dependencies. Set package metadata to:

```json
{
  "name": "floodcontrol-dashboard",
  "type": "module",
  "engines": { "node": ">=22.23.4" },
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "start": "node .output/server/index.mjs",
    "preview": "vite preview",
    "format": "oxfmt",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

Use `pnpm install` to regenerate the lockfile. Do not add a server data dependency.

- [ ] **Step 2: Pin the patched Node release.**

Change `floodcontrol-frontend/.mise.toml` to:

```toml
[tools]
node = "22.23.4"
"npm:pnpm" = "10.34.3"
```

- [ ] **Step 3: Replace the Vite configuration.**

Replace `floodcontrol-frontend/vite.config.ts` with a minimal config containing only the Start, React, and Tailwind plugins:

```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tanstackStart(), react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT ?? 8443),
    strictPort: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
})
```

No generator plugins, virtual modules, custom HTML transforms, source-map rewriters, or environment variables remain.

- [ ] **Step 4: Configure TypeScript for TanStack Start.**

Keep strict mode and `moduleResolution: "bundler"`, add `src/routeTree.gen.ts` to the generated-file include if needed, and retain the `@/*` path alias. Do not enable `verbatimModuleSyntax` because TanStack Start warns it can leak server bundles into the client bundle.

- [ ] **Step 5: Create the router factory.**

Create `src/app/router.tsx`:

```tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
```

- [ ] **Step 6: Run the configuration checks.**

Run:

```powershell
cd floodcontrol-frontend
pnpm typecheck
pnpm build
```

Expected: the generated route-tree or route-entry errors are the only failures; the old `App` entry can remain temporarily while the route files are added in Task 6.

- [ ] **Step 7: Commit the Start configuration.**

```powershell
git add floodcontrol-frontend/package.json floodcontrol-frontend/pnpm-lock.yaml floodcontrol-frontend/.mise.toml floodcontrol-frontend/tsconfig.json floodcontrol-frontend/vite.config.ts floodcontrol-frontend/src/app/router.tsx
git commit -m "build: migrate frontend runtime to TanStack Start"
```

### Task 3: Extract entities, selectors, and shared UI primitives

**Files:**
- Create: `floodcontrol-frontend/src/entities/sensor/model/types.ts`
- Create: `floodcontrol-frontend/src/entities/sensor/model/mock.ts`
- Create: `floodcontrol-frontend/src/entities/sensor/model/selectors.ts`
- Create: `floodcontrol-frontend/src/entities/alert/model/types.ts`
- Create: `floodcontrol-frontend/src/entities/alert/model/mock.ts`
- Create: `floodcontrol-frontend/src/entities/alert/model/selectors.ts`
- Create: `floodcontrol-frontend/src/entities/user/model/types.ts`
- Create: `floodcontrol-frontend/src/shared/config/severityStyles.ts`
- Create: `floodcontrol-frontend/src/shared/ui/Button.tsx`
- Create: `floodcontrol-frontend/src/shared/ui/Icon.tsx`
- Create: `floodcontrol-frontend/src/shared/ui/TextField.tsx`
- Create: `floodcontrol-frontend/src/shared/ui/PageHeading.tsx`
- Create: `floodcontrol-frontend/src/shared/ui/Row.tsx`
- Modify: `floodcontrol-tests/entities/sensor/filterSensors.test.ts`
- Modify: `floodcontrol-tests/entities/alert/activeAlerts.test.ts`

**Interfaces:**
- Consumes: The failing tests from Task 1 and the literal data/icon/primitive definitions currently in `src/App.tsx`.
- Produces: Typed entity models, static mock records, selector functions, the severity class map, and shared UI primitives with the exact current DOM/classes.

- [ ] **Step 1: Define the entity types from the existing literals.**

Use the existing `Sensor`, `Alert`, and `MockUser` shapes without changing values or display strings. `Sensor['state']` must be the union `'Critical' | 'Warning' | 'Watch'`; `MockUser['role']` must remain `'Administrator' | 'DRRM Monitor'`; alert severity must remain `'Critical' | 'Warning' | 'Watch'`.

- [ ] **Step 2: Add the static mock records.**

Move the exact `sensors` and `alerts` arrays from `App.tsx` into the entity `mock.ts` files. Export them as read-only values. Do not normalize, rename, sort, or replace any record.

- [ ] **Step 3: Implement the minimal selectors.**

Create:

```ts
export type SensorFilter = 'All sensors' | Sensor['state']

export function filterSensors(sensors: readonly Sensor[], filter: SensorFilter): Sensor[] {
  return filter === 'All sensors' ? [...sensors] : sensors.filter((sensor) => sensor.state === filter)
}
```

And:

```ts
export function getActiveAlerts(alerts: readonly Alert[], acknowledged: boolean): Alert[] {
  return acknowledged ? alerts.slice(1) : [...alerts]
}
```

- [ ] **Step 4: Run the focused tests and verify green.**

Run:

```powershell
corepack pnpm --dir floodcontrol-tests vitest run entities/sensor/filterSensors.test.ts entities/alert/activeAlerts.test.ts
```

Expected: both tests PASS.

- [ ] **Step 5: Move shared primitives without visual edits.**

Copy the current `Icon`, `Button`, `TextField`, `PageHeading`, and `Row` implementations into their shared files. Preserve their current props, default values, SVG `viewBox`/stroke attributes, button focus classes, input classes, and text strings. Only replace implicit `React.*` references with explicit type imports where needed.

- [ ] **Step 6: Typecheck the extracted layer.**

Run `pnpm typecheck`. Fix only type/import issues created by the extraction; do not alter presentation classes or mock values.

- [ ] **Step 7: Commit the entity and shared layer.**

```powershell
git add floodcontrol-frontend/src/entities floodcontrol-frontend/src/shared floodcontrol-tests
git commit -m "refactor: extract dashboard entities and shared UI"
```

### Task 4: Extract authentication and focused interaction features

**Files:**
- Create: `floodcontrol-frontend/src/features/authentication/ui/AuthScreen.tsx`
- Create: `floodcontrol-frontend/src/features/sensor-filter/ui/SensorFilter.tsx`
- Create: `floodcontrol-frontend/src/features/alert-acknowledgement/ui/AcknowledgeAlertButton.tsx`
- Create: `floodcontrol-frontend/src/features/dashboard-navigation/ui/DashboardNavigation.tsx`

**Interfaces:**
- Consumes: Shared primitives, user/sensor/alert entity types, and current `AuthScreen`/navigation JSX.
- Produces: Feature components that expose explicit callback props and contain no imports from widgets or pages.

- [ ] **Step 1: Extract `AuthScreen` with the current local form state.**

Move the current `mode`, `role`, `name`, `email`, `password`, and `error` state and submit behavior into `AuthScreen`. Keep the public interface:

```ts
type AuthScreenProps = {
  onAuthenticate: (user: MockUser) => void
}
```

Preserve the current validation messages, role labels, button labels, placeholder text, and class strings.

- [ ] **Step 2: Extract sensor filters.**

Create `SensorFilter` with:

```ts
type SensorFilterProps = {
  value: SensorFilter
  onChange: (value: SensorFilter) => void
}
```

Render the same four buttons (`All sensors`, `Critical`, `Warning`, `Watch`) and the same selected/unselected classes.

- [ ] **Step 3: Extract the alert acknowledgement control.**

Create `AcknowledgeAlertButton` with:

```ts
type AcknowledgeAlertButtonProps = {
  onAcknowledge: () => void
}
```

Preserve the current button text and classes. The parent remains responsible for `acknowledged` state.

- [ ] **Step 4: Extract dashboard navigation.**

Create `DashboardNavigation` with callback props for active tab, mobile open/close, sign-out, and the current user. Preserve the exact labels, icon names, badge count, and sidebar markup/classes.

- [ ] **Step 5: Run typecheck and the existing focused tests.**

Run:

```powershell
cd floodcontrol-frontend
pnpm typecheck
cd ..
corepack pnpm --dir floodcontrol-tests vitest run entities/sensor/filterSensors.test.ts entities/alert/activeAlerts.test.ts
```

Expected: both commands exit 0.

- [ ] **Step 6: Commit the feature layer.**

```powershell
git add floodcontrol-frontend/src/features
git commit -m "refactor: extract dashboard interaction features"
```

### Task 5: Split dashboard widgets and page composition

**Files:**
- Create: `floodcontrol-frontend/src/widgets/dashboard-overview/ui/DashboardOverview.tsx`
- Create: `floodcontrol-frontend/src/widgets/dashboard-workspace/ui/DashboardWorkspace.tsx`
- Create: `floodcontrol-frontend/src/widgets/dashboard-shell/ui/DashboardShell.tsx`
- Create: `floodcontrol-frontend/src/pages/dashboard/ui/DashboardPage.tsx`

**Interfaces:**
- Consumes: Entity mocks/selectors, shared primitives/config, and features from Tasks 3–4.
- Produces: A page-level component that renders the existing auth gate and signed-in dashboard without changing its visible behavior.

- [ ] **Step 1: Extract the overview widget.**

Move the current overview JSX from `App.tsx` into `DashboardOverview`. Its props must be:

```ts
type DashboardOverviewProps = {
  filter: SensorFilter
  onFilterChange: (filter: SensorFilter) => void
  selectedSensor: Sensor
  onSelectSensor: (sensor: Sensor) => void
  acknowledged: boolean
  onAcknowledge: () => void
}
```

Use `filterSensors(sensors, filter)` and `getActiveAlerts(alerts, acknowledged)` while preserving the existing map SVG, marker positions, stat cards, alert list, prediction chart, sensor health, and response readiness markup/classes.

- [ ] **Step 2: Extract the workspace widget.**

Move `Workspace`, `PageHeading`, and `Row` usage into `DashboardWorkspace`. Keep its internal `view`, `selected`, `period`, and `alertState` state and all four tab branches (`Live Map`, `Sensor Network`, `Predictive Analytics`, and the default alert-management branch) exactly as-is.

- [ ] **Step 3: Extract the dashboard shell.**

Move the signed-in layout state and shell markup into `DashboardShell`. Keep `activeNav`, `mobileNav`, `alertsOpen`, `filter`, `selectedSensor`, and `acknowledged` in the same component so state transitions remain identical. Compose `DashboardNavigation`, the header, `DashboardOverview`, `DashboardWorkspace`, and the notification toast without changing classes or text.

- [ ] **Step 4: Add the page boundary.**

Create `DashboardPage` with `user` state and the existing auth gate:

```tsx
export function DashboardPage() {
  const [user, setUser] = useState<MockUser | null>(null)

  if (!user) return <AuthScreen onAuthenticate={setUser} />
  return <DashboardShell user={user} onSignOut={() => setUser(null)} />
}
```

The page must not add data loading or server calls.

- [ ] **Step 5: Run focused typecheck/build.**

Run:

```powershell
cd floodcontrol-frontend
pnpm typecheck
cd ..
corepack pnpm --dir floodcontrol-tests test
```

Expected: the model and security tests PASS; any remaining build failure should be only the missing TanStack route document from Task 6.

- [ ] **Step 6: Commit the page/widget layer.**

```powershell
git add floodcontrol-frontend/src/pages floodcontrol-frontend/src/widgets
git commit -m "refactor: compose dashboard pages and widgets"
```

### Task 6: Add TanStack document/root routes and remove the old entrypoints

**Files:**
- Create: `floodcontrol-frontend/src/routes/__root.tsx`
- Create: `floodcontrol-frontend/src/routes/index.tsx`
- Create: generated `floodcontrol-frontend/src/routeTree.gen.ts`
- Create: `floodcontrol-frontend/src/app/styles/index.css`
- Delete: `floodcontrol-frontend/index.html`
- Delete: `floodcontrol-frontend/src/main.tsx`
- Delete: `floodcontrol-frontend/src/App.tsx`
- Delete: `floodcontrol-frontend/src/index.css`

**Interfaces:**
- Consumes: `getRouter()` from `src/app/router.tsx` and `DashboardPage` from the page layer.
- Produces: The only application entry through TanStack Start and a document shell with no generator HTML slots.

- [ ] **Step 1: Create the root document route.**

Create `src/routes/__root.tsx`:

```tsx
import type { ReactNode } from 'react'
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import styles from '../app/styles/index.css?url'

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: 'stylesheet', href: styles }, { rel: 'icon', href: '/favicon.svg' }],
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'iFlood 2.0 | City Operations' },
      { name: 'description', content: 'Mock flood operations dashboard for San Isidro City.' },
    ],
  }),
  component: RootDocument,
})

function RootDocument() {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body><Outlet /><Scripts /></body>
    </html>
  )
}
```

Keep the document shell free of `dangerouslySetInnerHTML`, dynamic scripts, custom decompression, and server data.

- [ ] **Step 2: Create the index route.**

Create `src/routes/index.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '../pages/dashboard/ui/DashboardPage'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})
```

- [ ] **Step 3: Move the existing CSS unchanged.**

Move the content of `src/index.css` to `src/app/styles/index.css`. Preserve the Google Fonts import order, Tailwind import, theme values, body rules, `.map-grid` declarations, and all values exactly.

- [ ] **Step 4: Let TanStack generate the route tree.**

Run `pnpm dev` once from `floodcontrol-frontend/`, allow the Start plugin to generate `src/routeTree.gen.ts`, then stop the server. Do not hand-edit the generated file.

- [ ] **Step 5: Run the full local application checks.**

Run:

```powershell
cd floodcontrol-frontend
pnpm format --check
pnpm typecheck
  corepack pnpm --dir floodcontrol-tests test
pnpm build
```

Expected: all commands exit 0. If the existing formatter does not support `--check`, run `pnpm format` and then inspect `git diff` to ensure only formatting changed.

- [ ] **Step 6: Commit the Start route migration.**

```powershell
git add floodcontrol-frontend/src floodcontrol-frontend/index.html
git commit -m "refactor: adopt TanStack Start document routing"
```

### Task 7: Remove remaining legacy artifacts and replace the favicon

**Files:**
- Delete: the workspace-level generator scaffolding files
- Modify: `floodcontrol-frontend/AGENTS.md`
- Modify: `floodcontrol-frontend/CLAUDE.md`
- Modify: `floodcontrol-frontend/public/favicon.svg`

**Interfaces:**
- Consumes: The complete TanStack Start/FSD app from Tasks 2–6.
- Produces: A repository with no legacy generator artifacts or text and a neutral FloodControl favicon.

- [ ] **Step 1: Delete the workspace-level generator scaffolding directory.**

Use an explicit path after confirming it is exactly the repository's generator scaffolding directory. Remove only that directory and its listed contents.

- [ ] **Step 2: Rewrite project instructions.**

Update `floodcontrol-frontend/AGENTS.md` to describe the TanStack Start structure, scripts, FSD layer direction, Tailwind CSS location, Node `22.23.4` requirement, and mock-only data rule. Keep `CLAUDE.md` as the one-line `@AGENTS.md` pointer unless it contains any additional stale text.

- [ ] **Step 3: Replace the legacy favicon.**

Replace the legacy logo paths in `public/favicon.svg` with a simple cyan flood-control droplet mark matching the existing `Icon` droplet silhouette. Keep the asset 16×16 and SVG-only; do not alter application layout or in-app branding.

- [ ] **Step 4: Scan for stale generator references.**

Run:

```powershell
rg -n -i "legacy generator|generator scaffolding|LEGACY_GENERATOR_|legacy-generator" . -g '!**/node_modules/**' -g '!**/pnpm-lock.yaml'
```

Expected: no matches outside this historical plan text. If `git` metadata contains an old commit message, ignore it; only tracked working-tree files are in scope.

- [ ] **Step 5: Commit the cleanup.**

```powershell
git add floodcontrol-frontend/AGENTS.md floodcontrol-frontend/CLAUDE.md floodcontrol-frontend/public/favicon.svg
git commit -m "chore: remove legacy generator scaffolding"
```

### Task 8: Complete verification and handoff

**Files:**
- Modify only files needed to correct failures found by the verification commands.

**Interfaces:**
- Consumes: All implementation commits from Tasks 1–7.
- Produces: Fresh evidence for the UI-preservation, FSD, runtime-security, and build gates.

- [ ] **Step 1: Run formatting and type checks.**

```powershell
cd floodcontrol-frontend
pnpm format --check
pnpm typecheck
```

Expected: exit code 0 for both.

- [ ] **Step 2: Run the complete test suite.**

```powershell
corepack pnpm --dir floodcontrol-tests typecheck
corepack pnpm --dir floodcontrol-tests test
```

Expected: all Vitest tests pass with zero skipped or focused tests.

- [ ] **Step 3: Run the production build.**

```powershell
pnpm build
```

Expected: TanStack Start emits a successful client/server production build.

- [ ] **Step 4: Run the production server smoke check.**

Start `pnpm start` with a bounded process, request `/`, and verify the response contains the app document and no generator comment slots. Stop the process after the request; do not leave a background server running.

- [ ] **Step 5: Run repository security scans.**

```powershell
rg -n -i "legacy generator|generator scaffolding|LEGACY_GENERATOR_|legacy-generator" . -g '!**/node_modules/**' -g '!**/pnpm-lock.yaml'
rg -n "node:zlib|child_process|(?:^|[^[:alnum:]_])exec(?:Sync)?[[:space:]]*\(|spawn(?:Sync)?[[:space:]]*\(|eval[[:space:]]*\(|new Function" floodcontrol-frontend/src floodcontrol-frontend/vite.config.ts
git status --short
git log --oneline -8
```

Expected: no legacy generator or forbidden sink matches; only intentional generated/build files are untracked or ignored; recent commits map to the task boundaries.

- [ ] **Step 6: Review the final diff for UI/UX and mock-data invariants.**

Use `git diff HEAD~8..HEAD -- floodcontrol-frontend/src` and compare every extracted literal against the original `src/App.tsx` snapshot. Confirm no visible copy, data value, Tailwind class, SVG path, or interaction callback changed. If the repo has a browser preview, manually smoke-test login, tab navigation, mobile drawer, filters, marker selection, alert acknowledgement, notification dismissal, and sign-out.

- [ ] **Step 7: Report verification evidence and remote CI status.**

Report the exact command outcomes, commit IDs, and whether any GitHub Actions run was available. If no remote workflow exists, state that remote CI is unverified rather than inferring success from local checks.

## Self-review checklist

- Spec coverage: Tasks 2, 6, and 7 cover TanStack Start, no `index.html`, and legacy scaffolding removal; Tasks 3–5 cover the full FSD split and UI-preserving composition; Tasks 1, 2, and 8 cover Node2Shell/runtime security and verification.
- Placeholder scan: no `TBD`, `TODO`, `FIXME`, or “implement later” instructions are used.
- Type consistency: `SensorFilter`, `Sensor`, `Alert`, `MockUser`, `filterSensors`, and `getActiveAlerts` are defined before their consumers and keep the exact names used by later tasks.
- Test integrity: tests are written in the separate `floodcontrol-tests/` package before extracted implementations, no focused or skipped tests are permitted, and full local verification is required before completion.

