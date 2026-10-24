import { describe, expect, it } from 'vitest'
import { sensors } from '../../../floodcontrol-frontend/src/entities/sensor/model/mock'
import { getForecastComparisonRows, getSensorForecast } from '../../../floodcontrol-frontend/src/entities/prediction/model/selectors'
import type { ForecastPeriod } from '../../../floodcontrol-frontend/src/entities/prediction/model/types'

const periods: ForecastPeriod[] = ['6 hours', '24 hours', '3 days', '7 days']

describe('predictive analytics selectors', () => {
  it('returns a computed forecast for every sensor and supported period', () => {
    for (const period of periods) {
      const rows = getForecastComparisonRows(period)

      expect(rows).toHaveLength(sensors.length)
      expect(rows.map((row) => row.sensorId)).toEqual(sensors.map((sensor) => sensor.id))
      expect(rows.every((row) => row.points.length > 0)).toBe(true)
    }
  })

  it('returns the selected sensor forecast for the requested period', () => {
    const forecast = getSensorForecast('IF-042', '24 hours')

    expect(forecast.sensorId).toBe('IF-042')
    expect(forecast.period).toBe('24 hours')
    expect(forecast.peakLevel).toBeGreaterThan(0)
    expect(forecast.peakHour).toBeGreaterThanOrEqual(1)
  })
})
