import type { Sensor, SensorState } from './types'

export type SensorFilter = 'All sensors' | SensorState

export function filterSensors(sensors: readonly Sensor[], filter: SensorFilter): Sensor[] {
  return filter === 'All sensors' ? [...sensors] : sensors.filter((sensor) => sensor.state === filter)
}
