import { describe, expect, it } from "vitest"
import { filterSensors } from "../../../floodcontrol-frontend/src/entities/sensor/model/selectors"
import type { Sensor } from "../../../floodcontrol-frontend/src/entities/sensor/model/types"

const sensors: Sensor[] = [
  {
    id: "A",
    street: "A",
    zone: "1",
    level: 1,
    trend: "Stable",
    state: "Critical",
    latitude: 14.84,
    longitude: 120.285,
    coordinateAccuracy: "approximate",
    coordinateSource: "OpenStreetMap test fixture",
  },
  {
    id: "B",
    street: "B",
    zone: "2",
    level: 2,
    trend: "Stable",
    state: "Warning",
    latitude: 14.841,
    longitude: 120.286,
    coordinateAccuracy: "approximate",
    coordinateSource: "OpenStreetMap test fixture",
  },
]

describe("filterSensors", () => {
  it("returns every sensor for the all-sensors filter and only matching states otherwise", () => {
    expect(filterSensors(sensors, "All sensors")).toEqual(sensors)
    expect(filterSensors(sensors, "Critical")).toEqual([sensors[0]])
  })
})
