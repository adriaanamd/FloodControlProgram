export function TextField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-slate-400">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
      />
    </label>
  )
}
