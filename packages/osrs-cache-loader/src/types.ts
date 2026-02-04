export interface OpenRS2Cache {
  id: number;
  scope: string;
  game: string;
  environment: string;
  language: string;
  builds: Array<{
    major: number;
    minor?: number;
  }>;
  timestamp?: string;
  sources: Array<string>;
  item_count?: number;
  npc_count?: number;
  object_count?: number;
}

export interface AssetCounts {
  item: number;
  npc: number;
  obj: number;
  map: number;
  animation: number;
  enum: number;
  sprite: number;
  model: number;
  struct: number;
  underlay: number;
  overlay: number;
  identikit: number;
  param: number;
  hitsplat: number;
  healthBar: number;
  dbRow: number;
  // New types
  dbTable: number;
  worldEntity: number;
  spotAnim: number;
  inventory: number;
  varbit: number;
  texture: number;
  font: number;
  dbTableIndex: number;
  gameVal: number;
}

export interface LoadCacheOptions {
  cacheId?: number;
  game?: string;
  openrs2BaseUrl?: string;
}

export interface CacheMetadata {
  id: number;
  builds: Array<{
    major: number;
    minor?: number;
  }>;
  timestamp?: string;
  source: string;
  counts: AssetCounts;
}