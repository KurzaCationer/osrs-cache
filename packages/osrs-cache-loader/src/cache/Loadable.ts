import { Reader } from './Reader'
import type { CacheProvider } from './Cache'

type LoadableType<T extends Loadable, TArgs extends Array<unknown>> = {
  decode: (reader: Reader, ...args: TArgs) => T
  loadData: (cache: CacheProvider, ...args: TArgs) => Promise<Reader | undefined>
}

type OrNumber<T extends Array<unknown>> = T

export abstract class Loadable {
  public toJSON(): Record<string, unknown> {
    const obj: Record<string, unknown> = {}
    for (const key of Object.getOwnPropertyNames(this)) {
      const val = (this as Record<string, unknown>)[key]
      if (val instanceof Map) {
        obj[key] = Object.fromEntries(val)
      } else {
        obj[key] = val
      }
    }
    return obj
  }

  public static load<T extends Loadable, TArgs extends Array<unknown>>(
    this: LoadableType<T, TArgs>,
    cache: CacheProvider | Promise<CacheProvider>,
    ...args: OrNumber<TArgs>
  ): Promise<T | undefined>
  public static load<T extends Loadable, TArgs extends Array<unknown>>(
    this: LoadableType<T, TArgs>,
    reader: Reader | ArrayBufferView | ArrayBuffer,
    ...args: OrNumber<TArgs>
  ): T
  public static load<T extends Loadable, TArgs extends Array<unknown>>(
    this: LoadableType<T, TArgs>,
    reader:
      | Reader
      | ArrayBufferView
      | ArrayBuffer
      | CacheProvider
      | Promise<CacheProvider>,
    ...args: OrNumber<TArgs>
  ): Promise<T | undefined> | T {
    if (reader instanceof ArrayBuffer || ArrayBuffer.isView(reader)) {
      reader = new Reader(reader)
    }
    if (reader instanceof Reader) {
      return this.decode(reader, ...args)
    } else {
      return (async () => {
        const data = await this.loadData(await reader, ...args)
        if (data) {
          return this.decode(data, ...args)
        }
      })()
    }
  }
}

export abstract class PerArchiveLoadable extends Loadable {
  public static async loadData(
    this: { index: number },
    cache: CacheProvider,
    id: number,
  ): Promise<Reader | undefined> {
    const archive = await cache.getArchive(this.index, id)
    const version = await cache.getVersion(this.index)
    const data = archive?.getFile(0)?.data
    return data ? new Reader(data, version) : undefined
  }

  public static async all<T extends PerArchiveLoadable, TId extends number>(
    this: {
      index: number
      decode: (reader: Reader, id: TId) => T
    },
    cache0: CacheProvider | Promise<CacheProvider>,
  ): Promise<Array<T>> {
    const cache = await cache0
    const ids = await cache.getArchives(this.index)
    if (!ids) {
      return []
    }

    const archives = await Promise.all(
      ids.map((id) => cache.getArchive(this.index, id)),
    )
    const version = await cache.getVersion(this.index)

    return archives
      .filter((v): v is NonNullable<typeof v> => !!v)
      .map((v) => {
        try {
          return this.decode(
            new Reader(v.getFile(0)!.data, version),
            v.archive as TId,
          )
        } catch (e) {
          if (e instanceof Error) {
            e.message = v.archive + ': ' + e.message
          }
          throw e
        }
      })
  }
}

export abstract class NamedPerArchiveLoadable extends PerArchiveLoadable {
  public static async loadByName<
    T extends PerArchiveLoadable,
    TId extends number,
  >(
    this: {
      index: number
      decode: (reader: Reader, id: TId) => T
    },
    cache0: CacheProvider | Promise<CacheProvider>,
    name: string | number,
  ): Promise<T | undefined> {
    const cache = await cache0
    const ar = await cache.getArchiveByName(this.index, name)
    const version = await cache.getVersion(this.index)
    const data = ar?.getFile(0)?.data
    if (data) {
      return this.decode(new Reader(data, version), ar.archive as TId)
    }
  }
}

export class PerFileLoadable extends Loadable {
  public static async loadData(
    this: { index: number; archive: number },
    cache: CacheProvider,
    id: number,
  ): Promise<Reader | undefined> {
    const archive = await cache.getArchive(this.index, this.archive)
    const version = await cache.getVersion(this.index)
    const data = archive?.getFile(id)?.data
    return data ? new Reader(data, version) : undefined
  }

  public static async all<T extends PerFileLoadable, TId extends number>(
    this: {
      index: number
      archive: number
      decode: (reader: Reader, id: TId) => T
    },
    cache0: CacheProvider | Promise<CacheProvider>,
  ): Promise<Array<T>> {
    const cache = await cache0
    const ad = await cache.getArchive(this.index, this.archive)
    if (!ad) {
      return []
    }

    const version = await cache.getVersion(this.index)

    return [...ad.getFiles().values()]
      .filter((v) => v.data.length > 1 && v.data[0] != 0)
      .map((v) => {
        try {
          return this.decode(new Reader(v.data, version), v.id as TId)
        } catch (e) {
          if (e instanceof Error) {
            e.message = v.id + ': ' + e.message
          }
          throw e
        }
      })
  }
}
