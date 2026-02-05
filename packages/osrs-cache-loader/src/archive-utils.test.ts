import { describe, expect, it } from 'vitest';
import { extractFiles } from './archive-utils';

describe('Archive Utilities', () => {
  it('should extract a single file', () => {
    const data = new Uint8Array([0x12, 0x34]);
    const result = extractFiles(data, 1);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(data);
  });

  it('should extract multiple files (single chunk)', () => {
    // 2 files, 1 chunk each
    // [file1][file2][numChunks]
    // footer: [delta1][delta2][numChunks]
    // where delta is Int32 and accumulated across files in a chunk
    const file1 = new Uint8Array([0x11, 0x22]); // size 2
    const file2 = new Uint8Array([0x33, 0x44, 0x55]); // size 3
    
    const data = new Uint8Array(file1.length + file2.length + 4 + 4 + 1);
    data.set(file1, 0);
    data.set(file2, file1.length);
    const dv = new DataView(data.buffer);
    
    // File 1: size 2. Delta = 2 - 0 = 2.
    dv.setInt32(file1.length + file2.length, 2);
    // File 2: size 3. Delta = 3 - 2 = 1.
    dv.setInt32(file1.length + file2.length + 4, 1);
    
    data[data.length - 1] = 1; // 1 chunk

    const result = extractFiles(data, 2);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(file1);
    expect(result[1]).toEqual(file2);
  });
});