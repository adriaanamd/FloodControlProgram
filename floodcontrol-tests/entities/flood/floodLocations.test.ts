import { describe, expect, it } from "vitest"
import { floodLocations } from "../../../floodcontrol-frontend/src/entities/flood/model/mock"
import { getFloodLocationsByKind } from "../../../floodcontrol-frontend/src/entities/flood/model/selectors"

describe("flood location data", () => {
  it("keeps observed hotspots and drainage-risk segments separate", () => {
    expect(getFloodLocationsByKind(floodLocations, "observed-hotspot")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Rizal Avenue near Apo Rotunda" }),
      ]),
    )
    expect(
      getFloodLocationsByKind(floodLocations, "drainage-risk"),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Kessing Street drainage segment" }),
      ]),
    )
  })

  it("keeps every location within the Olongapo map bounds and uses source metadata", () => {
    expect(floodLocations.length).toBeGreaterThanOrEqual(10)
    expect(new Set(floodLocations.map((location) => location.id)).size).toBe(
      floodLocations.length,
    )
    expect(floodLocations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Rizal Avenue near Apo Rotunda",
          sourceUrl: expect.stringMatching(/(gmanetwork|newsinfo)/),
          coordinateAccuracy: "approximate",
        }),
      ]),
    )
    for (const location of floodLocations) {
      expect(location.latitude).toBeGreaterThan(14.8)
      expect(location.latitude).toBeLessThan(14.9)
      expect(location.longitude).toBeGreaterThan(120.25)
      expect(location.longitude).toBeLessThan(120.34)
      expect(location.label).not.toContain("Torunda")
    }
  })
})
