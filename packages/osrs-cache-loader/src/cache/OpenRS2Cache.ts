import {
  ArchiveData,
  hash,
} from './Cache'
import { Reader } from './Reader'
import { XTEAKeyManager } from './xtea'
import type {
  CacheProvider,
  CacheVersion,
  IndexData} from './Cache';
import type { OpenRS2Client } from '../openrs2-client'
import type { OpenRS2Cache as OpenRS2CacheMetadata } from '../types'

export class OpenRS2IndexData implements IndexData {
  public id!: number
  public protocol!: number
  public revision!: number
  public compression!: number
  public crc!: number
  public named!: boolean
  public sized!: boolean
  /** @internal */ archives: Map<number, ArchiveData> = new Map()

  public static decode(cdata: Uint8Array, index: number): OpenRS2IndexData {
    const ad = new ArchiveData(255, index)
    ad.addFile(0, 0)
    ad.compressedData = cdata

    // Force decompression
    ad.getDecryptedData()
    const file = ad.getFile(0)
    if (!file) {
      throw new Error(`Failed to decompress index ${index}`)
    }

    const r = new Reader(file.data)

    const out = new OpenRS2IndexData()
    out.id = index
    const protocol = (out.protocol = r.u8())
    out.revision = protocol >= 6 ? r.i32() : -1

    const flags = r.u8()
    const named = (out.named = !!(flags & 1))
    const sized = (out.sized = !!(flags & 4))

    const numArchives = protocol <= 6 ? r.u16() : r.u32o16()
    const ams: Array<ArchiveData> = new Array(numArchives)
    for (let i = 0, id = 0; i < numArchives; i++) {
      id += protocol <= 6 ? r.u16() : r.u32o16()
      const v = new ArchiveData(index, id)
      ams[i] = v
      out.archives.set(id, v)
    }

    if (named) {
      for (const am of ams) {
        am.namehash = r.i32()
      }
    }
    for (const am of ams) {
      am.crc = r.i32()
    }
    if (sized) {
      for (const am of ams) {
        am.compressedSize = r.i32()
        am.decompressedSize = r.i32()
      }
    }
    for (const am of ams) {
      am.revision = r.i32()
    }

    const numFileses = new Uint32Array(ams.length)
    for (let i = 0; i < numArchives; i++) {
      numFileses[i] = protocol <= 6 ? r.u16() : r.u32o16()
    }

    for (let i = 0; i < numArchives; i++) {
      const am = ams[i]
      const numFiles = numFileses[i]
      let fileId = 0
      for (let j = 0; j < numFiles; j++) {
        fileId += protocol <= 6 ? r.u16() : r.u32o16()
        am.addFile(fileId, 0)
      }
    }

    if (named) {
      for (const am of ams) {
        for (const archiveFile of am.files.values()) {
          ;(archiveFile as { namehash?: number }).namehash = r.i32()
        }
      }
    }

    return out
  }
}

export class OpenRS2CacheProvider implements CacheProvider {
  private indexData: Map<number, Promise<OpenRS2IndexData | undefined>> =
    new Map()
  private keysPromise?: Promise<XTEAKeyManager>

  public constructor(
    public readonly metadata: OpenRS2CacheMetadata,
    private readonly client: OpenRS2Client,
  ) {}

  public async getIndex(index: number): Promise<OpenRS2IndexData | undefined> {
    let id = this.indexData.get(index)
    if (!id) {
      this.indexData.set(
        index,
        (id = (async () => {
          let cdata: Uint8Array
          try {
            const buffer = await this.client.getGroup(
              this.metadata.scope,
              this.metadata.id,
              255,
              index,
            )
            cdata = new Uint8Array(buffer)
          } catch {
            // 404 or other error means index doesn't exist
            return undefined
          }

          return OpenRS2IndexData.decode(cdata, index)
        })()),
      )
    }
    return id
  }

  public async getArchives(index: number): Promise<Array<number> | undefined> {
    if (index === 255) {
      // Master index doesn't have a standard reference table.
      // Return a range or just undefined if not needed.
      return undefined
    }
    const idx = await this.getIndex(index)
    if (!idx) {
      return
    }

    return Array.from(idx.archives.keys())
  }

  public async getArchive(
    index: number,
    archive: number,
  ): Promise<ArchiveData | undefined> {
    if (index === 255) {
      // Special case for master index groups (indices themselves)
      const am = new ArchiveData(255, archive)
      try {
        const buffer = await this.client.getGroup(
          this.metadata.scope,
          this.metadata.id,
          255,
          archive,
        )
        am.compressedData = new Uint8Array(buffer)
        return am
      } catch {
        return undefined
      }
    }

    const idx = await this.getIndex(index)
    if (!idx) {
      return
    }
    const am = idx.archives.get(archive)
    if (!am) {
      return
    }
    if (!am.compressedData) {
      try {
        const buffer = await this.client.getGroup(
          this.metadata.scope,
          this.metadata.id,
          index,
          archive,
        )
        am.compressedData = new Uint8Array(buffer)
      } catch {
        return undefined
      }
    }
    return am
  }

  public async getArchiveByName(
    index: number,
    name: string | number,
  ): Promise<ArchiveData | undefined> {
    const namehash = hash(name)

    const idx = await this.getIndex(index)
    if (!idx) {
      return
    }

    for (const ar of idx.archives.values()) {
      if (ar.namehash === namehash) {
        if (!ar.compressedData) {
          try {
            const buffer = await this.client.getGroup(
              this.metadata.scope,
              this.metadata.id,
              index,
              ar.archive,
            )
            ar.compressedData = new Uint8Array(buffer)
          } catch {
            return undefined
          }
        }
        return ar
      }
    }
  }

  public async getVersion(index: number): Promise<CacheVersion> {
    return {
      era: 'osrs',
      indexRevision: (await this.getIndex(index))?.revision ?? 0,
    }
  }

  public async getKeys(): Promise<XTEAKeyManager> {
    if (this.keysPromise) {
      return this.keysPromise
    }
    return (this.keysPromise = (async () => {
      const keys = new XTEAKeyManager()
      try {
        const fetchedKeys = await this.client.getXTEAKeys(
          this.metadata.scope,
          this.metadata.id,
        )
        keys.loadKeys(fetchedKeys)
      } catch (e) {
        console.warn('Failed to fetch XTEA keys:', e)
      }
      return keys
    })())
  }
}
