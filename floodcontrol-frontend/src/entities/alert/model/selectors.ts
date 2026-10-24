import type { Alert } from './types'

export function getActiveAlerts(alerts: readonly Alert[], acknowledged: boolean): Alert[] {
  return acknowledged ? alerts.slice(1) : [...alerts]
}
