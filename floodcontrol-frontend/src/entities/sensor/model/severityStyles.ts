import type { SensorState } from "./types"

export const severityStyles: Record<SensorState, string> = {
  Critical:
    "bg-[var(--danger)] text-[var(--surface-deep)] border border-[var(--danger)]",
  Warning:
    "bg-[#ffd166] text-[var(--surface-deep)] border border-[#ffd166]",
  Watch:
    "bg-[var(--signal)] text-[var(--surface-deep)] border border-[var(--signal)]",
  Normal:
    "bg-[#8b947e] text-[var(--surface-deep)] border border-[#8b947e]",
}
