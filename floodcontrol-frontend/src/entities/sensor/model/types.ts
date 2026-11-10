export type SensorState = "Critical" | "Warning" | "Watch" | "Normal"

export type Sensor = {
  id: string
  street: string
  zone: string
  level: number
  state: SensorState
  trend: string
  latitude: number
  longitude: number
  coordinateAccuracy: "approximate"
  coordinateSource: string
}
