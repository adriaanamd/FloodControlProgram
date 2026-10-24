import type { SensorState } from "../../sensor/model/types"

export type ForecastPeriod = "6 hours" | "24 hours" | "3 days" | "7 days"

export type ForecastPoint = {
  hour: number
  value: number
  lower: number
  upper: number
}

export type HoltForecast = {
  points: readonly ForecastPoint[]
  trend: number
  rmse: number
  uncertainty: number
  confidence: number
}

export type SensorForecast = HoltForecast & {
  sensorId: string
  period: ForecastPeriod
  currentLevel: number
  peakLevel: number
  peakHour: number
  risk: SensorState
  roadImpact: number
  populationExposed: number
}
