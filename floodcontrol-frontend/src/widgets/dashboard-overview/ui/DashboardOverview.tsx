import { alerts } from "../../../entities/alert/model/mock"
import { getActiveAlerts } from "../../../entities/alert/model/selectors"
import { floodLocations } from "../../../entities/flood/model/mock"
import {
  getAlertCounts,
  getAttentionSensors,
  getCitywideHistory,
  getOverviewForecast,
  getSensorStateCounts,
} from "../../../entities/overview/model/selectors"
import { sensorHistories } from "../../../entities/prediction/model/mock"
import { getSensorForecast } from "../../../entities/prediction/model/selectors"
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
import { FloodLeafletMap } from "../../flood-map/ui/FloodLeafletMap"
import { OverviewAnalytics } from "../../overview-analytics/ui/OverviewAnalytics"

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
  const selectedForecast = getSensorForecast(selectedSensor.id, "6 hours")
  const overviewForecast = getOverviewForecast(
    selectedSensor.level,
    selectedForecast,
    2,
  )

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

      <OverviewAnalytics
        history={getCitywideHistory(visibleSensors, sensorHistories)}
        alertCounts={getAlertCounts(alerts, acknowledged)}
        sensorCounts={getSensorStateCounts(visibleSensors)}
        forecast={overviewForecast}
        forecastConfidence={selectedForecast.confidence}
        forecastSensorLabel={selectedSensor.street}
        attentionSensors={getAttentionSensors(visibleSensors, 4)}
      />

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
          <div className="relative h-[22rem] overflow-hidden bg-[#10140f]">
            <FloodLeafletMap
              floodLocations={floodLocations}
              visibleSensors={visibleSensors}
              selectedSensor={selectedSensor}
              onSelectSensor={onSelectSensor}
              className="h-full min-h-0"
            />
            <div className="absolute bottom-4 left-4 right-4 z-[1000] border border-[var(--rule-strong)] bg-[var(--surface-deep)]/95 p-4 sm:left-auto sm:w-80">
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
                          <AcknowledgeAlertButton
                            onAcknowledge={onAcknowledge}
                          />
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
                <p className="mt-1 text-[10px] text-[var(--text-dim)]">
                  {label}
                </p>
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
              <div
                key={label}
                className="flex items-center gap-3 p-3 first:pl-0"
              >
                <Icon
                  name={icon as IconName}
                  className="size-4 text-[var(--signal)]"
                />
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
