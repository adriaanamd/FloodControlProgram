import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const repositoryRoot = resolve(import.meta.dirname, "..", "..")

describe("Overview analytics visual contract", () => {
  it("renders chart-led operations sections with accessible SVG labels", () => {
    const source = readFileSync(
      resolve(
        repositoryRoot,
        "floodcontrol-frontend/src/widgets/overview-analytics/ui/OverviewAnalytics.tsx",
      ),
      "utf8",
    )

    expect(source).toContain("Citywide water level")
    expect(source).toContain("Alert activity")
    expect(source).toContain("Sensor status")
    expect(source).toContain("Two-hour forecast")
    expect(source).toContain("Sensors needing attention")
    expect(source).toContain("aria-label")
    expect(source).toContain("<svg")
  })
})
