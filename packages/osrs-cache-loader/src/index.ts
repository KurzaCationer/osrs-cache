import { OpenRS2Client } from "./openrs2-client";
import type { AssetCounts, LoadCacheOptions, OpenRS2Cache } from "./types";
import { ReferenceTable } from "./reference-table";
import { decompress } from "./compression";

export * from "./types";
export * from "./openrs2-client";

export class Cache {
  private constructor(
    public readonly metadata: OpenRS2Cache,
    private readonly client: OpenRS2Client,
    private readonly tables: Map<number, ReferenceTable>,
  ) {}

  static async load(options: LoadCacheOptions = {}): Promise<Cache> {
    const client = new OpenRS2Client(options.openrs2BaseUrl);
    const cacheMetadata = await client.getLatestCache(options.game || "oldschool");
    
    // We need at least Index 2 (Configs), Index 5 (Maps), Index 7 (Models), Index 8 (Sprites)
    const indicesToLoad = [2, 5, 7, 8];
    const tables = new Map<number, ReferenceTable>();

    await Promise.all(
      indicesToLoad.map(async (index) => {
        const rawData = await client.getArchiveMetadata(
          cacheMetadata.scope,
          cacheMetadata.id,
          index,
        );
        const decompressed = await decompress(new Uint8Array(rawData));
        tables.set(index, ReferenceTable.decode(decompressed));
      }),
    );

    return new Cache(cacheMetadata, client, tables);
  }

  getAssetCounts(): AssetCounts {
    const configTable = this.tables.get(2);
    const mapTable = this.tables.get(5);
    const modelTable = this.tables.get(7);
    const spriteTable = this.tables.get(8);

    const getFileCount = (index: number, archive: number) => 
      this.tables.get(index)?.archives.get(archive)?.files.size ?? 0;

    const getArchiveCount = (index: number) => 
      this.tables.get(index)?.archives.size ?? 0;

    return {
      items: getFileCount(2, 10),
      npcs: getFileCount(2, 9),
      objects: getFileCount(2, 6),
      maps: getArchiveCount(5),
      animations: getFileCount(2, 12),
      enums: getFileCount(2, 8),
      sprites: getArchiveCount(8),
      models: getArchiveCount(7),
      structs: getFileCount(2, 34),
      underlays: getFileCount(2, 1),
      overlays: getFileCount(2, 4),
      identikits: getFileCount(2, 3),
      params: getFileCount(2, 11),
      hitsplats: getFileCount(2, 32),
      healthBars: getFileCount(2, 33),
      dbRows: getFileCount(2, 38), // Note: also 39
    };
  }

  async getRawFile(index: number, archive: number, file: number = 0): Promise<Uint8Array> {
    // This would fetch the actual data group from OpenRS2
    // For now, we just implement the counts as requested.
    throw new Error("getRawFile not yet implemented");
  }
}

export const loadCache = async (options: LoadCacheOptions = {}): Promise<AssetCounts> => {
  console.log("OSRS Cache Loader Initialized");
  const cache = await Cache.load(options);
  return cache.getAssetCounts();
};