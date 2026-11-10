type SectionFolioProps = {
  index: string
  label: string
  className?: string
}

export function SectionFolio({
  index,
  label,
  className = "",
}: SectionFolioProps) {
  return (
    <div
      className={`flex items-center gap-3 font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-dim)] ${className}`}
    >
      <span className="text-[var(--signal)]">{index}</span>
      <span className="h-px w-8 bg-[var(--rule-strong)]" />
      <span>{label}</span>
    </div>
  )
}
