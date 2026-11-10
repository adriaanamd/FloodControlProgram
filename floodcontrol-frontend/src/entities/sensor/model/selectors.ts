import type { Sensor, SensorState } from "./types"

export type SensorFilter = "All sensors" | SensorState

export function filterSensors(
  sensors: readonly Sensor[],
  filter: SensorFilter,
): Sensor[] {
  return filter === "All sensors"
    ? [...sensors]
    : sensors.filter((sensor) => sensor.state === filter)
}

export function getSensorCoordinates(
  sensor: Pick<Sensor, "latitude" | "longitude">,
): [number, number] | null {
  return Number.isFinite(sensor.latitude) && Number.isFinite(sensor.longitude)
    ? [sensor.latitude, sensor.longitude]
    : null
}
