import type { SensorFilter } from "../../../entities/sensor/model/selectors"
import { Button } from "../../../shared/ui/Button"

export function SensorFilter({
  value,
  onChange,
}: {
  value: SensorFilter
  onChange: (value: SensorFilter) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {["All sensors", "Critical", "Warning", "Watch"].map((item) => (
        <Button
          key={item}
          onClick={() => onChange(item as SensorFilter)}
          className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium ${
            value === item
              ? "border-cyan-400 bg-cyan-400 text-slate-950"
              : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
          }`}
        >
          {item}
        </Button>
      ))}
    </div>
  )
}
