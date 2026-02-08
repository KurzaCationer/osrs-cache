import type { AssetCounts } from './types'

export interface TechnicalAssetMapping {
  index: number
  archive?: number
}

export const TECHNICAL_ASSET_MAPPINGS: Record<
  keyof AssetCounts,
  TechnicalAssetMapping
> = {
  item: { index: 2, archive: 10 },
  npc: { index: 2, archive: 9 },
  obj: { index: 2, archive: 6 },
  map: { index: 5 },
  animation: { index: 2, archive: 12 },
  enum: { index: 2, archive: 8 },
  sprite: { index: 8 },
  model: { index: 7 },
  struct: { index: 2, archive: 34 },
  underlay: { index: 2, archive: 1 },
  overlay: { index: 2, archive: 4 },
  identikit: { index: 2, archive: 3 },
  param: { index: 2, archive: 11 },
  hitsplat: { index: 2, archive: 32 },
  healthBar: { index: 2, archive: 33 },
  dbRow: { index: 2, archive: 38 },
  dbTable: { index: 2, archive: 39 },
  worldEntity: { index: 2, archive: 72 },
  spotAnim: { index: 2, archive: 13 },
  inventory: { index: 2, archive: 14 },
  varbit: { index: 2, archive: 69 },
  texture: { index: 9 },
  font: { index: 13 },
  dbTableIndex: { index: 21 },
  gameVal: { index: 24 },
}
