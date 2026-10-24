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
      <section className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-[0.18em] text-cyan-400 uppercase">
            Tuesday, 24 June · 14:32
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Good afternoon, Alex
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Monitor rising water levels and coordinate a faster response.
          </p>
        </div>
        <SensorFilterControl value={filter} onChange={onFilterChange} />
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            icon: "sensor",
            label: "Active sensors",
            value: "48",
            detail: "of 50 deployed",
            color: "text-cyan-300",
            bg: "bg-cyan-400/10",
          },
          {
            icon: "droplet",
            label: "Highest level",
            value: "68 cm",
            detail: "Rizal Ave.",
            color: "text-rose-300",
            bg: "bg-rose-400/10",
          },
          {
            icon: "rain",
            label: "Rainfall",
            value: "32 mm",
            detail: "past 60 minutes",
            color: "text-indigo-300",
            bg: "bg-indigo-400/10",
          },
          {
            icon: "trend",
            label: "Risk forecast",
            value: "High",
            detail: "next 2 hours",
            color: "text-amber-300",
            bg: "bg-amber-400/10",
          },
        ].map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-white/8 bg-white/[0.035] p-4 sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
              </div>
              <div
                className={`grid size-9 shrink-0 place-items-center rounded-xl ${stat.bg} ${stat.color}`}
              >
                <Icon name={stat.icon as IconName} className="size-4.5" />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <article className="overflow-hidden rounded-2xl border border-white/8 bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
            <div>
              <h2 className="font-semibold text-white">Live flood map</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {visibleSensors.length} sensors in view
              </p>
            </div>
            <Button className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5">
              <Icon name="layers" className="size-4" /> Map layers
            </Button>
          </div>
          <div className="relative h-[29rem] overflow-hidden bg-[#0d1b26]">
            <div className="map-grid absolute inset-0 opacity-60" />
            <svg
              className="absolute inset-0 size-full opacity-50"
              viewBox="0 0 800 500"
              preserveAspectRatio="none"
            >
              <g fill="none" stroke="#37505f" strokeWidth="8">
                <path d="M-20 120C140 80 250 170 410 130s260-20 430 30" />
                <path d="M110-20c30 150 80 240 20 550M580-20c-70 150-30 310 80 540" />
                <path d="M-20 390c190-60 300-10 460-60s260 0 390-50" />
              </g>
              <g fill="none" stroke="#1c3442" strokeWidth="3">
                <path d="M-10 245h850M320-20v550M735-20 640 520M30 25l740 430" />
                <path d="M220-20 480 520M-10 470 790 20" />
              </g>
              <path
                d="M-10 300c160-100 250 90 410 5S650 200 820 90"
                fill="none"
                stroke="#0e7490"
                strokeWidth="18"
                opacity=".55"
              />
            </svg>
            <div className="absolute left-[8%] top-[9%] rounded-md bg-slate-950/60 px-2 py-1 text-[10px] tracking-wide text-slate-500 uppercase">
              District 1
            </div>
            <div className="absolute right-[9%] top-[45%] rounded-md bg-slate-950/60 px-2 py-1 text-[10px] tracking-wide text-slate-500 uppercase">
              District 4
            </div>
            <div className="absolute bottom-[8%] left-[38%] rounded-md bg-slate-950/60 px-2 py-1 text-[10px] tracking-wide text-slate-500 uppercase">
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
                  className={`relative grid size-8 place-items-center rounded-full border-4 border-slate-900 shadow-lg ${severityStyles[sensor.state]}`}
                >
                  <Icon name="droplet" className="size-3.5" />
                </span>
                <span className="pointer-events-none absolute left-1/2 top-10 hidden w-max -translate-x-1/2 rounded-lg bg-slate-950 px-2 py-1 text-[10px] text-white shadow-xl group-hover:block">
                  {sensor.id} · {sensor.level} cm
                </span>
              </Button>
            ))}
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-xl sm:left-auto sm:w-80">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${severityStyles[selectedSensor.state].split(" ")[0]}`}
                    />
                    <p className="text-xs font-semibold text-slate-300">
                      {selectedSensor.state.toUpperCase()}
                    </p>
                  </div>
                  <p className="mt-1 font-medium text-white">
                    {selectedSensor.street}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedSensor.id} · {selectedSensor.zone}
                  </p>
                </div>
                <p className="text-2xl font-semibold text-white">
                  {selectedSensor.level}
                  <span className="ml-1 text-xs font-normal text-slate-500">
                    cm
                  </span>
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-3 text-xs">
                <span className="text-slate-500">Current trend</span>
                <span className="font-medium text-rose-300">
                  {selectedSensor.trend}
                </span>
              </div>
            </div>
          </div>
        </article>

        <div className="space-y-5">
          <article className="rounded-2xl border border-white/8 bg-white/[0.035]">
            <div className="flex items-center justify-between border-b border-white/8 p-5">
              <div>
                <h2 className="font-semibold text-white">Active alerts</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Prioritized by severity
                </p>
              </div>
              <span className="rounded-full bg-rose-500/15 px-2.5 py-1 text-xs font-semibold text-rose-300">
                {activeAlertCount} active
              </span>
            </div>
            <div className="divide-y divide-white/8">
              {alerts.map((alert, index) =>
                index === 0 && acknowledged ? null : (
                  <div key={alert.title} className="p-4">
                    <div className="flex gap-3">
                      <div
                        className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${
                          alert.severity === "Critical"
                            ? "bg-rose-500/12 text-rose-300"
                            : alert.severity === "Warning"
                              ? "bg-amber-400/12 text-amber-300"
                              : "bg-cyan-400/12 text-cyan-300"
                        }`}
                      >
                        <Icon name="alert" className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-slate-200">
                            {alert.title}
                          </p>
                          <p className="shrink-0 text-[10px] text-slate-600">
                            {alert.time}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
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
            <Button className="w-full border-t border-white/8 py-3.5 text-xs font-medium text-cyan-300 hover:bg-white/[0.025]">
              View all alerts
            </Button>
          </article>

          <article className="rounded-2xl border border-white/8 bg-gradient-to-br from-indigo-500/10 to-cyan-500/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  2-hour prediction
                </p>
                <h2 className="mt-1 font-semibold text-white">
                  Flood risk rising
                </h2>
              </div>
              <div className="grid size-10 place-items-center rounded-xl bg-amber-400/10 text-amber-300">
                <Icon name="trend" />
              </div>
            </div>
            <div className="mt-5 flex h-20 items-end gap-1.5">
              {[24, 31, 28, 39, 45, 56, 61, 76, 84, 92].map((height, index) => (
                <div
                  key={index}
                  className={`flex-1 rounded-t-sm ${
                    index > 6 ? "bg-amber-400" : "bg-cyan-400/50"
                  }`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-slate-600">
              <span>Now</span>
              <span>+1 hr</span>
              <span>+2 hrs</span>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-950/40 px-3 py-2 text-xs text-slate-400">
              <Icon name="activity" className="size-4 text-cyan-400" />
              <span>
                <strong className="text-slate-200">87% confidence</strong> based
                on rainfall & terrain
              </span>
            </div>
          </article>
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">Sensor health</h2>
              <p className="mt-1 text-xs text-slate-500">
                Network uptime and connectivity
              </p>
            </div>
            <Button className="text-xs font-medium text-cyan-300">
              View network
            </Button>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              ["48", "Online", "text-emerald-300"],
              ["1", "Low battery", "text-amber-300"],
              ["1", "Offline", "text-rose-300"],
            ].map(([value, label, color]) => (
              <div key={label} className="rounded-xl bg-slate-950/60 p-3">
                <p className={`text-xl font-semibold ${color}`}>{value}</p>
                <p className="mt-1 text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">Response readiness</h2>
              <p className="mt-1 text-xs text-slate-500">
                Available field resources
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Ready
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              ["users", "12", "Teams"],
              ["radio", "8", "Units"],
              ["clock", "6m", "Avg. dispatch"],
            ].map(([icon, value, label]) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl bg-slate-950/60 p-3"
              >
                <Icon
                  name={icon as IconName}
                  className="size-4 text-indigo-300"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{value}</p>
                  <p className="text-[10px] text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  )
}
