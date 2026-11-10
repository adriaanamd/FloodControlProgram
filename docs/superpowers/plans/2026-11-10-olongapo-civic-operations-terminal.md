# Olongapo City Civic Operations Terminal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the complete FloodControl frontend as a dark Olongapo City civic-operations terminal while preserving existing workflows and demo data behavior.

**Architecture:** Keep the existing Vite/React component boundaries and state model. Add a small shared identity/folio layer, centralize the Industrial visual tokens in CSS, then apply the same shell and surface treatment to authentication, navigation, overview, and secondary workspace views. Store official Olongapo assets locally under `public/assets/olongapo/`.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, SVG icons, npm scripts from the repository root.

## Global Constraints

- Surface: warm black `#0B0C0A`, near-black `#050605`, charcoal `#141714`.
- Primary signal: amber `#FFB800`; use it for active navigation, current readings, focus rings, and primary operational actions.
- Typography: IBM Plex Mono for display, body, labels, and tabular numerics.
- Geometry: mostly squared containers with minimal 2px rounding; no soft card shadows.
- Preserve all current click and form behaviors, route/state boundaries, and prediction logic.
- Replace product-context references to `San Isidro City` with `Olongapo City`.
- Keep existing mock readings as demo data and expose a `Demo environment` label where telemetry could be mistaken for live city data.
- Use real SVG icons and meaningful alt text; do not add unicode glyphs as icons.
- Respect `prefers-reduced-motion` and keep keyboard focus visible with an amber outline.
- Run `npm run frontend:build`, `npm test`, and `npm run typecheck` before claiming completion.

---

### Task 1: Add Olongapo assets and the shared visual foundation

**Files:**
- Create: `floodcontrol-frontend/public/assets/olongapo/logo-olongapo.png`
- Create: `floodcontrol-frontend/public/assets/olongapo/main-banner.png`
- Create: `floodcontrol-frontend/src/shared/ui/CityMark.tsx`
- Create: `floodcontrol-frontend/src/shared/ui/SectionFolio.tsx`
- Modify: `floodcontrol-frontend/src/app/styles/index.css`

**Interfaces:**
- `CityMark` accepts `{ compact?: boolean; className?: string }` and renders the local seal image with accessible alt text plus the product lockup.
- `SectionFolio` accepts `{ index: string; label: string; className?: string }` and renders the numbered fieldboard label used by page headings.

- [ ] **Step 1: Download the two official assets into the public directory**

Run from the repository root:

```powershell
New-Item -ItemType Directory -Force -Path 'floodcontrol-frontend/public/assets/olongapo' | Out-Null
Invoke-WebRequest -Uri 'https://olongapocity.gov.ph/wp-content/themes/olongapo-ofc-theme-prod/assets/images/logo-olongapo.png' -OutFile 'floodcontrol-frontend/public/assets/olongapo/logo-olongapo.png'
Invoke-WebRequest -Uri 'https://olongapocity.gov.ph/wp-content/uploads/2025/08/Main-Banner.png' -OutFile 'floodcontrol-frontend/public/assets/olongapo/main-banner.png'
```

Expected: both files exist under `floodcontrol-frontend/public/assets/olongapo/` and are non-empty PNG files.

- [ ] **Step 2: Add the identity and folio components**

Create `CityMark.tsx` with a local image source and this public shape:

```tsx
type CityMarkProps = { compact?: boolean; className?: string }

export function CityMark({ compact = false, className = "" }: CityMarkProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/assets/olongapo/logo-olongapo.png"
        alt="Olongapo City official seal"
        className={compact ? "size-9 object-contain" : "size-11 object-contain"}
      />
      {!compact && (
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-white">Olongapo City</p>
          <p className="font-display text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Flood Control</p>
        </div>
      )}
    </div>
  )
}
```

Create `SectionFolio.tsx` with an amber numeric index, a 1px rule, and the supplied label in uppercase mono text. Do not add decorative copy beyond the supplied label.

- [ ] **Step 3: Replace the global theme tokens**

Update `index.css` with IBM Plex Mono, the following variables, dark browser controls, a rule-based map grid, a `.fieldboard-surface` utility, an amber `.focus-ring`, and `prefers-reduced-motion` handling:

```css
:root {
  --surface: #0b0c0a;
  --surface-deep: #050605;
  --surface-raised: #141714;
  --surface-elevated: #1b1e1a;
  --signal: #ffb800;
  --signal-soft: rgba(255, 184, 0, 0.12);
  --text: #f4f5ef;
  --text-muted: #9ca398;
  --text-dim: #687064;
  --rule: rgba(244, 245, 239, 0.12);
  --rule-strong: rgba(255, 184, 0, 0.42);
  --danger: #ff4d3d;
}

@theme {
  --font-sans: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-display: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

Retain the existing map-grid idea with the new rule token and no grain or soft shadow utilities.

- [ ] **Step 4: Build and commit the foundation**

Run `npm run frontend:build`; expect a successful Vite build. Then run:

```powershell
git add floodcontrol-frontend/public/assets/olongapo floodcontrol-frontend/src/app/styles/index.css floodcontrol-frontend/src/shared/ui/CityMark.tsx floodcontrol-frontend/src/shared/ui/SectionFolio.tsx
git commit -m "feat: add Olongapo visual foundation"
```

### Task 2: Redesign authentication and shared controls

**Files:**
- Modify: `floodcontrol-frontend/src/features/authentication/ui/AuthScreen.tsx`
- Modify: `floodcontrol-frontend/src/shared/ui/Button.tsx`
- Modify: `floodcontrol-frontend/src/shared/ui/TextField.tsx`

**Interfaces:** Preserve `AuthScreen({ onAuthenticate })`, the existing `MockUser` payload, and all `Button`/`TextField` props.

- [ ] **Step 1: Restyle auth while preserving state and handlers**

Keep mode, role, validation, demo access, and submit behavior. Use a dark split layout with the local banner on the desktop panel:

```tsx
<img src="/assets/olongapo/main-banner.png" alt="" className="absolute inset-0 size-full object-cover opacity-35" />
<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,5,.94),rgba(5,6,5,.68)),linear-gradient(0deg,rgba(5,6,5,.94),transparent_55%)]" />
```

Use `CityMark`, the heading `Flood intelligence for Olongapo City.`, a visible `Demo environment` label, and the existing form controls. Preserve the `name@drrm.gov.ph` placeholder.

- [ ] **Step 2: Update shared controls**

Update `Button` to use `focus-visible:outline-2 focus-visible:outline-[var(--signal)] focus-visible:outline-offset-2`. Update `TextField` to use dark surfaces, `var(--rule)`, `var(--text)`, `var(--signal)` focus styling, square geometry, and `color-scheme: dark`.

- [ ] **Step 3: Build and commit auth changes**

Run `npm run frontend:build` and expect PASS. Commit with:

```powershell
git add floodcontrol-frontend/src/features/authentication/ui/AuthScreen.tsx floodcontrol-frontend/src/shared/ui/Button.tsx floodcontrol-frontend/src/shared/ui/TextField.tsx
git commit -m "feat: redesign Olongapo authentication shell"
```

### Task 3: Redesign the application shell and page headings

**Files:**
- Modify: `floodcontrol-frontend/src/features/dashboard-navigation/ui/DashboardNavigation.tsx`
- Modify: `floodcontrol-frontend/src/widgets/dashboard-shell/ui/DashboardShell.tsx`
- Modify: `floodcontrol-frontend/src/shared/ui/PageHeading.tsx`

**Interfaces:** Preserve all existing props and callbacks. `PageHeading` continues to accept `{ title, subtitle, action }`.

- [ ] **Step 1: Add typed numbered navigation metadata**

Replace inline tuples with:

```tsx
const navigationItems = [
  ["01", "Overview", "dashboard"],
  ["02", "Live Map", "map"],
  ["03", "Sensor Network", "sensor"],
  ["04", "Predictive Analytics", "analytics"],
  ["05", "Alert Management", "alert"],
] as const
```

Render the folio, existing SVG icon, and label. Preserve the alert count and mobile drawer callbacks. Use `CityMark` and the environment label `Demo operations`.

- [ ] **Step 2: Restyle the shell**

Use `var(--surface-deep)` for the page, `var(--surface)` for the sticky header, and `var(--rule)` for dividers. Keep rail width and mobile behavior. Replace the cyan live-data pill with `Demo data · sync active` in amber-led styling.

- [ ] **Step 3: Add folio mapping to `PageHeading`**

Use this exact mapping for the existing title values:

```tsx
const folioByTitle: Record<string, string> = {
  Overview: "01",
  "Citywide live map": "02",
  "IoT sensor network": "03",
  "Predictive analytics": "04",
  "Alert management": "05",
}
```

Render `SectionFolio` above the title and replace the stale date line with `Olongapo City · Demo operations`.

- [ ] **Step 4: Build and commit the shell**

Run `npm run frontend:build`; expect PASS. Then commit:

```powershell
git add floodcontrol-frontend/src/features/dashboard-navigation/ui/DashboardNavigation.tsx floodcontrol-frontend/src/widgets/dashboard-shell/ui/DashboardShell.tsx floodcontrol-frontend/src/shared/ui/PageHeading.tsx
git commit -m "feat: apply Olongapo fieldboard shell"
```

### Task 4: Restyle overview and secondary operational views

**Files:**
- Modify: `floodcontrol-frontend/src/widgets/dashboard-overview/ui/DashboardOverview.tsx`
- Modify: `floodcontrol-frontend/src/widgets/dashboard-workspace/ui/DashboardWorkspace.tsx`
- Modify: `floodcontrol-frontend/src/entities/sensor/model/severityStyles.ts`

**Interfaces:** Preserve `DashboardOverview` props, `DashboardWorkspace({ tab })`, sensor/alert/forecast data structures, and every existing interaction.

- [ ] **Step 1: Replace rounded cyan cards with fieldboard panels**

Use `border border-[var(--rule)] bg-[var(--surface-raised)] p-5` for operational panels, `border-b border-[var(--rule)]` for panel headers, `text-[var(--text-muted)]` for support copy, and `text-[var(--signal)]` for selected/current readings. Remove soft shadows and large rounded corners.

- [ ] **Step 2: Add the overview folio and demo label**

Render `SectionFolio index="01" label="Overview / live operations"` above the greeting. Add `Demo telemetry` beside the sensor filter.

- [ ] **Step 3: Preserve severity labels while changing colors**

Update `severityStyles.ts` to use amber-led classes for `Normal`, `Watch`, and `Warning`, and a narrowly scoped danger class for `Critical`. Keep the literal severity labels visible and preserve alert acknowledgement.

- [ ] **Step 4: Apply the system to all workspace tabs**

For Live Map, Sensor Network, Predictive Analytics, and Alert Management, preserve all filters/selectors/actions, use folios `02` through `05` via `PageHeading`, use squared panels/table rules, and label mock readings as `Demo telemetry` or `Demo model`. Keep the existing SVG map and forecast chart.

- [ ] **Step 5: Replace remaining product-context copy**

Change only product-context references from `San Isidro City` to `Olongapo City`. Do not invent official departments, hotlines, statistics, street incidents, or new telemetry.

- [ ] **Step 6: Build and commit the surface redesign**

Run `npm run frontend:build`; expect PASS. Then commit:

```powershell
git add floodcontrol-frontend/src/widgets/dashboard-overview/ui/DashboardOverview.tsx floodcontrol-frontend/src/widgets/dashboard-workspace/ui/DashboardWorkspace.tsx floodcontrol-frontend/src/entities/sensor/model/severityStyles.ts
git commit -m "feat: restyle Olongapo operational surfaces"
```

### Task 5: Verify behavior, copy, and CI-equivalent gates

**Files:** Verify all files changed in Tasks 1–4; no new public interfaces.

- [ ] **Step 1: Run copy and asset checks**

Run:

```powershell
rg -n "San Isidro City|iFlood 2\.0|Tuesday, 24 June" floodcontrol-frontend/src
Test-Path 'floodcontrol-frontend/public/assets/olongapo/logo-olongapo.png'
Test-Path 'floodcontrol-frontend/public/assets/olongapo/main-banner.png'
```

Expected: no product-context matches; both asset checks return `True`.

- [ ] **Step 2: Run all repository gates**

```powershell
npm run frontend:build
npm test
npm run typecheck
```

Expected: every command exits 0. Fix the first root-cause error and rerun the affected lane before continuing.

- [ ] **Step 3: Preview desktop and mobile states**

Run `npm run frontend:dev`, then inspect sign-in, demo access, navigation, mobile drawer, focus states, table overflow, select/input colors, map, alerts, dispatch/resolution, and forecast controls at desktop and mobile widths.

- [ ] **Step 4: Confirm the final diff**

Run `git status --short` and `git log -6 --oneline`. Expected: only intended redesign files are changed and all verification commands are green.
