import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CacheInstaller } from './cache/CacheInstaller'
import { cacheExistsOnDisk } from './paths'
import { Cache } from './index'
import type { Mock } from 'vitest'

vi.mock('./cache/CacheInstaller', () => {
  return {
    CacheInstaller: vi.fn().mockImplementation(() => ({
      install: vi.fn().mockResolvedValue(undefined),
      cleanupOldCaches: vi.fn().mockResolvedValue(undefined),
    })),
  }
})

vi.mock('./paths', async () => {
  const actual = (await vi.importActual('./paths'))
  return {
    ...actual,
    cacheExistsOnDisk: vi.fn(),
    getCacheDir: vi.fn().mockReturnValue('/tmp/osrs-cache/123'),
  }
})

vi.mock('./metadata-store', () => {
  return {
    MetadataStore: vi.fn().mockImplementation(() => ({
      getGameMetadata: vi.fn().mockResolvedValue(null),
      setGameMetadata: vi.fn().mockResolvedValue(undefined),
      load: vi.fn().mockResolvedValue({ games: {} }),
      save: vi.fn().mockResolvedValue(undefined),
    })),
  }
})

describe('Cache.load Proactive Installation', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
    vi.clearAllMocks()
  })

  it('should trigger CacheInstaller if cache is missing from disk', async () => {
    vi.mocked(cacheExistsOnDisk).mockResolvedValue(false)

    const mockCaches = [{ id: 123, scope: 'runescape', game: 'oldschool' }]

    // Valid minimal container for reference table
    const mockTable = new Uint8Array([5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const mockContainer = new Uint8Array(5 + mockTable.length)
    mockContainer[4] = mockTable.length
    mockContainer.set(mockTable, 5)
    ;(global.fetch as Mock).mockImplementation((url: string) => {
      if (url.includes('caches.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => await Promise.resolve(mockCaches),
        })
      }
      return Promise.resolve({
        ok: true,
        arrayBuffer: async () => await Promise.resolve(mockContainer.buffer),
      })
    })

    await Cache.load({ game: 'oldschool' })

    expect(CacheInstaller).toHaveBeenCalled()
    const installerInstance = (CacheInstaller as unknown as Mock).mock
      .results[0].value as { install: Mock }
    expect(installerInstance.install).toHaveBeenCalled()
  })

  it('should NOT trigger CacheInstaller if cache exists on disk', async () => {
    ;(cacheExistsOnDisk as Mock).mockResolvedValue(true)

    const mockCaches = [{ id: 123, scope: 'runescape', game: 'oldschool' }]

    const mockTable = new Uint8Array([5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const mockContainer = new Uint8Array(5 + mockTable.length)
    mockContainer[4] = mockTable.length
    mockContainer.set(mockTable, 5)
    ;(global.fetch as Mock).mockImplementation((url: string) => {
      if (url.includes('caches.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => await Promise.resolve(mockCaches),
        })
      }
      return Promise.resolve({
        ok: true,
        arrayBuffer: async () => await Promise.resolve(mockContainer.buffer),
      })
    })

    await Cache.load({ game: 'oldschool' })

    expect(CacheInstaller).not.toHaveBeenCalled()
  })

  it('should NOT trigger CacheInstaller if forceUpdate is true but cache already exists on disk', async () => {
    ;(cacheExistsOnDisk as Mock).mockResolvedValue(true)

    const mockCaches = [{ id: 123, scope: 'runescape', game: 'oldschool' }]

    const mockTable = new Uint8Array([5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const mockContainer = new Uint8Array(5 + mockTable.length)
    mockContainer[4] = mockTable.length
    mockContainer.set(mockTable, 5)
    ;(global.fetch as Mock).mockImplementation((url: string) => {
      if (url.includes('caches.json'))
        return Promise.resolve({
          ok: true,
          json: async () => await Promise.resolve(mockCaches),
        })
      return Promise.resolve({
        ok: true,
        arrayBuffer: async () => await Promise.resolve(mockContainer.buffer),
      })
    })

    await Cache.load({ game: 'oldschool', forceUpdate: true })

    expect(CacheInstaller).not.toHaveBeenCalled()
  })
})
