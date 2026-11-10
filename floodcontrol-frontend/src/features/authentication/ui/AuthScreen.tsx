import { useState } from "react"
import type { MockUser } from "../../../entities/user/model/types"
import { Button } from "../../../shared/ui/Button"
import { CityMark } from "../../../shared/ui/CityMark"
import { Icon } from "../../../shared/ui/Icon"
import { SectionFolio } from "../../../shared/ui/SectionFolio"
import { TextField } from "../../../shared/ui/TextField"

export function AuthScreen({
  onAuthenticate,
}: {
  onAuthenticate: (user: MockUser) => void
}) {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [role, setRole] = useState<MockUser["role"]>("DRRM Monitor")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const submit = () => {
    if (
      (mode === "signup" && !name.trim()) ||
      !email.trim() ||
      !password.trim()
    ) {
      setError("Complete all required fields to continue.")
      return
    }

    onAuthenticate({
      name:
        mode === "signup"
          ? name
          : role === "Administrator"
            ? "Alex Morgan"
            : "Jamie Reyes",
      email,
      role,
    })
  }

  const useDemo = (demoRole: MockUser["role"]) => {
    setRole(demoRole)
    setEmail(
      demoRole === "Administrator"
        ? "admin@iflood.demo"
        : "monitor@iflood.demo",
    )
    setPassword("demo123")
    setError("")
  }

  return (
    <main className="min-h-screen bg-[var(--surface-deep)] text-[var(--text)] lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden min-h-screen overflow-hidden border-r border-[var(--rule)] lg:flex lg:flex-col lg:justify-between">
        <img
          src="/assets/olongapo/main-banner.png"
          alt=""
          className="absolute inset-0 size-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,5,.94),rgba(5,6,5,.68)),linear-gradient(0deg,rgba(5,6,5,.94),transparent_55%)]" />
        <div className="relative p-10">
          <CityMark />
        </div>
        <div className="relative max-w-2xl p-10">
          <SectionFolio index="00" label="Demo environment" />
          <h1 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-tight text-white xl:text-6xl">
            Flood intelligence for Olongapo City.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--text-muted)]">
            Monitor sensors, assess rising water levels, and coordinate response
            from one operational view.
          </p>
          <div className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-[var(--rule)] border-y border-[var(--rule)]">
            {[
              ["50", "IoT sensors"],
              ["5", "Districts"],
              ["12s", "Refresh rate"],
            ].map(([value, label]) => (
              <div key={label} className="px-4 py-4 first:pl-0">
                <p className="font-display text-2xl font-semibold text-white">
                  {value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative p-10 text-xs text-[var(--text-dim)]">
          Official city identity asset · FloodControl demo
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <CityMark />
          </div>
          <SectionFolio index="ACCESS" label="Olongapo City operations" />
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            {mode === "login"
              ? "Sign in to access the flood monitoring command center."
              : "Register a demo user for the monitoring platform."}
          </p>

          <div className="mt-7 grid grid-cols-2 border border-[var(--rule)] bg-[var(--surface-raised)] p-1">
            <Button
              onClick={() => {
                setMode("login")
                setError("")
              }}
              className={`py-2.5 text-sm font-medium ${
                mode === "login"
                  ? "bg-[var(--signal)] text-[var(--surface-deep)]"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              Log in
            </Button>
            <Button
              onClick={() => {
                setMode("signup")
                setError("")
              }}
              className={`py-2.5 text-sm font-medium ${
                mode === "signup"
                  ? "bg-[var(--signal)] text-[var(--surface-deep)]"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              Sign up
            </Button>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Access role
            </p>
            <div className="grid grid-cols-2 gap-px border border-[var(--rule)] bg-[var(--rule)]">
              {(["Administrator", "DRRM Monitor"] as MockUser["role"][]).map(
                (item) => (
                  <Button
                    key={item}
                    onClick={() => setRole(item)}
                    className={`bg-[var(--surface-raised)] p-4 text-left ${
                      role === item
                        ? "border-l-2 border-[var(--signal)] bg-[var(--signal-soft)]"
                        : "hover:bg-[var(--surface-elevated)]"
                    }`}
                  >
                    <span
                      className={`grid size-8 place-items-center border border-[var(--rule)] ${
                        role === item
                          ? "bg-[var(--signal)] text-[var(--surface-deep)]"
                          : "text-[var(--text-muted)]"
                      }`}
                    >
                      <Icon
                        name={
                          item === "Administrator" ? "settings" : "activity"
                        }
                        className="size-4"
                      />
                    </span>
                    <span className="mt-3 block text-xs font-semibold text-white">
                      {item}
                    </span>
                    <span className="mt-1 block text-[10px] leading-relaxed text-[var(--text-dim)]">
                      {item === "Administrator"
                        ? "Full system and user controls"
                        : "Monitoring and response tools"}
                    </span>
                  </Button>
                ),
              )}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {mode === "signup" && (
              <TextField
                label="Full name"
                value={name}
                onChange={setName}
                placeholder="Enter your full name"
              />
            )}
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="name@drrm.gov.ph"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <p className="mt-3 border border-[color-mix(in_srgb,var(--danger)_40%,transparent)] bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] px-3 py-2 text-xs text-[var(--danger)]">
              {error}
            </p>
          )}
          <Button
            onClick={submit}
            className="mt-5 w-full bg-[var(--signal)] py-3 text-sm font-semibold text-[var(--surface-deep)] hover:bg-[#ffd166]"
          >
            {mode === "login" ? "Access command center" : "Create account"}
          </Button>

          {mode === "login" && (
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-[var(--rule)]" />
                <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
                  Demo access
                </span>
                <span className="h-px flex-1 bg-[var(--rule)]" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-px border border-[var(--rule)] bg-[var(--rule)]">
                <Button
                  onClick={() => useDemo("Administrator")}
                  className="bg-[var(--surface-raised)] px-3 py-2.5 text-xs text-[var(--text-muted)] hover:bg-[var(--surface-elevated)] hover:text-white"
                >
                  Use Admin demo
                </Button>
                <Button
                  onClick={() => useDemo("DRRM Monitor")}
                  className="bg-[var(--surface-raised)] px-3 py-2.5 text-xs text-[var(--text-muted)] hover:bg-[var(--surface-elevated)] hover:text-white"
                >
                  Use Monitor demo
                </Button>
              </div>
              <p className="mt-3 text-center text-[10px] text-[var(--text-dim)]">
                Select a demo, then access the command center.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
