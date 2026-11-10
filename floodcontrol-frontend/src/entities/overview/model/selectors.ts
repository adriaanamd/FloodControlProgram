import { getActiveAlerts } from "../../alert/model/selectors"
import type { Alert, AlertSeverity } from "../../alert/model/types"
import type { Sensor, SensorState } from "../../sensor/model/types"
import type { SensorForecast } from "../../prediction/model/types"
import type {
  OverviewCount,
  OverviewForecastPoint,
  OverviewSeriesPoint,
} from "./types"

const alertOrder: readonly AlertSeverity[] = ["Critical", "Warning", "Watch"]
const sensorOrder: readonly SensorState[] = [
  "Critical",
  "Warning",
  "Watch",
  "Normal",
]

const toneForLabel = {
  Critical: "critical",
  Warning: "warning",
  Watch: "watch",
  Normal: "normal",
} as const

function round(value: number): number {
  return Number(value.toFixed(2))
}

export function getCitywideHistory(
  sensors: readonly Sensor[],
  histories: Readonly<Record<string, readonly number[]>>,
): readonly OverviewSeriesPoint[] {
  const historySets = sensors
    .map((sensor) => histories[sensor.id])
    .filter((history): history is readonly number[] => Boolean(history?.length))
  const historyLength = Math.max(
    0,
    ...historySets.map((history) => history.length),
  )

  return Array.from({ length: historyLength }, (_, index) => {
    const values = historySets
      .map((history) => history[index])
      .filter((value): value is number => Number.isFinite(value))
    const average = values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : 0
    const peak = values.length ? Math.max(...values) : 0
    const label =
      index === historyLength - 1
        ? "Now"
        : "-" + (historyLength - 1 - index) + "h"

    return { label, average: round(average), peak: round(peak) }
  })
}

export function getAlertCounts(
  alerts: readonly Alert[],
  acknowledged: boolean,
): readonly OverviewCount[] {
  const activeAlerts = getActiveAlerts(alerts, acknowledged)

  return alertOrder.map((severity) => ({
    label: severity,
    value: activeAlerts.filter((alert) => alert.severity === severity).length,
    tone: toneForLabel[severity],
  }))
}

export function getSensorStateCounts(
  sensors: readonly Sensor[],
): readonly OverviewCount[] {
  return sensorOrder.map((state) => ({
    label: state,
    value: sensors.filter((sensor) => sensor.state === state).length,
    tone: toneForLabel[state],
  }))
}

export function getAttentionSensors(
  sensors: readonly Sensor[],
  limit: number,
): readonly Sensor[] {
  const priority: Record<SensorState, number> = {
    Critical: 0,
    Warning: 1,
    Watch: 2,
    Normal: 3,
  }

  return [...sensors]
    .sort(
      (left, right) =>
        priority[left.state] - priority[right.state] ||
        right.level - left.level,
    )
    .slice(0, Math.max(0, limit))
}

export function getOverviewForecast(
  currentLevel: number,
  forecast: SensorForecast,
  horizon: number,
): readonly OverviewForecastPoint[] {
  return [
    { label: "Now", value: currentLevel },
    ...forecast.points.slice(0, Math.max(0, horizon)).map((point) => ({
      label: "+" + point.hour + (point.hour === 1 ? " hr" : " hrs"),
      value: point.value,
      lower: point.lower,
      upper: point.upper,
    })),
  ]
}
