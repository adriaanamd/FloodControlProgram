import type { MockUser } from '../../../entities/user/model/types'
import { Button } from '../../../shared/ui/Button'
import { Icon, type IconName } from '../../../shared/ui/Icon'

type DashboardNavigationProps = {
  user: MockUser
  activeNav: string
  mobileNav: boolean
  onSelectNav: (label: string) => void
  onCloseMobileNav: () => void
  onSignOut: () => void
}

export function DashboardNavigation({ user, activeNav, mobileNav, onSelectNav, onCloseMobileNav, onSignOut }: DashboardNavigationProps) {
  return <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/8 bg-slate-950/95 p-5 backdrop-blur-xl transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20"><Icon name="droplet" /></div>
        <div><p className="text-lg font-semibold tracking-tight">iFlood <span className="text-cyan-400">2.0</span></p><p className="text-[10px] font-medium tracking-[0.2em] text-slate-500 uppercase">City Operations</p></div>
      </div>
      <Button ariaLabel="Close navigation" onClick={onCloseMobileNav} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden"><Icon name="close" /></Button>
    </div>

    <nav className="mt-10 space-y-1">
      {[
        ['Overview', 'dashboard'],
        ['Live Map', 'map'],
        ['Sensor Network', 'sensor'],
        ['Predictive Analytics', 'analytics'],
        ['Alert Management', 'alert'],
      ].map(([label, icon]) => (
        <Button key={label} onClick={() => onSelectNav(label)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${activeNav === label ? 'bg-cyan-400/10 font-medium text-cyan-300' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`}>
          <Icon name={icon as IconName} className="size-4.5" />{label}
          {label === 'Alert Management' && <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">3</span>}
        </Button>
      ))}
    </nav>

    <div className="mt-auto">
      <div className="mb-5 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
        <div className="mb-2 flex items-center gap-2 text-cyan-300"><Icon name="radio" className="size-4" /><span className="text-xs font-semibold">SYSTEM STATUS</span></div>
        <p className="text-sm font-medium">All services operational</p>
        <p className="mt-1 text-xs text-slate-500">Last sync: just now</p>
      </div>
      <Button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="settings" className="size-4.5" /> Settings</Button>
      <Button onClick={onSignOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="chevron" className="size-4.5 rotate-180" /> Sign out</Button>
      <div className="mt-3 flex items-center gap-3 border-t border-white/8 pt-5">
        <div className="grid size-9 place-items-center rounded-full bg-indigo-500 text-xs font-bold">{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
        <div className="min-w-0"><p className="truncate text-sm font-medium">{user.name}</p><p className="text-xs text-slate-500">{user.role}</p></div>
        <Icon name="chevron" className="ml-auto size-4 text-slate-600" />
      </div>
    </div>
  </aside>
}
