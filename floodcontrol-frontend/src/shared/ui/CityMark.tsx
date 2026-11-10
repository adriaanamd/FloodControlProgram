type CityMarkProps = {
  compact?: boolean
  className?: string
}

export function CityMark({ compact = false, className = "" }: CityMarkProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/assets/olongapo/logo-olongapo.png"
        alt="Olongapo City official seal"
        className={compact ? "size-9 object-contain" : "size-11 object-contain"}
      />
      {!compact && (
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-white">
            Olongapo City
          </p>
          <p className="font-display text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Flood Control
          </p>
        </div>
      )}
    </div>
  )
}
