import { describe, expect, it } from "vitest"
import { alerts } from "../../../floodcontrol-frontend/src/entities/alert/model/mock"
import { getSensorForecast } from "../../../floodcontrol-frontend/src/entities/prediction/model/selectors"
import { sensorHistories } from "../../../floodcontrol-frontend/src/entities/prediction/model/mock"
import { sensors } from "../../../floodcontrol-frontend/src/entities/sensor/model/mock"
import {
  getAlertCounts,
  getAttentionSensors,
  getCitywideHistory,
  getOverviewForecast,
  getSensorStateCounts,
} from "../../../floodcontrol-frontend/src/entities/overview/model/selectors"

describe("overview analytics selectors", () => {
  it("aggregates each history hour into average and peak series points", () => {
    const series = getCitywideHistory(sensors, sensorHistories)

    expect(series).toHaveLength(24)
    expect(series[0]).toMatchObject({ label: "-23h" })
    expect(series.at(-1)?.label).toBe("Now")
    expect(series.at(-1)?.peak).toBe(68)
  })

  it("counts alerts and sensors in stable severity order", () => {
    expect(getAlertCounts(alerts, false).map((item) => item.label)).toEqual([
      "Critical",
      "Warning",
      "Watch",
    ])
    expect(getAlertCounts(alerts, false).map((item) => item.value)).toEqual([
      1, 1, 1,
    ])
    expect(getSensorStateCounts(sensors).map((item) => item.label)).toEqual([
      "Critical",
      "Warning",
      "Watch",
      "Normal",
    ])
  })

  it("orders attention sensors by severity and descending level", () => {
    const result = getAttentionSensors(sensors, 4)

    expect(result.map((sensor) => sensor.id)).toEqual([
      "IF-042",
      "IF-017",
      "IF-034",
      "IF-014",
    ])
  })

  it("returns Now plus the requested forecast horizon", () => {
    const forecast = getSensorForecast("IF-042", "6 hours")

    expect(
      getOverviewForecast(68, forecast, 2).map((point) => point.label),
    ).toEqual(["Now", "+1 hr", "+2 hrs"])
  })
})
