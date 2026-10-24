import { useState } from "react"
import { sensors } from "../../../entities/sensor/model/mock"
import { type SensorFilter } from "../../../entities/sensor/model/selectors"
import type { Sensor } from "../../../entities/sensor/model/types"
import type { MockUser } from "../../../entities/user/model/types"
import { AuthScreen } from "../../../features/authentication/ui/AuthScreen"
import { DashboardOverview } from "../../../widgets/dashboard-overview/ui/DashboardOverview"
import { DashboardShell } from "../../../widgets/dashboard-shell/ui/DashboardShell"
import { DashboardWorkspace } from "../../../widgets/dashboard-workspace/ui/DashboardWorkspace"

export function DashboardPage() {
  const [user, setUser] = useState<MockUser | null>(null)
  const [activeNav, setActiveNav] = useState("Overview")
  const [filter, setFilter] = useState<SensorFilter>("All sensors")
  const [selectedSensor, setSelectedSensor] = useState<Sensor>(sensors[0])
  const [alertsOpen, setAlertsOpen] = useState(true)
  const [acknowledged, setAcknowledged] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)

  if (!user) return <AuthScreen onAuthenticate={setUser} />

  const selectNav = (label: string) => {
    setActiveNav(label)
    setMobileNav(false)
  }

  const signOut = () => {
    setUser(null)
    setActiveNav("Overview")
    setFilter("All sensors")
    setSelectedSensor(sensors[0])
    setAlertsOpen(true)
    setAcknowledged(false)
    setMobileNav(false)
  }

  return (
    <DashboardShell
      user={user}
      activeNav={activeNav}
      mobileNav={mobileNav}
      alertsOpen={alertsOpen}
      onSelectNav={selectNav}
      onOpenMobileNav={() => setMobileNav(true)}
      onCloseMobileNav={() => setMobileNav(false)}
      onToggleAlerts={() => setAlertsOpen(!alertsOpen)}
      onDismissAlert={() => setAlertsOpen(false)}
      onSignOut={signOut}
    >
      {activeNav === "Overview" ? (
        <DashboardOverview
          filter={filter}
          onFilterChange={setFilter}
          selectedSensor={selectedSensor}
          onSelectSensor={setSelectedSensor}
          acknowledged={acknowledged}
          onAcknowledge={() => setAcknowledged(true)}
        />
      ) : (
        <DashboardWorkspace tab={activeNav} />
      )}
    </DashboardShell>
  )
}
