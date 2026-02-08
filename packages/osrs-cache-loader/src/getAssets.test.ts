import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getAssetsByType } from './index'

let tempDir: string

vi.mock('./paths', async (importOriginal) => {
  const actual = (await importOriginal())
  return {
    ...actual,
    getCacheDir: vi.fn(() => tempDir),
    getMetadataPath: vi.fn(() => path.join(tempDir, 'metadata.json')),
    cacheExistsOnDisk: vi.fn(() => Promise.resolve(true)),
  }
})

beforeEach(async () => {
  tempDir = await fs.mkdtemp(
    path.join(os.tmpdir(), 'osrs-cache-getassets-test-'),
  )
  global.fetch = vi.fn()
})

afterEach(async () => {
  await fs.rm(tempDir, { recursive: true, force: true })
})

describe('getAssets integration', () => {
  const mockCaches = [
    {
      id: 1,
      scope: 'runescape',
      game: 'oldschool',
      timestamp: '2023-01-01T00:00:00Z',
    },
  ]

  const fallbackTable = new Uint8Array([5, 0, 0, 0])
  const fallbackContainer = new Uint8Array(5 + fallbackTable.length)
  fallbackContainer[4] = fallbackTable.length
  fallbackContainer.set(fallbackTable, 5)

  const mockFallbackResponse = {
    ok: true,
    arrayBuffer: () => Promise.resolve(fallbackContainer.buffer),
  }

  it('should return decoded Enums', async () => {
    // Index 2, Archive 8 (Enum), File 0
    const mockTable = new Uint8Array([
      5, 0, 0, 1, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
    ])
    const mockRefContainer = new Uint8Array(5 + mockTable.length)
    mockRefContainer[4] = mockTable.length
    mockRefContainer.set(mockTable, 5)

    // Enum Data: Opcode 1 (KeyType) = 's' (115)
    const enumData = new Uint8Array([1, 115, 0])
    const mockEnumContainer = new Uint8Array(5 + enumData.length)
    mockEnumContainer[4] = enumData.length
    mockEnumContainer.set(enumData, 5)
    vi.mocked(global.fetch).mockImplementation((url: string) => {
      if (url.includes('caches.json'))
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCaches),
        })
      if (url.includes('/archives/255/groups/2'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockRefContainer.buffer),
        })
      if (url.includes('/archives/2/groups/8'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockEnumContainer.buffer),
        })
      return Promise.resolve(mockFallbackResponse)
    })

    const assets = await getAssetsByType('enum', { game: 'oldschool' })
    expect(assets.length).toBeGreaterThan(0)
    // 115 is 's'
    expect(assets[0]).toHaveProperty('keyTypeChar', 115)
    expect(assets[0]).not.toHaveProperty('status', 'Encoded')
  })

  it('should return decoded Structs', async () => {
    // Index 2, Archive 34 (Struct)
    const mockTable = new Uint8Array([
      5, 0, 0, 1, 0, 34, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
    ])
    const mockRefContainer = new Uint8Array(5 + mockTable.length)
    mockRefContainer[4] = mockTable.length
    mockRefContainer.set(mockTable, 5)

    // Struct Data: Empty (just 0, 0 for filter pass)
    const structData = new Uint8Array([0, 0])
    const mockStructContainer = new Uint8Array(5 + structData.length)
    mockStructContainer[4] = structData.length
    mockStructContainer.set(structData, 5)
    vi.mocked(global.fetch).mockImplementation((url: string) => {
      if (url.includes('caches.json'))
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCaches),
        })
      if (url.includes('/archives/255/groups/2'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockRefContainer.buffer),
        })
      if (url.includes('/archives/2/groups/34'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockStructContainer.buffer),
        })
      return Promise.resolve(mockFallbackResponse)
    })

    const assets = await getAssetsByType('struct', { game: 'oldschool' })
    expect(assets.length).toBeGreaterThan(0)
    expect(assets[0]).toHaveProperty('params')
    expect(assets[0]).not.toHaveProperty('status', 'Encoded')
  })

  it('should return decoded Params', async () => {
    // Index 2, Archive 11 (Param)
    const mockTable = new Uint8Array([
      5, 0, 0, 1, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
    ])
    const mockRefContainer = new Uint8Array(5 + mockTable.length)
    mockRefContainer[4] = mockTable.length
    mockRefContainer.set(mockTable, 5)

    // Param Data: Opcode 1 (Type) = 'i' (105)
    const paramData = new Uint8Array([1, 105, 0])
    const mockParamContainer = new Uint8Array(5 + paramData.length)
    mockParamContainer[4] = paramData.length
    mockParamContainer.set(paramData, 5)
    vi.mocked(global.fetch).mockImplementation((url: string) => {
      if (url.includes('caches.json'))
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCaches),
        })
      if (url.includes('/archives/255/groups/2'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockRefContainer.buffer),
        })
      if (url.includes('/archives/2/groups/11'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockParamContainer.buffer),
        })
      return Promise.resolve(mockFallbackResponse)
    })

    const assets = await getAssetsByType('param', { game: 'oldschool' })
    expect(assets.length).toBeGreaterThan(0)
    // 105 is 'i'
    expect(assets[0]).toHaveProperty('type', 105)
    expect(assets[0]).not.toHaveProperty('status', 'Encoded')
  })

  it('should return decoded Underlays', async () => {
    // Index 2, Archive 1 (Underlay)
    const mockTable = new Uint8Array([
      5, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
    ])
    const mockRefContainer = new Uint8Array(5 + mockTable.length)
    mockRefContainer[4] = mockTable.length
    mockRefContainer.set(mockTable, 5)

    // Underlay Data: Opcode 1 (Color) = 1234
    const underlayData = new Uint8Array([1, 0, 0, 255, 0]) // Color 255
    const mockUnderlayContainer = new Uint8Array(5 + underlayData.length)
    mockUnderlayContainer[4] = underlayData.length
    mockUnderlayContainer.set(underlayData, 5)
    vi.mocked(global.fetch).mockImplementation((url: string) => {
      if (url.includes('caches.json'))
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCaches),
        })
      if (url.includes('/archives/255/groups/2'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockRefContainer.buffer),
        })
      if (url.includes('/archives/2/groups/1'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockUnderlayContainer.buffer),
        })
      return Promise.resolve(mockFallbackResponse)
    })

    const assets = await getAssetsByType('underlay', { game: 'oldschool' })
    expect(assets.length).toBeGreaterThan(0)
    expect(assets[0]).toHaveProperty('rgb')
    expect(assets[0]).not.toHaveProperty('status', 'Encoded')
  })

  it('should return decoded Animations', async () => {
    // Index 2, Archive 12 (Animation)
    const mockTable = new Uint8Array([
      5, 0, 0, 1, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
    ])
    const mockRefContainer = new Uint8Array(5 + mockTable.length)
    mockRefContainer[4] = mockTable.length
    mockRefContainer.set(mockTable, 5)

    // Animation Data: [0, 0] (Empty/Default)
    const animData = new Uint8Array([0, 0])
    const mockAnimContainer = new Uint8Array(5 + animData.length)
    mockAnimContainer[4] = animData.length
    mockAnimContainer.set(animData, 5)
    vi.mocked(global.fetch).mockImplementation((url: string) => {
      if (url.includes('caches.json'))
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCaches),
        })
      if (url.includes('/archives/255/groups/2'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockRefContainer.buffer),
        })
      if (url.includes('/archives/2/groups/12'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockAnimContainer.buffer),
        })
      return Promise.resolve(mockFallbackResponse)
    })

    const assets = await getAssetsByType('animation', { game: 'oldschool' })
    expect(assets.length).toBeGreaterThan(0)
    // Priority default is 5
    expect(assets[0]).toHaveProperty('priority', 5)
    expect(assets[0]).not.toHaveProperty('status', 'Encoded')
  })

  it('should return decoded Items (Regression)', async () => {
    // Index 2, Archive 10 (Item)
    const mockTable = new Uint8Array([
      5, 0, 0, 1, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
    ])
    const mockRefContainer = new Uint8Array(5 + mockTable.length)
    mockRefContainer[4] = mockTable.length
    mockRefContainer.set(mockTable, 5)

    // Item Data: Opcode 2 (Name) = "Test Item"
    // 2, "Test Item" (string null terminated), 0 (opcode 0)
    const nameBytes = new TextEncoder().encode('Test Item')
    const itemData = new Uint8Array(3 + nameBytes.length)
    itemData[0] = 2 // Opcode 2
    itemData.set(nameBytes, 1)
    itemData[itemData.length - 2] = 0 // Null terminator for string
    itemData[itemData.length - 1] = 0 // Opcode 0 to terminate decoding loop

    const mockItemContainer = new Uint8Array(5 + itemData.length)
    mockItemContainer[4] = itemData.length
    mockItemContainer.set(itemData, 5)
    vi.mocked(global.fetch).mockImplementation((url: string) => {
      if (url.includes('caches.json'))
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCaches),
        })
      if (url.includes('/archives/255/groups/2'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockRefContainer.buffer),
        })
      if (url.includes('/archives/2/groups/10'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockItemContainer.buffer),
        })
      return Promise.resolve(mockFallbackResponse)
    })

    const assets = await getAssetsByType('item', { game: 'oldschool' })
    expect(assets.length).toBeGreaterThan(0)
    expect(assets[0]).toHaveProperty('name', 'Test Item')
  })

  it('should return decoded HealthBars', async () => {
    // Index 2, Archive 33 (HealthBar)
    const mockTable = new Uint8Array([
      5, 0, 0, 1, 0, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
    ])
    const mockRefContainer = new Uint8Array(5 + mockTable.length)
    mockRefContainer[4] = mockTable.length
    mockRefContainer.set(mockTable, 5)

    // HealthBar Data: Opcode 5 (Duration) = 50
    const hbData = new Uint8Array([5, 0, 50, 0])
    const mockHBContainer = new Uint8Array(5 + hbData.length)
    mockHBContainer[4] = hbData.length
    mockHBContainer.set(hbData, 5)
    vi.mocked(global.fetch).mockImplementation((url: string) => {
      if (url.includes('caches.json'))
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCaches),
        })
      if (url.includes('/archives/255/groups/2'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockRefContainer.buffer),
        })
      if (url.includes('/archives/2/groups/33'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockHBContainer.buffer),
        })
      return Promise.resolve(mockFallbackResponse)
    })

    const assets = await getAssetsByType('healthBar', { game: 'oldschool' })
    expect(assets.length).toBeGreaterThan(0)
    expect(assets[0]).toHaveProperty('duration', 50)
    expect(assets[0]).not.toHaveProperty('status', 'Encoded')
  })

  it('should return decoded HitSplats', async () => {
    // Index 2, Archive 32 (HitSplat)
    const mockTable = new Uint8Array([
      5, 0, 0, 1, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
    ])
    const mockRefContainer = new Uint8Array(5 + mockTable.length)
    mockRefContainer[4] = mockTable.length
    mockRefContainer.set(mockTable, 5)

    // HitSplat Data: Opcode 8 (FormatString) = "Hit"
    const str = new TextEncoder().encode('Hit')
    const hsData = new Uint8Array([8, 0, ...str, 0, 0])
    const mockHSContainer = new Uint8Array(5 + hsData.length)
    mockHSContainer[4] = hsData.length
    mockHSContainer.set(hsData, 5)
    vi.mocked(global.fetch).mockImplementation((url: string) => {
      if (url.includes('caches.json'))
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCaches),
        })
      if (url.includes('/archives/255/groups/2'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockRefContainer.buffer),
        })
      if (url.includes('/archives/2/groups/32'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockHSContainer.buffer),
        })
      return Promise.resolve(mockFallbackResponse)
    })

    const assets = await getAssetsByType('hitsplat', { game: 'oldschool' })
    expect(assets.length).toBeGreaterThan(0)
    expect(assets[0]).toHaveProperty('formatString', 'Hit')
    expect(assets[0]).not.toHaveProperty('status', 'Encoded')
  })

  it('should return decoded Sprites', async () => {
    // Index 8, Archive 0 (Sprite)
    // Ref Table for Index 8, with Archive 0.
    const mockTable = new Uint8Array([
      5, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
    ])
    const mockRefContainer = new Uint8Array(5 + mockTable.length)
    mockRefContainer[4] = mockTable.length
    mockRefContainer.set(mockTable, 5)

    // Sprite Data: (Use the buffer from my previous unit test)
    // Structure: [Pixels(2)][Palette(3)][CanvasW(2)][CanvasH(2)][PalLen(1)][SpInfo(8)][Count(2)]
    // W=10, H=10, PalLen=1, Count=1
    const buffer = [
      1,
      0, // Pixels
      0xff,
      0xff,
      0xff, // Palette
      0,
      10,
      0,
      10,
      1, // Canvas W, H, PalLen
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      1, // Sprite Info (8 bytes)
      0,
      1, // Count
    ]
    const spriteData = new Uint8Array(buffer)
    const mockSpriteContainer = new Uint8Array(5 + spriteData.length)
    mockSpriteContainer[4] = spriteData.length
    mockSpriteContainer.set(spriteData, 5)
    vi.mocked(global.fetch).mockImplementation((url: string) => {
      if (url.includes('caches.json'))
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCaches),
        })
      if (url.includes('/archives/255/groups/8'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockRefContainer.buffer),
        })
      if (url.includes('/archives/8/groups/0'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockSpriteContainer.buffer),
        })
      return Promise.resolve(mockFallbackResponse)
    })

    const assets = await getAssetsByType('sprite', { game: 'oldschool' })
    expect(assets.length).toBeGreaterThan(0)
    expect(assets[0]).toHaveProperty('width', 10)
    expect(assets[0]).toHaveProperty('palette')
    expect(assets[0].sprites[0]).toHaveProperty('pixels')
    expect(assets[0]).not.toHaveProperty('status', 'Encoded')
  })

  it('should return decoded DBTables', async () => {
    // Index 2, Archive 39
    const mockTable = new Uint8Array([
      5, 0, 0, 1, 0, 39, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
    ])
    const mockRefContainer = new Uint8Array(5 + mockTable.length)
    mockRefContainer[4] = mockTable.length
    mockRefContainer.set(mockTable, 5)

    // DBTable Data: Opcode 1 (Default Values)
    const str = new TextEncoder().encode('Val')
    const dbtData = new Uint8Array([1, 1, 128, 1, 36, 1, ...str, 0, 255, 0])
    const mockDBTContainer = new Uint8Array(5 + dbtData.length)
    mockDBTContainer[4] = dbtData.length
    mockDBTContainer.set(dbtData, 5)
    vi.mocked(global.fetch).mockImplementation((url: string) => {
      if (url.includes('caches.json'))
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCaches),
        })
      if (url.includes('/archives/255/groups/2'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockRefContainer.buffer),
        })
      if (url.includes('/archives/2/groups/39'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockDBTContainer.buffer),
        })
      return Promise.resolve(mockFallbackResponse)
    })

    const assets = await getAssetsByType('dbTable', { game: 'oldschool' })
    expect(assets.length).toBeGreaterThan(0)
    expect(assets[0]).toHaveProperty('defaultValues')
    expect(assets[0]).not.toHaveProperty('status', 'Encoded')
  })

  it('should return decoded DBRows', async () => {
    // Index 2, Archive 38
    const mockTable = new Uint8Array([
      5, 0, 0, 1, 0, 38, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
    ])
    const mockRefContainer = new Uint8Array(5 + mockTable.length)
    mockRefContainer[4] = mockTable.length
    mockRefContainer.set(mockTable, 5)

    // DBRow Data
    const dbrData = new Uint8Array([3, 1, 0, 1, 0, 1, 0, 0, 0, 42, 255, 0])
    const mockDBRContainer = new Uint8Array(5 + dbrData.length)
    mockDBRContainer[4] = dbrData.length
    mockDBRContainer.set(dbrData, 5)
    vi.mocked(global.fetch).mockImplementation((url: string) => {
      if (url.includes('caches.json'))
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCaches),
        })
      if (url.includes('/archives/255/groups/2'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockRefContainer.buffer),
        })
      if (url.includes('/archives/2/groups/38'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockDBRContainer.buffer),
        })
      return Promise.resolve(mockFallbackResponse)
    })

    const assets = await getAssetsByType('dbRow', { game: 'oldschool' })
    expect(assets.length).toBeGreaterThan(0)
    expect(assets[0]).toHaveProperty('values')
    expect(assets[0]).not.toHaveProperty('status', 'Encoded')
  })

  it('should return decoded WorldEntities', async () => {
    // Index 2, Archive 72
    const mockTable = new Uint8Array([
      5, 0, 0, 1, 0, 72, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
    ])
    const mockRefContainer = new Uint8Array(5 + mockTable.length)
    mockRefContainer[4] = mockTable.length
    mockRefContainer.set(mockTable, 5)

    // WorldEntity Data: Opcode 12 (Name) = "Entity"
    const name = new TextEncoder().encode('Entity')
    const weData = new Uint8Array([12, ...name, 0, 0])
    const mockWEContainer = new Uint8Array(5 + weData.length)
    mockWEContainer[4] = weData.length
    mockWEContainer.set(weData, 5)
    vi.mocked(global.fetch).mockImplementation((url: string) => {
      if (url.includes('caches.json'))
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCaches),
        })
      if (url.includes('/archives/255/groups/2'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockRefContainer.buffer),
        })
      if (url.includes('/archives/2/groups/72'))
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockWEContainer.buffer),
        })
      return Promise.resolve(mockFallbackResponse)
    })

    const assets = await getAssetsByType('worldEntity', { game: 'oldschool' })
    expect(assets.length).toBeGreaterThan(0)
    expect(assets[0]).toHaveProperty('name', 'Entity')
    expect(assets[0]).not.toHaveProperty('status', 'Encoded')
  })
})
