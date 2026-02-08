import { describe, expect, it } from 'vitest'
import { getCacheDir, getMetadataPath, getPersistentDataDir } from './paths'

describe('paths', () => {
  it('should return a persistent data directory', () => {
    const dataDir = getPersistentDataDir()
    expect(dataDir).toBeDefined()
    if (process.platform === 'linux') {
      expect(dataDir).toContain('.local/share/osrs-cache')
    }
  })

  it('should return a specific cache directory', () => {
    const cacheId = 123
    const cacheDir = getCacheDir(cacheId)
    expect(cacheDir).toContain('osrs-cache')
    expect(cacheDir).toContain('caches/123')
  })

  it('should return the metadata store path', () => {
    const metadataPath = getMetadataPath()
    expect(metadataPath).toContain('osrs-cache')
    expect(metadataPath).toContain('metadata.json')
  })
})
