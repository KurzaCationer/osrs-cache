/**
 * Supported OSRS compression types.
 */
export enum CompressionType {
  /** No compression. */
  NONE = 0,
  /** BZIP2 compression. */
  BZ2 = 1,
  /** GZIP compression. */
  GZIP = 2,
}

/**
 * Represents a reference to a file within an archive.
 */
export interface FileReference {
  /** The unique file ID. */
  id: number;
  /** The hash of the file name (if named). */
  nameHash: number;
}

/**
 * Represents a reference to an archive within an index.
 */
export interface ArchiveReference {
  /** The unique archive ID. */
  id: number;
  /** The hash of the archive name (if named). */
  nameHash: number;
  /** The CRC32 checksum of the archive. */
  crc: number;
  /** The revision number of the archive. */
  revision: number;
  /** A map of file IDs to their respective references. */
  files: Map<number, FileReference>;
  /** The maximum file ID contained within this archive. */
  maxFileId: number;
}

/**
 * Metadata for a cache hosted on the OpenRS2 Archive.
 */
export interface OpenRS2Cache {
  /** The unique OpenRS2 cache ID. */
  id: number;
  /** The scope of the cache (e.g., 'runescape'). */
  scope: string;
  /** The game the cache belongs to (e.g., 'oldschool'). */
  game: string;
  /** The environment (e.g., 'live'). */
  environment: string;
  /** The language of the cache. */
  language: string;
  /** An array of build versions associated with this cache. */
  builds: Array<{
    /** The major version number (revision). */
    major: number;
    /** The optional minor version number. */
    minor?: number;
  }>;
  /** The ISO timestamp of when the cache was archived. */
  timestamp?: string;
  /** A list of source URLs where the cache was found. */
  sources: Array<string>;
  /** Number of items in the cache (if available). */
  item_count?: number;
  /** Number of NPCs in the cache (if available). */
  npc_count?: number;
  /** Number of objects in the cache (if available). */
  object_count?: number;
}

/**
 * Represents an XTEA key for decrypting map archives.
 */
export interface XTEAKey {
  /** The archive ID this key applies to. */
  archive: number;
  /** The group ID within the archive. */
  group: number;
  /** The name hash of the mapsquare. */
  name_hash: number;
  /** The human-readable name of the mapsquare (if known). */
  name?: string;
  /** The unique mapsquare ID. */
  mapsquare?: number;
  /** The 4-integer XTEA key. */
  key: Array<number>;
}

/**
 * A comprehensive report of total asset counts within an OSRS cache.
 */
export interface AssetCounts {
  /** Total number of items (Index 2, Archive 10). */
  item: number;
  /** Total number of NPCs (Index 2, Archive 9). */
  npc: number;
  /** Total number of objects (Index 2, Archive 6). */
  obj: number;
  /** Total number of maps (Index 5). */
  map: number;
  /** Total number of animations (Index 2, Archive 12). */
  animation: number;
  /** Total number of enums (Index 2, Archive 8). */
  enum: number;
  /** Total number of sprites (Index 8). */
  sprite: number;
  /** Total number of models (Index 7). */
  model: number;
  /** Total number of structs (Index 2, Archive 34). */
  struct: number;
  /** Total number of underlays (Index 2, Archive 1). */
  underlay: number;
  /** Total number of overlays (Index 2, Archive 4). */
  overlay: number;
  /** Total number of identikits (Index 2, Archive 3). */
  identikit: number;
  /** Total number of params (Index 2, Archive 11). */
  param: number;
  /** Total number of hitsplats (Index 2, Archive 32). */
  hitsplat: number;
  /** Total number of health bars (Index 2, Archive 33). */
  healthBar: number;
  /** Total number of database rows (Index 2, Archive 38). */
  dbRow: number;
  /** Total number of database tables (Index 2, Archive 39). */
  dbTable: number;
  /** Total number of world entities (Index 2, Archive 72). */
  worldEntity: number;
  /** Total number of spot animations (Index 2, Archive 13). */
  spotAnim: number;
  /** Total number of inventories (Index 2, Archive 14). */
  inventory: number;
  /** Total number of varbits (Index 2, Archive 69). */
  varbit: number;
  /** Total number of textures (Index 9). */
  texture: number;
  /** Total number of fonts (Index 13). */
  font: number;
  /** Total number of database table indices (Index 21). */
  dbTableIndex: number;
  /** Total number of game values (Index 24). */
  gameVal: number;
}

/**
 * Options for initializing a new Cache instance.
 */
export interface LoadCacheOptions {
  /** Explicitly provide a cache ID to load. If omitted, the latest cache is used. */
  cacheId?: number;
  /** The game to target (defaults to 'oldschool'). */
  game?: string;
  /** Custom base URL for the OpenRS2 Archive API. */
  openrs2BaseUrl?: string;
}

/**
 * High-level metadata summary for a cache, including asset counts.
 */
export interface CacheMetadata {
  /** The OpenRS2 cache ID. */
  id: number;
  /** Build versions associated with this cache. */
  builds: Array<{
    major: number;
    minor?: number;
  }>;
  /** When the cache was archived. */
  timestamp?: string;
  /** The primary source where the cache was obtained. */
  source: string;
  /** Detailed asset counts for this cache. */
  counts: AssetCounts;
}
