import type { MockUser } from "../../../entities/user/model/types"
import { Button } from "../../../shared/ui/Button"
import { CityMark } from "../../../shared/ui/CityMark"
import { Icon, type IconName } from "../../../shared/ui/Icon"

const navigationItems = [
  ["01", "Overview", "dashboard"],
  ["02", "Live Map", "map"],
  ["03", "Sensor Network", "sensor"],
  ["04", "Predictive Analytics", "analytics"],
  ["05", "Alert Management", "alert"],
] as const

type DashboardNavigationProps = {
  user: MockUser
  activeNav: string
  mobileNav: boolean
  onSelectNav: (label: string) => void
  onCloseMobileNav: () => void
  onSignOut: () => void
}

export function DashboardNavigation({
  user,
  activeNav,
  mobileNav,
  onSelectNav,
  onCloseMobileNav,
  onSignOut,
}: DashboardNavigationProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[var(--rule)] bg-[var(--surface-deep)] p-5 transition-transform lg:translate-x-0 ${
        mobileNav ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-start justify-between">
        <CityMark />
        <Button
          ariaLabel="Close navigation"
          onClick={onCloseMobileNav}
          className="p-2 text-[var(--text-muted)] hover:bg-[var(--surface-raised)] lg:hidden"
        >
          <Icon name="close" />
        </Button>
      </div>
      <div className="mt-5 border-y border-[var(--rule)] py-3 text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
        Demo operations
      </div>

      <nav className="mt-8 space-y-1" aria-label="Dashboard navigation">
        {navigationItems.map(([index, label, icon]) => (
          <Button
            key={label}
            onClick={() => onSelectNav(label)}
            className={`flex w-full items-center gap-3 border-l-2 px-3 py-3 text-left text-xs ${
              activeNav === label
                ? "border-[var(--signal)] bg-[var(--signal-soft)] text-[var(--signal)]"
                : "border-transparent text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-white"
            }`}
          >
            <span className="w-5 text-[10px] text-[var(--text-dim)]">
              {index}
            </span>
            <Icon name={icon as IconName} className="size-4" />
            <span className="flex-1">{label}</span>
            {label === "Alert Management" && (
              <span className="border border-[var(--danger)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--danger)]">
                3
              </span>
            )}
          </Button>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="mb-5 border border-[var(--rule-strong)] bg-[var(--signal-soft)] p-4">
          <div className="mb-2 flex items-center gap-2 text-[var(--signal)]">
            <Icon name="radio" className="size-4" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
              System status
            </span>
          </div>
          <p className="text-xs font-medium text-white">Demo data · sync active</p>
          <p className="mt-1 text-[10px] text-[var(--text-dim)]">Last sync: just now</p>
        </div>
        <Button className="flex w-full items-center gap-3 px-3 py-2.5 text-xs text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-white">
          <Icon name="settings" className="size-4" /> Settings
        </Button>
        <Button
          onClick={onSignOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-xs text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-white"
        >
          <Icon name="chevron" className="size-4 rotate-180" /> Sign out
        </Button>
        <div className="mt-3 flex items-center gap-3 border-t border-[var(--rule)] pt-5">
          <div className="grid size-9 place-items-center border border-[var(--rule-strong)] bg-[var(--signal-soft)] text-xs font-bold text-[var(--signal)]">
            {user.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white">{user.name}</p>
            <p className="text-[10px] text-[var(--text-dim)]">{user.role}</p>
          </div>
          <Icon
            name="chevron"
            className="ml-auto size-4 text-[var(--text-dim)]"
          />
        </div>
      </div>
    </aside>
  )
}
