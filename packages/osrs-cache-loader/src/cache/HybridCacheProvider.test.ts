import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HybridCacheProvider } from './HybridCacheProvider'
import type { Mock } from 'vitest'
import type { OpenRS2Cache } from '../types'
import type { OpenRS2Client } from '../openrs2-client'

vi.mock('./DiskCache', () => {
  const DiskCacheProvider = vi.fn()
  DiskCacheProvider.prototype.getIndex = vi.fn()
  DiskCacheProvider.prototype.getArchive = vi.fn()
  DiskCacheProvider.prototype.saveGroup = vi.fn()
  DiskCacheProvider.prototype.getKeys = vi.fn().mockResolvedValue({ size: 0 })
  DiskCacheProvider.prototype.saveKeys = vi.fn()
  // Add missing methods to avoid runtime errors if they are called
  DiskCacheProvider.prototype.getArchives = vi.fn()
  DiskCacheProvider.prototype.getArchiveByName = vi.fn()
  DiskCacheProvider.prototype.getVersion = vi.fn()

  return { DiskCacheProvider }
})

vi.mock('./OpenRS2Cache', () => {
  const OpenRS2CacheProvider = vi.fn()
  OpenRS2CacheProvider.prototype.getIndex = vi.fn()
  OpenRS2CacheProvider.prototype.getArchive = vi.fn()
  OpenRS2CacheProvider.prototype.getKeys = vi
    .fn()
    .mockResolvedValue({ size: 0 })
  // Add missing methods
  OpenRS2CacheProvider.prototype.getArchives = vi.fn()
  OpenRS2CacheProvider.prototype.getArchiveByName = vi.fn()
  OpenRS2CacheProvider.prototype.getVersion = vi.fn()

  return { OpenRS2CacheProvider }
})

describe('HybridCacheProvider', () => {
  const mockMetadata = {
    id: 123,
    scope: 'runescape',
  } as unknown as OpenRS2Cache
  const mockClient = {
    getGroup: vi.fn().mockResolvedValue(new ArrayBuffer(10)),
    getXTEAKeys: vi.fn().mockResolvedValue([]),
  } as unknown as OpenRS2Client

  let provider: HybridCacheProvider
  let disk: { getIndex: Mock; saveGroup: Mock }
  let web: { getIndex: Mock }

  beforeEach(() => {
    vi.clearAllMocks()
    provider = new HybridCacheProvider(mockMetadata, mockClient)
    disk = (provider as unknown as { disk: typeof disk }).disk
    web = (provider as unknown as { web: typeof web }).web
  })

  it('should save to disk after fetching from web', async () => {
    disk.getIndex.mockResolvedValue(undefined)
    web.getIndex.mockResolvedValue({ id: 1, revision: 123 })

    await provider.getIndex(1)

    expect(web.getIndex).toHaveBeenCalledWith(1)
    expect(mockClient.getGroup).toHaveBeenCalledWith('runescape', 123, 255, 1)
    expect(disk.saveGroup).toHaveBeenCalled()
  })

  it('should not fetch from web if disk has it', async () => {
    disk.getIndex.mockResolvedValue({ id: 1, revision: 123 })

    await provider.getIndex(1)

    expect(disk.getIndex).toHaveBeenCalledWith(1)
    expect(web.getIndex).not.toHaveBeenCalled()
  })
})
