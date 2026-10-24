import { Button } from './Button'

export function PageHeading({ title, subtitle, action }: { title: string; subtitle: string; action: string }) {
  return <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-1 text-xs font-semibold tracking-[0.18em] text-cyan-400 uppercase">Tuesday, 24 June · Live operations</p><h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1><p className="mt-2 text-sm text-slate-400">{subtitle}</p></div><Button className="self-start rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 sm:self-auto">{action}</Button></div>
}
