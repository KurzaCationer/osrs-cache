import fs from 'node:fs/promises'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getMetadataPath } from './paths'
import { MetadataStore } from './metadata-store'
import type { Mock } from 'vitest'
import type { OpenRS2Cache } from './types'

describe('MetadataStore', () => {
  let store: MetadataStore

  beforeEach(() => {
    store = new MetadataStore()
    vi.mock('fs/promises')
  })

  it('should return empty metadata if file does not exist', async () => {
    ;(fs.readFile as Mock).mockRejectedValue(new Error('File not found'))
    const metadata = await store.load()
    expect(metadata.games).toEqual({})
  })

  it('should load metadata from disk', async () => {
    const mockData = {
      games: {
        oldschool: {
          latestCacheId: 123,
          lastCheckedAt: 1000,
          cache: { id: 123, game: 'oldschool' } as unknown as OpenRS2Cache,
        },
      },
    }
    ;(fs.readFile as Mock).mockResolvedValue(JSON.stringify(mockData))

    const metadata = await store.load()
    expect(metadata).toEqual(mockData)
  })

  it('should save metadata to disk', async () => {
    const mockData = {
      games: {
        oldschool: {
          latestCacheId: 123,
          lastCheckedAt: 1000,
          cache: { id: 123, game: 'oldschool' } as unknown as OpenRS2Cache,
        },
      },
    }

    await store.save(mockData)

    expect(fs.mkdir).toHaveBeenCalled()
    expect(fs.writeFile).toHaveBeenCalledWith(
      getMetadataPath(),
      JSON.stringify(mockData, null, 2),
    )
  })
})
