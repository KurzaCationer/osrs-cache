import {
  Activity,
  Archive,
  Binary,
  Box,
  Database,
  Globe,
  Image,
  Layers,
  Layout,
  Map,
  Maximize,
  Package,
  Palette,
  PlayCircle,
  Search,
  Settings,
  Shapes,
  Shield,
  Sparkles,
  Table,
  Type,
  Users,
  Zap,
} from 'lucide-react'
import type React from 'react'
import type { AssetCounts } from '@kurza/osrs-cache-loader'

/**
 * Defines the visual and technical metadata for a specific OSRS asset type.
 */
export interface AssetMapping {
  /** The human-readable title of the asset category. */
  title: string
  /** The Lucide icon component associated with the asset. */
  icon: React.ElementType
  /** The theme color (CSS-compatible) for the asset. */
  color: string
  /** The cache index ID where this asset is stored. */
  index: number
  /** The optional archive ID if the asset is stored as multiple files within a single archive. */
  archive?: number
}

/**
 * A comprehensive mapping of all supported OSRS asset types to their display metadata and cache locations.
 */
export const ASSET_MAPPINGS: Record<keyof AssetCounts, AssetMapping> = {
  item: {
    title: 'Items',
    icon: Package,
    color: '#22d3ee',
    index: 2,
    archive: 10,
  },
  npc: { title: 'NPCs', icon: Users, color: '#4ade80', index: 2, archive: 9 },
  obj: { title: 'Objects', icon: Box, color: '#fb923c', index: 2, archive: 6 },
  map: { title: 'Maps', icon: Map, color: '#c084fc', index: 5 },
  animation: {
    title: 'Animations',
    icon: PlayCircle,
    color: '#f472b6',
    index: 2,
    archive: 12,
  },
  enum: {
    title: 'Enums',
    icon: Database,
    color: '#facc15',
    index: 2,
    archive: 8,
  },
  sprite: { title: 'Sprites', icon: Image, color: '#38bdf8', index: 8 },
  model: { title: 'Models', icon: Shapes, color: '#a78bfa', index: 7 },
  struct: {
    title: 'Structs',
    icon: Layout,
    color: '#fb7185',
    index: 2,
    archive: 34,
  },
  underlay: {
    title: 'Underlays',
    icon: Layers,
    color: '#2dd4bf',
    index: 2,
    archive: 1,
  },
  overlay: {
    title: 'Overlays',
    icon: Maximize,
    color: '#60a5fa',
    index: 2,
    archive: 4,
  },
  identikit: {
    title: 'Identikits',
    icon: Settings,
    color: '#94a3b8',
    index: 2,
    archive: 3,
  },
  param: {
    title: 'Params',
    icon: Settings,
    color: '#818cf8',
    index: 2,
    archive: 11,
  },
  hitsplat: {
    title: 'Hitsplats',
    icon: Zap,
    color: '#ef4444',
    index: 2,
    archive: 32,
  },
  healthBar: {
    title: 'Health Bars',
    icon: Activity,
    color: '#10b981',
    index: 2,
    archive: 33,
  },
  dbRow: {
    title: 'Database Rows',
    icon: Type,
    color: '#d946ef',
    index: 2,
    archive: 38,
  },
  dbTable: {
    title: 'Database Tables',
    icon: Table,
    color: '#ec4899',
    index: 2,
    archive: 39,
  },
  worldEntity: {
    title: 'World Entities',
    icon: Globe,
    color: '#8b5cf6',
    index: 2,
    archive: 72,
  },
  spotAnim: {
    title: 'Spot Animations',
    icon: Sparkles,
    color: '#f59e0b',
    index: 2,
    archive: 13,
  },
  inventory: {
    title: 'Inventories',
    icon: Archive,
    color: '#6366f1',
    index: 2,
    archive: 14,
  },
  varbit: {
    title: 'Variable Bits',
    icon: Binary,
    color: '#14b8a6',
    index: 2,
    archive: 69,
  },
  texture: { title: 'Textures', icon: Palette, color: '#f43f5e', index: 9 },
  font: { title: 'Fonts', icon: Type, color: '#06b6d4', index: 13 },
  dbTableIndex: {
    title: 'DB Table Indices',
    icon: Search,
    color: '#84cc16',
    index: 21,
  },
  gameVal: { title: 'Game Values', icon: Shield, color: '#a855f7', index: 24 },
}
