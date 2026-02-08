import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OpenRS2Client, OpenRS2Error } from './openrs2-client'

describe('OpenRS2Client', () => {
  let client: OpenRS2Client

  beforeEach(() => {
    client = new OpenRS2Client()
    global.fetch = vi.fn()
  })

  it('should fetch a list of caches', async () => {
    const mockCaches = [{ id: 1, scope: 'runescape', game: 'oldschool' }]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => await Promise.resolve(mockCaches),
    })

    const caches = await client.listCaches()
    expect(caches).toEqual(mockCaches)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://archive.openrs2.org/caches.json',
    )
  })

  it('should get the latest cache for oldschool', async () => {
    const mockCaches = [
      { id: 1, game: 'oldschool', timestamp: '2023-01-01T00:00:00Z' },
      { id: 2, game: 'oldschool', timestamp: '2023-01-02T00:00:00Z' },
      { id: 3, game: 'rs2', timestamp: '2023-01-03T00:00:00Z' },
    ]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => await Promise.resolve(mockCaches),
    })

    const latest = await client.getLatestCache('oldschool')
    expect(latest.id).toBe(2)
  })

  it('should throw OpenRS2Error if no caches found for game', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => await Promise.resolve([]),
    })

    await expect(client.getLatestCache('oldschool')).rejects.toThrow(
      OpenRS2Error,
    )
    await expect(client.getLatestCache('oldschool')).rejects.toThrow(
      'No caches found for game: oldschool',
    )
  })

  it('should fetch XTEA keys', async () => {
    const mockKeys = [{ mapsquare: 1234, key: [1, 2, 3, 4] }]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => await Promise.resolve(mockKeys),
    })

    const keys = await client.getXTEAKeys('runescape', 123)
    expect(keys).toEqual(mockKeys)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://archive.openrs2.org/caches/runescape/123/keys.json',
    )
  })

  it('should fetch archive group', async () => {
    const mockBuffer = new ArrayBuffer(8)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      arrayBuffer: async () => await Promise.resolve(mockBuffer),
    })

    const buffer = await client.getGroup('runescape', 123, 10, 5)
    expect(buffer).toBe(mockBuffer)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://archive.openrs2.org/caches/runescape/123/archives/10/groups/5.dat',
    )
  })

  it('should throw OpenRS2Error on 404', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    await expect(client.listCaches()).rejects.toThrow(OpenRS2Error)
    await expect(client.listCaches()).rejects.toThrow(
      'OpenRS2 Error (404): Not Found',
    )
  })

  it('should download flat tarball export', async () => {
    const mockBuffer = new ArrayBuffer(1024)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      arrayBuffer: async () => await Promise.resolve(mockBuffer),
    })

    const buffer = await client.downloadFlatExport(123)
    expect(buffer).toBe(mockBuffer)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://archive.openrs2.org/caches/runescape/123/flat-file.tar.gz',
    )
  })
})
