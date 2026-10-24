import { describe, expect, it } from 'vitest'
import { getActiveAlerts } from '../../../floodcontrol-frontend/src/entities/alert/model/selectors'
import type { Alert } from '../../../floodcontrol-frontend/src/entities/alert/model/types'

const alerts: Alert[] = [
  { title: 'Critical', place: 'A', time: 'Now', severity: 'Critical' },
  { title: 'Warning', place: 'B', time: 'Now', severity: 'Warning' },
]

describe('getActiveAlerts', () => {
  it('removes only the first alert after acknowledgement', () => {
    expect(getActiveAlerts(alerts, false)).toEqual(alerts)
    expect(getActiveAlerts(alerts, true)).toEqual([alerts[1]])
  })
})
