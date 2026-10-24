import { useState, type CSSProperties } from "react"
import { alerts } from "../../../entities/alert/model/mock"
import { sensors } from "../../../entities/sensor/model/mock"
import { severityStyles } from "../../../entities/sensor/model/severityStyles"
import { Button } from "../../../shared/ui/Button"
import { Icon } from "../../../shared/ui/Icon"
import { PageHeading } from "../../../shared/ui/PageHeading"
import { Row } from "../../../shared/ui/Row"

export function DashboardWorkspace({ tab }: { tab: string }) {
  const [view, setView] = useState("All")
  const [selected, setSelected] = useState(sensors[0])
  const [period, setPeriod] = useState("24 hours")
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
      "Short-term flood forecasts using rainfall, terrain, and water-level trends",
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
          {[
            "All",
            "Critical",
            "Warning",
            "Watch",
            "District 1",
            "District 2",
            "District 3",
            "District 4",
            "District 5",
          ].map((item) => (
            <Button
              key={item}
              onClick={() => setView(item)}
              className={`rounded-lg border px-3 py-2 text-xs ${
                view === item
                  ? "border-cyan-400 bg-cyan-400 text-slate-950"
                  : "border-white/10 text-slate-400 hover:bg-white/5"
              }`}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <article className="relative min-h-[42rem] overflow-hidden rounded-2xl border border-white/8 bg-[#0d1b26]">
            <div className="map-grid absolute inset-0 opacity-60" />
            <svg
              className="absolute inset-0 size-full opacity-60"
              viewBox="0 0 900 700"
              preserveAspectRatio="none"
            >
              <g fill="none" stroke="#37505f" strokeWidth="10">
                <path d="M-30 130C170 70 300 190 490 120s280 20 450 0" />
                <path d="M120-20c20 210 100 330 20 750M650-20c-90 210-40 440 100 750" />
                <path d="M-20 510c220-90 340 10 510-70s290 20 450-30" />
              </g>
              <g fill="none" stroke="#1c3442" strokeWidth="4">
                <path d="M-20 300h950M350-20v750M820-20 700 730M20 30l850 610M250-20 540 730M-20 650 880 30" />
              </g>
              <path
                d="M-10 390c170-120 290 100 450-10S700 270 940 100"
                fill="none"
                stroke="#0e7490"
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
                  className={`relative grid size-8 place-items-center rounded-full border-4 border-slate-900 shadow-xl ${severityStyles[sensor.state]}`}
                >
                  <Icon name="droplet" className="size-3" />
                </span>
              </Button>
            ))}
            <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-slate-950/90 p-3 text-xs backdrop-blur">
              <div className="mb-2 font-semibold text-white">Map legend</div>
              <div className="flex flex-wrap gap-3">
                {["Critical", "Warning", "Watch", "Normal"].map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1.5 text-slate-400"
                  >
                    <span
                      className={`size-2 rounded-full ${severityStyles[(s as keyof typeof severityStyles)].split(" ")[0]}`}
                    />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </article>
          <div className="space-y-4">
            <article className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${severityStyles[selected.state]}`}
                >
                  {selected.state}
                </span>
                <span className="text-xs text-slate-500">{selected.id}</span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-white">
                {selected.street}
              </h2>
              <p className="text-sm text-slate-500">{selected.zone}</p>
              <p className="mt-6 text-4xl font-semibold text-white">
                {selected.level}
                <span className="ml-1 text-sm font-normal text-slate-500">
                  cm
                </span>
              </p>
              <div className="mt-5 space-y-3 border-t border-white/8 pt-4 text-sm">
                <Row label="Rate of change" value={selected.trend} />
                <Row label="Signal quality" value="Excellent · 94%" />
                <Row label="Last reading" value="12 sec ago" />
                <Row label="Battery" value="87%" />
              </div>
              <Button className="mt-5 w-full rounded-xl bg-cyan-400 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
                Open sensor history
              </Button>
            </article>
            <article className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
              <h2 className="font-semibold text-white">Map layers</h2>
              {[
                "Flood depth",
                "Road closures",
                "Evacuation centers",
                "Drainage network",
              ].map((layer, i) => (
                <div
                  key={layer}
                  className="mt-3 flex items-center justify-between text-sm text-slate-400"
                >
                  <span>{layer}</span>
                  <span
                    className={`h-5 w-9 rounded-full p-0.5 ${
                      i < 2 ? "bg-cyan-400" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`block size-4 rounded-full bg-white transition ${
                        i < 2 ? "translate-x-4" : ""
                      }`}
                    />
                  </span>
                </div>
              ))}
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
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ["48", "Online", "emerald"],
            ["1", "Offline", "rose"],
            ["1", "Low battery", "amber"],
            ["99.2%", "Network uptime", "cyan"],
          ].map(([v, l, c]) => (
            <article
              key={l}
              className="rounded-2xl border border-white/8 bg-white/[0.035] p-4"
            >
              <p className={`text-2xl font-semibold text-${c}-300`}>{v}</p>
              <p className="mt-1 text-xs text-slate-500">{l}</p>
            </article>
          ))}
        </div>
        <article className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.035]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 p-4">
            <div className="flex gap-2">
              {[
                "All",
                "District 1",
                "District 2",
                "District 3",
                "District 4",
                "District 5",
              ].map((item) => (
                <Button
                  key={item}
                  onClick={() => setView(item)}
                  className={`rounded-lg px-3 py-2 text-xs ${
                    view === item
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-slate-900 text-slate-400"
                  }`}
                >
                  {item}
                </Button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              {filtered.length} devices shown
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-950/50 text-xs text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Sensor</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Water level</th>
                  <th className="px-5 py-3 font-medium">Signal</th>
                  <th className="px-5 py-3 font-medium">Battery</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {filtered.map((s, i) => (
                  <tr key={s.id} className="hover:bg-white/[0.025]">
                    <td className="px-5 py-4 font-medium text-white">{s.id}</td>
                    <td className="px-5 py-4">
                      <p className="text-slate-300">{s.street}</p>
                      <p className="text-xs text-slate-600">{s.zone}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{s.level} cm</td>
                    <td className="px-5 py-4 text-emerald-300">
                      {92 - (i % 8)}%
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {i === 7 ? "16%" : `${96 - i * 3}%`}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          s.state === "Critical"
                            ? "bg-rose-400/15 text-rose-300"
                            : "bg-emerald-400/10 text-emerald-300"
                        }`}
                      >
                        {i === 9 ? "Needs service" : "Online"}
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

  if (tab === "Predictive Analytics")
    return (
      <div>
        <PageHeading
          title={title[tab][0]}
          subtitle={title[tab][1]}
          action="Download report"
        />
        <div className="mb-5 flex gap-2">
          {["6 hours", "24 hours", "3 days", "7 days"].map((item) => (
            <Button
              key={item}
              onClick={() => setPeriod(item)}
              className={`rounded-lg border px-3 py-2 text-xs ${
                period === item
                  ? "border-cyan-400 bg-cyan-400 text-slate-950"
                  : "border-white/10 text-slate-400"
              }`}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <article className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-white">
                  Water-level forecast
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Citywide weighted average · {period}
                </p>
              </div>
              <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
                Risk increasing
              </span>
            </div>
            <div className="relative mt-8 h-72 border-b border-l border-white/10">
              <div className="absolute inset-x-0 top-1/3 border-t border-dashed border-rose-400/30">
                <span className="absolute right-0 -top-5 text-[10px] text-rose-300">
                  Critical threshold
                </span>
              </div>
              <svg
                className="size-full"
                viewBox="0 0 800 280"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#22d3ee" stopOpacity=".35" />
                    <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 250 C90 235 120 245 200 220 S320 180 390 190 S500 150 570 120 S690 75 800 35 V280 H0Z"
                  fill="url(#area)"
                />
                <path
                  d="M0 250 C90 235 120 245 200 220 S320 180 390 190 S500 150 570 120 S690 75 800 35"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="4"
                />
              </svg>
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-slate-600">
              <span>Now</span>
              <span>+6h</span>
              <span>+12h</span>
              <span>+18h</span>
              <span>+24h</span>
            </div>
          </article>
          <div className="space-y-4">
            <article className="rounded-2xl border border-white/8 bg-gradient-to-br from-amber-400/10 to-rose-500/5 p-5">
              <p className="text-xs text-slate-400">Peak projected level</p>
              <p className="mt-2 text-3xl font-semibold text-white">82 cm</p>
              <p className="mt-1 text-xs text-amber-300">
                Expected at 22:40 tonight
              </p>
              <div className="mt-5 border-t border-white/8 pt-4">
                <Row label="Model confidence" value="87%" />
                <Row label="Potential road impact" value="14 streets" />
                <Row label="Population exposed" value="2,340" />
              </div>
            </article>
            <article className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
              <h2 className="font-semibold text-white">Forecast inputs</h2>
              {[
                ["Rainfall radar", "Live"],
                ["16 IoT sensors", "Streaming"],
                ["Terrain model", "Synced"],
                ["Drainage capacity", "Updated"],
              ].map(([a, b]) => (
                <div key={a} className="mt-3 flex justify-between text-xs">
                  <span className="text-slate-400">{a}</span>
                  <span className="text-emerald-300">{b}</span>
                </div>
              ))}
            </article>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ["District 3", "Very high", "Rizal corridor may exceed 75 cm"],
            ["District 1", "High", "Underpass closure likely"],
            ["District 4", "Moderate", "Localized pooling expected"],
          ].map(([z, r, d], i) => (
            <article
              key={z}
              className="rounded-2xl border border-white/8 bg-white/[0.035] p-5"
            >
              <div className="flex justify-between">
                <h2 className="font-semibold text-white">{z}</h2>
                <span
                  className={`text-xs ${
                    i === 0
                      ? "text-rose-300"
                      : i === 1
                        ? "text-amber-300"
                        : "text-cyan-300"
                  }`}
                >
                  {r}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-400">{d}</p>
              <Button className="mt-4 text-xs font-medium text-cyan-300">
                View scenario →
              </Button>
            </article>
          ))}
        </div>
      </div>
    )

  return (
    <div>
      <PageHeading
        title={title[tab][0]}
        subtitle={title[tab][1]}
        action="Create alert"
      />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["3", "Active"],
          ["1", "Critical"],
          ["2", "Teams dispatched"],
          ["6m", "Avg. response"],
        ].map(([v, l]) => (
          <article
            key={l}
            className="rounded-2xl border border-white/8 bg-white/[0.035] p-4"
          >
            <p className="text-2xl font-semibold text-white">{v}</p>
            <p className="mt-1 text-xs text-slate-500">{l}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="rounded-2xl border border-white/8 bg-white/[0.035]">
          <div className="border-b border-white/8 p-5">
            <h2 className="font-semibold text-white">Incident queue</h2>
            <p className="mt-1 text-xs text-slate-500">
              Sorted by operational priority
            </p>
          </div>
          <div className="divide-y divide-white/8">
            {alerts
              .concat({
                severity: "Watch",
                title: "Drainage capacity nearing limit",
                place: "Malaya Creek · District 5",
                time: "28 min ago",
              })
              .map((a, i) => (
                <div key={a.title} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div
                      className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                        a.severity === "Critical"
                          ? "bg-rose-500/15 text-rose-300"
                          : "bg-amber-400/10 text-amber-300"
                      }`}
                    >
                      <Icon name="alert" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{a.title}</p>
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                          {a.severity}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {a.place} · {a.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        {alertState[i] || (i < 2 ? "Unassigned" : "Monitoring")}
                      </span>
                      <Button
                        onClick={() =>
                          setAlertState({
                            ...alertState,
                            [i]:
                              alertState[i] === "Dispatched"
                                ? "Resolved"
                                : "Dispatched",
                          })
                        }
                        className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950"
                      >
                        {alertState[i] === "Dispatched"
                          ? "Resolve"
                          : alertState[i] === "Resolved"
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
          <article className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
            <h2 className="font-semibold text-white">Response teams</h2>
            {[
              ["Alpha 1", "En route · 4 min"],
              ["Bravo 2", "Available"],
              ["Rescue 4", "On scene"],
              ["Traffic 3", "Available"],
            ].map(([team, status]) => (
              <div
                key={team}
                className="mt-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span className="text-sm text-slate-300">{team}</span>
                </div>
                <span className="text-[10px] text-slate-500">{status}</span>
              </div>
            ))}
          </article>
          <article className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-5">
            <Icon name="radio" className="text-cyan-300" />
            <h2 className="mt-3 font-semibold text-white">Public advisory</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Rizal Avenue is closed between Mabini and Luna Streets. Use
              Bonifacio Avenue as alternate route.
            </p>
            <Button className="mt-4 w-full rounded-lg border border-cyan-400/20 py-2 text-xs font-semibold text-cyan-300">
              Update advisory
            </Button>
          </article>
        </div>
      </div>
    </div>
  )
}
