import type { SensorState } from './types'

export const severityStyles: Record<SensorState, string> = {
  Critical: 'bg-rose-500 text-white shadow-rose-500/30',
  Warning: 'bg-amber-400 text-slate-950 shadow-amber-400/30',
  Watch: 'bg-cyan-400 text-slate-950 shadow-cyan-400/30',
  Normal: 'bg-emerald-400 text-slate-950 shadow-emerald-400/30',
}
