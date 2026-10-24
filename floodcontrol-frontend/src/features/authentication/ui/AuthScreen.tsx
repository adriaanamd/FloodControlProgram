import { useState } from "react"
import type { MockUser } from "../../../entities/user/model/types"
import { Button } from "../../../shared/ui/Button"
import { Icon } from "../../../shared/ui/Icon"
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
    <main className="relative grid min-h-screen overflow-hidden bg-slate-950 text-slate-100 lg:grid-cols-[1.05fr_.95fr]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,.12),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,.12),transparent_35%)]" />
      <section className="relative hidden min-h-screen flex-col justify-between border-r border-white/8 p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-cyan-400 text-slate-950">
            <Icon name="droplet" />
          </div>
          <div>
            <p className="text-xl font-semibold">
              iFlood <span className="text-cyan-400">2.0</span>
            </p>
            <p className="text-[10px] tracking-[0.22em] text-slate-500 uppercase">
              Flood Intelligence Platform
            </p>
          </div>
        </div>
        <div className="max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/8 px-3 py-1.5 text-xs text-cyan-300">
            <span className="size-1.5 animate-pulse rounded-full bg-cyan-400" />
            Citywide network online
          </div>
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-white">
            Street-level awareness.
            <br />
            <span className="text-cyan-400">Faster flood response.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-400">
            Monitor distributed IoT sensors, predict flood risk, and coordinate
            DRRM response from one operational view.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              ["50", "IoT sensors"],
              ["5", "Districts"],
              ["12s", "Refresh rate"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/8 bg-white/[0.035] p-4"
              >
                <p className="text-2xl font-semibold text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-600">
          San Isidro City Disaster Risk Reduction & Management Office
        </p>
      </section>

      <section className="relative flex min-h-screen items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid size-10 place-items-center rounded-xl bg-cyan-400 text-slate-950">
              <Icon name="droplet" />
            </div>
            <p className="text-xl font-semibold">
              iFlood <span className="text-cyan-400">2.0</span>
            </p>
          </div>
          <p className="text-xs font-semibold tracking-[0.18em] text-cyan-400 uppercase">
            Secure operations access
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {mode === "login"
              ? "Sign in to access the flood monitoring command center."
              : "Register a demo user for the monitoring platform."}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-2 rounded-xl bg-slate-900 p-1">
            <Button
              onClick={() => {
                setMode("login")
                setError("")
              }}
              className={`rounded-lg py-2.5 text-sm font-medium ${
                mode === "login"
                  ? "bg-slate-700 text-white shadow"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              Log in
            </Button>
            <Button
              onClick={() => {
                setMode("signup")
                setError("")
              }}
              className={`rounded-lg py-2.5 text-sm font-medium ${
                mode === "signup"
                  ? "bg-slate-700 text-white shadow"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              Sign up
            </Button>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-medium text-slate-400">
              Access role
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(["Administrator", "DRRM Monitor"] as MockUser["role"][]).map(
                (item) => (
                  <Button
                    key={item}
                    onClick={() => setRole(item)}
                    className={`rounded-xl border p-3 text-left ${
                      role === item
                        ? "border-cyan-400/60 bg-cyan-400/8"
                        : "border-white/10 bg-white/[0.025] hover:border-white/20"
                    }`}
                  >
                    <span
                      className={`grid size-8 place-items-center rounded-lg ${
                        role === item
                          ? "bg-cyan-400 text-slate-950"
                          : "bg-slate-800 text-slate-400"
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
                    <span className="mt-1 block text-[10px] leading-relaxed text-slate-500">
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
            <p className="mt-3 rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {error}
            </p>
          )}
          <Button
            onClick={submit}
            className="mt-5 w-full rounded-xl bg-cyan-400 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 hover:bg-cyan-300"
          >
            {mode === "login" ? "Access command center" : "Create account"}
          </Button>

          {mode === "login" && (
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-white/8" />
                <span className="text-[10px] tracking-wider text-slate-600 uppercase">
                  Demo access
                </span>
                <span className="h-px flex-1 bg-white/8" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button
                  onClick={() => useDemo("Administrator")}
                  className="rounded-xl border border-white/10 px-3 py-2.5 text-xs text-slate-300 hover:bg-white/5"
                >
                  Use Admin demo
                </Button>
                <Button
                  onClick={() => useDemo("DRRM Monitor")}
                  className="rounded-xl border border-white/10 px-3 py-2.5 text-xs text-slate-300 hover:bg-white/5"
                >
                  Use Monitor demo
                </Button>
              </div>
              <p className="mt-3 text-center text-[10px] text-slate-600">
                Select a demo, then access the command center.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
