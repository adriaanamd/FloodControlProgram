import { describe, expect, it } from 'vitest'
import { holtLinearForecast } from '../../../floodcontrol-frontend/src/entities/prediction/model/forecast'

describe('holtLinearForecast', () => {
  it('projects a rising sensor series with a positive trend and bounded uncertainty', () => {
    const result = holtLinearForecast([10, 12, 14, 16, 18], 6)

    expect(result.points).toHaveLength(6)
    expect(result.trend).toBeGreaterThan(0)
    expect(result.points.at(-1)?.value).toBeGreaterThan(result.points[0].value)
    expect(result.confidence).toBeGreaterThanOrEqual(0)
    expect(result.confidence).toBeLessThanOrEqual(99)
    expect(result.uncertainty).toBeGreaterThanOrEqual(0)
  })
})
