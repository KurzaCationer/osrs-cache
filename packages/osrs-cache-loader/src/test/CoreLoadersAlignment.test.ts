import { beforeAll, describe, it } from 'vitest'
import * as cache2 from '@abextm/cache2'
import { OpenRS2Client } from '../openrs2-client'
import { OpenRS2CacheProvider } from '../cache/OpenRS2Cache'
import { Item, NPC, Obj } from '../cache/loaders'
import { AlignmentTester } from './AlignmentUtils'
import type { ItemID, NPCID, ObjID } from '../cache/types'

describe('Core Loaders Alignment', () => {
  let provider: OpenRS2CacheProvider

  beforeAll(async () => {
    const client = new OpenRS2Client()
    const metadata = await client.getLatestCache('oldschool')
    provider = new OpenRS2CacheProvider(metadata, client)
  })

  it('should align Item definitions', async () => {
    const archive = await provider.getArchive(2, 10)
    if (!archive) throw new Error('Item archive not found')

    const expected = new Map<number, unknown>()
    const actual = new Map<number, unknown>()

    const version = await provider.getVersion(2)

    // Test first 100 items for speed
    const files = Array.from(archive.getFiles().values()).slice(0, 100)

    for (const file of files) {
      // cache2 decoding
      const c2Reader = new cache2.Reader(
        file.data,
        version as unknown as cache2.CacheVersion,
      )
      const exp = cache2.Item.decode(c2Reader, file.id as unknown as number)
      expected.set(file.id, { ...exp, params: Object.fromEntries(exp.params) })

      const ourReader = new (await import('../cache/Reader')).Reader(
        file.data,
        version,
      )
      const act = Item.decode(ourReader, file.id as ItemID)
      actual.set(file.id, { ...act, params: Object.fromEntries(act.params) })
    }

    AlignmentTester.compare('Items', expected, actual)
  }, 30000)

  it('should align NPC definitions', async () => {
    const archive = await provider.getArchive(2, 9)
    if (!archive) throw new Error('NPC archive not found')

    const expected = new Map<number, unknown>()
    const actual = new Map<number, unknown>()

    const version = await provider.getVersion(2)
    const files = Array.from(archive.getFiles().values()).slice(0, 100)

    for (const file of files) {
      const c2Reader = new cache2.Reader(
        file.data,
        version as unknown as cache2.CacheVersion,
      )
      const exp = cache2.NPC.decode(c2Reader, file.id as unknown as number)
      expected.set(file.id, { ...exp, params: Object.fromEntries(exp.params) })

      const ourReader = new (await import('../cache/Reader')).Reader(
        file.data,
        version,
      )
      const act = NPC.decode(ourReader, file.id as NPCID)
      actual.set(file.id, { ...act, params: Object.fromEntries(act.params) })
    }

    AlignmentTester.compare('NPCs', expected, actual)
  }, 30000)

  it('should align Object definitions', async () => {
    const archive = await provider.getArchive(2, 6)
    if (!archive) throw new Error('Object archive not found')

    const expected = new Map<number, unknown>()
    const actual = new Map<number, unknown>()

    const version = await provider.getVersion(2)
    const files = Array.from(archive.getFiles().values()).slice(0, 100)

    for (const file of files) {
      const c2Reader = new cache2.Reader(
        file.data,
        version as unknown as cache2.CacheVersion,
      )
      const exp = cache2.Obj.decode(c2Reader, file.id as unknown as number)
      expected.set(file.id, { ...exp, params: Object.fromEntries(exp.params) })

      const ourReader = new (await import('../cache/Reader')).Reader(
        file.data,
        version,
      )
      const act = Obj.decode(ourReader, file.id as ObjID)
      actual.set(file.id, { ...act, params: Object.fromEntries(act.params) })
    }

    AlignmentTester.compare('Objects', expected, actual)
  }, 30000)
})
