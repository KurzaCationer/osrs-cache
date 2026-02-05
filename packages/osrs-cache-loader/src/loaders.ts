import { extractFiles } from "./archive-utils";
import type { Cache } from "./index";

/**
 * Base class for all asset loaders, providing a common interface for interacting with cache data.
 */
export abstract class AssetLoader {
  /**
   * Initializes a new AssetLoader.
   * @param cache The Cache instance to load assets from.
   */
  constructor(protected readonly cache: Cache) {}

  /**
   * Returns the total count of valid assets handled by this loader.
   * @returns A Promise resolving to the asset count.
   */
  abstract getCount(): Promise<number>;
}

/**
 * Loader for assets stored as multiple files within a single archive (e.g., Items, NPCs, Objects).
 * This corresponds to the "Per-File" counting methodology in OSRS.
 */
export class ConfigLoader extends AssetLoader {
  /**
   * Initializes a new ConfigLoader.
   * @param cache The Cache instance.
   * @param indexId The ID of the index containing the config (usually 2).
   * @param archiveId The ID of the archive containing the files (e.g., 10 for Items).
   */
  constructor(
    cache: Cache,
    public readonly indexId: number,
    public readonly archiveId: number
  ) {
    super(cache);
  }

  /**
   * Calculates the count of valid files within the specified archive.
   * Empty files or files containing only a null byte are excluded.
   * 
   * @returns A Promise resolving to the number of valid files.
   */
  async getCount(): Promise<number> {
    const archRef = this.cache.tables.get(this.indexId)?.archives.get(this.archiveId);
    if (!archRef) return 0;
    
    const data = await this.cache.getRawFile(this.indexId, this.archiveId);
    const files = extractFiles(data, archRef.files.size);
    // Filter out empty files (often used as null entries in OSRS)
    return files.filter(f => f.length > 0 && (f.length > 1 || f[0] !== 0)).length;
  }

  /**
   * Retrieves the raw data for a specific file within the config archive.
   * 
   * @param fileId The ID of the file to retrieve.
   * @returns A Promise resolving to the file data, or undefined if not found.
   */
  async getFile(fileId: number): Promise<Uint8Array | undefined> {
    const archRef = this.cache.tables.get(this.indexId)?.archives.get(this.archiveId);
    if (!archRef || !archRef.files.has(fileId)) return undefined;

    const data = await this.cache.getRawFile(this.indexId, this.archiveId);
    const files = extractFiles(data, archRef.files.size);
    
    // Files in the archive are stored sequentially based on their ID order in the reference table.
    const sortedIds = Array.from(archRef.files.keys()).sort((a, b) => a - b);
    const index = sortedIds.indexOf(fileId);
    return index !== -1 ? files[index] : undefined;
  }

  /**
   * Retrieves all files within the config archive, mapped by their IDs.
   * 
   * @returns A Promise resolving to a Map of file IDs to their raw data.
   */
  async getAllFiles(): Promise<Map<number, Uint8Array>> {
    const archRef = this.cache.tables.get(this.indexId)?.archives.get(this.archiveId);
    if (!archRef) return new Map();

    const data = await this.cache.getRawFile(this.indexId, this.archiveId);
    const files = extractFiles(data, archRef.files.size);
    const sortedIds = Array.from(archRef.files.keys()).sort((a, b) => a - b);
    
    const map = new Map<number, Uint8Array>();
    sortedIds.forEach((id, index) => {
      map.set(id, files[index]);
    });
    return map;
  }

  /**
   * Returns the version of the index containing this config.
   */
  getVersion(): { era: "osrs" | "rs3", indexRevision: number } | undefined {
    const table = this.cache.tables.get(this.indexId);
    if (!table) return undefined;
    return { era: "osrs", indexRevision: table.revision };
  }
}

/**
 * Loader for assets where each asset ID corresponds directly to an archive ID (e.g., Models, Sprites, Maps).
 * This corresponds to the "Per-Archive" counting methodology in OSRS.
 */
export class ArchiveLoader extends AssetLoader {
  /**
   * Initializes a new ArchiveLoader.
   * @param cache The Cache instance.
   * @param indexId The ID of the index containing the archives (e.g., 7 for Models, 5 for Maps).
   */
  constructor(
    cache: Cache,
    public readonly indexId: number
  ) {
    super(cache);
  }

  /**
   * Returns the total number of archives present in the index.
   * 
   * @returns A Promise resolving to the archive count.
   */
  async getCount(): Promise<number> {
    return await Promise.resolve(this.cache.tables.get(this.indexId)?.archives.size ?? 0);
  }

  /**
   * Retrieves the raw data for a specific archive.
   * 
   * @param archiveId The ID of the archive to retrieve.
   * @returns A Promise resolving to the archive data, or undefined if not found.
   */
  async getArchive(archiveId: number): Promise<Uint8Array | undefined> {
    const archRef = this.cache.tables.get(this.indexId)?.archives.get(archiveId);
    if (!archRef) return undefined;

    return await this.cache.getRawFile(this.indexId, archiveId);
  }
}