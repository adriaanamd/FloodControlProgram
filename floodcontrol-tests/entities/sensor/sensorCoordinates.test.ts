import { describe, expect, it } from "vitest"
import { sensors } from "../../../floodcontrol-frontend/src/entities/sensor/model/mock"
import { getSensorCoordinates } from "../../../floodcontrol-frontend/src/entities/sensor/model/selectors"
import type { Sensor } from "../../../floodcontrol-frontend/src/entities/sensor/model/types"

describe("sensor map coordinates", () => {
  it("returns explicit coordinates for a valid sensor", () => {
    expect(getSensorCoordinates(sensors[0])).toEqual([14.83891, 120.28431])
  })

  it("rejects stale or malformed runtime sensor coordinates", () => {
    const staleSensor = {
      ...sensors[0],
      latitude: undefined,
      longitude: undefined,
    } as unknown as Sensor

    expect(getSensorCoordinates(staleSensor)).toBeNull()
  })
})
