import { useMemo, useState } from 'react'

type IconName =
  | 'activity'
  | 'alert'
  | 'analytics'
  | 'bell'
  | 'chevron'
  | 'clock'
  | 'close'
  | 'dashboard'
  | 'droplet'
  | 'layers'
  | 'map'
  | 'menu'
  | 'radio'
  | 'rain'
  | 'search'
  | 'sensor'
  | 'settings'
  | 'trend'
  | 'users'

function Icon({ name, className = 'size-5' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    activity: <><path d="M3 12h4l2.5-7 5 14 2.5-7h4" /></>,
    alert: <><path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 9v4m0 3h.01" /></>,
    analytics: <><path d="M4 19V9m6 10V5m6 14v-7m4 7H2" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></>,
    chevron: <><path d="m9 18 6-6-6-6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    droplet: <><path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" /><path d="M9 3v15m6-12v15" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    radio: <><circle cx="12" cy="12" r="2" /><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14" /></>,
    rain: <><path d="M7 17a4 4 0 1 1 1-7.9A5.5 5.5 0 0 1 18.7 11 3 3 0 0 1 18 17H7Z" /><path d="m8 20-.5 1m5.5-1-.5 1m5.5-1-.5 1" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    sensor: <><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M10 7h4m-4 4h4m-4 4h4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    trend: <><path d="m3 17 6-6 4 4 8-9" /><path d="M15 6h6v6" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0m1-15a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4.6" /></>,
  }
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function Button({ children, className = '', onClick, ariaLabel }: { children: React.ReactNode; className?: string; onClick?: () => void; ariaLabel?: string }) {
  return <button type="button" aria-label={ariaLabel} onClick={onClick} className={`cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${className}`}>{children}</button>
}

function TextField({ label, type = 'text', value, onChange, placeholder }: { label: string; type?: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block"><span className="mb-2 block text-xs font-medium text-slate-400">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10" /></label>
}

type MockUser = { name: string; email: string; role: 'Administrator' | 'DRRM Monitor' }

function AuthScreen({ onAuthenticate }: { onAuthenticate: (user: MockUser) => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [role, setRole] = useState<MockUser['role']>('DRRM Monitor')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    if ((mode === 'signup' && !name.trim()) || !email.trim() || !password.trim()) {
      setError('Complete all required fields to continue.')
      return
    }
    onAuthenticate({ name: mode === 'signup' ? name : role === 'Administrator' ? 'Alex Morgan' : 'Jamie Reyes', email, role })
  }

  const useDemo = (demoRole: MockUser['role']) => {
    setRole(demoRole)
    setEmail(demoRole === 'Administrator' ? 'admin@iflood.demo' : 'monitor@iflood.demo')
    setPassword('demo123')
    setError('')
  }

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-slate-950 text-slate-100 lg:grid-cols-[1.05fr_.95fr]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,.12),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,.12),transparent_35%)]" />
      <section className="relative hidden min-h-screen flex-col justify-between border-r border-white/8 p-12 lg:flex">
        <div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-xl bg-cyan-400 text-slate-950"><Icon name="droplet" /></div><div><p className="text-xl font-semibold">iFlood <span className="text-cyan-400">2.0</span></p><p className="text-[10px] tracking-[0.22em] text-slate-500 uppercase">Flood Intelligence Platform</p></div></div>
        <div className="max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/8 px-3 py-1.5 text-xs text-cyan-300"><span className="size-1.5 animate-pulse rounded-full bg-cyan-400" />Citywide network online</div>
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-white">Street-level awareness.<br /><span className="text-cyan-400">Faster flood response.</span></h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-400">Monitor distributed IoT sensors, predict flood risk, and coordinate DRRM response from one operational view.</p>
          <div className="mt-10 grid grid-cols-3 gap-3">{[['50', 'IoT sensors'], ['5', 'Districts'], ['12s', 'Refresh rate']].map(([value, label]) => <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4"><p className="text-2xl font-semibold text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>)}</div>
        </div>
        <p className="text-xs text-slate-600">San Isidro City Disaster Risk Reduction & Management Office</p>
      </section>

      <section className="relative flex min-h-screen items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden"><div className="grid size-10 place-items-center rounded-xl bg-cyan-400 text-slate-950"><Icon name="droplet" /></div><p className="text-xl font-semibold">iFlood <span className="text-cyan-400">2.0</span></p></div>
          <p className="text-xs font-semibold tracking-[0.18em] text-cyan-400 uppercase">Secure operations access</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">{mode === 'login' ? 'Welcome back' : 'Create an account'}</h2>
          <p className="mt-2 text-sm text-slate-500">{mode === 'login' ? 'Sign in to access the flood monitoring command center.' : 'Register a demo user for the monitoring platform.'}</p>

          <div className="mt-7 grid grid-cols-2 gap-2 rounded-xl bg-slate-900 p-1">
            <Button onClick={() => { setMode('login'); setError('') }} className={`rounded-lg py-2.5 text-sm font-medium ${mode === 'login' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-white'}`}>Log in</Button>
            <Button onClick={() => { setMode('signup'); setError('') }} className={`rounded-lg py-2.5 text-sm font-medium ${mode === 'signup' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-white'}`}>Sign up</Button>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-medium text-slate-400">Access role</p>
            <div className="grid grid-cols-2 gap-3">
              {(['Administrator', 'DRRM Monitor'] as MockUser['role'][]).map((item) => <Button key={item} onClick={() => setRole(item)} className={`rounded-xl border p-3 text-left ${role === item ? 'border-cyan-400/60 bg-cyan-400/8' : 'border-white/10 bg-white/[0.025] hover:border-white/20'}`}><span className={`grid size-8 place-items-center rounded-lg ${role === item ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}><Icon name={item === 'Administrator' ? 'settings' : 'activity'} className="size-4" /></span><span className="mt-3 block text-xs font-semibold text-white">{item}</span><span className="mt-1 block text-[10px] leading-relaxed text-slate-500">{item === 'Administrator' ? 'Full system and user controls' : 'Monitoring and response tools'}</span></Button>)}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {mode === 'signup' && <TextField label="Full name" value={name} onChange={setName} placeholder="Enter your full name" />}
            <TextField label="Email address" type="email" value={email} onChange={setEmail} placeholder="name@drrm.gov.ph" />
            <TextField label="Password" type="password" value={password} onChange={setPassword} placeholder="Enter your password" />
          </div>
          {error && <p className="mt-3 rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</p>}
          <Button onClick={submit} className="mt-5 w-full rounded-xl bg-cyan-400 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 hover:bg-cyan-300">{mode === 'login' ? 'Access command center' : 'Create account'}</Button>

          {mode === 'login' && <div className="mt-6"><div className="flex items-center gap-3"><span className="h-px flex-1 bg-white/8" /><span className="text-[10px] tracking-wider text-slate-600 uppercase">Demo access</span><span className="h-px flex-1 bg-white/8" /></div><div className="mt-4 grid grid-cols-2 gap-3"><Button onClick={() => useDemo('Administrator')} className="rounded-xl border border-white/10 px-3 py-2.5 text-xs text-slate-300 hover:bg-white/5">Use Admin demo</Button><Button onClick={() => useDemo('DRRM Monitor')} className="rounded-xl border border-white/10 px-3 py-2.5 text-xs text-slate-300 hover:bg-white/5">Use Monitor demo</Button></div><p className="mt-3 text-center text-[10px] text-slate-600">Select a demo, then access the command center.</p></div>}
        </div>
      </section>
    </main>
  )
}

const sensors = [
  { id: 'IF-042', street: 'Rizal Ave. & Mabini St.', zone: 'District 3', level: 68, state: 'Critical', trend: '+12 cm/hr', x: 43, y: 43 },
  { id: 'IF-017', street: 'Quezon Blvd. underpass', zone: 'District 1', level: 52, state: 'Warning', trend: '+7 cm/hr', x: 67, y: 27 },
  { id: 'IF-031', street: 'Luna St. drainage', zone: 'District 4', level: 39, state: 'Watch', trend: '+3 cm/hr', x: 72, y: 63 },
  { id: 'IF-009', street: 'Bonifacio Ave.', zone: 'District 2', level: 21, state: 'Normal', trend: 'Stable', x: 27, y: 66 },
  { id: 'IF-026', street: 'Del Pilar St.', zone: 'District 3', level: 17, state: 'Normal', trend: '-1 cm/hr', x: 52, y: 72 },
  { id: 'IF-003', street: 'City Hall Plaza', zone: 'District 1', level: 12, state: 'Normal', trend: 'Stable', x: 18, y: 22 },
  { id: 'IF-006', street: 'Burgos Bridge', zone: 'District 1', level: 34, state: 'Watch', trend: '+2 cm/hr', x: 35, y: 18 },
  { id: 'IF-011', street: 'Market Access Road', zone: 'District 2', level: 29, state: 'Normal', trend: '+1 cm/hr', x: 84, y: 16 },
  { id: 'IF-014', street: 'Jacinto St. creek', zone: 'District 2', level: 43, state: 'Warning', trend: '+5 cm/hr', x: 15, y: 48 },
  { id: 'IF-019', street: 'National Highway km 4', zone: 'District 2', level: 18, state: 'Normal', trend: 'Stable', x: 86, y: 42 },
  { id: 'IF-023', street: 'San Roque Elementary', zone: 'District 3', level: 25, state: 'Normal', trend: '-1 cm/hr', x: 61, y: 48 },
  { id: 'IF-029', street: 'Rivera Subdivision', zone: 'District 3', level: 37, state: 'Watch', trend: '+4 cm/hr', x: 34, y: 80 },
  { id: 'IF-034', street: 'Coastal Road junction', zone: 'District 4', level: 47, state: 'Warning', trend: '+6 cm/hr', x: 89, y: 73 },
  { id: 'IF-038', street: 'P. Gomez St.', zone: 'District 4', level: 15, state: 'Normal', trend: 'Stable', x: 75, y: 84 },
  { id: 'IF-045', street: 'North Terminal', zone: 'District 5', level: 23, state: 'Normal', trend: '+1 cm/hr', x: 50, y: 13 },
  { id: 'IF-048', street: 'Malaya Creek', zone: 'District 5', level: 41, state: 'Watch', trend: '+3 cm/hr', x: 10, y: 82 },
]

const alerts = [
  { severity: 'Critical', title: 'Rapid water rise detected', place: 'Rizal Ave. & Mabini St.', time: '2 min ago' },
  { severity: 'Warning', title: 'Threshold level exceeded', place: 'Quezon Blvd. underpass', time: '8 min ago' },
  { severity: 'Watch', title: 'Rainfall intensity increasing', place: 'District 4 catchment', time: '16 min ago' },
]

const severityStyles: Record<string, string> = {
  Critical: 'bg-rose-500 text-white shadow-rose-500/30',
  Warning: 'bg-amber-400 text-slate-950 shadow-amber-400/30',
  Watch: 'bg-cyan-400 text-slate-950 shadow-cyan-400/30',
  Normal: 'bg-emerald-400 text-slate-950 shadow-emerald-400/30',
}

function Workspace({ tab }: { tab: string }) {
  const [view, setView] = useState('All')
  const [selected, setSelected] = useState(sensors[0])
  const [period, setPeriod] = useState('24 hours')
  const [alertState, setAlertState] = useState<Record<number, string>>({})
  const filtered = view === 'All' ? sensors : sensors.filter((item) => item.state === view || item.zone === view)

  const title: Record<string, [string, string]> = {
    'Live Map': ['Citywide live map', 'Street-level readings from IoT sensors across five districts'],
    'Sensor Network': ['IoT sensor network', 'Monitor connectivity, power, calibration, and maintenance'],
    'Predictive Analytics': ['Predictive analytics', 'Short-term flood forecasts using rainfall, terrain, and water-level trends'],
    'Alert Management': ['Alert management', 'Triage incidents, assign responders, and track resolution'],
  }

  if (tab === 'Live Map') return (
    <div>
      <PageHeading title={title[tab][0]} subtitle={title[tab][1]} action="Export map" />
      <div className="mb-4 flex flex-wrap gap-2">
        {['All', 'Critical', 'Warning', 'Watch', 'District 1', 'District 2', 'District 3', 'District 4', 'District 5'].map((item) => <Button key={item} onClick={() => setView(item)} className={`rounded-lg border px-3 py-2 text-xs ${view === item ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}>{item}</Button>)}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="relative min-h-[42rem] overflow-hidden rounded-2xl border border-white/8 bg-[#0d1b26]">
          <div className="map-grid absolute inset-0 opacity-60" />
          <svg className="absolute inset-0 size-full opacity-60" viewBox="0 0 900 700" preserveAspectRatio="none">
            <g fill="none" stroke="#37505f" strokeWidth="10"><path d="M-30 130C170 70 300 190 490 120s280 20 450 0" /><path d="M120-20c20 210 100 330 20 750M650-20c-90 210-40 440 100 750" /><path d="M-20 510c220-90 340 10 510-70s290 20 450-30" /></g>
            <g fill="none" stroke="#1c3442" strokeWidth="4"><path d="M-20 300h950M350-20v750M820-20 700 730M20 30l850 610M250-20 540 730M-20 650 880 30" /></g>
            <path d="M-10 390c170-120 290 100 450-10S700 270 940 100" fill="none" stroke="#0e7490" strokeWidth="24" opacity=".6" />
          </svg>
          {filtered.map((sensor) => <Button key={sensor.id} ariaLabel={`Select ${sensor.id}`} onClick={() => setSelected(sensor)} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${sensor.x}%`, top: `${sensor.y}%` } as React.CSSProperties}><span className={`absolute inset-0 animate-ping rounded-full opacity-20 ${severityStyles[sensor.state].split(' ')[0]}`} /><span className={`relative grid size-8 place-items-center rounded-full border-4 border-slate-900 shadow-xl ${severityStyles[sensor.state]}`}><Icon name="droplet" className="size-3" /></span></Button>)}
          <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-slate-950/90 p-3 text-xs backdrop-blur"><div className="mb-2 font-semibold text-white">Map legend</div><div className="flex flex-wrap gap-3">{['Critical', 'Warning', 'Watch', 'Normal'].map((s) => <span key={s} className="flex items-center gap-1.5 text-slate-400"><span className={`size-2 rounded-full ${severityStyles[s].split(' ')[0]}`} />{s}</span>)}</div></div>
        </article>
        <div className="space-y-4">
          <article className="rounded-2xl border border-white/8 bg-white/[0.035] p-5"><div className="flex items-center justify-between"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${severityStyles[selected.state]}`}>{selected.state}</span><span className="text-xs text-slate-500">{selected.id}</span></div><h2 className="mt-4 text-lg font-semibold text-white">{selected.street}</h2><p className="text-sm text-slate-500">{selected.zone}</p><p className="mt-6 text-4xl font-semibold text-white">{selected.level}<span className="ml-1 text-sm font-normal text-slate-500">cm</span></p><div className="mt-5 space-y-3 border-t border-white/8 pt-4 text-sm"><Row label="Rate of change" value={selected.trend} /><Row label="Signal quality" value="Excellent · 94%" /><Row label="Last reading" value="12 sec ago" /><Row label="Battery" value="87%" /></div><Button className="mt-5 w-full rounded-xl bg-cyan-400 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300">Open sensor history</Button></article>
          <article className="rounded-2xl border border-white/8 bg-white/[0.035] p-5"><h2 className="font-semibold text-white">Map layers</h2>{['Flood depth', 'Road closures', 'Evacuation centers', 'Drainage network'].map((layer, i) => <div key={layer} className="mt-3 flex items-center justify-between text-sm text-slate-400"><span>{layer}</span><span className={`h-5 w-9 rounded-full p-0.5 ${i < 2 ? 'bg-cyan-400' : 'bg-slate-700'}`}><span className={`block size-4 rounded-full bg-white transition ${i < 2 ? 'translate-x-4' : ''}`} /></span></div>)}</article>
        </div>
      </div>
    </div>
  )

  if (tab === 'Sensor Network') return (
    <div>
      <PageHeading title={title[tab][0]} subtitle={title[tab][1]} action="Register sensor" />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{[['48', 'Online', 'emerald'], ['1', 'Offline', 'rose'], ['1', 'Low battery', 'amber'], ['99.2%', 'Network uptime', 'cyan']].map(([v, l, c]) => <article key={l} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4"><p className={`text-2xl font-semibold text-${c}-300`}>{v}</p><p className="mt-1 text-xs text-slate-500">{l}</p></article>)}</div>
      <article className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.035]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 p-4"><div className="flex gap-2">{['All', 'District 1', 'District 2', 'District 3', 'District 4', 'District 5'].map((item) => <Button key={item} onClick={() => setView(item)} className={`rounded-lg px-3 py-2 text-xs ${view === item ? 'bg-cyan-400 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>{item}</Button>)}</div><p className="text-xs text-slate-500">{filtered.length} devices shown</p></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-950/50 text-xs text-slate-500"><tr><th className="px-5 py-3 font-medium">Sensor</th><th className="px-5 py-3 font-medium">Location</th><th className="px-5 py-3 font-medium">Water level</th><th className="px-5 py-3 font-medium">Signal</th><th className="px-5 py-3 font-medium">Battery</th><th className="px-5 py-3 font-medium">Status</th></tr></thead><tbody className="divide-y divide-white/6">{filtered.map((s, i) => <tr key={s.id} className="hover:bg-white/[0.025]"><td className="px-5 py-4 font-medium text-white">{s.id}</td><td className="px-5 py-4"><p className="text-slate-300">{s.street}</p><p className="text-xs text-slate-600">{s.zone}</p></td><td className="px-5 py-4 text-slate-300">{s.level} cm</td><td className="px-5 py-4 text-emerald-300">{92 - i % 8}%</td><td className="px-5 py-4 text-slate-300">{i === 7 ? '16%' : `${96 - i * 3}%`}</td><td className="px-5 py-4"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${s.state === 'Critical' ? 'bg-rose-400/15 text-rose-300' : 'bg-emerald-400/10 text-emerald-300'}`}>{i === 9 ? 'Needs service' : 'Online'}</span></td></tr>)}</tbody></table></div>
      </article>
    </div>
  )

  if (tab === 'Predictive Analytics') return (
    <div>
      <PageHeading title={title[tab][0]} subtitle={title[tab][1]} action="Download report" />
      <div className="mb-5 flex gap-2">{['6 hours', '24 hours', '3 days', '7 days'].map((item) => <Button key={item} onClick={() => setPeriod(item)} className={`rounded-lg border px-3 py-2 text-xs ${period === item ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-white/10 text-slate-400'}`}>{item}</Button>)}</div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <article className="rounded-2xl border border-white/8 bg-white/[0.035] p-5"><div className="flex items-start justify-between"><div><h2 className="font-semibold text-white">Water-level forecast</h2><p className="mt-1 text-xs text-slate-500">Citywide weighted average · {period}</p></div><span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300">Risk increasing</span></div><div className="relative mt-8 h-72 border-b border-l border-white/10"><div className="absolute inset-x-0 top-1/3 border-t border-dashed border-rose-400/30"><span className="absolute right-0 -top-5 text-[10px] text-rose-300">Critical threshold</span></div><svg className="size-full" viewBox="0 0 800 280" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#22d3ee" stopOpacity=".35"/><stop offset="1" stopColor="#22d3ee" stopOpacity="0"/></linearGradient></defs><path d="M0 250 C90 235 120 245 200 220 S320 180 390 190 S500 150 570 120 S690 75 800 35 V280 H0Z" fill="url(#area)"/><path d="M0 250 C90 235 120 245 200 220 S320 180 390 190 S500 150 570 120 S690 75 800 35" fill="none" stroke="#22d3ee" strokeWidth="4"/></svg></div><div className="mt-3 flex justify-between text-[10px] text-slate-600"><span>Now</span><span>+6h</span><span>+12h</span><span>+18h</span><span>+24h</span></div></article>
        <div className="space-y-4"><article className="rounded-2xl border border-white/8 bg-gradient-to-br from-amber-400/10 to-rose-500/5 p-5"><p className="text-xs text-slate-400">Peak projected level</p><p className="mt-2 text-3xl font-semibold text-white">82 cm</p><p className="mt-1 text-xs text-amber-300">Expected at 22:40 tonight</p><div className="mt-5 border-t border-white/8 pt-4"><Row label="Model confidence" value="87%" /><Row label="Potential road impact" value="14 streets" /><Row label="Population exposed" value="2,340" /></div></article><article className="rounded-2xl border border-white/8 bg-white/[0.035] p-5"><h2 className="font-semibold text-white">Forecast inputs</h2>{[['Rainfall radar', 'Live'], ['16 IoT sensors', 'Streaming'], ['Terrain model', 'Synced'], ['Drainage capacity', 'Updated']].map(([a,b]) => <div key={a} className="mt-3 flex justify-between text-xs"><span className="text-slate-400">{a}</span><span className="text-emerald-300">{b}</span></div>)}</article></div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">{[['District 3', 'Very high', 'Rizal corridor may exceed 75 cm'], ['District 1', 'High', 'Underpass closure likely'], ['District 4', 'Moderate', 'Localized pooling expected']].map(([z,r,d], i) => <article key={z} className="rounded-2xl border border-white/8 bg-white/[0.035] p-5"><div className="flex justify-between"><h2 className="font-semibold text-white">{z}</h2><span className={`text-xs ${i === 0 ? 'text-rose-300' : i === 1 ? 'text-amber-300' : 'text-cyan-300'}`}>{r}</span></div><p className="mt-3 text-sm text-slate-400">{d}</p><Button className="mt-4 text-xs font-medium text-cyan-300">View scenario →</Button></article>)}</div>
    </div>
  )

  return (
    <div>
      <PageHeading title={title[tab][0]} subtitle={title[tab][1]} action="Create alert" />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{[['3', 'Active'], ['1', 'Critical'], ['2', 'Teams dispatched'], ['6m', 'Avg. response']].map(([v,l]) => <article key={l} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4"><p className="text-2xl font-semibold text-white">{v}</p><p className="mt-1 text-xs text-slate-500">{l}</p></article>)}</div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]"><article className="rounded-2xl border border-white/8 bg-white/[0.035]"><div className="border-b border-white/8 p-5"><h2 className="font-semibold text-white">Incident queue</h2><p className="mt-1 text-xs text-slate-500">Sorted by operational priority</p></div><div className="divide-y divide-white/8">{alerts.concat([{ severity: 'Watch', title: 'Drainage capacity nearing limit', place: 'Malaya Creek · District 5', time: '28 min ago' }]).map((a,i) => <div key={a.title} className="p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className={`grid size-10 shrink-0 place-items-center rounded-xl ${a.severity === 'Critical' ? 'bg-rose-500/15 text-rose-300' : 'bg-amber-400/10 text-amber-300'}`}><Icon name="alert" /></div><div className="flex-1"><div className="flex items-center gap-2"><p className="font-medium text-white">{a.title}</p><span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">{a.severity}</span></div><p className="mt-1 text-xs text-slate-500">{a.place} · {a.time}</p></div><div className="flex items-center gap-2"><span className="text-xs text-slate-500">{alertState[i] || (i < 2 ? 'Unassigned' : 'Monitoring')}</span><Button onClick={() => setAlertState({...alertState, [i]: alertState[i] === 'Dispatched' ? 'Resolved' : 'Dispatched'})} className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950">{alertState[i] === 'Dispatched' ? 'Resolve' : alertState[i] === 'Resolved' ? 'Resolved' : 'Dispatch'}</Button></div></div></div>)}</div></article><div className="space-y-4"><article className="rounded-2xl border border-white/8 bg-white/[0.035] p-5"><h2 className="font-semibold text-white">Response teams</h2>{[['Alpha 1', 'En route · 4 min'], ['Bravo 2', 'Available'], ['Rescue 4', 'On scene'], ['Traffic 3', 'Available']].map(([team,status]) => <div key={team} className="mt-4 flex items-center justify-between"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-400" /><span className="text-sm text-slate-300">{team}</span></div><span className="text-[10px] text-slate-500">{status}</span></div>)}</article><article className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-5"><Icon name="radio" className="text-cyan-300" /><h2 className="mt-3 font-semibold text-white">Public advisory</h2><p className="mt-2 text-sm leading-relaxed text-slate-400">Rizal Avenue is closed between Mabini and Luna Streets. Use Bonifacio Avenue as alternate route.</p><Button className="mt-4 w-full rounded-lg border border-cyan-400/20 py-2 text-xs font-semibold text-cyan-300">Update advisory</Button></article></div></div>
    </div>
  )
}

function PageHeading({ title, subtitle, action }: { title: string; subtitle: string; action: string }) {
  return <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-1 text-xs font-semibold tracking-[0.18em] text-cyan-400 uppercase">Tuesday, 24 June · Live operations</p><h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1><p className="mt-2 text-sm text-slate-400">{subtitle}</p></div><Button className="self-start rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 sm:self-auto">{action}</Button></div>
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="mb-3 flex items-center justify-between"><span className="text-slate-500">{label}</span><span className="font-medium text-slate-200">{value}</span></div>
}

export default function App() {
  const [user, setUser] = useState<MockUser | null>(null)
  const [activeNav, setActiveNav] = useState('Overview')
  const [filter, setFilter] = useState('All sensors')
  const [selectedSensor, setSelectedSensor] = useState(sensors[0])
  const [alertsOpen, setAlertsOpen] = useState(true)
  const [acknowledged, setAcknowledged] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)

  const visibleSensors = useMemo(
    () => filter === 'All sensors' ? sensors : sensors.filter((sensor) => sensor.state === filter),
    [filter],
  )

  if (!user) return <AuthScreen onAuthenticate={setUser} />

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-400/30">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/8 bg-slate-950/95 p-5 backdrop-blur-xl transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20"><Icon name="droplet" /></div>
            <div><p className="text-lg font-semibold tracking-tight">iFlood <span className="text-cyan-400">2.0</span></p><p className="text-[10px] font-medium tracking-[0.2em] text-slate-500 uppercase">City Operations</p></div>
          </div>
          <Button ariaLabel="Close navigation" onClick={() => setMobileNav(false)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden"><Icon name="close" /></Button>
        </div>

        <nav className="mt-10 space-y-1">
          {[
            ['Overview', 'dashboard'],
            ['Live Map', 'map'],
            ['Sensor Network', 'sensor'],
            ['Predictive Analytics', 'analytics'],
            ['Alert Management', 'alert'],
          ].map(([label, icon]) => (
            <Button key={label} onClick={() => { setActiveNav(label); setMobileNav(false) }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${activeNav === label ? 'bg-cyan-400/10 font-medium text-cyan-300' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`}>
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
          <Button onClick={() => setUser(null)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="chevron" className="size-4.5 rotate-180" /> Sign out</Button>
          <div className="mt-3 flex items-center gap-3 border-t border-white/8 pt-5">
            <div className="grid size-9 place-items-center rounded-full bg-indigo-500 text-xs font-bold">{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
            <div className="min-w-0"><p className="truncate text-sm font-medium">{user.name}</p><p className="text-xs text-slate-500">{user.role}</p></div>
            <Icon name="chevron" className="ml-auto size-4 text-slate-600" />
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-18 items-center gap-4 border-b border-white/8 bg-slate-950/80 px-4 backdrop-blur-xl sm:px-7">
          <Button ariaLabel="Open navigation" onClick={() => setMobileNav(true)} className="rounded-lg p-2 text-slate-300 hover:bg-white/5 lg:hidden"><Icon name="menu" /></Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold sm:text-base">{activeNav}</p>
            <p className="hidden text-xs text-slate-500 sm:block">Real-time flood intelligence • San Isidro City</p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-3 py-1.5 text-xs font-medium text-emerald-300 sm:flex"><span className="size-1.5 animate-pulse rounded-full bg-emerald-400" /> Live data</div>
          <Button ariaLabel="Search" className="rounded-xl p-2.5 text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="search" /></Button>
          <Button ariaLabel="Notifications" onClick={() => setAlertsOpen(!alertsOpen)} className="relative rounded-xl p-2.5 text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="bell" /><span className="absolute right-2 top-2 size-2 rounded-full border-2 border-slate-950 bg-rose-500" /></Button>
        </header>

        <div className="p-4 sm:p-7">
          {activeNav === 'Overview' ? <>
          <section className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div>
              <p className="mb-1 text-xs font-semibold tracking-[0.18em] text-cyan-400 uppercase">Tuesday, 24 June · 14:32</p>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Good afternoon, Alex</h1>
              <p className="mt-2 text-sm text-slate-400">Monitor rising water levels and coordinate a faster response.</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['All sensors', 'Critical', 'Warning', 'Watch'].map((item) => (
                <Button key={item} onClick={() => setFilter(item)} className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium ${filter === item ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white'}`}>{item}</Button>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {[
              { icon: 'sensor', label: 'Active sensors', value: '48', detail: 'of 50 deployed', color: 'text-cyan-300', bg: 'bg-cyan-400/10' },
              { icon: 'droplet', label: 'Highest level', value: '68 cm', detail: 'Rizal Ave.', color: 'text-rose-300', bg: 'bg-rose-400/10' },
              { icon: 'rain', label: 'Rainfall', value: '32 mm', detail: 'past 60 minutes', color: 'text-indigo-300', bg: 'bg-indigo-400/10' },
              { icon: 'trend', label: 'Risk forecast', value: 'High', detail: 'next 2 hours', color: 'text-amber-300', bg: 'bg-amber-400/10' },
            ].map((stat) => (
              <article key={stat.label} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-xs text-slate-500">{stat.label}</p><p className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">{stat.value}</p><p className="mt-1 text-xs text-slate-500">{stat.detail}</p></div>
                  <div className={`grid size-9 shrink-0 place-items-center rounded-xl ${stat.bg} ${stat.color}`}><Icon name={stat.icon as IconName} className="size-4.5" /></div>
                </div>
              </article>
            ))}
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <article className="overflow-hidden rounded-2xl border border-white/8 bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
                <div><h2 className="font-semibold text-white">Live flood map</h2><p className="mt-0.5 text-xs text-slate-500">{visibleSensors.length} sensors in view</p></div>
                <Button className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"><Icon name="layers" className="size-4" /> Map layers</Button>
              </div>
              <div className="relative h-[29rem] overflow-hidden bg-[#0d1b26]">
                <div className="map-grid absolute inset-0 opacity-60" />
                <svg className="absolute inset-0 size-full opacity-50" viewBox="0 0 800 500" preserveAspectRatio="none">
                  <g fill="none" stroke="#37505f" strokeWidth="8"><path d="M-20 120C140 80 250 170 410 130s260-20 430 30" /><path d="M110-20c30 150 80 240 20 550M580-20c-70 150-30 310 80 540" /><path d="M-20 390c190-60 300-10 460-60s260 0 390-50" /></g>
                  <g fill="none" stroke="#1c3442" strokeWidth="3"><path d="M-10 245h850M320-20v550M735-20 640 520M30 25l740 430" /><path d="M220-20 480 520M-10 470 790 20" /></g>
                  <path d="M-10 300c160-100 250 90 410 5S650 200 820 90" fill="none" stroke="#0e7490" strokeWidth="18" opacity=".55" />
                </svg>
                <div className="absolute left-[8%] top-[9%] rounded-md bg-slate-950/60 px-2 py-1 text-[10px] tracking-wide text-slate-500 uppercase">District 1</div>
                <div className="absolute right-[9%] top-[45%] rounded-md bg-slate-950/60 px-2 py-1 text-[10px] tracking-wide text-slate-500 uppercase">District 4</div>
                <div className="absolute bottom-[8%] left-[38%] rounded-md bg-slate-950/60 px-2 py-1 text-[10px] tracking-wide text-slate-500 uppercase">District 3</div>
                {visibleSensors.map((sensor) => (
                  <Button key={sensor.id} ariaLabel={`View ${sensor.id}`} onClick={() => setSelectedSensor(sensor)} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${sensor.x}%`, top: `${sensor.y}%` } as React.CSSProperties}>
                    <span className={`absolute inset-0 animate-ping rounded-full opacity-20 ${severityStyles[sensor.state].split(' ')[0]}`} />
                    <span className={`relative grid size-8 place-items-center rounded-full border-4 border-slate-900 shadow-lg ${severityStyles[sensor.state]}`}><Icon name="droplet" className="size-3.5" /></span>
                    <span className="pointer-events-none absolute left-1/2 top-10 hidden w-max -translate-x-1/2 rounded-lg bg-slate-950 px-2 py-1 text-[10px] text-white shadow-xl group-hover:block">{sensor.id} · {sensor.level} cm</span>
                  </Button>
                ))}
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-xl sm:left-auto sm:w-80">
                  <div className="flex items-start justify-between">
                    <div><div className="flex items-center gap-2"><span className={`size-2 rounded-full ${severityStyles[selectedSensor.state].split(' ')[0]}`} /><p className="text-xs font-semibold text-slate-300">{selectedSensor.state.toUpperCase()}</p></div><p className="mt-1 font-medium text-white">{selectedSensor.street}</p><p className="text-xs text-slate-500">{selectedSensor.id} · {selectedSensor.zone}</p></div>
                    <p className="text-2xl font-semibold text-white">{selectedSensor.level}<span className="ml-1 text-xs font-normal text-slate-500">cm</span></p>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-3 text-xs"><span className="text-slate-500">Current trend</span><span className="font-medium text-rose-300">{selectedSensor.trend}</span></div>
                </div>
              </div>
            </article>

            <div className="space-y-5">
              <article className="rounded-2xl border border-white/8 bg-white/[0.035]">
                <div className="flex items-center justify-between border-b border-white/8 p-5"><div><h2 className="font-semibold text-white">Active alerts</h2><p className="mt-0.5 text-xs text-slate-500">Prioritized by severity</p></div><span className="rounded-full bg-rose-500/15 px-2.5 py-1 text-xs font-semibold text-rose-300">{acknowledged ? 2 : 3} active</span></div>
                <div className="divide-y divide-white/8">
                  {alerts.map((alert, index) => index === 0 && acknowledged ? null : (
                    <div key={alert.title} className="p-4">
                      <div className="flex gap-3">
                        <div className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${alert.severity === 'Critical' ? 'bg-rose-500/12 text-rose-300' : alert.severity === 'Warning' ? 'bg-amber-400/12 text-amber-300' : 'bg-cyan-400/12 text-cyan-300'}`}><Icon name="alert" className="size-4" /></div>
                        <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="text-sm font-medium text-slate-200">{alert.title}</p><p className="shrink-0 text-[10px] text-slate-600">{alert.time}</p></div><p className="mt-1 text-xs text-slate-500">{alert.place}</p>{index === 0 && <Button onClick={() => setAcknowledged(true)} className="mt-3 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-400">Acknowledge</Button>}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full border-t border-white/8 py-3.5 text-xs font-medium text-cyan-300 hover:bg-white/[0.025]">View all alerts</Button>
              </article>

              <article className="rounded-2xl border border-white/8 bg-gradient-to-br from-indigo-500/10 to-cyan-500/5 p-5">
                <div className="flex items-center justify-between"><div><p className="text-xs font-medium text-slate-400">2-hour prediction</p><h2 className="mt-1 font-semibold text-white">Flood risk rising</h2></div><div className="grid size-10 place-items-center rounded-xl bg-amber-400/10 text-amber-300"><Icon name="trend" /></div></div>
                <div className="mt-5 flex h-20 items-end gap-1.5">
                  {[24, 31, 28, 39, 45, 56, 61, 76, 84, 92].map((height, index) => <div key={index} className={`flex-1 rounded-t-sm ${index > 6 ? 'bg-amber-400' : 'bg-cyan-400/50'}`} style={{ height: `${height}%` }} />)}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-slate-600"><span>Now</span><span>+1 hr</span><span>+2 hrs</span></div>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-950/40 px-3 py-2 text-xs text-slate-400"><Icon name="activity" className="size-4 text-cyan-400" /><span><strong className="text-slate-200">87% confidence</strong> based on rainfall & terrain</span></div>
              </article>
            </div>
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <article className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
              <div className="flex items-center justify-between"><div><h2 className="font-semibold text-white">Sensor health</h2><p className="mt-1 text-xs text-slate-500">Network uptime and connectivity</p></div><Button className="text-xs font-medium text-cyan-300">View network</Button></div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[['48', 'Online', 'text-emerald-300'], ['1', 'Low battery', 'text-amber-300'], ['1', 'Offline', 'text-rose-300']].map(([value, label, color]) => <div key={label} className="rounded-xl bg-slate-950/60 p-3"><p className={`text-xl font-semibold ${color}`}>{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>)}
              </div>
            </article>
            <article className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
              <div className="flex items-center justify-between"><div><h2 className="font-semibold text-white">Response readiness</h2><p className="mt-1 text-xs text-slate-500">Available field resources</p></div><div className="flex items-center gap-1.5 text-xs font-medium text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-400" />Ready</div></div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[['users', '12', 'Teams'], ['radio', '8', 'Units'], ['clock', '6m', 'Avg. dispatch']].map(([icon, value, label]) => <div key={label} className="flex items-center gap-3 rounded-xl bg-slate-950/60 p-3"><Icon name={icon as IconName} className="size-4 text-indigo-300" /><div><p className="text-sm font-semibold text-white">{value}</p><p className="text-[10px] text-slate-500">{label}</p></div></div>)}
              </div>
            </article>
          </section>
          </> : <Workspace tab={activeNav} />}
        </div>
      </div>

      {alertsOpen && <div className="fixed bottom-5 right-5 z-50 hidden w-80 rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl shadow-black/50 sm:block"><div className="flex items-start gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-rose-500/15 text-rose-300"><Icon name="alert" className="size-4" /></div><div className="flex-1"><p className="text-sm font-semibold text-white">Critical alert active</p><p className="mt-1 text-xs leading-relaxed text-slate-400">Rizal Avenue is rising rapidly at 12 cm per hour.</p></div><Button ariaLabel="Dismiss notification" onClick={() => setAlertsOpen(false)} className="text-slate-500 hover:text-white"><Icon name="close" className="size-4" /></Button></div></div>}
    </main>
  )
}
