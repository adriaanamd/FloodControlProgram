import { useEffect, useRef } from "react"
import type { LayerGroup, Map as LeafletMap } from "leaflet"
import type { FloodLocation } from "../../../entities/flood/model/types"
import type { Sensor } from "../../../entities/sensor/model/types"

type LeafletModule = typeof import("leaflet")

type FloodLeafletMapProps = {
  floodLocations: readonly FloodLocation[]
  visibleSensors: readonly Sensor[]
  selectedSensor: Sensor
  onSelectSensor: (sensor: Sensor) => void
  className?: string
}

type MapData = Pick<FloodLeafletMapProps, "floodLocations" | "visibleSensors" | "selectedSensor" | "onSelectSensor">

const mapCenter: [number, number] = [14.839, 120.284]

const sensorColors = {
  Critical: "#ff4d3d",
  Warning: "#ffb800",
  Watch: "#70c7ff",
  Normal: "#78d66b",
} as const

const floodColors = {
  "observed-hotspot": "#ff4d3d",
  "drainage-risk": "#ffb800",
} as const

function sensorCoordinates(sensor: Sensor): [number, number] {
  return [14.88 - sensor.y * 0.0007, 120.25 + sensor.x * 0.0008]
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character,
  )
}

function floodPopup(location: FloodLocation): string {
  return `<div class="flood-popup"><strong>${escapeHtml(location.label)}</strong><br /><span>${escapeHtml(location.roadSegment)}</span><br /><span>${escapeHtml(location.area)}</span><p>${escapeHtml(location.evidence)}</p><a href="${escapeHtml(location.sourceUrl)}" target="_blank" rel="noreferrer">Open source</a></div>`
}

export function FloodLeafletMap({
  floodLocations,
  visibleSensors,
  selectedSensor,
  onSelectSensor,
  className,
}: FloodLeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const leafletRef = useRef<LeafletModule | null>(null)
  const floodLayerRef = useRef<LayerGroup | null>(null)
  const sensorLayerRef = useRef<LayerGroup | null>(null)
  const dataRef = useRef<MapData>({
    floodLocations,
    visibleSensors,
    selectedSensor,
    onSelectSensor,
  })
  const drawLayersRef = useRef<() => void>(() => undefined)

  dataRef.current = {
    floodLocations,
    visibleSensors,
    selectedSensor,
    onSelectSensor,
  }

  const drawLayers = () => {
    const leaflet = leafletRef.current
    const floodLayer = floodLayerRef.current
    const sensorLayer = sensorLayerRef.current

    if (!leaflet || !floodLayer || !sensorLayer) return

    const {
      floodLocations: locations,
      visibleSensors: sensors,
      selectedSensor: selected,
      onSelectSensor: selectSensor,
    } = dataRef.current

    floodLayer.clearLayers()
    for (const location of locations) {
      const color = floodColors[location.kind]
      leaflet
        .circleMarker([location.latitude, location.longitude], {
          color,
          fillColor: color,
          fillOpacity: location.kind === "observed-hotspot" ? 0.85 : 0.65,
          radius: location.kind === "observed-hotspot" ? 9 : 7,
          weight: 2,
        })
        .bindPopup(floodPopup(location))
        .addTo(floodLayer)
    }

    sensorLayer.clearLayers()
    for (const sensor of sensors) {
      const isSelected = sensor.id === selected.id
      const color = sensorColors[sensor.state]
      leaflet
        .circleMarker(sensorCoordinates(sensor), {
          color: isSelected ? "#f4f5ef" : "#10140f",
          fillColor: color,
          fillOpacity: 1,
          radius: isSelected ? 9 : 7,
          weight: isSelected ? 3 : 2,
        })
        .bindTooltip(`${sensor.id} · ${sensor.level} cm`, {
          direction: "top",
          offset: [0, -8],
        })
        .on("click", () => selectSensor(sensor))
        .addTo(sensorLayer)
    }
  }

  drawLayersRef.current = drawLayers

  useEffect(() => {
    drawLayersRef.current()
  }, [floodLocations, visibleSensors, selectedSensor, onSelectSensor])

  useEffect(() => {
    let cancelled = false
    let resizeObserver: ResizeObserver | undefined

    void import("leaflet").then((leaflet) => {
      if (cancelled || !containerRef.current) return

      const map = leaflet
        .map(containerRef.current, {
          minZoom: 11,
          maxZoom: 18,
          zoomControl: false,
        })
        .setView(mapCenter, 13)

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
        })
        .addTo(map)

      leaflet.control.zoom({ position: "topright" }).addTo(map)

      mapRef.current = map
      leafletRef.current = leaflet
      floodLayerRef.current = leaflet.layerGroup().addTo(map)
      sensorLayerRef.current = leaflet.layerGroup().addTo(map)
      drawLayersRef.current()

      resizeObserver = new ResizeObserver(() => map.invalidateSize())
      resizeObserver.observe(containerRef.current)
      requestAnimationFrame(() => map.invalidateSize())
    })

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
      mapRef.current?.remove()
      mapRef.current = null
      leafletRef.current = null
      floodLayerRef.current = null
      sensorLayerRef.current = null
    }
  }, [])

  return (
    <div
      className={`relative min-h-[29rem] overflow-hidden bg-[#10140f] ${className ?? ""}`}
    >
      <div
        ref={containerRef}
        aria-label="Olongapo City street flood map"
        className="absolute inset-0"
      />
      <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] border border-[var(--rule-strong)] bg-[var(--surface-deep)]/95 p-3 text-[10px] text-[var(--text-muted)] shadow-lg">
        <div className="mb-2 font-semibold uppercase tracking-[0.1em] text-white">
          Street flood layers
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--danger)]" />
            Observed flood hotspot
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--signal)]" />
            Official drainage-risk segment
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#78d66b]" />
            Demo sensor telemetry
          </div>
        </div>
      </div>
    </div>
  )
}
