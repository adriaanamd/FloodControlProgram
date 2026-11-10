import type { FloodLocation, FloodLocationKind } from "./types"

export function getFloodLocationsByKind(
  locations: readonly FloodLocation[],
  kind: FloodLocationKind,
): FloodLocation[] {
  return locations.filter((location) => location.kind === kind)
}
