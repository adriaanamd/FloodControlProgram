import type { Sensor } from './types'

export const sensors: readonly Sensor[] = [
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
