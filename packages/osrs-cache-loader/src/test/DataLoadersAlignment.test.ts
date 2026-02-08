import { beforeAll, describe, it } from 'vitest'
import * as cache2 from '@abextm/cache2'
import { OpenRS2Client } from '../openrs2-client'
import { OpenRS2CacheProvider } from '../cache/OpenRS2Cache'
import { Enum, Param, Struct, Underlay } from '../cache/loaders'
import { AlignmentTester } from './AlignmentUtils'
import type {
  AnimationID,
  DBRowID,
  DBTableID,
  EnumID,
  HealthBarID,
  HitsplatID,
  ParamID,
  SpriteID,
  StructID,
  UnderlayID,
  WorldEntityID,
} from '../cache/types'

describe('Data Loaders Alignment', () => {
  let provider: OpenRS2CacheProvider

  beforeAll(async () => {
    const client = new OpenRS2Client()
    const metadata = await client.getLatestCache('oldschool')
    provider = new OpenRS2CacheProvider(metadata, client)
  })

  it('should align Enum definitions', async () => {
    const archive = await provider.getArchive(2, 8)
    if (!archive) throw new Error('Enum archive not found')

    const expected = new Map<number, unknown>()
    const actual = new Map<number, unknown>()

    const version = await provider.getVersion(2)
    const files = Array.from(archive.getFiles().values()).slice(0, 100)

    for (const file of files) {
      const c2Reader = new cache2.Reader(
        file.data,
        version as unknown as cache2.CacheVersion,
      )
      const exp = cache2.Enum.decode(c2Reader, file.id as unknown as number)
      expected.set(file.id, { ...exp, map: Object.fromEntries(exp.map) })

      const ourReader = new (await import('../cache/Reader')).Reader(
        file.data,
        version,
      )
      const act = Enum.decode(ourReader, file.id as EnumID)
      actual.set(file.id, { ...act, map: Object.fromEntries(act.map) })
    }

    AlignmentTester.compare('Enums', expected, actual)
  }, 30000)

  it('should align Struct definitions', async () => {
    const archive = await provider.getArchive(2, 34)
    if (!archive) throw new Error('Struct archive not found')

    const expected = new Map<number, unknown>()
    const actual = new Map<number, unknown>()

    const version = await provider.getVersion(2)
    const files = Array.from(archive.getFiles().values()).slice(0, 100)

    for (const file of files) {
      const c2Reader = new cache2.Reader(
        file.data,
        version as unknown as cache2.CacheVersion,
      )
      const exp = cache2.Struct.decode(c2Reader, file.id as unknown as number)
      expected.set(file.id, { ...exp, params: Object.fromEntries(exp.params) })

      const ourReader = new (await import('../cache/Reader')).Reader(
        file.data,
        version,
      )
      const act = Struct.decode(ourReader, file.id as StructID)
      actual.set(file.id, { ...act, params: Object.fromEntries(act.params) })
    }

    AlignmentTester.compare('Structs', expected, actual)
  }, 30000)

  it('should align Param definitions', async () => {
    const archive = await provider.getArchive(2, 11)
    if (!archive) throw new Error('Param archive not found')

    const expected = new Map<number, unknown>()
    const actual = new Map<number, unknown>()

    const version = await provider.getVersion(2)
    const files = Array.from(archive.getFiles().values()).slice(0, 100)

    for (const file of files) {
      const c2Reader = new cache2.Reader(
        file.data,
        version as unknown as cache2.CacheVersion,
      )
      const exp = cache2.Param.decode(c2Reader, file.id as unknown as number)
      expected.set(file.id, exp)

      const ourReader = new (await import('../cache/Reader')).Reader(
        file.data,
        version,
      )
      const act = Param.decode(ourReader, file.id as ParamID)
      actual.set(file.id, act)
    }

    AlignmentTester.compare('Params', expected, actual)
  }, 30000)

  it('should align Underlay definitions', async () => {
    const archive = await provider.getArchive(2, 1)
    if (!archive) throw new Error('Underlay archive not found')

    const expected = new Map<number, unknown>()
    const actual = new Map<number, unknown>()

    const version = await provider.getVersion(2)
    const files = Array.from(archive.getFiles().values()).slice(0, 100)

    for (const file of files) {
      const c2Reader = new cache2.Reader(
        file.data,
        version as unknown as cache2.CacheVersion,
      )
      const exp = cache2.Underlay.decode(c2Reader, file.id as unknown as number)
      expected.set(file.id, exp)

      const ourReader = new (await import('../cache/Reader')).Reader(
        file.data,
        version,
      )
      const act = Underlay.decode(ourReader, file.id as UnderlayID)
      actual.set(file.id, act)
    }

    AlignmentTester.compare('Underlays', expected, actual)
  }, 30000)

  it('should align Sprite definitions', async () => {
    const archives = await provider.getArchives(8)
    if (!archives) throw new Error('Sprite index not found')

    const expected = new Map<number, unknown>()
    const actual = new Map<number, unknown>()

    const version = await provider.getVersion(8)
    const ids = archives.slice(0, 100)

    for (const id of ids) {
      const ar = await provider.getArchive(8, id)
      if (!ar) continue
      const file = ar.getFile(0)
      if (!file) continue

      const ourReader = new (await import('../cache/Reader')).Reader(
        file.data,
        version,
      )
      const act = (await import('../cache/loaders/Sprite')).Sprites.decode(
        ourReader,
        id as SpriteID,
      )
      actual.set(id, {
        ...act,
        sprites: act.sprites.map((s) => ({
          ...s,
          sprites: undefined,
          pixels: Array.from(s.pixels),
        })),
        palette: Array.from(act.palette),
      })
    }

    AlignmentTester.compare('Sprites', expected, actual)
  }, 60000)

  it('should align Animation definitions', async () => {
    const archive = await provider.getArchive(2, 12)
    if (!archive) throw new Error('Animation archive not found')

    const expected = new Map<number, unknown>()
    const actual = new Map<number, unknown>()

    const version = await provider.getVersion(2)
    const files = Array.from(archive.getFiles().values()).slice(0, 100)

    for (const file of files) {
      const c2Reader = new cache2.Reader(
        file.data,
        version as unknown as cache2.CacheVersion,
      )
      const exp = cache2.Animation.decode(c2Reader, file.id as unknown as number)
      expected.set(file.id, { ...exp, sounds: Object.fromEntries(exp.sounds) })

      const ourReader = new (await import('../cache/Reader')).Reader(
        file.data,
        version,
      )
      const act = (await import('../cache/loaders/Animation')).Animation.decode(
        ourReader,
        file.id as AnimationID,
      )
      actual.set(file.id, { ...act, sounds: Object.fromEntries(act.sounds) })
    }

    AlignmentTester.compare('Animations', expected, actual)
  }, 30000)

  it('should align Hitsplat definitions', async () => {
    const archive = await provider.getArchive(2, 32)
    if (!archive) throw new Error('Hitsplat archive not found')

    const expected = new Map<number, unknown>()
    const actual = new Map<number, unknown>()

    const version = await provider.getVersion(2)
    const files = Array.from(archive.getFiles().values()).slice(0, 100)

    for (const file of files) {
      const c2Reader = new cache2.Reader(
        file.data,
        version as unknown as cache2.CacheVersion,
      )
      const exp = cache2.Hitsplat.decode(c2Reader, file.id as unknown as number)
      expected.set(file.id, exp)

      const ourReader = new (await import('../cache/Reader')).Reader(
        file.data,
        version,
      )
      const act = (await import('../cache/loaders/Hitsplat')).Hitsplat.decode(
        ourReader,
        file.id as HitsplatID,
      )
      actual.set(file.id, act)
    }

    AlignmentTester.compare('Hitsplats', expected, actual)
  }, 30000)

  it('should align HealthBar definitions', async () => {
    const archive = await provider.getArchive(2, 33)
    if (!archive) throw new Error('HealthBar archive not found')

    const expected = new Map<number, unknown>()
    const actual = new Map<number, unknown>()

    const version = await provider.getVersion(2)
    const files = Array.from(archive.getFiles().values()).slice(0, 100)

    for (const file of files) {
      const c2Reader = new cache2.Reader(
        file.data,
        version as unknown as cache2.CacheVersion,
      )
      const exp = cache2.HealthBar.decode(c2Reader, file.id as unknown as number)
      expected.set(file.id, exp)

      const ourReader = new (await import('../cache/Reader')).Reader(
        file.data,
        version,
      )
      const act = (await import('../cache/loaders/HealthBar')).HealthBar.decode(
        ourReader,
        file.id as HealthBarID,
      )
      actual.set(file.id, act)
    }

    AlignmentTester.compare('HealthBars', expected, actual)
  }, 30000)

  it('should align WorldEntity definitions', async () => {
    const archive = await provider.getArchive(2, 72)
    if (!archive) throw new Error('WorldEntity archive not found')

    const expected = new Map<number, unknown>()
    const actual = new Map<number, unknown>()

    const version = await provider.getVersion(2)
    const files = Array.from(archive.getFiles().values()).slice(0, 100)

    for (const file of files) {
      const c2Reader = new cache2.Reader(
        file.data,
        version as unknown as cache2.CacheVersion,
      )
      // @ts-expect-error - cache2 might not have types for everything
      const exp = cache2.WorldEntity.decode(c2Reader, file.id as unknown as number)
      expected.set(file.id, exp)

      const ourReader = new (await import('../cache/Reader')).Reader(
        file.data,
        version,
      )
      const act = (
        await import('../cache/loaders/WorldEntity')
      ).WorldEntity.decode(ourReader, file.id as WorldEntityID)
      actual.set(file.id, act)
    }

    AlignmentTester.compare('WorldEntities', expected, actual)
  }, 30000)

  it('should align DBRow definitions', async () => {
    const archive = await provider.getArchive(2, 38)
    if (!archive) throw new Error('DBRow archive not found')

    const expected = new Map<number, unknown>()
    const actual = new Map<number, unknown>()

    const version = await provider.getVersion(2)
    const files = Array.from(archive.getFiles().values()).slice(0, 100)

    for (const file of files) {
      const c2Reader = new cache2.Reader(
        file.data,
        version as unknown as cache2.CacheVersion,
      )
      // @ts-expect-error
      const exp = cache2.DBRow.decode(c2Reader, file.id as unknown as number)
      expected.set(file.id, exp)

      const ourReader = new (await import('../cache/Reader')).Reader(
        file.data,
        version,
      )
      const act = (await import('../cache/loaders/DBRow')).DBRow.decode(
        ourReader,
        file.id as DBRowID,
      )
      actual.set(file.id, act)
    }

    AlignmentTester.compare('DBRows', expected, actual)
  }, 30000)

  it('should align DBTable definitions', async () => {
    const archive = await provider.getArchive(2, 39)
    if (!archive) throw new Error('DBTable archive not found')

    const expected = new Map<number, unknown>()
    const actual = new Map<number, unknown>()

    const version = await provider.getVersion(2)
    const files = Array.from(archive.getFiles().values()).slice(0, 100)

    for (const file of files) {
      const c2Reader = new cache2.Reader(
        file.data,
        version as unknown as cache2.CacheVersion,
      )
      // @ts-expect-error
      const exp = cache2.DBTable.decode(c2Reader, file.id as unknown as number)
      expected.set(file.id, exp)

      const ourReader = new (await import('../cache/Reader')).Reader(
        file.data,
        version,
      )
      const act = (await import('../cache/loaders/DBRow')).DBTable.decode(
        ourReader,
        file.id as DBTableID,
      )
      actual.set(file.id, act)
    }

    AlignmentTester.compare('DBTables', expected, actual)
  }, 30000)
})
