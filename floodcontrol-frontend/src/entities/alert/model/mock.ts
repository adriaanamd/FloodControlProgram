import type { Alert } from "./types"

export const alerts: readonly Alert[] = [
  {
    severity: "Critical",
    title: "Rapid water rise detected",
    place: "Rizal Ave. & Mabini St.",
    time: "2 min ago",
  },
  {
    severity: "Warning",
    title: "Threshold level exceeded",
    place: "Quezon Blvd. underpass",
    time: "8 min ago",
  },
  {
    severity: "Watch",
    title: "Rainfall intensity increasing",
    place: "District 4 catchment",
    time: "16 min ago",
  },
]
