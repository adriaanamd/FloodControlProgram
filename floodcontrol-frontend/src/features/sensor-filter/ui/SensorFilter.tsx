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
          className={`shrink-0 border px-3 py-2 text-xs font-medium ${
            value === item
              ? "border-[var(--signal)] bg-[var(--signal)] text-[var(--surface-deep)]"
              : "border-[var(--rule)] bg-[var(--surface-raised)] text-[var(--text-muted)] hover:border-[var(--rule-strong)] hover:text-white"
          }`}
        >
          {item}
        </Button>
      ))}
    </div>
  )
}
