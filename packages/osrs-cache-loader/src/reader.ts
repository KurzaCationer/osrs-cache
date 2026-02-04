export class Reader {
  private view: DataView;
  public offset = 0;

  constructor(buffer: ArrayBuffer | Uint8Array) {
    if (buffer instanceof Uint8Array) {
      this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    } else {
      this.view = new DataView(buffer);
    }
  }

  get length(): number {
    return this.view.byteLength;
  }

  u8(): number {
    return this.view.getUint8(this.offset++);
  }

  u16(): number {
    const val = this.view.getUint16(this.offset);
    this.offset += 2;
    return val;
  }

  u24(): number {
    const val = (this.u8() << 16) | this.u16();
    return val;
  }

  u32(): number {
    const val = this.view.getUint32(this.offset);
    this.offset += 4;
    return val;
  }

  i32(): number {
    const val = this.view.getInt32(this.offset);
    this.offset += 4;
    return val;
  }

  smart32(): number {
    const first = this.view.getUint8(this.offset);
    if ((first & 0x80) === 0) {
      return this.u16();
    }
    return this.u32() & 0x7fffffff;
  }

  bytes(length: number): Uint8Array {
    const start = this.view.byteOffset + this.offset;
    const val = new Uint8Array(this.view.buffer, start, length);
    this.offset += length;
    return val;
  }

  remaining(): number {
    return this.length - this.offset;
  }
}