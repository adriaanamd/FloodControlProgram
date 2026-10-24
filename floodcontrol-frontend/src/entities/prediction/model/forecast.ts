import type { Sensor } from "../../sensor/model/types"
import { sensorHistories } from "./mock"
import type { ForecastPeriod, HoltForecast, SensorForecast } from "./types"

export const forecastPeriods: readonly ForecastPeriod[] = [
  "6 hours",
  "24 hours",
  "3 days",
  "7 days",
]

export const holtParameters = {
  alpha: 0.45,
  beta: 0.25,
} as const

const periodHours: Record<ForecastPeriod, number> = {
  "6 hours": 6,
  "24 hours": 24,
  "3 days": 72,
  "7 days": 168,
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value))
}

function riskForLevel(level: number) {
  if (level >= 60) return "Critical" as const
  if (level >= 45) return "Warning" as const
  if (level >= 30) return "Watch" as const
  return "Normal" as const
}

export function holtLinearForecast(
  values: readonly number[],
  horizon: number,
  alpha = holtParameters.alpha,
  beta = holtParameters.beta,
): HoltForecast {
  if (values.length < 2)
    throw new Error("Holt forecasting requires at least two observations")
  if (!Number.isInteger(horizon) || horizon < 1)
    throw new Error("Holt forecasting requires a positive integer horizon")

  let level = values[0]
  let trend = values[1] - values[0]
  const residuals: number[] = []

  for (let index = 1; index < values.length; index += 1) {
    const previousLevel = level
    const previousTrend = trend
    const predicted = previousLevel + previousTrend
    residuals.push(values[index] - predicted)
    level =
      alpha * values[index] + (1 - alpha) * (previousLevel + previousTrend)
    trend = beta * (level - previousLevel) + (1 - beta) * previousTrend
  }

  const rmse = Math.sqrt(
    residuals.reduce((sum, residual) => sum + residual ** 2, 0) /
      residuals.length,
  )
  const baseline = Math.max(Math.abs(level), 1)
  const confidence = Math.round(
    clamp(99 - (rmse / baseline) * 100 - (horizon / values.length) * 4, 0, 99),
  )
  const points = Array.from({ length: horizon }, (_, index) => {
    const hour = index + 1
    const value = Math.max(0, level + hour * trend)
    const uncertainty = 1.96 * rmse * Math.sqrt(1 + hour / values.length)
    return {
      hour,
      value: Number(value.toFixed(2)),
      lower: Number(Math.max(0, value - uncertainty).toFixed(2)),
      upper: Number((value + uncertainty).toFixed(2)),
    }
  })

  return {
    points,
    trend,
    rmse,
    uncertainty: points.at(-1)!.upper - points.at(-1)!.value,
    confidence,
  }
}

export function forecastSensor(
  sensor: Sensor,
  period: ForecastPeriod,
): SensorForecast {
  const history = sensorHistories[sensor.id]
  if (!history)
    throw new Error(`No mock history exists for sensor ${sensor.id}`)

  const forecast = holtLinearForecast(history, periodHours[period])
  const peak = forecast.points.reduce((highest, point) =>
    point.value > highest.value ? point : highest,
  )

  return {
    ...forecast,
    sensorId: sensor.id,
    period,
    currentLevel: sensor.level,
    peakLevel: peak.value,
    peakHour: peak.hour,
    risk: riskForLevel(peak.value),
    roadImpact: Math.max(1, Math.round(peak.value / 6)),
    populationExposed: Math.max(1, Math.round(peak.value * 30)),
  }
}
