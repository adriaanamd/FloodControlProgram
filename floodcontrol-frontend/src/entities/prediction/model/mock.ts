import { sensors } from "../../sensor/model/mock"
import type { Sensor } from "../../sensor/model/types"

const historyLength = 24
const variationPattern = [-1.6, -0.8, 0, 0.9, 1.4, 0.6, -0.4, -1.1]

function parseTrendRate(trend: string) {
  const match = trend.match(/[+-]?\d+(?:\.\d+)?/)
  return match ? Number(match[0]) : 0
}

function createSensorHistory(sensor: Sensor, seed: number): readonly number[] {
  const rate = parseTrendRate(sensor.trend)
  const rawHistory = Array.from({ length: historyLength }, (_, hour) => {
    const trendComponent = rate * (hour - (historyLength - 1))
    const variation = variationPattern[(hour + seed) % variationPattern.length]
    return sensor.level + trendComponent + variation
  })
  const adjustment = sensor.level - rawHistory.at(-1)!

  return rawHistory.map((value) =>
    Number(Math.max(0, value + adjustment).toFixed(2)),
  )
}

export const sensorHistories: Readonly<Record<string, readonly number[]>> =
  Object.fromEntries(
    sensors.map((sensor, index) => [
      sensor.id,
      createSensorHistory(sensor, index),
    ]),
  )
