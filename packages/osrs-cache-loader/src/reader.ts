export interface CacheVersion {
  era: 'osrs' | 'rs3'
  indexRevision: number
}

/**
 * A utility class for reading OSRS-specific binary data types from a buffer.
 */
export class Reader {
  private view: DataView
  /** The current reading offset in bytes. */
  public offset = 0

  /**
   * Creates a new Reader instance.
   * @param buffer The buffer to read from.
   * @param version Optional cache version for revision-dependent decoding.
   */
  constructor(
    buffer: ArrayBuffer | Uint8Array,
    public version?: CacheVersion,
  ) {
    if (buffer instanceof Uint8Array) {
      this.view = new DataView(
        buffer.buffer,
        buffer.byteOffset,
        buffer.byteLength,
      )
    } else {
      this.view = new DataView(buffer)
    }
  }

  /**
   * Checks if the current cache version is after the specified version.
   */
  isAfter(ver: CacheVersion): boolean {
    if (!this.version) return true // Default to latest if version unknown
    if (this.version.era !== ver.era) return false
    return this.version.indexRevision >= ver.indexRevision
  }

  /**
   * The total length of the buffer in bytes.
   */
  get length(): number {
    return this.view.byteLength
  }

  /**
   * Reads an unsigned 8-bit integer.
   * @returns The read integer.
   */
  u8(): number {
    return this.view.getUint8(this.offset++)
  }

  /**
   * Reads a signed 8-bit integer.
   * @returns The read integer.
   */
  i8(): number {
    return this.view.getInt8(this.offset++)
  }

  /**
   * Reads an unsigned 16-bit integer (big-endian).
   * @returns The read integer.
   */
  u16(): number {
    const val = this.view.getUint16(this.offset)
    this.offset += 2
    return val
  }

  /**
   * Reads an unsigned 24-bit integer (big-endian).
   * @returns The read integer.
   */
  u24(): number {
    const val = (this.u8() << 16) | this.u16()
    return val
  }

  /**
   * Reads an unsigned 32-bit integer (big-endian).
   * @returns The read integer.
   */
  u32(): number {
    const val = this.view.getUint32(this.offset)
    this.offset += 4
    return val
  }

  /**
   * Reads a 32-bit signed integer.
   * @returns The read integer.
   */
  i32(): number {
    const val = this.view.getInt32(this.offset)
    this.offset += 4
    return val
  }

  /**
   * Reads a signed 16-bit integer (big-endian).
   * @returns The read integer.
   */
  i16(): number {
    const val = this.view.getInt16(this.offset)
    this.offset += 2
    return val
  }

  /**
   * Reads a signed 64-bit integer.
   * @returns The read integer as a bigint.
   */
  i64(): bigint {
    const val = this.view.getBigInt64(this.offset)
    this.offset += 8
    return val
  }

  /**
   * Reads an unsigned 16-bit integer, returning -1 if it's 0xFFFF.
   * @returns The read value.
   */
  u16n(): number {
    const val = this.u16()
    return val === 0xffff ? -1 : val
  }

  /**
   * Reads an unsigned 8-bit integer and adds 1.
   * @returns The read value plus 1.
   */
  u8p1(): number {
    return this.u8() + 1
  }

  /**
   * Reads an OSRS "smart" (u8 or u16).
   * If the first byte is less than 128, it returns a single byte.
   * Otherwise, it returns 2 bytes (big-endian) minus 0x8000.
   * @returns The read value.
   */
  smart(): number {
    const first = this.view.getUint8(this.offset)
    if (first < 128) {
      return this.u8()
    }
    return this.u16() - 0x8000
  }

  /**
   * Alias for smart().
   */
  u8o16(): number {
    return this.smart()
  }

  /**
   * Reads an OSRS "smart" (u8 or u16) and subtracts 1.
   * @returns The read value minus 1.
   */
  smartm1(): number {
    const first = this.view.getUint8(this.offset)
    if (first < 128) {
      return this.u8() - 1
    }
    return this.u16() - 0x8001
  }

  /**
   * Alias for smartm1().
   */
  u8o16m1(): number {
    return this.smartm1()
  }

  /**
   * Reads an OSRS "big smart" (u16 or u32).
   * If the first byte has the 0x80 bit set, it returns 4 bytes (big-endian) AND 0x7FFFFFFF.
   * Otherwise, it returns 2 bytes.
   * @returns The read value.
   */
  bigSmart(): number {
    const first = this.view.getUint8(this.offset)
    if ((first & 0x80) === 0) {
      return this.u16()
    }
    return this.u32() & 0x7fffffff
  }

  /**
   * Alias for bigSmart().
   */
  u32o16(): number {
    return this.bigSmart()
  }

  /**
   * Reads an OSRS "big smart" (u16 or u32), returning -1 if it's 0xFFFF or 0x7FFFFFFF.
   * @returns The read value.
   */
  bigSmartn(): number {
    const first = this.view.getUint8(this.offset)
    if ((first & 0x80) === 0) {
      return this.u16n()
    }
    const val = this.u32() & 0x7fffffff
    return val === 0x7fffffff ? -1 : val
  }

  /**
   * Alias for bigSmartn().
   */
  s2o4n(): number {
    return this.bigSmartn()
  }

  /**
   * Alias for bigSmartn().
   */
  u32o16n(): number {
    return this.bigSmartn()
  }

  /**
   * Alias for bigSmart.
   * @deprecated Use bigSmart() instead.
   */
  smart32(): number {
    return this.bigSmart()
  }

  /**
   * Reads a null-terminated string (CP1252).
   * @returns The read string.
   */
  string(): string {
    const cp1252 = '€?‚ƒ„…†‡ˆ‰Š‹Œ?Ž??‘’“”•–—˜™š›œ?žŸ'
    let str = ''
    let b: number
    while ((b = this.u8()) !== 0) {
      if (b >= 128 && b <= 159) {
        str += cp1252[b - 128]
      } else {
        str += String.fromCharCode(b)
      }
    }
    return str
  }

  /**
   * Reads a string and returns null if it's "hidden".
   * @returns The read string or null.
   */
  stringNullHidden(): string | null {
    const s = this.string()
    return s === 'hidden' ? null : s
  }

  /**
   * Reads a specified number of bytes.
   * @param length The number of bytes to read.
   * @returns A Uint8Array containing the read bytes.
   */
  bytes(length: number): Uint8Array {
    const start = this.view.byteOffset + this.offset
    const val = new Uint8Array(this.view.buffer, start, length)
    this.offset += length
    return val
  }

  /**
   * Calculates the number of remaining bytes in the buffer.
   * @returns The number of bytes remaining.
   */
  remaining(): number {
    return this.length - this.offset
  }
}
