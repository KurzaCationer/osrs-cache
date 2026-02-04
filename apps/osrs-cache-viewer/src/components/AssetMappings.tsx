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
  Zap,
  Table,
  Globe,
  Sparkles,
  Archive,
  Binary,
  Palette,
  Search,
  Shield
} from 'lucide-react'
import type { AssetCounts } from '@kurza/osrs-cache-loader'

export interface AssetMapping {
  title: string
  icon: React.ElementType
  color: string
}

export const ASSET_MAPPINGS: Record<keyof AssetCounts, AssetMapping> = {
  item: { title: 'Items', icon: Package, color: '#22d3ee' }, // cyan.400
  npc: { title: 'NPCs', icon: Users, color: '#4ade80' }, // green.400
  obj: { title: 'Objects', icon: Box, color: '#fb923c' }, // orange.400
  map: { title: 'Maps', icon: Map, color: '#c084fc' }, // purple.400
  animation: { title: 'Animations', icon: PlayCircle, color: '#f472b6' }, // pink.400
  enum: { title: 'Enums', icon: Database, color: '#facc15' }, // yellow.400
  sprite: { title: 'Sprites', icon: Image, color: '#38bdf8' }, // sky.400
  model: { title: 'Models', icon: Shapes, color: '#a78bfa' }, // violet.400
  struct: { title: 'Structs', icon: Layout, color: '#fb7185' }, // rose.400
  underlay: { title: 'Underlays', icon: Layers, color: '#2dd4bf' }, // teal.400
  overlay: { title: 'Overlays', icon: Maximize, color: '#60a5fa' }, // blue.400
  identikit: { title: 'Identikits', icon: Settings, color: '#94a3b8' }, // slate.400
  param: { title: 'Params', icon: Settings, color: '#818cf8' }, // indigo.400
  hitsplat: { title: 'Hitsplats', icon: Zap, color: '#ef4444' }, // red.500
  healthBar: { title: 'Health Bars', icon: Activity, color: '#10b981' }, // emerald.500
  dbRow: { title: 'Database Rows', icon: Type, color: '#d946ef' }, // fuchsia.500
  dbTable: { title: 'Database Tables', icon: Table, color: '#ec4899' }, // pink.500
  worldEntity: { title: 'World Entities', icon: Globe, color: '#8b5cf6' }, // violet.500
  spotAnim: { title: 'Spot Animations', icon: Sparkles, color: '#f59e0b' }, // amber.500
  inventory: { title: 'Inventories', icon: Archive, color: '#6366f1' }, // indigo.500
  varbit: { title: 'Variable Bits', icon: Binary, color: '#14b8a6' }, // teal.500
  texture: { title: 'Textures', icon: Palette, color: '#f43f5e' }, // rose.500
  font: { title: 'Fonts', icon: Type, color: '#06b6d4' }, // cyan.500
  dbTableIndex: { title: 'DB Table Indices', icon: Search, color: '#84cc16' }, // lime.500
  gameVal: { title: 'Game Values', icon: Shield, color: '#a855f7' }, // purple.500
}
