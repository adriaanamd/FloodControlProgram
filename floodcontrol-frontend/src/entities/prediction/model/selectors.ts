import { sensors } from "../../sensor/model/mock"
import { forecastSensor } from "./forecast"
import type { ForecastPeriod, SensorForecast } from "./types"

export function getSensorForecast(
  sensorId: string,
  period: ForecastPeriod,
): SensorForecast {
  const sensor = sensors.find((item) => item.id === sensorId)
  if (!sensor) throw new Error(`Unknown sensor ${sensorId}`)
  return forecastSensor(sensor, period)
}

export function getForecastComparisonRows(
  period: ForecastPeriod,
): readonly SensorForecast[] {
  return sensors.map((sensor) => forecastSensor(sensor, period))
}
