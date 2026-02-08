import { describe, expect, it } from 'vitest'
import { ASSET_MAPPINGS } from './AssetMappings'

describe('ASSET_MAPPINGS', () => {
  it('contains all required fields for each mapping', () => {
    Object.entries(ASSET_MAPPINGS).forEach(([_key, mapping]) => {
      expect(mapping.title).toBeDefined()
      expect(mapping.icon).toBeDefined()
      expect(mapping.color).toBeDefined()
      expect(mapping.index).toBeDefined()
    })
  })

  it('has items mapped correctly', () => {
    expect(ASSET_MAPPINGS.item).toMatchObject({
      title: 'Items',
      index: 2,
      archive: 10,
    })
  })
})
