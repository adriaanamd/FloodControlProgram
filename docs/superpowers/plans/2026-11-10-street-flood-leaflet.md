# Street Flood Hotspots Leaflet Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dashboard’s CSS-only demo maps with a reusable Leaflet map that plots verified Olongapo street-level flood observations and separately labeled official drainage-mitigation segments.

**Architecture:** Keep flood locations as typed local mock data under the existing `entities` layer, with source URLs and approximate coordinate provenance embedded in every record. Render Leaflet imperatively inside a client-only widget so TanStack Start SSR remains safe, while sensor markers remain demo telemetry derived from their existing map positions.

**Tech Stack:** React 19, TanStack Start, Vite, TypeScript, Leaflet, OpenStreetMap tiles, Vitest.

## Global Constraints

- Keep dashboard product data local; do not add a live flood API or database.
- Preserve the existing Feature-Sliced import direction and in-app navigation.
- Use the canonical label `Apo Rotunda`; never use `Apo Torunda`.
- Mark coordinates as approximate when sourced from road/landmark geocoding rather than an official surveyed point.
- Run the smallest affected checks after each edit and the full local CI-equivalent checks before completion.

---

### Task 1: Add a tested street-flood data contract

**Files:**
- Create: `floodcontrol-tests/entities/flood/floodLocations.test.ts`
- Create: `floodcontrol-frontend/src/entities/flood/model/types.ts`
- Create: `floodcontrol-frontend/src/entities/flood/model/selectors.ts`
- Create: `floodcontrol-frontend/src/entities/flood/model/mock.ts`

**Interfaces:**
- Produces `FloodLocation`, `FloodLocationKind`, and `getFloodLocationsByKind()` for the map widget.
- Includes recent observed locations such as Apo Rotunda, Del Rosario Street/Bridge, Sta. Rita Bridge, Kalaklan Bridge, Filtration Road, Napalan Street, Labitan Street, and Dewey Avenue near San Roque Chapel.
- Includes official drainage-risk segments such as Kessing Street, W-1st Street, 20th Street, Fontaine Street, Jones Street, Arthur Street, Corpuz Street, and Rimas Street.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest"
import { floodLocations } from "../../../floodcontrol-frontend/src/entities/flood/model/mock"
import { getFloodLocationsByKind } from "../../../floodcontrol-frontend/src/entities/flood/model/selectors"

describe("flood location data", () => {
  it("keeps observed hotspots and drainage-risk segments separate", () => {
    expect(getFloodLocationsByKind(floodLocations, "observed-hotspot")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Rizal Avenue near Apo Rotunda" }),
      ]),
    )
    expect(
      getFloodLocationsByKind(floodLocations, "drainage-risk"),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Kessing Street drainage segment" }),
      ]),
    )
  })

  it("keeps every location within the Olongapo map bounds and uses source metadata", () => {
    expect(floodLocations.length).toBeGreaterThanOrEqual(10)
    expect(new Set(floodLocations.map((location) => location.id)).size).toBe(
      floodLocations.length,
    )
    expect(floodLocations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Rizal Avenue near Apo Rotunda",
          sourceUrl: expect.stringContaining("gmanetwork.com"),
          coordinateAccuracy: "approximate",
        }),
      ]),
    )
    for (const location of floodLocations) {
      expect(location.latitude).toBeGreaterThan(14.8)
      expect(location.latitude).toBeLessThan(14.9)
      expect(location.longitude).toBeGreaterThan(120.25)
      expect(location.longitude).toBeLessThan(120.34)
      expect(location.label).not.toContain("Torunda")
    }
  })
})
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `corepack pnpm --dir floodcontrol-tests test entities/flood/floodLocations.test.ts`

Expected: FAIL because the flood entity modules do not exist yet.

- [ ] **Step 3: Implement the minimal data model and source-backed records**

Define `FloodLocation` with `id`, `label`, `kind`, `roadSegment`, `area`, `latitude`, `longitude`, `coordinateAccuracy`, `evidence`, `sourceUrl`, and `verifiedAt`. Use the searched coordinates and store the source URL for each record. `getFloodLocationsByKind()` should return a new filtered array.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `corepack pnpm --dir floodcontrol-tests test entities/flood/floodLocations.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the data contract**

```powershell
git add floodcontrol-tests/entities/flood/floodLocations.test.ts floodcontrol-frontend/src/entities/flood/model docs/superpowers/plans/2026-11-10-street-flood-leaflet.md
git commit -m "feat: add sourced Olongapo street flood locations"
```

### Task 2: Add the reusable client-safe Leaflet widget

**Files:**
- Modify: `floodcontrol-frontend/package.json`
- Modify: `floodcontrol-frontend/pnpm-lock.yaml`
- Modify: `floodcontrol-frontend/src/app/styles/index.css`
- Create: `floodcontrol-frontend/src/widgets/flood-map/ui/FloodLeafletMap.tsx`

**Interfaces:**
- Consumes `FloodLocation[]`, `Sensor[]`, the visible sensor subset, and the selected sensor callback.
- Produces a fixed-height Leaflet map with OSM attribution, observed-hotspot markers, drainage-risk markers, and demo sensor markers.

- [ ] **Step 1: Add Leaflet dependencies**

Run: `corepack pnpm --dir floodcontrol-frontend add leaflet && corepack pnpm --dir floodcontrol-frontend add -D @types/leaflet`

- [ ] **Step 2: Import Leaflet CSS**

Add `@import 'leaflet/dist/leaflet.css';` to `src/app/styles/index.css` without changing the existing theme values.

- [ ] **Step 3: Implement the widget**

Use `useEffect` plus `import("leaflet")` so Leaflet is loaded only in the browser. Initialize the map at `[14.839, 120.284]`, add an OSM tile layer with attribution, clear and redraw layer groups when props change, and remove the map on unmount. Use `circleMarker` and `divIcon`/HTML-free circles so no Leaflet image asset path is required. Popups must show the street label, area, evidence, and source link.

- [ ] **Step 4: Run frontend checks**

Run: `corepack pnpm --dir floodcontrol-frontend typecheck`

Expected: PASS with no SSR or Leaflet type errors.

### Task 3: Replace both dashboard demo maps

**Files:**
- Modify: `floodcontrol-frontend/src/widgets/dashboard-overview/ui/DashboardOverview.tsx`
- Modify: `floodcontrol-frontend/src/widgets/dashboard-workspace/ui/DashboardWorkspace.tsx`

**Interfaces:**
- `DashboardOverview` passes its filtered sensors, selected sensor, and selection callback to `FloodLeafletMap`.
- `DashboardWorkspace` passes its filtered sensors and selected sensor state to the same widget.

- [ ] **Step 1: Replace the overview SVG map**

Keep the existing map header, selected-sensor detail panel, and filter controls. Replace only the CSS grid/SVG/absolute sensor marker area with `FloodLeafletMap`, passing `floodLocations` and `visibleSensors`.

- [ ] **Step 2: Replace the Live Map workspace SVG**

Keep the existing workspace filters and right-hand sensor detail card. Replace the fake SVG map with the shared Leaflet widget and preserve sensor selection behavior.

- [ ] **Step 3: Add flood-layer legend copy**

Show `Observed flood hotspot` and `Official drainage-risk segment` in the map legend, with source-backed wording that does not call drainage projects confirmed flood events.

- [ ] **Step 4: Run focused and full checks**

Run:

```powershell
corepack pnpm --dir floodcontrol-tests test entities/flood/floodLocations.test.ts
corepack pnpm --dir floodcontrol-frontend typecheck
corepack pnpm --dir floodcontrol-frontend build
corepack pnpm --dir floodcontrol-tests test
corepack pnpm --dir floodcontrol-frontend format
```

Expected: all commands pass; no existing test coverage is removed or weakened.

- [ ] **Step 5: Commit the integration**

```powershell
git add floodcontrol-frontend/package.json floodcontrol-frontend/pnpm-lock.yaml floodcontrol-frontend/src/app/styles/index.css floodcontrol-frontend/src/widgets/flood-map floodcontrol-frontend/src/widgets/dashboard-overview/ui/DashboardOverview.tsx floodcontrol-frontend/src/widgets/dashboard-workspace/ui/DashboardWorkspace.tsx
git commit -m "feat: integrate street flood hotspots with Leaflet"
```

## Self-review checklist

- [x] Covers street-based observed hotspots and official mitigation segments.
- [x] Keeps current mock telemetry local and does not add a flood API.
- [x] Preserves the existing dashboard navigation and sensor selection behavior.
- [x] Includes a failing data test before production modules are implemented.
- [x] Calls out approximate coordinate provenance and the Apo Rotunda correction.
