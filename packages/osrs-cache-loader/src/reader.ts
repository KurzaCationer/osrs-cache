/**
 * A utility class for reading OSRS-specific binary data types from a buffer.
 */
export class Reader {
  private view: DataView;
  /** The current reading offset in bytes. */
  public offset = 0;

  /**
   * Creates a new Reader instance.
   * @param buffer The buffer to read from.
   */
  constructor(buffer: ArrayBuffer | Uint8Array) {
    if (buffer instanceof Uint8Array) {
      this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    } else {
      this.view = new DataView(buffer);
    }
  }

  /**
   * The total length of the buffer in bytes.
   */
  get length(): number {
    return this.view.byteLength;
  }

  /**
   * Reads an unsigned 8-bit integer.
   * @returns The read integer.
   */
  u8(): number {
    return this.view.getUint8(this.offset++);
  }

  /**
   * Reads an unsigned 16-bit integer (big-endian).
   * @returns The read integer.
   */
  u16(): number {
    const val = this.view.getUint16(this.offset);
    this.offset += 2;
    return val;
  }

  /**
   * Reads an unsigned 24-bit integer (big-endian).
   * @returns The read integer.
   */
  u24(): number {
    const val = (this.u8() << 16) | this.u16();
    return val;
  }

  /**
   * Reads an unsigned 32-bit integer (big-endian).
   * @returns The read integer.
   */
  u32(): number {
    const val = this.view.getUint32(this.offset);
    this.offset += 4;
    return val;
  }

  /**
   * Reads a 32-bit signed integer.
   * @returns The read integer.
   */
  i32(): number {
    const val = this.view.getInt32(this.offset);
    this.offset += 4;
    return val;
  }

  /**
   * Reads an OSRS "smart" (u8 or u16).
   * If the first byte is less than 128, it returns a single byte.
   * Otherwise, it returns 2 bytes (big-endian) minus 0x8000.
   * @returns The read value.
   */
  smart(): number {
    const first = this.view.getUint8(this.offset);
    if (first < 128) {
      return this.u8();
    }
    return this.u16() - 0x8000;
  }

  /**
   * Reads an OSRS "big smart" (u16 or u32).
   * If the first byte has the 0x80 bit set, it returns 4 bytes (big-endian) AND 0x7FFFFFFF.
   * Otherwise, it returns 2 bytes.
   * @returns The read value.
   */
  bigSmart(): number {
    const first = this.view.getUint8(this.offset);
    if ((first & 0x80) === 0) {
      return this.u16();
    }
    return this.u32() & 0x7fffffff;
  }

  /**
   * Alias for bigSmart.
   * @deprecated Use bigSmart() instead.
   */
  smart32(): number {
    return this.bigSmart();
  }

  /**
   * Reads a null-terminated string (CP1252).
   * @returns The read string.
   */
  string(): string {
    let str = '';
    let b: number;
    while ((b = this.u8()) !== 0) {
      str += String.fromCharCode(b);
    }
    return str;
  }

  /**
   * Reads a specified number of bytes.
   * @param length The number of bytes to read.
   * @returns A Uint8Array containing the read bytes.
   */
  bytes(length: number): Uint8Array {
    const start = this.view.byteOffset + this.offset;
    const val = new Uint8Array(this.view.buffer, start, length);
    this.offset += length;
    return val;
  }

  /**
   * Calculates the number of remaining bytes in the buffer.
   * @returns The number of bytes remaining.
   */
  remaining(): number {
    return this.length - this.offset;
  }
}