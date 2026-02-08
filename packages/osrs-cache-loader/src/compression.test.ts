import { describe, expect, it } from 'vitest'
import { decompress } from './compression'
import { CompressionType } from './types'

describe('Compression', () => {
  it('should handle NONE compression', () => {
    const payload = new Uint8Array([1, 2, 3, 4])
    const data = new Uint8Array(5 + payload.length)
    data[0] = CompressionType.NONE
    // Size = 4 (Big Endian)
    data[1] = 0
    data[2] = 0
    data[3] = 0
    data[4] = 4
    data.set(payload, 5)

    const result = decompress(data)
    expect(result).toEqual(payload)
  })

  it('should throw error for unknown compression type', () => {
    // Need at least 9 bytes for reader.u32() to not throw "outside bounds"
    const data = new Uint8Array(9)
    data[0] = 99
    expect(() => decompress(data)).toThrow('Unknown compression type: 99')
  })
})
