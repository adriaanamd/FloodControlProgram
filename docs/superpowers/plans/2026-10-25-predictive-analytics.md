# Per-Sensor Predictive Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded predictive analytics values with per-sensor Holt forecasts over deterministic mock history and add a selectable all-sensor comparison table.

**Architecture:** Add a focused `entities/prediction` model layer for forecast periods, mock hourly histories, Holt's linear trend calculation, and selectors. Keep the existing dashboard workspace as the UI composition boundary; only its predictive branch consumes the new model.

**Tech Stack:** React 19, TypeScript, TanStack Start, Tailwind CSS 4, Vitest, pnpm, Node `>=22.23.4`.

## Global Constraints

- Preserve all non-predictive UI/UX and all existing mock sensor/alert records.
- Keep all predictive inputs local and deterministic; add no API, database, persistence, or live data.
- Use an actual Holt double-exponential smoothing algorithm; do not hardcode forecast chart points or summary metrics.
- Tests live in the separate `floodcontrol-tests/` package and must be written before production implementations.
- Do not add runtime shell execution, dynamic evaluation, decompression, or new dependencies.

---

### Task 1: Define the forecast contract with failing tests

**Files:**

- Create: `floodcontrol-tests/entities/prediction/holtForecast.test.ts`
- Create: `floodcontrol-tests/entities/prediction/forecastSelectors.test.ts`

**Interfaces:**

- Tests will consume `ForecastPeriod`, `holtLinearForecast`, `forecastSensor`, `getSensorForecast`, and `getForecastComparisonRows`.
- Production implementations do not exist yet; this task must be red.

- [ ] **Step 1: Write the algorithm contract test.**

Test a strictly increasing series and assert the result contains one point per requested horizon, a positive trend, a peak at the end of the forecast, bounded confidence, and non-negative uncertainty.

- [ ] **Step 2: Write the selector contract test.**

Assert every existing sensor gets a forecast for each period, a selected sensor lookup returns the selected ID, and comparison rows contain every sensor exactly once.

- [ ] **Step 3: Run the focused tests and verify the expected red failure.**

Run:

```powershell
corepack pnpm test --run entities/prediction/holtForecast.test.ts entities/prediction/forecastSelectors.test.ts
```

Expected: FAIL because the prediction model modules do not exist.

- [ ] **Step 4: Commit the red tests.**

```powershell
git add floodcontrol-tests/entities/prediction
git commit -m "test: define per-sensor forecast contracts"
```

### Task 2: Implement the deterministic Holt forecast model

**Files:**

- Create: `floodcontrol-frontend/src/entities/prediction/model/types.ts`
- Create: `floodcontrol-frontend/src/entities/prediction/model/mock.ts`
- Create: `floodcontrol-frontend/src/entities/prediction/model/forecast.ts`

**Interfaces:**

- `ForecastPeriod = '6 hours' | '24 hours' | '3 days' | '7 days'`.
- `holtLinearForecast(values: readonly number[], horizon: number, alpha?: number, beta?: number): HoltForecast`.
- `forecastSensor(sensor: Sensor, period: ForecastPeriod): SensorForecast`.

- [ ] **Step 1: Add typed periods and forecast result types.**

Define forecast points, risk, and the selected-sensor result without importing UI code.

- [ ] **Step 2: Add deterministic mock history.**

Create a stable hourly history for each existing sensor from its current mock level, trend, and a stable numeric seed. Keep the history local and deterministic; do not alter `entities/sensor/model/mock.ts`.

- [ ] **Step 3: Implement Holt's level/trend recurrence.**

For each observation `y[t]`, use:

```ts
level[t] = alpha * y[t] + (1 - alpha) * (level[t - 1] + trend[t - 1])
trend[t] = beta * (level[t] - level[t - 1]) + (1 - beta) * trend[t - 1]
forecast[t + h] = max(0, level[t] + h * trend[t])
```

Calculate residual RMSE, uncertainty, confidence, peak, and predicted severity from the resulting series.

- [ ] **Step 4: Run the focused tests and make them green.**

Run the Task 1 command. Expected: all focused tests pass.

- [ ] **Step 5: Run the complete test package.**

Run `corepack pnpm test` from `floodcontrol-tests`. Expected: all tests pass.

- [ ] **Step 6: Commit the model.**

```powershell
git add floodcontrol-frontend/src/entities/prediction floodcontrol-tests/entities/prediction
git commit -m "feat: add per-sensor Holt forecast model"
```

### Task 3: Add forecast selectors

**Files:**

- Create: `floodcontrol-frontend/src/entities/prediction/model/selectors.ts`
- Modify: `floodcontrol-tests/entities/prediction/forecastSelectors.test.ts`

**Interfaces:**

- `getSensorForecast(sensorId: string, period: ForecastPeriod): SensorForecast`.
- `getForecastComparisonRows(period: ForecastPeriod): readonly SensorForecast[]`.

- [ ] **Step 1: Extend tests for period changes and stable row ordering.**
- [ ] **Step 2: Implement selectors over the existing `sensors` list and prediction model.**
- [ ] **Step 3: Run the focused and complete tests.**
- [ ] **Step 4: Commit the selectors.**

```powershell
git add floodcontrol-frontend/src/entities/prediction/model/selectors.ts floodcontrol-tests/entities/prediction/forecastSelectors.test.ts
git commit -m "feat: add forecast selectors"
```

### Task 4: Replace the predictive branch with computed selected and comparison views

**Files:**

- Modify: `floodcontrol-frontend/src/widgets/dashboard-workspace/ui/DashboardWorkspace.tsx`

**Interfaces:**

- Consume `ForecastPeriod`, `forecastPeriods`, `getSensorForecast`, and `getForecastComparisonRows`.
- Keep `DashboardWorkspace({ tab }: { tab: string })` unchanged for all other tabs.

- [ ] **Step 1: Add predictive-tab sensor selection state.**

Initialize to `sensors[0].id`; keep selection local to the workspace so leaving/re-entering the tab preserves the existing mount behavior.

- [ ] **Step 2: Bind the existing period controls to `ForecastPeriod`.**

Use the selected period to retrieve a computed forecast and comparison rows.

- [ ] **Step 3: Bind the chart and summary card to selected-sensor output.**

Render the forecast points and uncertainty band from model output. Replace fixed 82 cm, 22:40, 87%, 14 streets, and 2,340 values with deterministic model-derived values while retaining the existing card structure and visual classes.

- [ ] **Step 4: Add the comparison table.**

Render every sensor row with its computed current level, projected peak, peak time, confidence, and risk. Make the row's sensor control accessible and selecting it update the main forecast.

- [ ] **Step 5: Run typecheck and tests.**

Run frontend typecheck plus the complete `floodcontrol-tests` suite. Expected: all pass.

- [ ] **Step 6: Commit the predictive UI.**

```powershell
git add floodcontrol-frontend/src/widgets/dashboard-workspace/ui/DashboardWorkspace.tsx
git commit -m "feat: make predictive analytics sensor-specific"
```

### Task 5: Verify the complete application gate

**Files:**

- No new production files.

- [ ] **Step 1: Run formatting.**

Run `corepack pnpm format` from `floodcontrol-frontend`, then inspect the diff for UI-class or literal changes.

- [ ] **Step 2: Run all local checks.**

```powershell
corepack pnpm --dir floodcontrol-tests test
corepack pnpm --dir floodcontrol-tests typecheck
corepack pnpm --dir floodcontrol-frontend typecheck
corepack pnpm --dir floodcontrol-frontend build
```

- [ ] **Step 3: Inspect the final diff.**

Confirm only the predictive tab and its model/test/doc files changed; existing non-predictive UI and mock entity records remain unchanged.

- [ ] **Step 4: Commit formatting and verification documentation if needed.**

```powershell
git status --short
git diff --check
```
