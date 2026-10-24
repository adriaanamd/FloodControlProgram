# Per-Sensor Predictive Analytics Design

## Goal

Replace the predictive analytics tab's hardcoded citywide chart and summary values with actual per-sensor forecasts computed from local mock time-series data, while preserving the existing dashboard visual language and leaving all other tabs unchanged.

## Requirements

- The selected sensor is the primary forecast view.
- A comparison table lists the computed forecast for every sensor and can select the primary sensor.
- The existing period controls remain: 6 hours, 24 hours, 3 days, and 7 days.
- All observations remain deterministic local mock data. No API, database, persistence, or live data is added.
- The predictive result must come from an actual forecasting algorithm, not hardcoded chart points or fixed summary values.
- Existing non-predictive tabs, shared mock records, visual tokens, and interaction behavior remain unchanged.

## Algorithm

Each sensor receives a deterministic hourly mock history derived from its existing mocked current level, trend, and a stable sensor-specific variation seed. The history is input data only; it is not presented as live data.

The forecast uses Holt's linear trend method (double exponential smoothing), which estimates a smoothed level and trend and projects each future hour. The implementation uses fixed local parameters (`alpha = 0.45`, `beta = 0.25`) so the same mock input always produces the same output.

For each selected period, the model returns:

- hourly forecast points;
- projected peak level and the hour it occurs;
- model residual RMSE and a bounded confidence percentage derived from residual error;
- an uncertainty band derived from RMSE and forecast horizon;
- predicted risk based on the existing flood-level severity thresholds.

This is intentionally a transparent, dependency-free time-series model appropriate for the mock dashboard. It is not presented as a trained production model.

## UI composition

The existing predictive analytics layout remains the base:

- Keep the page heading and period buttons.
- Add a compact sensor selector beside the period controls.
- Bind the existing forecast chart to the selected sensor and period, including its labels, line, area, threshold, and uncertainty band.
- Bind the existing peak summary card to the selected sensor's computed peak, forecast time, confidence, and impact values.
- Keep the forecast-input card, but show the selected sensor's mock history/model inputs.
- Add a responsive `Sensor forecast comparison` table below the cards. Each row shows sensor ID/location, current level, projected peak, peak time, confidence, and predicted risk. Selecting a row updates the primary chart.

The table is an addition scoped to this tab. No dashboard-wide navigation, colors, spacing system, or mock-data policy changes.

## FSD boundaries

- `entities/prediction/model/types.ts` owns forecast types and period definitions.
- `entities/prediction/model/mock.ts` owns deterministic local histories and model parameters.
- `entities/prediction/model/forecast.ts` owns the Holt forecast algorithm and derived metrics.
- `entities/prediction/model/selectors.ts` owns period/sensor lookup and comparison-row projection.
- `widgets/dashboard-workspace/ui/DashboardWorkspace.tsx` owns only predictive-tab composition and interaction state.

## Testing

Tests in `floodcontrol-tests/` are written first:

- known linear input produces the expected Holt projection;
- forecast output changes with period and is non-empty for every sensor;
- comparison rows include every mocked sensor and select stable IDs;
- risk/confidence/uncertainty stay within their declared bounds.

The full gate remains the existing test suite, both package typechecks, formatter, and TanStack Start production build.
