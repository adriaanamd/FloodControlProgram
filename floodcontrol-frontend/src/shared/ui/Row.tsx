export function Row({ label, value }: { label: string; value: string }) {
  return <div className="mb-3 flex items-center justify-between"><span className="text-slate-500">{label}</span><span className="font-medium text-slate-200">{value}</span></div>
}
