import { Button } from "./Button"
import { SectionFolio } from "./SectionFolio"

const folioByTitle: Record<string, string> = {
  Overview: "01",
  "Citywide live map": "02",
  "IoT sensor network": "03",
  "Predictive analytics": "04",
  "Alert management": "05",
}

const labelByTitle: Record<string, string> = {
  Overview: "Overview / live operations",
  "Citywide live map": "Live Map / citywide readings",
  "IoT sensor network": "Sensor Network / device health",
  "Predictive analytics": "Predictive Analytics / demo model",
  "Alert management": "Alert Management / response queue",
}

export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle: string
  action: string
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 border-b border-[var(--rule)] pb-6 sm:flex-row sm:items-end">
      <div>
        <SectionFolio
          index={folioByTitle[title] ?? "00"}
          label={labelByTitle[title] ?? "Olongapo City operations"}
        />
        <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
          Olongapo City · Demo operations
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          {subtitle}
        </p>
      </div>
      <Button className="self-start border border-[var(--signal)] bg-[var(--signal)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--surface-deep)] hover:bg-[#ffd166] sm:self-auto">
        {action}
      </Button>
    </div>
  )
}
