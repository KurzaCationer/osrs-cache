import { OpenRS2Client } from "./openrs2-client";
import type { AssetCounts, LoadCacheOptions } from "./types";

export * from "./types";
export * from "./openrs2-client";

export const loadCache = async (options: LoadCacheOptions = {}): Promise<AssetCounts> => {
  console.log("OSRS Cache Loader Initialized");
  const client = new OpenRS2Client(options.openrs2BaseUrl);
  const cache = await client.getLatestCache(options.game || "osrs");

  // In a real implementation, we would parse the cache here.
  // For the MVP, we use metadata from OpenRS2 where available.
  return {
    items: cache.item_count ?? 0,
    npcs: cache.npc_count ?? 0,
    objects: cache.object_count ?? 0,
    maps: 500, // Placeholder
    audio: 1200, // Placeholder
  };
};