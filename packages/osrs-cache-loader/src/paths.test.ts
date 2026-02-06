import { describe, it, expect } from 'vitest';
import { getPersistentDataDir, getCacheDir } from './paths';
import os from 'os';

describe('paths', () => {
  it('should return a persistent data directory', () => {
    const dataDir = getPersistentDataDir();
    expect(dataDir).toBeDefined();
    if (process.platform === 'linux') {
      expect(dataDir).toContain('.local/share/osrs-cache');
    }
  });

  it('should return a specific cache directory', () => {
    const cacheId = 123;
    const cacheDir = getCacheDir(cacheId);
    expect(cacheDir).toContain('osrs-cache');
    expect(cacheDir).toContain('caches/123');
  });
});
