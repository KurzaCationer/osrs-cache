import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { expect } from 'vitest'
import { OpenRS2CacheProvider } from '../cache/OpenRS2Cache'
import { OpenRS2Client } from '../openrs2-client'
import type { FileProvider } from '../cache/Cache';

// Ported from cache2 node loader
export class NodeFSFileProvider implements FileProvider {
  public constructor(private dirPath: string) {}

  public async getFile(name: string): Promise<Uint8Array | undefined> {
    try {
      return await fs.readFile(path.join(this.dirPath, name))
    } catch {
      return undefined
    }
  }

  public async exists(name: string): Promise<boolean> {
    try {
      await fs.access(path.join(this.dirPath, name))
      return true
    } catch {
      return false
    }
  }
}

export interface AlignmentResult {
  total: number
  passed: number
  failed: number
  mismatches: Array<{
    id: number
    expected: unknown
    actual: unknown
    property?: string
    propExpected?: unknown
    propActual?: unknown
  }>
}

export class AlignmentTester {
  /**
   * Compares two sets of data and returns a summary of mismatches.
   * Logs only a summary to avoid flooding.
   */
  static compare(
    name: string,
    expected: Map<number, unknown>,
    actual: Map<number, unknown>,
  ): AlignmentResult {
    const ids = new Set([...expected.keys(), ...actual.keys()])
    const result: AlignmentResult = {
      total: ids.size,
      passed: 0,
      failed: 0,
      mismatches: [],
    }

    for (const id of ids) {
      const exp = expected.get(id) as Record<string, unknown> | undefined
      const act = actual.get(id) as Record<string, unknown> | undefined

      try {
        expect(act).toEqual(exp)
        result.passed++
      } catch {
        result.failed++
        if (result.mismatches.length < 10) {
          // Identify first mismatching property
          let property: string | undefined
          let propExpected: unknown
          let propActual: unknown
          if (exp && act) {
            for (const key of Object.keys(exp)) {
              try {
                expect(act[key]).toEqual(exp[key])
              } catch {
                property = key
                propExpected = exp[key]
                propActual = act[key]
                break
              }
            }
          }
          result.mismatches.push({
            id,
            expected: exp,
            actual: act,
            property,
            propExpected,
            propActual,
          })
        }
      }
    }

    console.log(
      `Alignment [${name}]: ${result.passed}/${result.total} passed (${result.failed} failed)`,
    )
    if (result.failed > 0) {
      console.warn(
        `Top mismatches for ${name}:`,
        result.mismatches.slice(0, 3).map((m) => ({
          id: m.id,
          property: m.property,
          expected: m.propExpected,
          actual: m.propActual,
        })),
      )
    }

    return result
  }

  /**
   * Utility to load a cache for testing, with optional local fallback.
   */
  static async getTestProvider(): Promise<OpenRS2CacheProvider> {
    const client = new OpenRS2Client()
    const metadata = await client.getLatestCache('oldschool')
    return new OpenRS2CacheProvider(metadata, client)
  }
}
