import { OpenRS2Client } from "./openrs2-client";
import { ReferenceTable } from "./reference-table";
import { decompress } from "./compression";
import { ArchiveLoader, ConfigLoader } from "./loaders";
import { decodeItem, decodeNPC, decodeObject } from "./definitions";
import { TECHNICAL_ASSET_MAPPINGS } from "./constants";
import type { AssetCounts, CacheMetadata, LoadCacheOptions, OpenRS2Cache } from "./types";
import { HybridCacheProvider } from "./cache/HybridCacheProvider";
import { Enum, Struct, Param, Underlay, Animation, HealthBar, Hitsplat, Sprites, DBRow, DBTable, WorldEntity } from "./cache/loaders";
import { Reader } from "./cache/Reader";
import { EnumID, StructID, ParamID, UnderlayID, AnimationID, HealthBarID, HitsplatID, SpriteID, DBRowID, DBTableID, WorldEntityID } from "./cache/types";

export * from "./types";
export * from "./openrs2-client";
export * from "./definitions";

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
    /** The provider used for low-level data access. */
    public readonly provider: HybridCacheProvider,
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
    const provider = new HybridCacheProvider(cacheMetadata, client);
    
    // Core indices required for basic functionality
    const indicesToLoad = [2, 5, 7, 8, 9, 13, 21, 24];
    const tables = new Map<number, ReferenceTable>();

    await Promise.all(
      indicesToLoad.map(async (index) => {
        const idxData = await provider.getIndex(index);
        if (idxData) {
          // We need to convert IndexData back to ReferenceTable?
          // Actually ReferenceTable.decode expects the raw decompressed data of the index.
          // OpenRS2CacheProvider fetches raw and decodes.
          
          // To keep it simple, we'll fetch the raw data from provider (which might be disk)
          const archive = await provider.getArchive(255, index);
          if (archive && archive.compressedData) {
            const decompressed = await decompress(new Uint8Array(archive.compressedData));
            tables.set(index, ReferenceTable.decode(decompressed));
          }
        }
      }),
    );

    return new Cache(cacheMetadata, client, tables, provider);
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
    const am = await this.provider.getArchive(index, archive);
    if (!am || !am.compressedData) {
      throw new Error(`Failed to load archive ${index}:${archive}`);
    }
    return await decompress(new Uint8Array(am.compressedData));
  }

  /**
   * Retrieves all assets of a specific type from the cache, decoded into structured objects.
   * 
   * @param type The type of assets to retrieve (e.g., 'item', 'npc').
   * @param limit Maximum number of assets to return.
   * @param offset Number of assets to skip.
   * @param options Additional options for filtering (e.g., tableId for dbRows).
   * @returns A Promise resolving to an array of decoded asset objects.
   */
  async getAssets(type: keyof AssetCounts, limit?: number, offset?: number, options?: { tableId?: number }): Promise<any[]> {
    let assets: any[] = [];
    try {
      if (type === 'item') {
        const loader = new ConfigLoader(this, 2, 10);
        const files = await loader.getAllFiles();
        const version = loader.getVersion();
        assets = Array.from(files.entries())
          .filter(([_, data]) => data.length > 0 && (data.length > 1 || data[0] !== 0))
          .map(([id, data]) => {
            try {
              return decodeItem(id, data, version);
            } catch (e) {
              console.warn(`Failed to decode item ${id}:`, e);
              return { id, name: `Error Decoding (${id})`, error: true };
            }
          });
      } else if (type === 'npc') {
        const loader = new ConfigLoader(this, 2, 9);
        const files = await loader.getAllFiles();
        const version = loader.getVersion();
        assets = Array.from(files.entries())
          .filter(([_, data]) => data.length > 0 && (data.length > 1 || data[0] !== 0))
          .map(([id, data]) => {
            try {
              return decodeNPC(id, data, version);
            } catch (e) {
              console.warn(`Failed to decode NPC ${id}:`, e);
              return { id, name: `Error Decoding (${id})`, error: true };
            }
          });
      } else if (type === 'obj') {
        const loader = new ConfigLoader(this, 2, 6);
        const files = await loader.getAllFiles();
        const version = loader.getVersion();
        assets = Array.from(files.entries())
          .filter(([_, data]) => data.length > 0 && (data.length > 1 || data[0] !== 0))
          .map(([id, data]) => {
            try {
              return decodeObject(id, data, version);
            } catch (e) {
              console.warn(`Failed to decode Object ${id}:`, e);
              return { id, name: `Error Decoding (${id})`, error: true };
            }
          });
      } else if (type === 'enum') {
        const loader = new ConfigLoader(this, 2, 8);
        const files = await loader.getAllFiles();
        assets = Array.from(files.entries())
          .filter(([_, data]) => data.length > 0 && (data.length > 1 || data[0] !== 0))
          .map(([id, data]) => {
            try {
              const decoded = Enum.decode(new Reader(data), id as EnumID);
              return JSON.parse(JSON.stringify(decoded));
            } catch (e) {
              console.warn(`Failed to decode Enum ${id}:`, e);
              return { id, name: `Error Decoding (${id})`, error: true };
            }
          });
      } else if (type === 'struct') {
        const loader = new ConfigLoader(this, 2, 34);
        const files = await loader.getAllFiles();
        assets = Array.from(files.entries())
          .filter(([_, data]) => data.length > 0 && (data.length > 1 || data[0] !== 0))
          .map(([id, data]) => {
            try {
              const decoded = Struct.decode(new Reader(data), id as StructID);
              return JSON.parse(JSON.stringify(decoded));
            } catch (e) {
              console.warn(`Failed to decode Struct ${id}:`, e);
              return { id, name: `Error Decoding (${id})`, error: true };
            }
          });
      } else if (type === 'param') {
        const loader = new ConfigLoader(this, 2, 11);
        const files = await loader.getAllFiles();
        assets = Array.from(files.entries())
          .filter(([_, data]) => data.length > 0 && (data.length > 1 || data[0] !== 0))
          .map(([id, data]) => {
            try {
              const decoded = Param.decode(new Reader(data), id as ParamID);
              return JSON.parse(JSON.stringify(decoded));
            } catch (e) {
              console.warn(`Failed to decode Param ${id}:`, e);
              return { id, name: `Error Decoding (${id})`, error: true };
            }
          });
      } else if (type === 'underlay') {
        const loader = new ConfigLoader(this, 2, 1);
        const files = await loader.getAllFiles();
        assets = Array.from(files.entries())
          .filter(([_, data]) => data.length > 0 && (data.length > 1 || data[0] !== 0))
          .map(([id, data]) => {
            try {
              const decoded = Underlay.decode(new Reader(data), id as UnderlayID);
              return JSON.parse(JSON.stringify(decoded));
            } catch (e) {
              console.warn(`Failed to decode Underlay ${id}:`, e);
              return { id, name: `Error Decoding (${id})`, error: true };
            }
          });
      } else if (type === 'animation') {
        const loader = new ConfigLoader(this, 2, 12);
        const files = await loader.getAllFiles();
        assets = Array.from(files.entries())
          .filter(([_, data]) => data.length > 0 && (data.length > 1 || data[0] !== 0))
          .map(([id, data]) => {
            try {
              const decoded = Animation.decode(new Reader(data), id as AnimationID);
              return JSON.parse(JSON.stringify(decoded));
            } catch (e) {
              console.warn(`Failed to decode Animation ${id}:`, e);
              return { id, name: `Error Decoding (${id})`, error: true };
            }
          });
      } else if (type === 'healthBar') {
        const loader = new ConfigLoader(this, 2, 33);
        const files = await loader.getAllFiles();
        assets = Array.from(files.entries())
          .filter(([_, data]) => data.length > 0 && (data.length > 1 || data[0] !== 0))
          .map(([id, data]) => {
            try {
              const decoded = HealthBar.decode(new Reader(data), id as HealthBarID);
              return JSON.parse(JSON.stringify(decoded));
            } catch (e) {
              console.warn(`Failed to decode HealthBar ${id}:`, e);
              return { id, name: `Error Decoding (${id})`, error: true };
            }
          });
      } else if (type === 'hitsplat') {
        const loader = new ConfigLoader(this, 2, 32);
        const files = await loader.getAllFiles();
        assets = Array.from(files.entries())
          .filter(([_, data]) => data.length > 0 && (data.length > 1 || data[0] !== 0))
          .map(([id, data]) => {
            try {
              const decoded = Hitsplat.decode(new Reader(data), id as HitsplatID);
              return JSON.parse(JSON.stringify(decoded));
            } catch (e) {
              console.warn(`Failed to decode Hitsplat ${id}:`, e);
              return { id, name: `Error Decoding (${id})`, error: true };
            }
          });
      } else if (type === 'dbTable') {
        const loader = new ConfigLoader(this, 2, 39);
        const files = await loader.getAllFiles();
        assets = Array.from(files.entries())
          .filter(([_, data]) => data.length > 0 && (data.length > 1 || data[0] !== 0))
          .map(([id, data]) => {
            try {
              const decoded = DBTable.decode(new Reader(data), id as DBTableID);
              return JSON.parse(JSON.stringify(decoded));
            } catch (e) {
              console.warn(`Failed to decode DBTable ${id}:`, e);
              return { id, name: `Error Decoding (${id})`, error: true };
            }
          });
      } else if (type === 'dbRow') {
        if (options?.tableId !== undefined) {
          const rows = await this.getDBRows(options.tableId);
          assets = rows.map(r => JSON.parse(JSON.stringify(r)));
        } else {
          const loader = new ConfigLoader(this, 2, 38);
          const files = await loader.getAllFiles();
          assets = Array.from(files.entries())
            .filter(([_, data]) => data.length > 0 && (data.length > 1 || data[0] !== 0))
            .map(([id, data]) => {
              try {
                const decoded = DBRow.decode(new Reader(data), id as DBRowID);
                return JSON.parse(JSON.stringify(decoded));
              } catch (e) {
                console.warn(`Failed to decode DBRow ${id}:`, e);
                return { id, name: `Error Decoding (${id})`, error: true };
              }
            });
        }
      } else if (type === 'worldEntity') {
        const loader = new ConfigLoader(this, 2, 72);
        const files = await loader.getAllFiles();
        assets = Array.from(files.entries())
          .filter(([_, data]) => data.length > 0 && (data.length > 1 || data[0] !== 0))
          .map(([id, data]) => {
            try {
              const decoded = WorldEntity.decode(new Reader(data), id as WorldEntityID);
              return JSON.parse(JSON.stringify(decoded));
            } catch (e) {
              console.warn(`Failed to decode WorldEntity ${id}:`, e);
              return { id, name: `Error Decoding (${id})`, error: true };
            }
          });
      } else if (type === 'sprite') {
        const loader = new ArchiveLoader(this, 8);
        const table = this.tables.get(8);
        if (table) {
             let archiveIds = Array.from(table.archives.keys());
             
             // Apply pagination BEFORE decoding to avoid OOM and network timeouts
             if (offset !== undefined || limit !== undefined) {
               const start = offset ?? 0;
               const end = limit !== undefined ? start + limit : undefined;
               archiveIds = archiveIds.slice(start, end);
             }

             assets = (await Promise.all(archiveIds.map(async (id) => {
                 try {
                     const data = await loader.getArchive(id);
                     if (data) {
                         const decoded = Sprites.decode(new Reader(data), id as SpriteID);
                         // Convert to plain object to ensure Seroval serialization works
                         return {
                           id: decoded.id,
                           width: decoded.width,
                           height: decoded.height,
                           palette: Array.from(decoded.palette),
                           sprites: decoded.sprites.map(s => ({
                             offsetX: s.offsetX,
                             offsetY: s.offsetY,
                             width: s.pixelsWidth,
                             height: s.pixelsHeight,
                             pixels: Array.from(s.pixels)
                           }))
                         };
                     }
                 } catch (e) {
                     console.warn(`Failed to decode Sprite ${id}:`, e);
                     return { id, name: `Error Decoding (${id})`, error: true };
                 }
                 return null;
             }))).filter(a => a !== null);
             
             // Return early since we already handled pagination
             return assets;
        }
      } else {
        const mapping = TECHNICAL_ASSET_MAPPINGS[type];
        if (mapping && mapping.index === 2 && mapping.archive !== undefined) {
          const loader = new ConfigLoader(this, 2, mapping.archive);
          const files = await loader.getAllFiles();
          assets = Array.from(files.entries())
            .filter(([_, data]) => data.length > 0 && (data.length > 1 || data[0] !== 0))
            .map(([id, data]) => {
              try {
                if ((type as any) === 'healthBar') return JSON.parse(JSON.stringify(HealthBar.decode(new Reader(data), id as HealthBarID)));
                if ((type as any) === 'hitsplat') return JSON.parse(JSON.stringify(Hitsplat.decode(new Reader(data), id as HitsplatID)));
                if ((type as any) === 'worldEntity') return JSON.parse(JSON.stringify(WorldEntity.decode(new Reader(data), id as WorldEntityID)));
                if ((type as any) === 'dbRow') return JSON.parse(JSON.stringify(DBRow.decode(new Reader(data), id as DBRowID)));
                if ((type as any) === 'dbTable') return JSON.parse(JSON.stringify(DBTable.decode(new Reader(data), id as DBTableID)));
                
                return { id, size: data.length, status: 'Encoded' };
              } catch (e) {
                console.warn(`Failed to decode ${type} ${id}:`, e);
                return { id, name: `Error Decoding (${id})`, error: true };
              }
            });
        } else if (mapping && mapping.index !== undefined) {
          const loader = new ArchiveLoader(this, mapping.index);
          const count = await loader.getCount();
          assets = Array.from({ length: count }, (_, i) => ({ id: i, status: 'Archive' }));
        } else {
          assets = [{ id: -1, name: "Unsupported type for browsing yet" }];
        }
      }
    } catch (error) {
      console.error(`Fatal error in getAssets for ${type}:`, error);
      throw error;
    }

    if (offset !== undefined || limit !== undefined) {
      const start = offset ?? 0;
      const end = limit !== undefined ? start + limit : undefined;
      return assets.slice(start, end);
    }

    return assets;
  }

  /**
   * Helper method to retrieve all rows for a specific database table.
   * 
   * @param tableId The ID of the DBTable.
   * @returns A Promise resolving to an array of DBRows.
   */
  async getDBRows(tableId: number): Promise<DBRow[]> {
    return (await DBTable.loadRows(this.provider, tableId)) || [];
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
 * Convenience function to fetch all assets of a specific type.
 * 
 * @param type The type of assets to fetch.
 * @param options Configuration options for loading the cache.
 * @param limit Maximum number of assets to return.
 * @param offset Number of assets to skip.
 * @param filtering Optional filtering options.
 * @returns A Promise resolving to an array of decoded asset objects.
 */
export const getAssetsByType = async (
  type: keyof AssetCounts, 
  options: LoadCacheOptions = {},
  limit?: number,
  offset?: number,
  filtering?: { tableId?: number }
): Promise<any[]> => {
  const cache = await Cache.load(options);
  return await cache.getAssets(type, limit, offset, filtering);
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

// New Cache System (Alignment with cache2)
export { OpenRS2CacheProvider, OpenRS2IndexData } from "./cache/OpenRS2Cache";
export { DiskCacheProvider } from "./cache/DiskCache";
export { HybridCacheProvider } from "./cache/HybridCacheProvider";
export { CacheInstaller } from "./cache/CacheInstaller";
export { ArchiveData, ArchiveFile } from "./cache/Cache";
export type { CacheProvider, IndexData, CacheVersion } from "./cache/Cache";
export * from "./cache/loaders";