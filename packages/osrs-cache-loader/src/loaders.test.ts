import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ArchiveLoader, ConfigLoader } from './loaders';
import { ArchiveReference, ReferenceTable } from './reference-table';

describe('Asset Loaders', () => {
  let mockCache: unknown; // Using unknown for simplified mocking in tests

  beforeEach(() => {
    mockCache = {
      tables: new Map(),
      getRawFile: vi.fn(),
    };
  });

  describe('ConfigLoader', () => {
    it('should return correct count for per-file configs', async () => {
      const archRef = new ArchiveReference(10);
      archRef.addFile(0);
      archRef.addFile(1);
      
      const mockTable = new ReferenceTable();
      mockTable.archives.set(10, archRef);
      mockCache.tables.set(2, mockTable);
      
      // Mock raw file data (2 files, 1 byte each + 1 byte footer)
      // extractFiles for 2 files expects: [file1][file2][numChunks]
      // simplified: [0x12][0x34][0x01][0x00,0x00,0x00,0x01][0x00,0x00,0x00,0x01][0x01]
      // Actually extractFiles is complex, I'll just mock the result if I were mocking extractFiles
      // but loaders.ts imports real extractFiles.
      
      // Let's create a valid-ish buffer for 2 files
      const data = new Uint8Array([0x12, 0x34, 1, 0,0,0,1, 0,0,0,1, 1]);
      mockCache.getRawFile.mockResolvedValue(data);
      
      const loader = new ConfigLoader(mockCache, 2, 10);
      expect(await loader.getCount()).toBe(2);
    });
  });

  describe('ArchiveLoader', () => {
    it('should return correct count for per-archive assets', async () => {
      const mockTable = new ReferenceTable();
      mockTable.archives.set(1, new ArchiveReference(1));
      mockTable.archives.set(2, new ArchiveReference(2));
      mockCache.tables.set(5, mockTable);
      
      const loader = new ArchiveLoader(mockCache, 5);
      expect(await loader.getCount()).toBe(2);
    });
  });
});