import { OpenRS2Client } from "./openrs2-client";
import { ReferenceTable } from "./reference-table";
import { decompress } from "./compression";
import { ArchiveLoader, ConfigLoader } from "./loaders";
import type { AssetCounts, CacheMetadata, LoadCacheOptions, OpenRS2Cache } from "./types";

export * from "./types";
export * from "./openrs2-client";

/**
 * The primary entry point for interacting with an OSRS cache.
 */
export class Cache {
  private constructor(
    /** Metadata about the cache sourced from OpenRS2. */
    public readonly metadata: OpenRS2Cache,
    /** The client used to fetch data for this cache. */
    private readonly client: OpenRS2Client,
    /** A map of index IDs to their decoded reference tables. */
    public readonly tables: Map<number, ReferenceTable>,
  ) {}

  /**
   * Loads a cache from OpenRS2 based on the provided options.
   * By default, it fetches the latest Old School RuneScape cache.
   * 
   * @param options Configuration options for loading the cache.
   * @returns A Promise that resolves to a new Cache instance.
   */
  static async load(options: LoadCacheOptions = {}): Promise<Cache> {
    const client = new OpenRS2Client(options.openrs2BaseUrl);
    const cacheMetadata = await client.getLatestCache(options.game || "oldschool");
    
    // Core indices required for basic functionality
    const indicesToLoad = [2, 5, 7, 8, 9, 13, 21, 24];
    const tables = new Map<number, ReferenceTable>();

    await Promise.all(
      indicesToLoad.map(async (index) => {
        const rawData = await client.getGroup(
          cacheMetadata.scope,
          cacheMetadata.id,
          255,
          index,
        );
        const decompressed = await decompress(new Uint8Array(rawData));
        tables.set(index, ReferenceTable.decode(decompressed));
      }),
    );

    return new Cache(cacheMetadata, client, tables);
  }

  /**
   * Performs a comprehensive scan of the cache to count all supported assets.
   * 
   * @returns A Promise that resolves to an AssetCounts report.
   */
  async getAssetCounts(): Promise<AssetCounts> {
    const config = (archiveId: number) => new ConfigLoader(this, 2, archiveId).getCount();
    const archive = (indexId: number) => new ArchiveLoader(this, indexId).getCount();

    return {
      item: await config(10),
      npc: await config(9),
      obj: await config(6),
      map: await archive(5),
      animation: await config(12),
      enum: await config(8),
      sprite: await archive(8),
      model: await archive(7),
      struct: await config(34),
      underlay: await config(1),
      overlay: await config(4),
      identikit: await config(3),
      param: await config(11),
      hitsplat: await config(32),
      healthBar: await config(33),
      dbRow: await config(38),
      dbTable: await config(39),
      worldEntity: await config(72),
      spotAnim: await config(13),
      inventory: await config(14),
      varbit: await config(69),
      texture: await archive(9),
      font: await archive(13),
      dbTableIndex: await archive(21),
      gameVal: await archive(24),
    };
  }

  /**
   * Fetches the raw, decompressed data for a specific archive/group.
   * 
   * @param index The index ID.
   * @param archive The archive ID.
   * @returns A Promise that resolves to the raw bytes of the archive.
   */
  async getRawFile(index: number, archive: number): Promise<Uint8Array> {
    const response = await this.client.getGroup(
      this.metadata.scope,
      this.metadata.id,
      index,
      archive,
    );
    return await decompress(new Uint8Array(response));
  }
}

/**
 * Convenience function to fetch metadata and asset counts without manually managing a Cache instance.
 * 
 * @param options Configuration options for loading the cache.
 * @returns A Promise that resolves to the CacheMetadata summary.
 */
export const getMetadata = async (options: LoadCacheOptions = {}): Promise<CacheMetadata> => {
  const cache = await Cache.load(options);
  const counts = await cache.getAssetCounts();
  return {
    id: cache.metadata.id,
    builds: cache.metadata.builds,
    timestamp: cache.metadata.timestamp,
    source: cache.metadata.sources[0] || "Unknown",
    counts,
  };
};

/**
 * Convenience function to initialize a cache and return its asset counts.
 * 
 * @param options Configuration options for loading the cache.
 * @returns A Promise that resolves to the AssetCounts report.
 */
export const loadCache = async (options: LoadCacheOptions = {}): Promise<AssetCounts> => {
  console.log("OSRS Cache Loader Initialized");
  const cache = await Cache.load(options);
  return await cache.getAssetCounts();
};
