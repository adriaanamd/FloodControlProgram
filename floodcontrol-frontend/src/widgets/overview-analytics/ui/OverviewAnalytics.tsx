import type { ReactNode } from "react"
import type { Sensor } from "../../../entities/sensor/model/types"
import type {
  OverviewCount,
  OverviewForecastPoint,
  OverviewSeriesPoint,
  OverviewTone,
} from "../../../entities/overview/model/types"

type OverviewAnalyticsProps = {
  history: readonly OverviewSeriesPoint[]
  alertCounts: readonly OverviewCount[]
  sensorCounts: readonly OverviewCount[]
  forecast: readonly OverviewForecastPoint[]
  forecastConfidence: number
  forecastSensorLabel: string
  attentionSensors: readonly Sensor[]
}

const toneColors: Record<OverviewTone, string> = {
  critical: "var(--danger)",
  warning: "var(--signal)",
  watch: "#70c7ff",
  normal: "#78d66b",
  signal: "var(--signal)",
}

function chartY(value: number, maximum: number): number {
  const top = 12
  const bottom = 112
  return bottom - (value / Math.max(maximum, 1)) * (bottom - top)
}

function chartX(index: number, total: number): number {
  if (total <= 1) return 16
  return 16 + (index / (total - 1)) * 288
}

function ChartCard({
  title,
  summary,
  children,
}: {
  title: string
  summary: string
  children: ReactNode
}) {
  return (
    <article className="border border-[var(--rule)] bg-[var(--surface-raised)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-white">
            {title}
          </h2>
          <p className="mt-1 text-[10px] text-[var(--text-dim)]">{summary}</p>
        </div>
        <span className="size-2 shrink-0 bg-[var(--signal)]" />
      </div>
      <div className="mt-5">{children}</div>
    </article>
  )
}

function LineChart({
  points,
  ariaLabel,
}: {
  points: readonly OverviewSeriesPoint[]
  ariaLabel: string
}) {
  if (!points.length) {
    return (
      <p className="text-xs text-[var(--text-muted)]">No history available.</p>
    )
  }

  const maximum = Math.max(...points.map((point) => point.peak), 1)
  const averagePoints = points
    .map(
      (point, index) =>
        chartX(index, points.length) + "," + chartY(point.average, maximum),
    )
    .join(" ")
  const peakPoints = points
    .map(
      (point, index) =>
        chartX(index, points.length) + "," + chartY(point.peak, maximum),
    )
    .join(" ")

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <p className="font-display text-2xl font-semibold tabular-nums text-white">
          {points.at(-1)?.peak ?? 0}
          <span className="ml-1 text-xs font-normal text-[var(--text-dim)]">
            cm peak
          </span>
        </p>
        <p className="text-right text-[10px] text-[var(--text-muted)]">
          Avg {points.at(-1)?.average ?? 0} cm · max {maximum} cm
        </p>
      </div>
      <svg
        aria-label={ariaLabel}
        className="mt-4 h-32 w-full overflow-visible"
        role="img"
        viewBox="0 0 320 128"
      >
        {[24, 56, 88, 120].map((y) => (
          <line
            key={y}
            x1="16"
            x2="304"
            y1={y}
            y2={y}
            stroke="var(--rule)"
            strokeWidth="1"
          />
        ))}
        <polyline
          fill="none"
          points={averagePoints}
          stroke="var(--signal)"
          strokeDasharray="3 3"
          strokeWidth="2"
        />
        <polyline
          fill="none"
          points={peakPoints}
          stroke="var(--danger)"
          strokeWidth="2"
        />
        <circle
          cx={chartX(points.length - 1, points.length)}
          cy={chartY(points.at(-1)?.peak ?? 0, maximum)}
          fill="var(--danger)"
          r="3"
        />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-[var(--text-dim)]">
        <span>{points[0]?.label}</span>
        <span>Now</span>
      </div>
      <div className="mt-3 flex gap-4 text-[10px] text-[var(--text-muted)]">
        <span className="flex items-center gap-2">
          <span className="h-px w-4 bg-[var(--danger)]" /> Peak
        </span>
        <span className="flex items-center gap-2">
          <span className="h-px w-4 border-t border-dashed border-[var(--signal)]" />{" "}
          Average
        </span>
      </div>
    </div>
  )
}

function BarChart({
  values,
  ariaLabel,
}: {
  values: readonly OverviewCount[]
  ariaLabel: string
}) {
  const maximum = Math.max(...values.map((item) => item.value), 1)
  const barWidth = values.length ? 280 / values.length : 0

  return (
    <div>
      <svg
        aria-label={ariaLabel}
        className="h-32 w-full"
        role="img"
        viewBox="0 0 320 128"
      >
        <line x1="16" x2="304" y1="112" y2="112" stroke="var(--rule-strong)" />
        {values.map((item, index) => {
          const height = (item.value / maximum) * 82
          const x = 20 + index * barWidth
          const y = 112 - height
          return (
            <g key={item.label}>
              <rect
                x={x}
                y={y}
                width={Math.max(barWidth - 10, 18)}
                height={height}
                fill={toneColors[item.tone]}
                fillOpacity="0.85"
              />
              <text
                x={x + Math.max(barWidth - 10, 18) / 2}
                y={Math.max(y - 6, 10)}
                fill="var(--text-bright)"
                fontSize="11"
                textAnchor="middle"
              >
                {item.value}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="grid grid-cols-3 gap-2 text-[10px] text-[var(--text-muted)]">
        {values.map((item) => (
          <span key={item.label} className="flex items-center gap-2">
            <span
              className="size-2"
              style={{ backgroundColor: toneColors[item.tone] }}
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function ForecastChart({
  points,
  ariaLabel,
}: {
  points: readonly OverviewForecastPoint[]
  ariaLabel: string
}) {
  const maximum = Math.max(
    ...points.map((point) => point.upper ?? point.value),
    1,
  )

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <p className="font-display text-2xl font-semibold tabular-nums text-white">
          {points.at(-1)?.value ?? 0}
          <span className="ml-1 text-xs font-normal text-[var(--text-dim)]">
            cm at +2 hrs
          </span>
        </p>
        <p className="text-right text-[10px] text-[var(--text-muted)]">
          Range {points.at(-1)?.lower ?? 0}–{points.at(-1)?.upper ?? 0} cm
        </p>
      </div>
      <svg
        aria-label={ariaLabel}
        className="mt-4 h-32 w-full"
        role="img"
        viewBox="0 0 320 128"
      >
        <line x1="16" x2="304" y1="112" y2="112" stroke="var(--rule-strong)" />
        {points.map((point, index) => {
          const x = chartX(index, points.length)
          const height = (point.value / maximum) * 84
          return (
            <g key={point.label}>
              <rect
                x={x - 18}
                y={112 - height}
                width="36"
                height={height}
                fill={index === 0 ? "var(--signal)" : "var(--danger)"}
                fillOpacity={index === 0 ? "0.45" : "0.85"}
              />
              {point.upper !== undefined && point.lower !== undefined && (
                <line
                  x1={x}
                  x2={x}
                  y1={chartY(point.upper, maximum)}
                  y2={chartY(point.lower, maximum)}
                  stroke="var(--text-bright)"
                  strokeWidth="2"
                />
              )}
              <text
                x={x}
                y="124"
                fill="var(--text-muted)"
                fontSize="9"
                textAnchor="middle"
              >
                {point.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function AttentionList({ sensors }: { sensors: readonly Sensor[] }) {
  return (
    <article className="mt-5 border border-[var(--rule)] bg-[var(--surface-raised)]">
      <div className="flex items-start justify-between gap-4 border-b border-[var(--rule)] p-5">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-white">
            Sensors needing attention
          </h2>
          <p className="mt-1 text-[10px] text-[var(--text-dim)]">
            Highest current levels in the filtered view
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--signal)]">
          {sensors.length} shown
        </span>
      </div>
      {sensors.length ? (
        <div className="divide-y divide-[var(--rule)]">
          {sensors.map((sensor) => (
            <div
              key={sensor.id}
              className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      "size-2 " +
                      (sensor.state === "Critical"
                        ? "bg-[var(--danger)]"
                        : sensor.state === "Warning"
                          ? "bg-[var(--signal)]"
                          : "bg-[#70c7ff]")
                    }
                  />
                  <p className="text-xs font-medium text-white">
                    {sensor.street}
                  </p>
                </div>
                <p className="mt-1 text-[10px] text-[var(--text-dim)]">
                  {sensor.id} · {sensor.state}
                </p>
              </div>
              <p className="font-display text-lg font-semibold tabular-nums text-white">
                {sensor.level}
                <span className="ml-1 text-[10px] font-normal text-[var(--text-dim)]">
                  cm
                </span>
              </p>
              <p className="text-right text-[10px] text-[var(--signal)]">
                {sensor.trend}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="p-5 text-xs text-[var(--text-muted)]">
          No sensors match the current filter.
        </p>
      )}
    </article>
  )
}

export function OverviewAnalytics({
  history,
  alertCounts,
  sensorCounts,
  forecast,
  forecastConfidence,
  forecastSensorLabel,
  attentionSensors,
}: OverviewAnalyticsProps) {
  return (
    <section aria-label="Overview analytics" className="mt-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard
          title="Citywide water level"
          summary="24-hour aggregate sensor history"
        >
          <LineChart
            ariaLabel="Citywide water-level trend for the last 24 hours"
            points={history}
          />
        </ChartCard>
        <ChartCard title="Alert activity" summary="Active alerts by severity">
          <BarChart
            ariaLabel="Active alerts by severity"
            values={alertCounts}
          />
        </ChartCard>
        <ChartCard
          title="Sensor status"
          summary="Sensors in the local demo network"
        >
          <BarChart
            ariaLabel="Sensor status distribution"
            values={sensorCounts}
          />
        </ChartCard>
        <ChartCard
          title="Two-hour forecast"
          summary={
            forecastSensorLabel + " · " + forecastConfidence + "% confidence"
          }
        >
          <ForecastChart
            ariaLabel="Two-hour flood-risk forecast"
            points={forecast}
          />
        </ChartCard>
      </div>
      <AttentionList sensors={attentionSensors} />
    </section>
  )
}
