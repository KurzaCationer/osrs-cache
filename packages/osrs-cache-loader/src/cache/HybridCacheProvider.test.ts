import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HybridCacheProvider } from './HybridCacheProvider';
import { DiskCacheProvider } from './DiskCache';
import { OpenRS2CacheProvider } from './OpenRS2Cache';

vi.mock('./DiskCache', () => {
    return {
        DiskCacheProvider: vi.fn().mockImplementation(() => ({
            getIndex: vi.fn(),
            getArchive: vi.fn(),
            saveGroup: vi.fn(),
            getKeys: vi.fn().mockResolvedValue({ size: 0 }),
            saveKeys: vi.fn()
        }))
    };
});

vi.mock('./OpenRS2Cache', () => {
    return {
        OpenRS2CacheProvider: vi.fn().mockImplementation(() => ({
            getIndex: vi.fn(),
            getArchive: vi.fn(),
            getKeys: vi.fn().mockResolvedValue({ size: 0 })
        }))
    };
});

describe('HybridCacheProvider', () => {
    const mockMetadata: any = { id: 123, scope: 'runescape' };
    const mockClient: any = {
        getGroup: vi.fn().mockResolvedValue(new ArrayBuffer(10)),
        getXTEAKeys: vi.fn().mockResolvedValue([])
    };

    let provider: HybridCacheProvider;
    let disk: any;
    let web: any;

    beforeEach(() => {
        vi.clearAllMocks();
        provider = new HybridCacheProvider(mockMetadata, mockClient);
        disk = (provider as any).disk;
        web = (provider as any).web;
    });

    it('should save to disk after fetching from web', async () => {
        disk.getIndex.mockResolvedValue(undefined);
        web.getIndex.mockResolvedValue({ id: 1, revision: 123 });

        await provider.getIndex(1);

        expect(web.getIndex).toHaveBeenCalledWith(1);
        expect(mockClient.getGroup).toHaveBeenCalledWith('runescape', 123, 255, 1);
        expect(disk.saveGroup).toHaveBeenCalled();
    });

    it('should not fetch from web if disk has it', async () => {
        disk.getIndex.mockResolvedValue({ id: 1, revision: 123 });

        await provider.getIndex(1);

        expect(disk.getIndex).toHaveBeenCalledWith(1);
        expect(web.getIndex).not.toHaveBeenCalled();
    });
});
