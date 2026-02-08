import { Readable } from 'node:stream'
import fs from 'node:fs/promises'
import path from 'node:path'
import * as tar from 'tar-stream'
import { gunzipSync } from 'fflate'
import { getPersistentDataDir } from '../paths'
import { DiskCacheProvider } from './DiskCache'
import { OpenRS2CacheProvider } from './OpenRS2Cache'
import type { OpenRS2Client } from '../openrs2-client'
import type { OpenRS2Cache as OpenRS2CacheMetadata } from '../types'

export class CacheInstaller {
  private disk: DiskCacheProvider
  private web: OpenRS2CacheProvider

  constructor(
    public readonly metadata: OpenRS2CacheMetadata,
    private readonly client: OpenRS2Client,
  ) {
    this.disk = new DiskCacheProvider(metadata.id)
    this.web = new OpenRS2CacheProvider(metadata, client)
  }

  /**
   * Downloads and saves the entire cache to disk as a flat-file tarball.
   * This is significantly faster than fetching individual groups.
   */
  async install(): Promise<void> {
    console.log(`Installing cache ${this.metadata.id} via flat tarball...`)

    // 1. Download XTEA keys
    console.log('Downloading XTEA keys...')
    const keys = await this.client.getXTEAKeys(
      this.metadata.scope,
      this.metadata.id,
    )
    await this.disk.saveKeys(keys)

    // 2. Download flat export
    console.log('Downloading flat tarball (this may take a minute)...')
    const tarGzBuffer = await this.client.downloadFlatExport(
      this.metadata.id,
      this.metadata.scope,
    )

    // 3. Decompress GZIP
    console.log('Decompressing GZIP...')
    const tarBuffer = gunzipSync(new Uint8Array(tarGzBuffer))

    // 4. Extract TAR and save to disk
    console.log('Extracting cache files...')

    const extract = tar.extract()
    const extractPromise = new Promise<void>((resolve, reject) => {
      extract.on('entry', async (header, stream, next) => {
        try {
          // OpenRS2 flat tar format: "cache/<index>/<group>.dat"
          const name = header.name
          const parts = name.split('/')

          // We expect "cache", "<index>", "<group>.dat"
          if (parts.length === 3 && parts[0] === 'cache') {
            const index = parseInt(parts[1])
            const group = parseInt(parts[2].replace('.dat', ''))

            if (!isNaN(index) && !isNaN(group)) {
              const chunks: Array<Uint8Array> = []
              for await (const chunk of stream) {
                chunks.push(chunk)
              }
              const data = new Uint8Array(Buffer.concat(chunks))
              await this.disk.saveGroup(index, group, data)
            }
          }

          stream.resume()
          next()
        } catch (e) {
          reject(e)
        }
      })

      extract.on('finish', () => resolve())
      extract.on('error', (err) => reject(err))
    })

    const readable = new Readable()
    readable.push(Buffer.from(tarBuffer))
    readable.push(null)
    readable.pipe(extract)

    await extractPromise

    // 5. Cleanup old caches
    await this.cleanupOldCaches()

    console.log(`Cache ${this.metadata.id} installed successfully.`)
  }

  /**
   * Removes all cache directories from disk except the one currently being installed.
   */
  async cleanupOldCaches(): Promise<void> {
    console.log('Cleaning up old cache directories...')
    const cachesRoot = path.join(getPersistentDataDir(), 'caches')

    try {
      const entries = await fs.readdir(cachesRoot)
      for (const entry of entries) {
        const cacheId = parseInt(entry)
        if (!isNaN(cacheId) && cacheId !== this.metadata.id) {
          const oldCachePath = path.join(cachesRoot, entry)
          console.log(`Deleting old cache: ${oldCachePath}`)
          await fs.rm(oldCachePath, { recursive: true, force: true })
        }
      }
    } catch (e) {
      // Root directory might not exist or other issues, ignore
      console.warn('Failed to cleanup old caches:', e)
    }
  }
}
