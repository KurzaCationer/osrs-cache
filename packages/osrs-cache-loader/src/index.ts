import { ArchiveLoader, ConfigLoader } from './loaders'
import { Reader } from './cache/Reader'
import {
  Animation,
  DBRow,
  DBTable,
  Enum,
  HealthBar,
  Hitsplat,
  Item,
  NPC,
  Obj,
  Param,
  Sprites,
  Struct,
  Underlay,
  WorldEntity,
} from './cache/loaders'
import { OpenRS2Client } from './openrs2-client'
import { HybridCacheProvider } from './cache/HybridCacheProvider'
import { cacheExistsOnDisk } from './paths'
import type { OpenRS2IndexData } from './cache/OpenRS2Cache'
import type {
  AnimationID,
  DBRowID,
  DBTableID,
  EnumID,
  HealthBarID,
  HitsplatID,
  ItemID,
  NPCID,
  ObjID,
  ParamID,
  SpriteID,
  StructID,
  UnderlayID,
  WorldEntityID,
} from './cache/types'
import type { CacheProvider, CacheVersion } from './cache/Cache'

export interface LoadCacheOptions {
  game?: string
  scope?: string
  cacheId?: number
  forceUpdate?: boolean
}

export interface AssetCounts {
  item: number
  npc: number
  obj: number
  enum: number
  struct: number
  param: number
  underlay: number
  animation: number
  healthBar: number
  hitsplat: number
  dbTable: number
  dbRow: number
  worldEntity: number
  sprite: number
  map: number
}

export interface CacheMetadata {
  id: number
  scope: string
  game: string
  timestamp: string
  builds: Array<{ major: number; minor?: number }>
  source: string
  counts: AssetCounts
}

const TECHNICAL_ASSET_MAPPINGS: Record<
  string,
  { index: number; archive?: number }
> = {
  item: { index: 2, archive: 10 },
  npc: { index: 2, archive: 9 },
  obj: { index: 2, archive: 6 },
  enum: { index: 2, archive: 8 },
  struct: { index: 2, archive: 34 },
  param: { index: 2, archive: 11 },
  underlay: { index: 2, archive: 1 },
  animation: { index: 2, archive: 12 },
  healthBar: { index: 2, archive: 33 },
  hitsplat: { index: 2, archive: 32 },
  dbTable: { index: 2, archive: 39 },
  dbRow: { index: 2, archive: 38 },
  worldEntity: { index: 2, archive: 72 },
  sprite: { index: 8 },
  map: { index: 5 },
}

const decodeItem = (id: number, data: Uint8Array, version?: CacheVersion) => {
  const item = Item.decode(new Reader(data, version), id as ItemID)
  // Simple serialization-friendly conversion
  return JSON.parse(JSON.stringify(item))
}

const decodeNPC = (id: number, data: Uint8Array, version?: CacheVersion) => {
  const npc = NPC.decode(new Reader(data, version), id as NPCID)
  return JSON.parse(JSON.stringify(npc))
}

const decodeObject = (id: number, data: Uint8Array, version?: CacheVersion) => {
  const obj = Obj.decode(new Reader(data, version), id as ObjID)
  return JSON.parse(JSON.stringify(obj))
}

export class Cache {
  private constructor(
    public readonly provider: CacheProvider,
    private readonly tables: Map<number, OpenRS2IndexData>,
  ) {}

  public static async load(options: LoadCacheOptions = {}): Promise<Cache> {
    const client = new OpenRS2Client()

    let cacheMetadata
    if (options.cacheId) {
      const allCaches = await client.listCaches()
      cacheMetadata = allCaches.find((c) => c.id === options.cacheId)
    } else {
      cacheMetadata = await client.getLatestCache(
        options.game || 'oldschool',
        options.forceUpdate,
      )
    }

    if (!cacheMetadata) {
      throw new Error(
        `Could not find cache metadata for ${options.game || 'oldschool'}`,
      )
    }

    // Proactive Installation if not on disk
    const isInstalled = await cacheExistsOnDisk(cacheMetadata.id)
    if (!isInstalled) {
      console.log(
        `Cache ${cacheMetadata.id} not found on disk. Installing...`,
      )
      const { CacheInstaller } = await import('./cache/CacheInstaller')
      const installer = new CacheInstaller(cacheMetadata, client)
      await installer.install()
      await installer.cleanupOldCaches()
    }

    const provider = new HybridCacheProvider(cacheMetadata, client)
    const tables = new Map<number, OpenRS2IndexData>()

    return new Cache(provider, tables)
  }

  /**
   * Retrieves and caches the index data for a specific index.
   *
   * @param indexId The ID of the index to retrieve.
   * @returns A Promise resolving to the IndexData, or undefined if not found.
   */
  async getIndex(indexId: number): Promise<OpenRS2IndexData | undefined> {
    let index = this.tables.get(indexId)
    if (!index) {
      const data = await this.provider.getIndex(indexId)
      if (data) {
        index = data as OpenRS2IndexData
        this.tables.set(indexId, index)
      }
    }
    return index
  }

  /**
   * Retrieves the raw data for a specific archive.
   *
   * @param index The index ID.
   * @param archive The archive ID.
   * @returns A Promise resolving to the raw archive data.
   */
  async getRawFile(index: number, archive: number): Promise<Uint8Array> {
    const am = await this.provider.getArchive(index, archive)
    if (!am) {
      throw new Error(`Archive ${index}:${archive} not found`)
    }
    return am.getDecryptedData()
  }

  async getAssetCounts(): Promise<AssetCounts> {
    const counts: AssetCounts = {
      item: 0,
      npc: 0,
      obj: 0,
      enum: 0,
      struct: 0,
      param: 0,
      underlay: 0,
      animation: 0,
      healthBar: 0,
      hitsplat: 0,
      dbTable: 0,
      dbRow: 0,
      worldEntity: 0,
      sprite: 0,
      map: 0,
    }

    const configIndex = await this.getIndex(2)
    if (configIndex) {
      const getCount = async (archiveId: number) => {
        return await new ConfigLoader(this, 2, archiveId).getCount()
      }
      counts.item = await getCount(10)
      counts.npc = await getCount(9)
      counts.obj = await getCount(6)
      counts.enum = await getCount(8)
      counts.struct = await getCount(34)
      counts.param = await getCount(11)
      counts.underlay = await getCount(1)
      counts.animation = await getCount(12)
      counts.healthBar = await getCount(33)
      counts.hitsplat = await getCount(32)
      counts.dbTable = await getCount(39)
      counts.dbRow = await getCount(38)
      counts.worldEntity = await getCount(72)
    }

    const spriteIndex = await this.getIndex(8)
    if (spriteIndex) {
      counts.sprite = spriteIndex.archives.size
    }

    const mapIndex = await this.getIndex(5)
    if (mapIndex) {
      counts.map = mapIndex.archives.size
    }

    return counts
  }

  async getAssets(
    type: keyof AssetCounts,
    limit?: number,
    offset?: number,
    options?: { tableId?: number },
  ): Promise<Array<unknown>> {
    let assets: Array<unknown> = []
    try {
      const typeName = type as string
      switch (typeName) {
        case 'item': {
          const loader = new ConfigLoader(this, 2, 10)
          const files = await loader.getAllFiles()
          const version = (await loader.getVersion()) as CacheVersion
          assets = Array.from(files.entries())
            .filter(
              ([_, data]) =>
                data.length > 0 && (data.length > 1 || data[0] !== 0),
            )
            .map(([id, data]) => {
              try {
                return decodeItem(id, data, version)
              } catch (e) {
                console.warn(`Failed to decode item ${id}:`, e)
                return { id, name: `Error Decoding (${id})`, error: true }
              }
            })
          break
        }
        case 'npc': {
          const loader = new ConfigLoader(this, 2, 9)
          const files = await loader.getAllFiles()
          const version = (await loader.getVersion()) as CacheVersion
          assets = Array.from(files.entries())
            .filter(
              ([_, data]) =>
                data.length > 0 && (data.length > 1 || data[0] !== 0),
            )
            .map(([id, data]) => {
              try {
                return decodeNPC(id, data, version)
              } catch (e) {
                console.warn(`Failed to decode NPC ${id}:`, e)
                return { id, name: `Error Decoding (${id})`, error: true }
              }
            })
          break
        }
        case 'obj': {
          const loader = new ConfigLoader(this, 2, 6)
          const files = await loader.getAllFiles()
          const version = (await loader.getVersion()) as CacheVersion
          assets = Array.from(files.entries())
            .filter(
              ([_, data]) =>
                data.length > 0 && (data.length > 1 || data[0] !== 0),
            )
            .map(([id, data]) => {
              try {
                return decodeObject(id, data, version)
              } catch (e) {
                console.warn(`Failed to decode Object ${id}:`, e)
                return { id, name: `Error Decoding (${id})`, error: true }
              }
            })
          break
        }
        case 'enum': {
          const loader = new ConfigLoader(this, 2, 8)
          const files = await loader.getAllFiles()
          assets = Array.from(files.entries())
            .filter(
              ([_, data]) =>
                data.length > 0 && (data.length > 1 || data[0] !== 0),
            )
            .map(([id, data]) => {
              try {
                const decoded = Enum.decode(new Reader(data), id as EnumID)
                return JSON.parse(JSON.stringify(decoded))
              } catch (e) {
                console.warn(`Failed to decode Enum ${id}:`, e)
                return { id, name: `Error Decoding (${id})`, error: true }
              }
            })
          break
        }
        case 'struct': {
          const loader = new ConfigLoader(this, 2, 34)
          const files = await loader.getAllFiles()
          assets = Array.from(files.entries())
            .filter(
              ([_, data]) =>
                data.length > 0 && (data.length > 1 || data[0] !== 0),
            )
            .map(([id, data]) => {
              try {
                const decoded = Struct.decode(new Reader(data), id as StructID)
                return JSON.parse(JSON.stringify(decoded))
              } catch (e) {
                console.warn(`Failed to decode Struct ${id}:`, e)
                return { id, name: `Error Decoding (${id})`, error: true }
              }
            })
          break
        }
        case 'param': {
          const loader = new ConfigLoader(this, 2, 11)
          const files = await loader.getAllFiles()
          assets = Array.from(files.entries())
            .filter(
              ([_, data]) =>
                data.length > 0 && (data.length > 1 || data[0] !== 0),
            )
            .map(([id, data]) => {
              try {
                const decoded = Param.decode(new Reader(data), id as ParamID)
                return JSON.parse(JSON.stringify(decoded))
              } catch (e) {
                console.warn(`Failed to decode Param ${id}:`, e)
                return { id, name: `Error Decoding (${id})`, error: true }
              }
            })
          break
        }
        case 'underlay': {
          const loader = new ConfigLoader(this, 2, 1)
          const files = await loader.getAllFiles()
          assets = Array.from(files.entries())
            .filter(
              ([_, data]) =>
                data.length > 0 && (data.length > 1 || data[0] !== 0),
            )
            .map(([id, data]) => {
              try {
                const decoded = Underlay.decode(
                  new Reader(data),
                  id as UnderlayID,
                )
                return JSON.parse(JSON.stringify(decoded))
              } catch (e) {
                console.warn(`Failed to decode Underlay ${id}:`, e)
                return { id, name: `Error Decoding (${id})`, error: true }
              }
            })
          break
        }
        case 'animation': {
          const loader = new ConfigLoader(this, 2, 12)
          const files = await loader.getAllFiles()
          assets = Array.from(files.entries())
            .filter(
              ([_, data]) =>
                data.length > 0 && (data.length > 1 || data[0] !== 0),
            )
            .map(([id, data]) => {
              try {
                const decoded = Animation.decode(
                  new Reader(data),
                  id as AnimationID,
                )
                return JSON.parse(JSON.stringify(decoded))
              } catch (e) {
                console.warn(`Failed to decode Animation ${id}:`, e)
                return { id, name: `Error Decoding (${id})`, error: true }
              }
            })
          break
        }
        case 'healthBar': {
          const loader = new ConfigLoader(this, 2, 33)
          const files = await loader.getAllFiles()
          assets = Array.from(files.entries())
            .filter(
              ([_, data]) =>
                data.length > 0 && (data.length > 1 || data[0] !== 0),
            )
            .map(([id, data]) => {
              try {
                const decoded = HealthBar.decode(
                  new Reader(data),
                  id as HealthBarID,
                )
                return JSON.parse(JSON.stringify(decoded))
              } catch (e) {
                console.warn(`Failed to decode HealthBar ${id}:`, e)
                return { id, name: `Error Decoding (${id})`, error: true }
              }
            })
          break
        }
        case 'hitsplat': {
          const loader = new ConfigLoader(this, 2, 32)
          const files = await loader.getAllFiles()
          assets = Array.from(files.entries())
            .filter(
              ([_, data]) =>
                data.length > 0 && (data.length > 1 || data[0] !== 0),
            )
            .map(([id, data]) => {
              try {
                const decoded = Hitsplat.decode(
                  new Reader(data),
                  id as HitsplatID,
                )
                return JSON.parse(JSON.stringify(decoded))
              } catch (e) {
                console.warn(`Failed to decode Hitsplat ${id}:`, e)
                return { id, name: `Error Decoding (${id})`, error: true }
              }
            })
          break
        }
        case 'dbTable': {
          const loader = new ConfigLoader(this, 2, 39)
          const files = await loader.getAllFiles()
          assets = Array.from(files.entries())
            .filter(
              ([_, data]) =>
                data.length > 0 && (data.length > 1 || data[0] !== 0),
            )
            .map(([id, data]) => {
              try {
                const decoded = DBTable.decode(new Reader(data), id as DBTableID)
                return JSON.parse(JSON.stringify(decoded))
              } catch (e) {
                console.warn(`Failed to decode DBTable ${id}:`, e)
                return { id, name: `Error Decoding (${id})`, error: true }
              }
            })
          break
        }
        case 'dbRow': {
          if (options?.tableId !== undefined) {
            const rows = await this.getDBRows(options.tableId)
            assets = rows.map((r) => JSON.parse(JSON.stringify(r)))
          } else {
            const loader = new ConfigLoader(this, 2, 38)
            const files = await loader.getAllFiles()
            assets = Array.from(files.entries())
              .filter(
                ([_, data]) =>
                  data.length > 0 && (data.length > 1 || data[0] !== 0),
              )
              .map(([id, data]) => {
                try {
                  const decoded = DBRow.decode(new Reader(data), id as DBRowID)
                  return JSON.parse(JSON.stringify(decoded))
                } catch (e) {
                  console.warn(`Failed to decode DBRow ${id}:`, e)
                  return { id, name: `Error Decoding (${id})`, error: true }
                }
              })
          }
          break
        }
        case 'worldEntity': {
          const loader = new ConfigLoader(this, 2, 72)
          const files = await loader.getAllFiles()
          assets = Array.from(files.entries())
            .filter(
              ([_, data]) =>
                data.length > 0 && (data.length > 1 || data[0] !== 0),
            )
            .map(([id, data]) => {
              try {
                const decoded = WorldEntity.decode(
                  new Reader(data),
                  id as WorldEntityID,
                )
                return JSON.parse(JSON.stringify(decoded))
              } catch (e) {
                console.warn(`Failed to decode WorldEntity ${id}:`, e)
                return { id, name: `Error Decoding (${id})`, error: true }
              }
            })
          break
        }
        case 'sprite': {
          const loader = new ArchiveLoader(this, 8)
          const table = await this.getIndex(8)
          if (table) {
            let archiveIds = Array.from(table.archives.keys())

            // Apply pagination BEFORE decoding to avoid OOM and network timeouts
            if (offset !== undefined || limit !== undefined) {
              const start = offset ?? 0
              const end = limit !== undefined ? start + limit : undefined
              archiveIds = archiveIds.slice(start, end)
            }

            assets = (
              await Promise.all(
                archiveIds.map(async (id: number) => {
                  try {
                    const data = await loader.getArchive(id)
                    if (data) {
                      const decoded = Sprites.decode(
                        new Reader(data),
                        id as SpriteID,
                      )
                      // Convert to plain object to ensure Seroval serialization works
                      return {
                        id: decoded.id,
                        width: decoded.width,
                        height: decoded.height,
                        palette: Array.from(decoded.palette),
                        sprites: decoded.sprites.map((s) => ({
                          offsetX: s.offsetX,
                          offsetY: s.offsetY,
                          width: s.pixelsWidth,
                          height: s.pixelsHeight,
                          pixels: Array.from(s.pixels),
                        })),
                      }
                    }
                  } catch (e) {
                    console.warn(`Failed to decode Sprite ${id}:`, e)
                    return { id, name: `Error Decoding (${id})`, error: true }
                  }
                  return null
                }),
              )
            ).filter((a) => a !== null)

            // Return early since we already handled pagination
            return assets
          }
          break
        }
        default: {
          const mapping = TECHNICAL_ASSET_MAPPINGS[typeName]
          if (mapping.index === 2 && mapping.archive !== undefined) {
            const loader = new ConfigLoader(this, 2, mapping.archive)
            const files = await loader.getAllFiles()
            assets = Array.from(files.entries())
              .filter(
                ([_, data]) =>
                  data.length > 0 && (data.length > 1 || data[0] !== 0),
              )
              .map(([id, data]) => {
                try {
                  const subTypeName = type as string
                  if (subTypeName === 'healthBar')
                    return JSON.parse(
                      JSON.stringify(
                        HealthBar.decode(new Reader(data), id as HealthBarID),
                      ),
                    )
                  if (subTypeName === 'hitsplat')
                    return JSON.parse(
                      JSON.stringify(
                        Hitsplat.decode(new Reader(data), id as HitsplatID),
                      ),
                    )
                  if (subTypeName === 'worldEntity')
                    return JSON.parse(
                      JSON.stringify(
                        WorldEntity.decode(
                          new Reader(data),
                          id as WorldEntityID,
                        ),
                      ),
                    )
                  if (subTypeName === 'dbRow')
                    return JSON.parse(
                      JSON.stringify(
                        DBRow.decode(new Reader(data), id as DBRowID),
                      ),
                    )
                  if (subTypeName === 'dbTable')
                    return JSON.parse(
                      JSON.stringify(
                        DBTable.decode(new Reader(data), id as DBTableID),
                      ),
                    )

                  return { id, size: data.length, status: 'Encoded' }
                } catch (e) {
                  console.warn(`Failed to decode ${type as string} ${id}:`, e)
                  return { id, name: `Error Decoding (${id})`, error: true }
                }
              })
          } else {
            const loader = new ArchiveLoader(this, mapping.index)
            const count = await loader.getCount()
            assets = Array.from({ length: count }, (_, i) => ({
              id: i,
              status: 'Archive',
            }))
          }
        }
      }
    } catch (error) {
      console.error(`Fatal error in getAssets for ${type}:`, error)
      throw error
    }

    if (offset !== undefined || limit !== undefined) {
      const start = offset ?? 0
      const end = limit !== undefined ? start + limit : undefined
      return assets.slice(start, end)
    }

    return assets
  }

  /**
   * Helper method to retrieve all rows for a specific database table.
   *
   * @param tableId The ID of the DBTable.
   * @returns A Promise resolving to an array of DBRows.
   */
  async getDBRows(tableId: number): Promise<Array<DBRow>> {
    return (await DBTable.loadRows(this.provider, tableId)) || []
  }
}

/**
 * Convenience function to fetch metadata and asset counts without manually managing a Cache instance.
 *
 * @param options Configuration options for loading the cache.
 * @returns A Promise that resolves to the CacheMetadata summary.
 */
export const getMetadata = async (
  options: LoadCacheOptions = {},
): Promise<CacheMetadata> => {
  const cache = await Cache.load(options)
  const counts = await cache.getAssetCounts()

  // Find the source name
  const client = new OpenRS2Client()
  const allCaches = await client.listCaches()
  const provider = cache.provider as HybridCacheProvider
  const meta = allCaches.find((c) => c.id === provider.metadata.id)

  return {
    id: provider.metadata.id || 0,
    scope: provider.metadata.scope || 'runescape',
    game: options.game || 'oldschool',
    timestamp: meta?.timestamp || new Date().toISOString(),
    builds: meta?.builds || [],
    source: meta?.sources[0] || 'OpenRS2 Archive',
    counts,
  }
}

/**
 * Convenience function to fetch assets by type.
 *
 * @param type The type of assets to fetch.
 * @param options Configuration options for loading the cache.
 * @param limit Optional limit on the number of assets.
 * @param offset Optional offset for pagination.
 * @param filtering Optional filtering parameters.
 * @returns A Promise resolving to an array of assets.
 */
export const getAssetsByType = async (
  type: keyof AssetCounts,
  options: LoadCacheOptions = {},
  limit?: number,
  offset?: number,
  filtering?: { tableId?: number },
): Promise<Array<unknown>> => {
  const cache = await Cache.load(options)
  return await cache.getAssets(type, limit, offset, filtering)
}

/**
 * Convenience function to initialize a cache and return its asset counts.
 *
 * @param options Configuration options for loading the cache.
 * @returns A Promise that resolves to the AssetCounts report.
 */
export const loadCache = async (
  options: LoadCacheOptions = {},
): Promise<AssetCounts> => {
  console.log('OSRS Cache Loader Initialized')
  const cache = await Cache.load(options)
  return await cache.getAssetCounts()
}

// New Cache System (Alignment with cache2)
export { OpenRS2CacheProvider, OpenRS2IndexData } from './cache/OpenRS2Cache'
export { DiskCacheProvider } from './cache/DiskCache'
export { HybridCacheProvider } from './cache/HybridCacheProvider'
export { CacheInstaller } from './cache/CacheInstaller'
export { ArchiveData, ArchiveFile } from './cache/Cache'
export type { CacheProvider, IndexData, CacheVersion } from './cache/Cache'
export * from './cache/loaders'