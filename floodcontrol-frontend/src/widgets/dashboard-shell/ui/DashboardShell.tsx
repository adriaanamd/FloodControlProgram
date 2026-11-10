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
    <main className="min-h-screen bg-[var(--surface)] text-[var(--text)] selection:bg-[var(--signal)] selection:text-[var(--surface-deep)]">
      <DashboardNavigation
        user={user}
        activeNav={activeNav}
        mobileNav={mobileNav}
        onSelectNav={onSelectNav}
        onCloseMobileNav={onCloseMobileNav}
        onSignOut={onSignOut}
      />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-18 items-center gap-4 border-b border-[var(--rule)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-4 backdrop-blur-xl sm:px-7">
          <Button
            ariaLabel="Open navigation"
            onClick={onOpenMobileNav}
            className="p-2 text-[var(--text-muted)] hover:bg-[var(--surface-raised)] lg:hidden"
          >
            <Icon name="menu" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold uppercase tracking-[0.08em] sm:text-base">
              {activeNav}
            </p>
            <p className="hidden text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)] sm:block">
              Olongapo City · Demo operations
            </p>
          </div>
          <div className="hidden items-center gap-2 border border-[var(--rule-strong)] bg-[var(--signal-soft)] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--signal)] sm:flex">
            <span className="size-1.5 animate-pulse bg-[var(--signal)]" /> Demo data · sync active
          </div>
          <Button
            ariaLabel="Search"
            className="p-2.5 text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-white"
          >
            <Icon name="search" />
          </Button>
          <Button
            ariaLabel="Notifications"
            onClick={onToggleAlerts}
            className="relative p-2.5 text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-white"
          >
            <Icon name="bell" />
            <span className="absolute right-2 top-2 size-2 border-2 border-[var(--surface)] bg-[var(--danger)]" />
          </Button>
        </header>

        <div className="p-4 sm:p-7">{children}</div>
      </div>

      {alertsOpen && (
        <div className="fixed bottom-5 right-5 z-50 hidden w-80 border border-[var(--rule-strong)] bg-[var(--surface-raised)] p-4 shadow-2xl shadow-black/50 sm:block">
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center border border-[var(--danger)] bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-[var(--danger)]">
              <Icon name="alert" className="size-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Critical alert active</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                Rizal Avenue is rising rapidly at 12 cm per hour.
              </p>
            </div>
            <Button
              ariaLabel="Dismiss notification"
              onClick={onDismissAlert}
              className="text-[var(--text-dim)] hover:text-white"
            >
              <Icon name="close" className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}
