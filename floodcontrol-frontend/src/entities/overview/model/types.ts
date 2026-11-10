export type OverviewTone = "critical" | "warning" | "watch" | "normal" | "signal"

export type OverviewSeriesPoint = {
  label: string
  average: number
  peak: number
}

export type OverviewCount = {
  label: string
  value: number
  tone: OverviewTone
}

export type OverviewForecastPoint = {
  label: string
  value: number
  lower?: number
  upper?: number
}
