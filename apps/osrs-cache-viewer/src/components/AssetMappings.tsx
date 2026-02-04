import { 
  Box, 
  Map, 
  Package, 
  Users, 
  Activity, 
  Database, 
  Image, 
  Layers, 
  Layout, 
  Maximize, 
  PlayCircle, 
  Settings, 
  Shapes, 
  Type, 
  Zap 
} from 'lucide-react'
import type { AssetCounts } from '@kurza/osrs-cache-loader'

export interface AssetMapping {
  title: string
  icon: React.ElementType
  color: string
}

export const ASSET_MAPPINGS: Record<keyof AssetCounts, AssetMapping> = {
  items: { title: 'Items', icon: Package, color: '#22d3ee' }, // cyan.400
  npcs: { title: 'NPCs', icon: Users, color: '#4ade80' }, // green.400
  objects: { title: 'Objects', icon: Box, color: '#fb923c' }, // orange.400
  maps: { title: 'Maps', icon: Map, color: '#c084fc' }, // purple.400
  animations: { title: 'Animations', icon: PlayCircle, color: '#f472b6' }, // pink.400
  enums: { title: 'Enums', icon: Database, color: '#facc15' }, // yellow.400
  sprites: { title: 'Sprites', icon: Image, color: '#38bdf8' }, // sky.400
  models: { title: 'Models', icon: Shapes, color: '#a78bfa' }, // violet.400
  structs: { title: 'Structs', icon: Layout, color: '#fb7185' }, // rose.400
  underlays: { title: 'Underlays', icon: Layers, color: '#2dd4bf' }, // teal.400
  overlays: { title: 'Overlays', icon: Maximize, color: '#60a5fa' }, // blue.400
  identikits: { title: 'Identikits', icon: Settings, color: '#94a3b8' }, // slate.400
  params: { title: 'Params', icon: Settings, color: '#818cf8' }, // indigo.400
  hitsplats: { title: 'Hitsplats', icon: Zap, color: '#ef4444' }, // red.500
  healthBars: { title: 'Health Bars', icon: Activity, color: '#10b981' }, // emerald.500
  dbRows: { title: 'Database Rows', icon: Type, color: '#d946ef' }, // fuchsia.500
}
