export type FloodLocationKind = "observed-hotspot" | "drainage-risk"

export type FloodLocation = {
  id: string
  label: string
  kind: FloodLocationKind
  roadSegment: string
  area: string
  latitude: number
  longitude: number
  coordinateAccuracy: "approximate"
  coordinateSource: string
  evidence: string
  sourceUrl: string
  verifiedAt: string
}
