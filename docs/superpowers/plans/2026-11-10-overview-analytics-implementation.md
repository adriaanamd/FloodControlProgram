# Overview Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Turn the Overview page into a chart-led Olongapo flood-operations summary with sensor attention data, while keeping detailed mapping and analysis in the Workspace.

**Architecture:** Add pure overview selectors for aggregate histories, alert counts, sensor-state counts, attention ordering, and short forecast data. Render those values through a focused OverviewAnalytics widget using inline SVG/CSS charts, then compose that widget in DashboardOverview above the reduced map/context section.

**Tech Stack:** React 19, TypeScript, TanStack Start/Vite, Tailwind CSS 4, inline SVG, Vitest, oxfmt.

## Global Constraints

- Use existing local deterministic mock data; do not add live APIs, databases, persistence, analytics services, or chart dependencies.
- Preserve the Industrial fieldboard direction: warm-black surfaces, monospaced/tabular numerics, hairline rules, green signal, amber warning, and red critical accents.
- Preserve existing navigation, Leaflet explicit-coordinate behavior, sensor filtering, alert acknowledgement, and workspace tabs.
- Use Node >=22.23.4 and the existing Corepack/pnpm commands.
- Keep every chart accessible through a heading, text summary, and labels that do not depend on color alone.
- Keep the existing sensor-coordinate regression changes in the working tree; do not revert or overwrite them.

---

### Task 1: Add pure Overview analytics selectors

**Files:**
- Create: floodcontrol-frontend/src/entities/overview/model/types.ts
- Create: floodcontrol-frontend/src/entities/overview/model/selectors.ts
- Create: floodcontrol-tests/entities/overview/overviewSelectors.test.ts

**Interfaces:**
- OverviewSeriesPoint = { label: string; average: number; peak: number }
- OverviewCount = { label: string; value: number; tone: "critical" | "warning" | "watch" | "normal" | "signal" }
- OverviewForecastPoint = { label: string; value: number; lower?: number; upper?: number }
- getCitywideHistory(sensors, histories): readonly OverviewSeriesPoint[]
- getAlertCounts(alerts, acknowledged): readonly OverviewCount[]
- getSensorStateCounts(sensors): readonly OverviewCount[]
- getAttentionSensors(sensors, limit): readonly Sensor[]
- getOverviewForecast(currentLevel, forecast, horizon): readonly OverviewForecastPoint[]

- [ ] Step 1: Write the failing selector tests.

Use the existing sensors, alerts, sensorHistories, and getSensorForecast fixtures:

~~~ts
it("aggregates each history hour into average and peak series points", () => {
  const series = getCitywideHistory(sensors, sensorHistories)
  expect(series).toHaveLength(24)
  expect(series[0]).toMatchObject({ label: "-23h" })
  expect(series.at(-1)?.label).toBe("Now")
  expect(series.at(-1)?.peak).toBe(68)
})

it("counts alerts and sensors in stable severity order", () => {
  expect(getAlertCounts(alerts, false).map((item) => item.label)).toEqual([
    "Critical",
    "Warning",
    "Watch",
  ])
  expect(getSensorStateCounts(sensors).map((item) => item.label)).toEqual([
    "Critical",
    "Warning",
    "Watch",
    "Normal",
  ])
})

it("orders attention sensors by severity and descending level", () => {
  const result = getAttentionSensors(sensors, 4)
  expect(result.map((sensor) => sensor.id)).toEqual([
    "IF-042",
    "IF-017",
    "IF-034",
    "IF-014",
  ])
})

it("returns Now plus the requested forecast horizon", () => {
  const forecast = getSensorForecast("IF-042", "6 hours")
  expect(getOverviewForecast(68, forecast, 2).map((point) => point.label)).toEqual([
    "Now",
    "+1 hr",
    "+2 hrs",
  ])
})
~~~

- [ ] Step 2: Run the selector test and verify the expected failure.

Run:

~~~powershell
corepack pnpm --dir floodcontrol-tests test -- entities/overview/overviewSelectors.test.ts
~~~

Expected: FAIL because the overview model modules and selector exports do not exist yet.

- [ ] Step 3: Implement the selector types and pure functions.

getCitywideHistory must ignore missing sensor history entries, calculate the mean and maximum for each hour, round both to two decimals, and label the 24 points -23h through Now. Count selectors must return the exact severity/state orders from the tests. getAttentionSensors must sort by Critical, Warning, Watch, Normal, then descending level, and slice to limit. getOverviewForecast must return the current value followed by the first horizon forecast points and preserve forecast bounds.

Use this stable ordering:

~~~ts
const priority: Record<SensorState, number> = {
  Critical: 0,
  Warning: 1,
  Watch: 2,
  Normal: 3,
}
~~~

- [ ] Step 4: Run the focused test and confirm it passes.

Run the same command from Step 2. Expected: all selector assertions pass.

- [ ] Step 5: Commit the selector unit.

~~~powershell
git add -- floodcontrol-frontend/src/entities/overview floodcontrol-tests/entities/overview/overviewSelectors.test.ts
git commit -m "feat: add overview analytics selectors"
~~~

---

### Task 2: Build the chart-led OverviewAnalytics widget

**Files:**
- Create: floodcontrol-frontend/src/widgets/overview-analytics/ui/OverviewAnalytics.tsx
- Create: floodcontrol-tests/visual/overviewAnalytics.test.ts

**Interfaces:**

~~~ts
type OverviewAnalyticsProps = {
  history: readonly OverviewSeriesPoint[]
  alertCounts: readonly OverviewCount[]
  sensorCounts: readonly OverviewCount[]
  forecast: readonly OverviewForecastPoint[]
  forecastConfidence: number
  forecastSensorLabel: string
  attentionSensors: readonly Sensor[]
}
~~~

- [ ] Step 1: Write the failing visual contract test.

Read the widget source with the existing readFileSync contract-test pattern and require the headings Citywide water level, Alert activity, Sensor status, Two-hour forecast, and Sensors needing attention, plus aria-label and <svg>.

- [ ] Step 2: Run the visual contract test and verify it fails.

~~~powershell
corepack pnpm --dir floodcontrol-tests test -- visual/overviewAnalytics.test.ts
~~~

Expected: FAIL because the widget source does not exist yet.

- [ ] Step 3: Implement the widget with inline SVG/CSS charts.

Render four bordered cards and an attention list. The widget must expose an accessible section and chart labels:

~~~tsx
<section aria-label="Overview analytics" className="grid gap-5 xl:grid-cols-2">
  <ChartCard title="Citywide water level" summary="24-hour aggregate sensor history">
    <LineChart ariaLabel="Citywide water-level trend for the last 24 hours" points={history} />
  </ChartCard>
  <ChartCard title="Alert activity" summary="Active alerts by severity">
    <BarChart ariaLabel="Active alerts by severity" values={alertCounts} />
  </ChartCard>
  <ChartCard title="Sensor status" summary="Sensors in the local demo network">
    <StatusChart ariaLabel="Sensor status distribution" values={sensorCounts} />
  </ChartCard>
  <ChartCard title="Two-hour forecast" summary={forecastSensorLabel}>
    <ForecastChart ariaLabel="Two-hour flood-risk forecast" points={forecast} />
  </ChartCard>
</section>
~~~

Use viewBox="0 0 320 128", deterministic scaling, existing CSS tokens, text legends, and no new runtime dependency. The line chart scales average/peak against the series maximum; bar heights scale against the largest count; forecast geometry uses supplied values and bounds. The attention list must show sensor ID, street, level, trend, and state, with a readable empty state.

- [ ] Step 4: Run the visual contract test and confirm it passes.

Run the same command from Step 2. Expected: the contract test passes.

- [ ] Step 5: Commit the widget.

~~~powershell
git add -- floodcontrol-frontend/src/widgets/overview-analytics floodcontrol-tests/visual/overviewAnalytics.test.ts
git commit -m "feat: add chart-led overview analytics widget"
~~~

---

### Task 3: Compose analytics, sensors, and map context in DashboardOverview

**Files:**
- Modify: floodcontrol-frontend/src/widgets/dashboard-overview/ui/DashboardOverview.tsx
- Modify: floodcontrol-tests/visual/olongapoFieldboard.test.ts

**Interfaces:**
- Import sensorHistories from entities/prediction/model/mock.
- Import getSensorForecast from entities/prediction/model/selectors.
- Import the overview selectors from entities/overview/model/selectors.
- Render OverviewAnalytics with derived values from visibleSensors, alerts, acknowledged, and selectedSensor.

- [ ] Step 1: Add the Overview composition contract.

Extend the visual contract test to require the Overview source to import OverviewAnalytics and include Citywide water level, Sensor status, and Sensors needing attention through the widget composition.

- [ ] Step 2: Run the contract test and verify it fails.

~~~powershell
corepack pnpm --dir floodcontrol-tests test -- visual/olongapoFieldboard.test.ts
~~~

Expected: FAIL until DashboardOverview composes the new widget.

- [ ] Step 3: Integrate the derived analytics data.

Inside DashboardOverview, derive the selected six-hour forecast and chart data:

~~~tsx
const selectedForecast = getSensorForecast(selectedSensor.id, "6 hours")
const overviewForecast = getOverviewForecast(
  selectedSensor.level,
  selectedForecast,
  2,
)
~~~

Render OverviewAnalytics immediately after the KPI strip. Pass citywide history, alert counts, sensor-state counts, overviewForecast, selectedForecast.confidence, selectedSensor.street, and the four-item attention list. Keep the active-alert queue, selected-sensor card, reduced map preview, sensor health, and response readiness. Remove the duplicate hard-coded forecast bar card so the forecast has one source of truth. Reduce the map preview height to 22rem on large screens so charts are visually primary.

- [ ] Step 4: Run the composition contract and focused tests.

~~~powershell
corepack pnpm --dir floodcontrol-tests test -- visual/olongapoFieldboard.test.ts
corepack pnpm --dir floodcontrol-tests test -- entities/overview/overviewSelectors.test.ts visual/overviewAnalytics.test.ts visual/olongapoFieldboard.test.ts
~~~

Expected: all focused tests pass.

- [ ] Step 5: Commit the Overview composition.

~~~powershell
git add -- floodcontrol-frontend/src/widgets/dashboard-overview/ui/DashboardOverview.tsx floodcontrol-tests/visual/olongapoFieldboard.test.ts
git commit -m "feat: compose analytics into dashboard overview"
~~~

---

### Task 4: Run the complete local quality gate

**Files:**
- Verify all modified frontend and test files from Tasks 1–3.

- [ ] Step 1: Run the full test suite.

~~~powershell
corepack pnpm --dir floodcontrol-tests test
~~~

Expected: every test file passes with zero failures.

- [ ] Step 2: Run typecheck, formatting, build, and diff checks.

~~~powershell
corepack pnpm --dir floodcontrol-frontend typecheck
corepack pnpm --dir floodcontrol-frontend format
corepack pnpm --dir floodcontrol-frontend build
git diff --check
~~~

If the repository formatter touches unrelated files, restore only formatter-only unrelated changes with apply_patch; do not use destructive Git reset/checkout commands.

- [ ] Step 3: Run the production server smoke check.

Start the existing server on a free local port, request /, verify HTTP 200 and the Olongapo page title, then stop the server cleanly.

- [ ] Step 4: Review final status.

~~~powershell
git status --short
git diff --stat
git diff --check
~~~

Confirm the chart-led Overview, selector tests, widget contract tests, and existing sensor-coordinate fix are the only intended changes. Do not push unless explicitly requested after review.
