# Overview Analytics Design

## Goal

Make the Overview page a chart-led operations summary for Olongapo City flood response, while keeping the full Leaflet map, sensor network table, and forecast comparison in the Workspace.

## Visual direction

The page keeps the existing Industrial fieldboard direction: warm-black surfaces, monospaced/tabular data, hairline rules, green signal accents, amber warning accents, and red critical accents. The differentiator is a compact monitoring grid where each chart includes a visible current-value readout and threshold context, so operators can scan trends without opening the detailed Workspace.

## Information hierarchy

1. **Header and KPI strip**
   - Preserve the current page heading, sensor filter, and four KPI values.
   - Keep labels explicit about demo/local data where the values are not live.

2. **Overview chart grid**
   - **Citywide water level:** a 24-hour line chart derived from the existing `sensorHistories`, showing the aggregate average and the highest observed sensor level. The current level and highest sensor are shown as text alongside the chart.
   - **Alert activity:** a compact severity breakdown derived from `alerts` and `getActiveAlerts`, using labeled Critical, Warning, and Watch counts. The chart must retain text labels so color is not the only signal.
   - **Sensor status:** a distribution view derived from `sensors`, showing Critical, Warning, Watch, and Normal counts with the total sensor count.
   - **Two-hour forecast:** retain the existing forecast visual, but derive its values from the existing prediction model rather than a standalone hard-coded bar array. Show forecast confidence and the selected/highest-risk sensor label.

3. **Operational context rail**
   - Keep the active-alert queue and acknowledgement action visible beside the charts.
   - Add a compact “Sensors needing attention” list with the highest-level Critical and Warning sensors, their street labels, levels, and current trends.
   - Keep the selected-sensor detail card as the interaction target when a sensor marker is selected.

4. **Geographic context and readiness**
   - Keep a reduced live hotspot map preview so the Overview still answers “where?”, but make it visually secondary to the charts.
   - Preserve sensor health and response readiness below the primary grid.
   - The full map, all map layers, sensor table, and forecast comparison remain in the Workspace.

## Data and component boundaries

- All values remain local deterministic mock data. No live API, database, persistence, analytics service, or new chart dependency is introduced.
- Add pure selectors under `floodcontrol-frontend/src/entities/overview/model/` for:
  - aggregating the citywide history series;
  - counting alerts by severity;
  - counting sensors by state;
  - selecting the attention list;
  - deriving the two-hour forecast series from the existing prediction model.
- Add a focused `OverviewAnalytics` widget under `floodcontrol-frontend/src/widgets/overview-analytics/ui/` for chart cards and the attention list. `DashboardOverview` composes the widget with the existing alert, map, and readiness sections.
- Charts use SVG and existing CSS tokens, with no new runtime dependency. Each chart provides a readable label/value summary for non-visual users and narrow screens.
- Keep `FloodLeafletMap` as the geographic map implementation. Its existing explicit-coordinate and malformed-coordinate guard remains unchanged.

## Interaction and responsive behavior

- The sensor filter continues to affect KPI values, chart aggregations, the attention list, and the map’s visible demo sensors.
- Clicking a sensor marker continues to update the selected-sensor card.
- On wide screens, the chart grid uses two columns with the operational context rail alongside it. On narrow screens, cards stack in priority order: water level, alerts, sensor status, forecast, attention list, map preview, readiness.
- The alert acknowledgement action keeps its existing behavior and updates the active-alert count and alert chart.

## Content and accessibility

- Use real local domain labels such as street names, sensor IDs, alert severities, and Olongapo locations; mark demo/model values as demo where appropriate.
- Use text labels, patterns, and line styles in addition to color for severity.
- Give every chart a meaningful heading and an accessible summary. Avoid decorative charts without a corresponding value or operational interpretation.
- Preserve the existing keyboard-accessible buttons and Leaflet attribution.

## Testing requirements

- Add selector tests for aggregate water-level series, alert severity counts, sensor-state counts, attention ordering, and forecast series extraction.
- Add component-contract tests for the Overview copy/sections so the chart-led structure and sensor attention list do not regress.
- Run the existing full Vitest suite, frontend typecheck, formatter check, production client/SSR build, and `git diff --check`.
