export type AlertSeverity = "Critical" | "Warning" | "Watch"

export type Alert = {
  severity: AlertSeverity
  title: string
  place: string
  time: string
}
