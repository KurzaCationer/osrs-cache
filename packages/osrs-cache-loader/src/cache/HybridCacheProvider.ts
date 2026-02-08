import { OpenRS2CacheProvider } from './OpenRS2Cache'
import { DiskCacheProvider } from './DiskCache'
import type { OpenRS2Client } from '../openrs2-client'
import type { ArchiveData, CacheProvider, CacheVersion, IndexData } from './Cache'
import type { XTEAKeyManager } from './xtea'
import type { OpenRS2Cache as OpenRS2CacheMetadata } from '../types'

export class HybridCacheProvider implements CacheProvider {
  private disk: DiskCacheProvider
  private web: OpenRS2CacheProvider

  constructor(
    public readonly metadata: OpenRS2CacheMetadata,
    private readonly client: OpenRS2Client,
  ) {
    this.disk = new DiskCacheProvider(metadata.id)
    this.web = new OpenRS2CacheProvider(metadata, client)
  }

  async getIndex(index: number): Promise<IndexData | undefined> {
    let idx = await this.disk.getIndex(index)
    if (idx) return idx

    idx = await this.web.getIndex(index)
    if (idx) {
      // Save to disk for next time
      try {
        const buffer = await this.client.getGroup(
          this.metadata.scope,
          this.metadata.id,
          255,
          index,
        )
        await this.disk.saveGroup(255, index, new Uint8Array(buffer))
      } catch (_e) {
        console.warn(`Failed to save index ${index} to disk:`, _e)
      }
    }
    return idx
  }

  async getArchive(
    index: number,
    archive: number,
  ): Promise<ArchiveData | undefined> {
    let am = await this.disk.getArchive(index, archive)
    if (am) return am

    am = await this.web.getArchive(index, archive)
    if (am && am.compressedData) {
      // Save to disk
      try {
        await this.disk.saveGroup(index, archive, am.compressedData)
      } catch (_e) {
        console.warn(`Failed to save archive ${index}:${archive} to disk:`, _e)
      }
    }
    return am
  }

  async getArchiveByName(
    index: number,
    name: string | number,
  ): Promise<ArchiveData | undefined> {
    // This is tricky because we don't know the archive ID without loading the index.
    // But disk.getArchiveByName will try to load the index from disk first.
    let am = await this.disk.getArchiveByName(index, name)
    if (am) return am

    am = await this.web.getArchiveByName(index, name)
    if (am && am.compressedData) {
      // Save to disk
      try {
        await this.disk.saveGroup(index, am.archive, am.compressedData)
      } catch (_e) {
        console.warn(
          `Failed to save archive ${index}:${am.archive} to disk:`,
          _e,
        )
      }
    }
    return am
  }

  async getArchives(index: number): Promise<Array<number> | undefined> {
    const diskArchives = await this.disk.getArchives(index)
    if (diskArchives) return diskArchives
    return this.web.getArchives(index)
  }

  async getVersion(index: number): Promise<CacheVersion> {
    // Preference to disk if available
    const diskIdx = await this.disk.getIndex(index)
    if (diskIdx) {
      return { era: 'osrs', indexRevision: diskIdx.revision }
    }
    return this.web.getVersion(index)
  }

  async getKeys(): Promise<XTEAKeyManager> {
    // Try disk first
    const diskKeys = await this.disk.getKeys()
    if (diskKeys.allKeys.length > 0) return diskKeys

    const webKeys = await this.web.getKeys()
    if (webKeys.allKeys.length > 0) {
      // Save to disk
      try {
        const keys = await this.client.getXTEAKeys(
          this.metadata.scope,
          this.metadata.id,
        )
        await this.disk.saveKeys(keys)
      } catch (_e) {
        console.warn(`Failed to save XTEA keys to disk:`, _e)
      }
    }
    return webKeys
  }
}
