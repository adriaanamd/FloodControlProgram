import type { CSSProperties } from "react"
import { alerts } from "../../../entities/alert/model/mock"
import { getActiveAlerts } from "../../../entities/alert/model/selectors"
import { sensors } from "../../../entities/sensor/model/mock"
import {
  filterSensors,
  type SensorFilter,
} from "../../../entities/sensor/model/selectors"
import { severityStyles } from "../../../entities/sensor/model/severityStyles"
import type { Sensor } from "../../../entities/sensor/model/types"
import { AcknowledgeAlertButton } from "../../../features/alert-acknowledgement/ui/AcknowledgeAlertButton"
import { SensorFilter as SensorFilterControl } from "../../../features/sensor-filter/ui/SensorFilter"
import { Button } from "../../../shared/ui/Button"
import { Icon, type IconName } from "../../../shared/ui/Icon"
import { SectionFolio } from "../../../shared/ui/SectionFolio"

type DashboardOverviewProps = {
  filter: SensorFilter
  onFilterChange: (filter: SensorFilter) => void
  selectedSensor: Sensor
  onSelectSensor: (sensor: Sensor) => void
  acknowledged: boolean
  onAcknowledge: () => void
}

export function DashboardOverview({
  filter,
  onFilterChange,
  selectedSensor,
  onSelectSensor,
  acknowledged,
  onAcknowledge,
}: DashboardOverviewProps) {
  const visibleSensors = filterSensors(sensors, filter)
  const activeAlertCount = getActiveAlerts(alerts, acknowledged).length

  return (
    <>
      <section className="mb-7 flex flex-col justify-between gap-5 border-b border-[var(--rule)] pb-6 xl:flex-row xl:items-end">
        <div>
          <SectionFolio index="01" label="Overview / live operations" />
          <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
            Olongapo City · Demo telemetry
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Good afternoon, Alex
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            Monitor rising water levels and coordinate a faster response.
          </p>
        </div>
        <SensorFilterControl value={filter} onChange={onFilterChange} />
      </section>

      <section className="grid grid-cols-2 divide-x divide-y divide-[var(--rule)] border border-[var(--rule)] bg-[var(--surface-raised)] xl:grid-cols-4 xl:divide-y-0">
        {[
          ["sensor", "Active sensors", "48", "of 50 deployed"],
          ["droplet", "Highest level", "68 cm", "Rizal Ave."],
          ["rain", "Rainfall", "32 mm", "past 60 minutes"],
          ["trend", "Risk forecast", "High", "next 2 hours"],
        ].map(([icon, label, value, detail]) => (
          <article key={label} className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                  {label}
                </p>
                <p className="mt-3 font-display text-xl font-semibold tracking-tight text-[var(--signal)] sm:text-2xl">
                  {value}
                </p>
                <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                  {detail}
                </p>
              </div>
              <div className="grid size-9 shrink-0 place-items-center border border-[var(--rule-strong)] bg-[var(--signal-soft)] text-[var(--signal)]">
                <Icon name={icon as IconName} className="size-4" />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <article className="fieldboard-surface overflow-hidden border border-[var(--rule)] bg-[var(--surface-raised)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule)] px-5 py-4">
            <div>
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-white">
                Live flood map
              </h2>
              <p className="mt-1 text-[10px] text-[var(--text-dim)]">
                {visibleSensors.length} sensors in view · demo telemetry
              </p>
            </div>
            <Button className="flex items-center gap-2 border border-[var(--rule)] px-3 py-2 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)] hover:border-[var(--signal)] hover:text-[var(--signal)]">
              <Icon name="layers" className="size-4" /> Map layers
            </Button>
          </div>
          <div className="relative h-[29rem] overflow-hidden bg-[#10140f]">
            <div className="map-grid absolute inset-0 opacity-70" />
            <svg
              className="absolute inset-0 size-full opacity-60"
              viewBox="0 0 800 500"
              preserveAspectRatio="none"
            >
              <g fill="none" stroke="#414c3e" strokeWidth="8">
                <path d="M-20 120C140 80 250 170 410 130s260-20 430 30" />
                <path d="M110-20c30 150 80 240 20 550M580-20c-70 150-30 310 80 540" />
                <path d="M-20 390c190-60 300-10 460-60s260 0 390-50" />
              </g>
              <g fill="none" stroke="#2a3328" strokeWidth="3">
                <path d="M-10 245h850M320-20v550M735-20 640 520M30 25l740 455" />
                <path d="M220-20 480 520M-10 470 790 20" />
              </g>
              <path
                d="M-10 300c160-100 250 90 410 5S650 200 820 90"
                fill="none"
                stroke="#8b6700"
                strokeWidth="18"
                opacity=".55"
              />
            </svg>
            <div className="absolute left-[8%] top-[9%] border border-[var(--rule)] bg-[var(--surface-deep)]/75 px-2 py-1 text-[10px] tracking-wide text-[var(--text-dim)] uppercase">
              District 1
            </div>
            <div className="absolute right-[9%] top-[45%] border border-[var(--rule)] bg-[var(--surface-deep)]/75 px-2 py-1 text-[10px] tracking-wide text-[var(--text-dim)] uppercase">
              District 4
            </div>
            <div className="absolute bottom-[8%] left-[38%] border border-[var(--rule)] bg-[var(--surface-deep)]/75 px-2 py-1 text-[10px] tracking-wide text-[var(--text-dim)] uppercase">
              District 3
            </div>
            {visibleSensors.map((sensor) => (
              <Button
                key={sensor.id}
                ariaLabel={`View ${sensor.id}`}
                onClick={() => onSelectSensor(sensor)}
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
                  <Icon name="droplet" className="size-3.5" />
                </span>
                <span className="pointer-events-none absolute left-1/2 top-10 hidden w-max -translate-x-1/2 border border-[var(--rule)] bg-[var(--surface-deep)] px-2 py-1 text-[10px] text-white group-hover:block">
                  {sensor.id} · {sensor.level} cm
                </span>
              </Button>
            ))}
            <div className="absolute bottom-4 left-4 right-4 border border-[var(--rule-strong)] bg-[var(--surface-deep)]/95 p-4 sm:left-auto sm:w-80">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${severityStyles[selectedSensor.state].split(" ")[0]}`}
                    />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      {selectedSensor.state}
                    </p>
                  </div>
                  <p className="mt-2 font-medium text-white">
                    {selectedSensor.street}
                  </p>
                  <p className="text-[10px] text-[var(--text-dim)]">
                    {selectedSensor.id} · {selectedSensor.zone}
                  </p>
                </div>
                <p className="font-display text-2xl font-semibold text-white">
                  {selectedSensor.level}
                  <span className="ml-1 text-xs font-normal text-[var(--text-dim)]">
                    cm
                  </span>
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[var(--rule)] pt-3 text-xs">
                <span className="text-[var(--text-dim)]">Current trend</span>
                <span className="font-medium text-[var(--signal)]">
                  {selectedSensor.trend}
                </span>
              </div>
            </div>
          </div>
        </article>

        <div className="space-y-5">
          <article className="border border-[var(--rule)] bg-[var(--surface-raised)]">
            <div className="flex items-center justify-between border-b border-[var(--rule)] p-5">
              <div>
                <h2 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-white">
                  Active alerts
                </h2>
                <p className="mt-1 text-[10px] text-[var(--text-dim)]">
                  Prioritized by severity
                </p>
              </div>
              <span className="border border-[var(--danger)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--danger)]">
                {activeAlertCount} active
              </span>
            </div>
            <div className="divide-y divide-[var(--rule)]">
              {alerts.map((alert, index) =>
                index === 0 && acknowledged ? null : (
                  <div key={alert.title} className="p-4">
                    <div className="flex gap-3">
                      <div
                        className={`mt-0.5 grid size-8 shrink-0 place-items-center border ${
                          alert.severity === "Critical"
                            ? "border-[var(--danger)] bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-[var(--danger)]"
                            : "border-[var(--rule-strong)] bg-[var(--signal-soft)] text-[var(--signal)]"
                        }`}
                      >
                        <Icon name="alert" className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-white">
                            {alert.title}
                          </p>
                          <p className="shrink-0 text-[10px] text-[var(--text-dim)]">
                            {alert.time}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          {alert.place}
                        </p>
                        {index === 0 && (
                          <AcknowledgeAlertButton onAcknowledge={onAcknowledge} />
                        )}
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
            <Button className="w-full border-t border-[var(--rule)] py-3.5 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--signal)] hover:bg-[var(--surface-elevated)]">
              View all alerts
            </Button>
          </article>

          <article className="fieldboard-surface border border-[var(--rule-strong)] bg-[var(--signal-soft)] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  2-hour prediction · demo model
                </p>
                <h2 className="mt-2 font-display font-semibold text-white">
                  Flood risk rising
                </h2>
              </div>
              <div className="grid size-10 place-items-center border border-[var(--rule-strong)] text-[var(--signal)]">
                <Icon name="trend" />
              </div>
            </div>
            <div className="mt-5 flex h-20 items-end gap-1.5">
              {[24, 31, 28, 39, 45, 56, 61, 76, 84, 92].map((height, index) => (
                <div
                  key={index}
                  className={`flex-1 rounded-t-sm ${
                    index > 6 ? "bg-[var(--signal)]" : "bg-[var(--signal)]/35"
                  }`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-[var(--text-dim)]">
              <span>Now</span>
              <span>+1 hr</span>
              <span>+2 hrs</span>
            </div>
            <div className="mt-4 flex items-center gap-2 border border-[var(--rule)] bg-[var(--surface-deep)]/40 px-3 py-2 text-xs text-[var(--text-muted)]">
              <Icon name="activity" className="size-4 text-[var(--signal)]" />
              <span>
                <strong className="text-white">87% confidence</strong> based
                on rainfall &amp; terrain
              </span>
            </div>
          </article>
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <article className="border border-[var(--rule)] bg-[var(--surface-raised)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-white">
                Sensor health
              </h2>
              <p className="mt-1 text-[10px] text-[var(--text-dim)]">
                Network uptime and connectivity
              </p>
            </div>
            <Button className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--signal)]">
              View network
            </Button>
          </div>
          <div className="mt-5 grid grid-cols-3 divide-x divide-[var(--rule)] border-y border-[var(--rule)]">
            {[
              ["48", "Online", "text-[var(--signal)]"],
              ["1", "Low battery", "text-[#ffd166]"],
              ["1", "Offline", "text-[var(--danger)]"],
            ].map(([value, label, color]) => (
              <div key={label} className="p-3 first:pl-0">
                <p className={`font-display text-xl font-semibold ${color}`}>
                  {value}
                </p>
                <p className="mt-1 text-[10px] text-[var(--text-dim)]">{label}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="border border-[var(--rule)] bg-[var(--surface-raised)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-white">
                Response readiness
              </h2>
              <p className="mt-1 text-[10px] text-[var(--text-dim)]">
                Available field resources
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--signal)]">
              <span className="size-1.5 bg-[var(--signal)]" /> Ready
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 divide-x divide-[var(--rule)] border-y border-[var(--rule)]">
            {[
              ["users", "12", "Teams"],
              ["radio", "8", "Units"],
              ["clock", "6m", "Avg. dispatch"],
            ].map(([icon, value, label]) => (
              <div key={label} className="flex items-center gap-3 p-3 first:pl-0">
                <Icon name={icon as IconName} className="size-4 text-[var(--signal)]" />
                <div>
                  <p className="text-sm font-semibold text-white">{value}</p>
                  <p className="text-[10px] text-[var(--text-dim)]">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  )
}
