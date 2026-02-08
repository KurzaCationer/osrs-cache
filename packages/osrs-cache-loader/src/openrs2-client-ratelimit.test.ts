import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OpenRS2Client } from './openrs2-client'
import type { Mock } from 'vitest'
import type { MetadataStore } from './metadata-store'

describe('OpenRS2Client Rate Limiting', () => {
  let client: OpenRS2Client
  let mockMetadataStore: {
    getGameMetadata: Mock
    setGameMetadata: Mock
    load: Mock
    save: Mock
  }

  beforeEach(() => {
    mockMetadataStore = {
      getGameMetadata: vi.fn(),
      setGameMetadata: vi.fn(),
      load: vi.fn(),
      save: vi.fn(),
    }
    client = new OpenRS2Client(
      'https://archive.openrs2.org',
      mockMetadataStore as unknown as MetadataStore,
    )
    global.fetch = vi.fn()
  })

  it('should fetch from API if no cached metadata exists', async () => {
    mockMetadataStore.getGameMetadata.mockResolvedValue(null)
    const mockCaches = [
      { id: 123, game: 'oldschool', timestamp: '2023-01-01T00:00:00Z' },
    ]
    ;(global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => await Promise.resolve(mockCaches),
    })

    const latest = await client.getLatestCache('oldschool')

    expect(latest.id).toBe(123)
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(mockMetadataStore.setGameMetadata).toHaveBeenCalledWith(
      'oldschool',
      expect.objectContaining({
        latestCacheId: 123,
      }),
    )
  })

  it('should use cached metadata if checked less than 1 hour ago', async () => {
    const oneMinuteAgo = Date.now() - 60000
    const mockCache = { id: 123, game: 'oldschool' }
    mockMetadataStore.getGameMetadata.mockResolvedValue({
      latestCacheId: 123,
      lastCheckedAt: oneMinuteAgo,
      cache: mockCache,
    })

    const latest = await client.getLatestCache('oldschool')
    expect(latest.id).toBe(123)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should fetch from API if cached metadata is older than 1 hour', async () => {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000
    const mockCache = { id: 123, game: 'oldschool' }
    mockMetadataStore.getGameMetadata.mockResolvedValue({
      latestCacheId: 123,
      lastCheckedAt: twoHoursAgo,
      cache: mockCache,
    })

    const mockCaches = [
      { id: 124, game: 'oldschool', timestamp: '2023-01-01T00:00:00Z' },
    ]
    ;(global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => await Promise.resolve(mockCaches),
    })

    const latest = await client.getLatestCache('oldschool')
    expect(latest.id).toBe(124)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('should fetch from API if forceRefresh is true and checked more than 5 minutes ago', async () => {
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000
    const mockCache = { id: 123, game: 'oldschool' }
    mockMetadataStore.getGameMetadata.mockResolvedValue({
      latestCacheId: 123,
      lastCheckedAt: tenMinutesAgo,
      cache: mockCache,
    })

    const mockCaches = [
      { id: 123, game: 'oldschool', timestamp: '2023-01-01T00:00:00Z' },
    ]
    ;(global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => await Promise.resolve(mockCaches),
    })

    await client.getLatestCache('oldschool', true)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('should NOT fetch from API if forceRefresh is true but checked less than 5 minutes ago', async () => {
    const oneMinuteAgo = Date.now() - 60000
    const mockCache = { id: 123, game: 'oldschool' }
    mockMetadataStore.getGameMetadata.mockResolvedValue({
      latestCacheId: 123,
      lastCheckedAt: oneMinuteAgo,
      cache: mockCache,
    })

    const latest = await client.getLatestCache('oldschool', true)
    expect(latest.id).toBe(123)
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
