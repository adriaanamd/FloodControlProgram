import type { ReactNode } from "react"
import type { MockUser } from "../../../entities/user/model/types"
import { DashboardNavigation } from "../../../features/dashboard-navigation/ui/DashboardNavigation"
import { Button } from "../../../shared/ui/Button"
import { Icon } from "../../../shared/ui/Icon"

type DashboardShellProps = {
  user: MockUser
  activeNav: string
  mobileNav: boolean
  alertsOpen: boolean
  children: ReactNode
  onSelectNav: (label: string) => void
  onOpenMobileNav: () => void
  onCloseMobileNav: () => void
  onToggleAlerts: () => void
  onDismissAlert: () => void
  onSignOut: () => void
}

export function DashboardShell({
  user,
  activeNav,
  mobileNav,
  alertsOpen,
  children,
  onSelectNav,
  onOpenMobileNav,
  onCloseMobileNav,
  onToggleAlerts,
  onDismissAlert,
  onSignOut,
}: DashboardShellProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-400/30">
      <DashboardNavigation
        user={user}
        activeNav={activeNav}
        mobileNav={mobileNav}
        onSelectNav={onSelectNav}
        onCloseMobileNav={onCloseMobileNav}
        onSignOut={onSignOut}
      />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-18 items-center gap-4 border-b border-white/8 bg-slate-950/80 px-4 backdrop-blur-xl sm:px-7">
          <Button
            ariaLabel="Open navigation"
            onClick={onOpenMobileNav}
            className="rounded-lg p-2 text-slate-300 hover:bg-white/5 lg:hidden"
          >
            <Icon name="menu" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold sm:text-base">
              {activeNav}
            </p>
            <p className="hidden text-xs text-slate-500 sm:block">
              Real-time flood intelligence · San Isidro City
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-3 py-1.5 text-xs font-medium text-emerald-300 sm:flex">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
            Live data
          </div>
          <Button
            ariaLabel="Search"
            className="rounded-xl p-2.5 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <Icon name="search" />
          </Button>
          <Button
            ariaLabel="Notifications"
            onClick={onToggleAlerts}
            className="relative rounded-xl p-2.5 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <Icon name="bell" />
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-slate-950 bg-rose-500" />
          </Button>
        </header>

        <div className="p-4 sm:p-7">{children}</div>
      </div>

      {alertsOpen && (
        <div className="fixed bottom-5 right-5 z-50 hidden w-80 rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl shadow-black/50 sm:block">
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-rose-500/15 text-rose-300">
              <Icon name="alert" className="size-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                Critical alert active
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Rizal Avenue is rising rapidly at 12 cm per hour.
              </p>
            </div>
            <Button
              ariaLabel="Dismiss notification"
              onClick={onDismissAlert}
              className="text-slate-500 hover:text-white"
            >
              <Icon name="close" className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}
