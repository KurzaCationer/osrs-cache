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
  items: number;
  npcs: number;
  objects: number;
  maps: number;
  animations: number;
  enums: number;
  sprites: number;
  models: number;
  structs: number;
  underlays: number;
  overlays: number;
  identikits: number;
  params: number;
  hitsplats: number;
  healthBars: number;
  dbRows: number;
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