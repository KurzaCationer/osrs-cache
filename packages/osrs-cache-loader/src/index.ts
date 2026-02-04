import { OpenRS2Client } from "./openrs2-client";
import { ReferenceTable } from "./reference-table";
import { decompress } from "./compression";
import type { AssetCounts, CacheMetadata, LoadCacheOptions, OpenRS2Cache } from "./types";

export * from "./types";
export * from "./openrs2-client";

function extractFiles(data: Uint8Array, fileCount: number): Array<Uint8Array> {
  if (fileCount <= 1) {
    return [data];
  }

  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const numChunks = dv.getUint8(dv.byteLength - 1);
  let off = dv.byteLength - 1 - numChunks * fileCount * 4;
  let doff = 0;
  const files: Array<Uint8Array> = new Array(fileCount);

  if (numChunks === 1) {
    let size = 0;
    for (let i = 0; i < fileCount; i++) {
      size += dv.getInt32(off);
      off += 4;
      files[i] = data.subarray(doff, doff + size);
      doff += size;
    }
  } else {
    const sizeStride = numChunks + 1;
    const sizes = new Uint32Array(sizeStride * fileCount);
    for (let ch = 0; ch < numChunks; ch++) {
      let size = 0;
      for (let id = 0; id < fileCount; id++) {
        size += dv.getInt32(off);
        off += 4;
        const soff = id * sizeStride;
        sizes[soff] += size;
        sizes[soff + 1 + ch] = size;
      }
    }

    for (let id = 0; id < fileCount; id++) {
      const soff = id * sizeStride;
      files[id] = new Uint8Array(sizes[soff]);
      sizes[soff] = 0; // reset to use as write pointer
    }

    for (let ch = 0; ch < numChunks; ch++) {
      for (let id = 0; id < fileCount; id++) {
        const soff = id * sizeStride;
        const cSize = sizes[soff + 1 + ch];
        const start = sizes[soff];
        files[id].set(data.subarray(doff, doff + cSize), start);
        sizes[soff] = start + cSize;
        doff += cSize;
      }
    }
  }

  return files;
}

export class Cache {
  private constructor(
    public readonly metadata: OpenRS2Cache,
    private readonly client: OpenRS2Client,
    public readonly tables: Map<number, ReferenceTable>,
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

  async getAssetCounts(): Promise<AssetCounts> {
    const getArchive = async (index: number, archive: number) => {
      const response = await this.client.getArchive(
        this.metadata.scope,
        this.metadata.id,
        index,
        archive,
      );
      return await decompress(new Uint8Array(response));
    };

    const getFileCount = async (index: number, archive: number) => {
      const archRef = this.tables.get(index)?.archives.get(archive);
      if (!archRef) return 0;
      const data = await getArchive(index, archive);
      const files = extractFiles(data, archRef.files.size);
      return files.filter(f => f.length > 0 && (f.length > 1 || f[0] !== 0)).length;
    };

    const getArchiveCount = (index: number) => 
      this.tables.get(index)?.archives.size ?? 0;

    return {
      items: await getFileCount(2, 10),
      npcs: await getFileCount(2, 9),
      objects: await getFileCount(2, 6),
      maps: getArchiveCount(5),
      animations: await getFileCount(2, 12),
      enums: await getFileCount(2, 8),
      sprites: getArchiveCount(8),
      models: getArchiveCount(7),
      structs: await getFileCount(2, 34),
      underlays: await getFileCount(2, 1),
      overlays: await getFileCount(2, 4),
      identikits: await getFileCount(2, 3),
      params: await getFileCount(2, 11),
      hitsplats: await getFileCount(2, 32),
      healthBars: await getFileCount(2, 33),
      dbRows: await getFileCount(2, 38),
    };
  }

  async getRawFile(index: number, archive: number): Promise<Uint8Array> {
    const response = await this.client.getArchive(
      this.metadata.scope,
      this.metadata.id,
      index,
      archive,
    );
    const decompressed = await decompress(new Uint8Array(response));
    
    // For now, we don't have a full Archive/File decoder that handles the footer.
    // However, many config archives (like 2, 10) have multiple files.
    // If it's a single-file archive (like maps/models), this returns the whole thing.
    return decompressed;
  }
}

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

export const loadCache = async (options: LoadCacheOptions = {}): Promise<AssetCounts> => {
  console.log("OSRS Cache Loader Initialized");
  const cache = await Cache.load(options);
  return await cache.getAssetCounts();
};