type RowProps = {
  label: string
  value: string
}

export function Row({ label, value }: RowProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="text-[var(--text-dim)]">{label}</span>
      <span className="font-medium text-[var(--text)]">{value}</span>
    </div>
  )
}
