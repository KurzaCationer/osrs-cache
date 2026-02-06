import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { DiskCacheProvider } from './DiskCache';

let tempDir: string;

vi.mock('../paths', () => ({
    getCacheDir: vi.fn(() => tempDir),
    cacheExistsOnDisk: vi.fn()
}));

describe('Persistence Integration', () => {
    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'osrs-cache-test-'));
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
        vi.restoreAllMocks();
    });

    it('should retrieve saved data from disk', async () => {
        const cacheId = 1;
        const disk = new DiskCacheProvider(cacheId);
        
        // 1. Save some data
        const testData = new Uint8Array([1, 2, 3, 4, 5]);
        // We need to save something that looks like a valid index for getIndex to work, 
        // or just test getArchive directly.
        await disk.saveGroup(1, 10, testData);

        // 2. Verify it exists as a file
        const filePath = path.join(tempDir, 'index_1_10.dat');
        const fileExists = await fs.stat(filePath).then(() => true).catch(() => false);
        expect(fileExists).toBe(true);

        // 3. Mock getIndex to return a fake index that includes archive 10
        // because getArchive calls getIndex first.
        vi.spyOn(disk, 'getIndex').mockResolvedValue({
            id: 1,
            archives: new Map([[10, { index: 1, archive: 10 } as any]]),
            revision: 1
        } as any);

        // 4. Retrieve data
        const am = await disk.getArchive(1, 10);
        expect(am).toBeDefined();
        expect(am?.compressedData).toEqual(testData);
    });
});
