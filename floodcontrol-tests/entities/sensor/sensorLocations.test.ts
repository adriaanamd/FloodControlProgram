import { describe, expect, it } from "vitest"
import { sensors } from "../../../floodcontrol-frontend/src/entities/sensor/model/mock"

describe("sensor map locations", () => {
  it("uses explicit Olongapo street coordinates instead of screen positions", () => {
    expect(sensors).toHaveLength(16)
    expect(sensors.find((sensor) => sensor.id === "IF-048")).toMatchObject({
      latitude: 14.8396424,
      longitude: 120.2815857,
      coordinateAccuracy: "approximate",
    })

    for (const sensor of sensors) {
      expect(sensor).toEqual(
        expect.objectContaining({
          latitude: expect.any(Number),
          longitude: expect.any(Number),
          coordinateAccuracy: "approximate",
          coordinateSource: expect.stringContaining("OpenStreetMap"),
        }),
      )
      expect(sensor.latitude).toBeGreaterThan(14.81)
      expect(sensor.latitude).toBeLessThan(14.89)
      expect(sensor.longitude).toBeGreaterThan(120.25)
      expect(sensor.longitude).toBeLessThan(120.33)
      expect("x" in sensor).toBe(false)
      expect("y" in sensor).toBe(false)
    }
  })
})
