import { describe, expect, it } from 'vitest';
import { ReferenceTable } from './reference-table';

describe('ReferenceTable', () => {
  it('should throw error for unsupported protocol', () => {
    const data = new Uint8Array([1]); // Protocol 1
    expect(() => ReferenceTable.decode(data)).toThrow('Unsupported Reference Table protocol: 1');
  });

  it('should basic decode a simple table (v5)', () => {
    // Protocol 5, no revision, flags 0, archive count 0
    const data = new Uint8Array([5, 0, 0, 0]);
    const table = ReferenceTable.decode(data);
    expect(table.protocol).toBe(5);
    expect(table.archives.size).toBe(0);
  });
});
