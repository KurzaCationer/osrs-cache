import { describe, expect, it } from 'vitest';
import { Reader } from './reader';

describe('Reader', () => {
  it('should read u8', () => {
    const reader = new Reader(new Uint8Array([0x12, 0x34]));
    expect(reader.u8()).toBe(0x12);
    expect(reader.u8()).toBe(0x34);
    expect(reader.offset).toBe(2);
  });

  it('should read i8', () => {
    const reader = new Reader(new Uint8Array([0xff, 0x01]));
    expect(reader.i8()).toBe(-1);
    expect(reader.i8()).toBe(1);
    expect(reader.offset).toBe(2);
  });

  it('should read u16', () => {
    const reader = new Reader(new Uint8Array([0x12, 0x34]));
    expect(reader.u16()).toBe(0x1234);
    expect(reader.offset).toBe(2);
  });

  it('should read u24', () => {
    const reader = new Reader(new Uint8Array([0x12, 0x34, 0x56]));
    expect(reader.u24()).toBe(0x123456);
    expect(reader.offset).toBe(3);
  });

  it('should read u32', () => {
    const reader = new Reader(new Uint8Array([0x12, 0x34, 0x56, 0x78]));
    expect(reader.u32()).toBe(0x12345678);
    expect(reader.offset).toBe(4);
  });

  it('should read i32', () => {
    const reader = new Reader(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
    expect(reader.i32()).toBe(-1);
    expect(reader.offset).toBe(4);
  });

  it('should read bigSmart', () => {
    // Under 32768
    const reader1 = new Reader(new Uint8Array([0x12, 0x34]));
    expect(reader1.bigSmart()).toBe(0x1234);

    // Over 32768
    const reader2 = new Reader(new Uint8Array([0x80, 0x01, 0x23, 0x45]));
    expect(reader2.bigSmart()).toBe(0x012345);
  });

  it('should read bytes', () => {
    const data = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
    const reader = new Reader(data);
    expect(reader.bytes(2)).toEqual(new Uint8Array([0x01, 0x02]));
    expect(reader.bytes(2)).toEqual(new Uint8Array([0x03, 0x04]));
  });

  it('should report remaining bytes', () => {
    const reader = new Reader(new Uint8Array([0x01, 0x02, 0x03]));
    expect(reader.remaining()).toBe(3);
    reader.u8();
    expect(reader.remaining()).toBe(2);
  });

  it('should read smart (u8o16)', () => {
    // Under 128
    const reader1 = new Reader(new Uint8Array([0x12]));
    expect(reader1.smart()).toBe(0x12);

    // Over 128
    const reader2 = new Reader(new Uint8Array([0x81, 0x23]));
    expect(reader2.smart()).toBe(0x0123);
  });

  it('should read null-terminated string', () => {
    const reader = new Reader(new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x00, 0x57, 0x6f, 0x72, 0x6c, 0x64]));
    expect(reader.string()).toBe('Hello');
    expect(reader.offset).toBe(6);
  });
});
