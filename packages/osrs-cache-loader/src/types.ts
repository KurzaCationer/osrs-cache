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
  audio: number;
}

export interface LoadCacheOptions {
  cacheId?: number;
  game?: string;
  openrs2BaseUrl?: string;
}