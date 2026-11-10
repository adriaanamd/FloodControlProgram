import { useState, type CSSProperties } from "react"
import { alerts } from "../../../entities/alert/model/mock"
import {
  forecastPeriods,
  holtParameters,
} from "../../../entities/prediction/model/forecast"
import {
  getForecastComparisonRows,
  getSensorForecast,
} from "../../../entities/prediction/model/selectors"
import { sensorHistories } from "../../../entities/prediction/model/mock"
import type { ForecastPeriod } from "../../../entities/prediction/model/types"
import { sensors } from "../../../entities/sensor/model/mock"
import { severityStyles } from "../../../entities/sensor/model/severityStyles"
import { Button } from "../../../shared/ui/Button"
import { Icon } from "../../../shared/ui/Icon"
import { PageHeading } from "../../../shared/ui/PageHeading"
import { Row } from "../../../shared/ui/Row"

const filterItems = [
  "All",
  "Critical",
  "Warning",
  "Watch",
  "District 1",
  "District 2",
  "District 3",
  "District 4",
  "District 5",
]

const controlClass =
  "border border-[var(--rule)] px-3 py-2 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)] hover:border-[var(--rule-strong)] hover:text-white"

const activeControlClass =
  "border border-[var(--signal)] bg-[var(--signal)] px-3 py-2 text-[10px] uppercase tracking-[0.08em] text-[var(--surface-deep)]"

const panelClass = "border border-[var(--rule)] bg-[var(--surface-raised)]"

export function DashboardWorkspace({ tab }: { tab: string }) {
  const [view, setView] = useState("All")
  const [selected, setSelected] = useState(sensors[0])
  const [period, setPeriod] = useState<ForecastPeriod>("24 hours")
  const [predictionSensorId, setPredictionSensorId] = useState(sensors[0].id)
  const [alertState, setAlertState] = useState<Record<number, string>>({})
  const filtered =
    view === "All"
      ? sensors
      : sensors.filter((item) => item.state === view || item.zone === view)

  const title: Record<string, [string, string]> = {
    "Live Map": [
      "Citywide live map",
      "Street-level readings from IoT sensors across five districts",
    ],
    "Sensor Network": [
      "IoT sensor network",
      "Monitor connectivity, power, calibration, and maintenance",
    ],
    "Predictive Analytics": [
      "Predictive analytics",
      "Short-term per-sensor forecasts using historical water-level trends",
    ],
    "Alert Management": [
      "Alert management",
      "Triage incidents, assign responders, and track resolution",
    ],
  }

  if (tab === "Live Map")
    return (
      <div>
        <PageHeading
          title={title[tab][0]}
          subtitle={title[tab][1]}
          action="Export map"
        />
        <div className="mb-4 flex flex-wrap gap-2">
          {filterItems.map((item) => (
            <Button
              key={item}
              onClick={() => setView(item)}
              className={view === item ? activeControlClass : controlClass}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <article className="relative min-h-[42rem] overflow-hidden border border-[var(--rule)] bg-[#10140f]">
            <div className="map-grid absolute inset-0 opacity-70" />
            <svg
              className="absolute inset-0 size-full opacity-60"
              viewBox="0 0 900 700"
              preserveAspectRatio="none"
            >
              <g fill="none" stroke="#414c3e" strokeWidth="10">
                <path d="M-30 130C170 70 300 190 490 120s280 20 450 0" />
                <path d="M120-20c20 210 100 330 20 750M650-20c-90 210-40 440 100 750" />
                <path d="M-20 510c220-90 340 10 510-70s290 20 450-30" />
              </g>
              <g fill="none" stroke="#2a3328" strokeWidth="4">
                <path d="M-20 300h950M350-20v750M820-20 700 730M20 30l850 610M250-20 540 730M-20 650 880 30" />
              </g>
              <path
                d="M-10 390c170-120 290 100 450-10S700 270 940 100"
                fill="none"
                stroke="#8b6700"
                strokeWidth="24"
                opacity=".6"
              />
            </svg>
            {filtered.map((sensor) => (
              <Button
                key={sensor.id}
                ariaLabel={`Select ${sensor.id}`}
                onClick={() => setSelected(sensor)}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={
                  { left: `${sensor.x}%`, top: `${sensor.y}%` } as CSSProperties
                }
              >
                <span
                  className={`absolute inset-0 animate-ping rounded-full opacity-20 ${severityStyles[sensor.state].split(" ")[0]}`}
                />
                <span
                  className={`relative grid size-8 place-items-center rounded-full border-4 border-[#10140f] ${severityStyles[sensor.state]}`}
                >
                  <Icon name="droplet" className="size-3" />
                </span>
              </Button>
            ))}
            <div className="absolute bottom-4 left-4 border border-[var(--rule-strong)] bg-[var(--surface-deep)]/95 p-3 text-xs">
              <div className="mb-2 font-display text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
                Map legend · demo telemetry
              </div>
              <div className="flex flex-wrap gap-3">
                {(["Critical", "Warning", "Watch", "Normal"] as const).map(
                  (status) => (
                    <span
                      key={status}
                      className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]"
                    >
                      <span
                        className={`size-2 rounded-full ${severityStyles[status].split(" ")[0]}`}
                      />
                      {status}
                    </span>
                  ),
                )}
              </div>
            </div>
          </article>
          <div className="space-y-4">
            <article className={`${panelClass} p-5`}>
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${severityStyles[selected.state]}`}
                >
                  {selected.state}
                </span>
                <span className="text-[10px] text-[var(--text-dim)]">
                  {selected.id}
                </span>
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-white">
                {selected.street}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">{selected.zone}</p>
              <p className="mt-6 font-display text-4xl font-semibold text-white">
                {selected.level}
                <span className="ml-1 text-sm font-normal text-[var(--text-dim)]">
                  cm
                </span>
              </p>
              <div className="mt-5 space-y-3 border-t border-[var(--rule)] pt-4 text-sm">
                <Row label="Rate of change" value={selected.trend} />
                <Row label="Signal quality" value="Excellent · 94%" />
                <Row label="Last reading" value="12 sec ago" />
                <Row label="Battery" value="87%" />
              </div>
              <Button className="mt-5 w-full border border-[var(--signal)] bg-[var(--signal)] py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--surface-deep)] hover:bg-[#ffd166]">
                Open sensor history
              </Button>
            </article>
            <article className={`${panelClass} p-5`}>
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-white">
                Map layers
              </h2>
              {["Flood depth", "Road closures", "Evacuation centers", "Drainage network"].map(
                (layer, i) => (
                  <div
                    key={layer}
                    className="mt-3 flex items-center justify-between text-sm text-[var(--text-muted)]"
                  >
                    <span>{layer}</span>
                    <span
                      className={`h-5 w-9 border border-[var(--rule)] p-0.5 ${
                        i < 2 ? "bg-[var(--signal)]" : "bg-[var(--surface-deep)]"
                      }`}
                    >
                      <span
                        className={`block size-4 bg-[var(--surface-deep)] transition ${
                          i < 2 ? "translate-x-4" : ""
                        }`}
                      />
                    </span>
                  </div>
                ),
              )}
            </article>
          </div>
        </div>
      </div>
    )

  if (tab === "Sensor Network")
    return (
      <div>
        <PageHeading
          title={title[tab][0]}
          subtitle={title[tab][1]}
          action="Register sensor"
        />
        <div className="mb-5 grid grid-cols-2 divide-x divide-y divide-[var(--rule)] border border-[var(--rule)] bg-[var(--surface-raised)] lg:grid-cols-4 lg:divide-y-0">
          {[
            ["48", "Online", "text-[var(--signal)]"],
            ["1", "Offline", "text-[var(--danger)]"],
            ["1", "Low battery", "text-[#ffd166]"],
            ["99.2%", "Network uptime", "text-[var(--signal)]"],
          ].map(([value, label, color]) => (
            <article key={label} className="p-4">
              <p className={`font-display text-2xl font-semibold ${color}`}>
                {value}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[var(--text-dim)]">
                {label}
              </p>
            </article>
          ))}
        </div>
        <article className={`${panelClass} overflow-hidden`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule)] p-4">
            <div className="flex flex-wrap gap-2">
              {["All", "District 1", "District 2", "District 3", "District 4", "District 5"].map(
                (item) => (
                  <Button
                    key={item}
                    onClick={() => setView(item)}
                    className={
                      view === item
                        ? "bg-[var(--signal)] px-3 py-2 text-[10px] uppercase tracking-[0.08em] text-[var(--surface-deep)]"
                        : "bg-[var(--surface-deep)] px-3 py-2 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)] hover:text-white"
                    }
                  >
                    {item}
                  </Button>
                ),
              )}
            </div>
            <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--text-dim)]">
              {filtered.length} devices · demo telemetry
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[var(--surface-deep)] text-[10px] uppercase tracking-[0.08em] text-[var(--text-dim)]">
                <tr>
                  <th className="px-5 py-3 font-medium">Sensor</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Water level</th>
                  <th className="px-5 py-3 font-medium">Signal</th>
                  <th className="px-5 py-3 font-medium">Battery</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--rule)]">
                {filtered.map((sensor, index) => (
                  <tr key={sensor.id} className="hover:bg-[var(--surface-elevated)]">
                    <td className="px-5 py-4 font-medium text-white">{sensor.id}</td>
                    <td className="px-5 py-4">
                      <p className="text-[var(--text-muted)]">{sensor.street}</p>
                      <p className="text-[10px] text-[var(--text-dim)]">{sensor.zone}</p>
                    </td>
                    <td className="px-5 py-4 text-[var(--text-muted)]">{sensor.level} cm</td>
                    <td className="px-5 py-4 text-[var(--signal)]">{92 - (index % 8)}%</td>
                    <td className="px-5 py-4 text-[var(--text-muted)]">
                      {index === 7 ? "16%" : `${96 - index * 3}%`}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${
                          sensor.state === "Critical"
                            ? "border-[var(--danger)] text-[var(--danger)]"
                            : "border-[var(--rule-strong)] text-[var(--signal)]"
                        }`}
                      >
                        {index === 9 ? "Needs service" : "Online"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    )

  if (tab === "Predictive Analytics") {
    const selectedPredictionSensor =
      sensors.find((sensor) => sensor.id === predictionSensorId) ?? sensors[0]
    const predictiveForecast = getSensorForecast(
      selectedPredictionSensor.id,
      period,
    )
    const comparisonRows = getForecastComparisonRows(period)
    const chartMax = Math.max(
      80,
      ...predictiveForecast.points.map((point) => point.upper),
    )
    const chartPoints = predictiveForecast.points
      .map(
        (point, index) =>
          `${(index / Math.max(predictiveForecast.points.length - 1, 1)) * 800},${260 - (point.value / chartMax) * 230}`,
      )
      .join(" ")
    const lowerPoints = predictiveForecast.points
      .map(
        (point, index) =>
          `${(index / Math.max(predictiveForecast.points.length - 1, 1)) * 800},${260 - (point.lower / chartMax) * 230}`,
      )
      .join(" ")
    const upperPoints = predictiveForecast.points
      .map((point, index) => {
        const reverseIndex = predictiveForecast.points.length - index - 1
        return `${(reverseIndex / Math.max(predictiveForecast.points.length - 1, 1)) * 800},${260 - (point.upper / chartMax) * 230}`
      })
      .join(" ")
    const uncertaintyPoints = `${lowerPoints} ${upperPoints}`
    const forecastAreaPoints = `0,280 ${chartPoints} 800,280`
    const timelineLabels =
      period === "6 hours"
        ? ["Now", "+2h", "+4h", "+6h"]
        : period === "24 hours"
          ? ["Now", "+6h", "+12h", "+18h", "+24h"]
          : period === "3 days"
            ? ["Now", "+18h", "+36h", "+54h", "+72h"]
            : ["Now", "+42h", "+84h", "+126h", "+168h"]
    const historyCount =
      sensorHistories[selectedPredictionSensor.id]?.length ?? 0

    return (
      <div>
        <PageHeading
          title={title[tab][0]}
          subtitle={title[tab][1]}
          action="Download report"
        />
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div className="flex gap-2">
            {forecastPeriods.map((item) => (
              <Button
                key={item}
                onClick={() => setPeriod(item)}
                className={period === item ? activeControlClass : controlClass}
              >
                {item}
              </Button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Forecast sensor
            <select
              value={predictionSensorId}
              onChange={(event) => setPredictionSensorId(event.target.value)}
              className="border border-[var(--rule)] bg-[var(--surface-deep)] px-3 py-2 text-[10px] text-[var(--text-muted)] outline-none focus:border-[var(--signal)]"
            >
              {sensors.map((sensor) => (
                <option key={sensor.id} value={sensor.id}>
                  {sensor.id} · {sensor.street}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <article className={`${panelClass} p-5`}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-white">
                  Water-level forecast
                </h2>
                <p className="mt-1 text-[10px] text-[var(--text-dim)]">
                  {selectedPredictionSensor.id} · {selectedPredictionSensor.street} · {period} · demo model
                </p>
              </div>
              <span
                className={`px-3 py-1 text-[10px] uppercase tracking-[0.08em] ${severityStyles[predictiveForecast.risk]}`}
              >
                {predictiveForecast.risk} risk
              </span>
            </div>
            <div className="relative mt-8 h-72 border-b border-l border-[var(--rule)]">
              <svg
                className="size-full"
                viewBox="0 0 800 280"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="prediction-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ffb800" stopOpacity=".35" />
                    <stop offset="1" stopColor="#ffb800" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon points={uncertaintyPoints} fill="#ffb800" fillOpacity=".08" />
                <polygon points={forecastAreaPoints} fill="url(#prediction-area)" />
                <line
                  x1="0"
                  x2="800"
                  y1={260 - (60 / chartMax) * 230}
                  y2={260 - (60 / chartMax) * 230}
                  stroke="#ff4d3d"
                  strokeDasharray="6 6"
                  strokeOpacity=".65"
                />
                <polyline points={chartPoints} fill="none" stroke="#ffb800" strokeWidth="4" />
                <text
                  x="795"
                  y={Math.max(14, 255 - (60 / chartMax) * 230)}
                  fill="#ff8b7f"
                  fontSize="10"
                  textAnchor="end"
                >
                  Critical threshold
                </text>
              </svg>
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-[var(--text-dim)]">
              {timelineLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </article>
          <div className="space-y-4">
            <article className="fieldboard-surface border border-[var(--rule-strong)] bg-[var(--signal-soft)] p-5">
              <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
                Peak projected level
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-white">
                {Math.round(predictiveForecast.peakLevel)} cm
              </p>
              <p className="mt-1 text-[10px] text-[var(--signal)]">
                Expected in +{predictiveForecast.peakHour} hours
              </p>
              <div className="mt-5 border-t border-[var(--rule)] pt-4">
                <Row label="Model confidence" value={`${predictiveForecast.confidence}%`} />
                <Row label="Potential road impact" value={`${predictiveForecast.roadImpact} streets`} />
                <Row label="Population exposed" value={predictiveForecast.populationExposed.toLocaleString("en-US")} />
              </div>
            </article>
            <article className={`${panelClass} p-5`}>
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-white">
                Forecast inputs
              </h2>
              {[
                ["Water-level history", `${historyCount} hourly samples`],
                ["Holt trend model", `Alpha ${holtParameters.alpha}`],
                ["Trend smoothing", `Beta ${holtParameters.beta}`],
                ["Critical threshold", "60 cm"],
              ].map(([label, value]) => (
                <div key={label} className="mt-3 flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">{label}</span>
                  <span className="text-[var(--signal)]">{value}</span>
                </div>
              ))}
            </article>
          </div>
        </div>
        <article className={`${panelClass} mt-5 overflow-hidden`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule)] p-5">
            <div>
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-white">
                Sensor forecast comparison
              </h2>
              <p className="mt-1 text-[10px] text-[var(--text-dim)]">
                Holt trend forecast for every demo sensor
              </p>
            </div>
            <span className="border border-[var(--rule-strong)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--signal)]">
              {comparisonRows.length} sensors modeled
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-[var(--surface-deep)] text-[10px] uppercase tracking-[0.08em] text-[var(--text-dim)]">
                <tr>
                  <th className="px-5 py-3 font-medium">Sensor</th>
                  <th className="px-5 py-3 font-medium">Current level</th>
                  <th className="px-5 py-3 font-medium">Projected peak</th>
                  <th className="px-5 py-3 font-medium">Peak horizon</th>
                  <th className="px-5 py-3 font-medium">Confidence</th>
                  <th className="px-5 py-3 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--rule)]">
                {comparisonRows.map((row) => {
                  const sensor = sensors.find((item) => item.id === row.sensorId) ?? sensors[0]
                  const isSelected = sensor.id === selectedPredictionSensor.id

                  return (
                    <tr
                      key={row.sensorId}
                      className={isSelected ? "bg-[var(--signal-soft)]" : "hover:bg-[var(--surface-elevated)]"}
                    >
                      <td className="px-5 py-3">
                        <Button
                          onClick={() => setPredictionSensorId(row.sensorId)}
                          className="text-left font-medium text-[var(--signal)] hover:text-[#ffd166]"
                        >
                          {row.sensorId}
                        </Button>
                        <p className="mt-0.5 text-[10px] text-[var(--text-dim)]">{sensor.street}</p>
                      </td>
                      <td className="px-5 py-3 text-[var(--text-muted)]">{row.currentLevel} cm</td>
                      <td className="px-5 py-3 font-medium text-white">{Math.round(row.peakLevel)} cm</td>
                      <td className="px-5 py-3 text-[var(--text-muted)]">+{row.peakHour}h</td>
                      <td className="px-5 py-3 text-[var(--text-muted)]">{row.confidence}%</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${severityStyles[row.risk]}`}>
                          {row.risk}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    )
  }

  return (
    <div>
      <PageHeading
        title={title[tab][0]}
        subtitle={title[tab][1]}
        action="Create alert"
      />
      <div className="mb-5 grid grid-cols-2 divide-x divide-y divide-[var(--rule)] border border-[var(--rule)] bg-[var(--surface-raised)] lg:grid-cols-4 lg:divide-y-0">
        {[
          ["3", "Active"],
          ["1", "Critical"],
          ["2", "Teams dispatched"],
          ["6m", "Avg. response"],
        ].map(([value, label]) => (
          <article key={label} className="p-4">
            <p className="font-display text-2xl font-semibold text-[var(--signal)]">{value}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[var(--text-dim)]">{label}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <article className={panelClass}>
          <div className="border-b border-[var(--rule)] p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-white">
              Incident queue
            </h2>
            <p className="mt-1 text-[10px] text-[var(--text-dim)]">
              Sorted by operational priority · demo queue
            </p>
          </div>
          <div className="divide-y divide-[var(--rule)]">
            {alerts
              .concat({
                severity: "Watch",
                title: "Drainage capacity nearing limit",
                place: "Malaya Creek · District 5",
                time: "28 min ago",
              })
              .map((alert, index) => (
                <div key={alert.title} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div
                      className={`grid size-10 shrink-0 place-items-center border ${
                        alert.severity === "Critical"
                          ? "border-[var(--danger)] bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-[var(--danger)]"
                          : "border-[var(--rule-strong)] bg-[var(--signal-soft)] text-[var(--signal)]"
                      }`}
                    >
                      <Icon name="alert" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{alert.title}</p>
                        <span className="border border-[var(--rule)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">
                          {alert.severity}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {alert.place} · {alert.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--text-dim)]">
                        {alertState[index] || (index < 2 ? "Unassigned" : "Monitoring")}
                      </span>
                      <Button
                        onClick={() =>
                          setAlertState({
                            ...alertState,
                            [index]:
                              alertState[index] === "Dispatched"
                                ? "Resolved"
                                : "Dispatched",
                          })
                        }
                        className="border border-[var(--signal)] bg-[var(--signal)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--surface-deep)]"
                      >
                        {alertState[index] === "Dispatched"
                          ? "Resolve"
                          : alertState[index] === "Resolved"
                            ? "Resolved"
                            : "Dispatch"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </article>
        <div className="space-y-4">
          <article className={`${panelClass} p-5`}>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-white">
              Response teams
            </h2>
            {[
              ["Alpha 1", "En route · 4 min"],
              ["Bravo 2", "Available"],
              ["Rescue 4", "On scene"],
              ["Traffic 3", "Available"],
            ].map(([team, status]) => (
              <div key={team} className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-[var(--signal)]" />
                  <span className="text-sm text-[var(--text-muted)]">{team}</span>
                </div>
                <span className="text-[10px] text-[var(--text-dim)]">{status}</span>
              </div>
            ))}
          </article>
          <article className="fieldboard-surface border border-[var(--rule-strong)] bg-[var(--signal-soft)] p-5">
            <Icon name="radio" className="text-[var(--signal)]" />
            <h2 className="mt-3 font-display text-sm font-semibold uppercase tracking-[0.08em] text-white">
              Public advisory
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Rizal Avenue is closed between Mabini and Luna Streets. Use
              Bonifacio Avenue as alternate route.
            </p>
            <Button className="mt-4 w-full border border-[var(--rule-strong)] py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--signal)] hover:bg-[var(--surface-elevated)]">
              Update advisory
            </Button>
          </article>
        </div>
      </div>
    </div>
  )
}
