import { describe, expect, it } from 'vitest'
import { filterSensors } from '../../../floodcontrol-frontend/src/entities/sensor/model/selectors'
import type { Sensor } from '../../../floodcontrol-frontend/src/entities/sensor/model/types'

const sensors: Sensor[] = [
  { id: 'A', street: 'A', zone: '1', level: 1, trend: 'Stable', state: 'Critical', x: 0, y: 0 },
  { id: 'B', street: 'B', zone: '2', level: 2, trend: 'Stable', state: 'Warning', x: 0, y: 0 },
]

describe('filterSensors', () => {
  it('returns every sensor for the all-sensors filter and only matching states otherwise', () => {
    expect(filterSensors(sensors, 'All sensors')).toEqual(sensors)
    expect(filterSensors(sensors, 'Critical')).toEqual([sensors[0]])
  })
})
