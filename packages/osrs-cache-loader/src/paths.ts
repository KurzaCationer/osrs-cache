import envPaths from 'env-paths';
import path from 'path';
import fs from 'fs/promises';

const paths = envPaths('osrs-cache');

/**
 * Returns the path to the persistent data directory for OSRS caches.
 */
export function getPersistentDataDir(): string {
  return paths.data;
}

/**
 * Returns the path to the metadata store file.
 */
export function getMetadataPath(): string {
  return path.join(getPersistentDataDir(), 'metadata.json');
}

/**
 * Returns the path to a specific cache directory.
 * @param cacheId The OpenRS2 cache ID.
 */
export function getCacheDir(cacheId: number): string {
  return path.join(getPersistentDataDir(), 'caches', cacheId.toString());
}

/**
 * Checks if a specific cache exists on disk.
 * @param cacheId The OpenRS2 cache ID.
 */
export async function cacheExistsOnDisk(cacheId: number): Promise<boolean> {
  try {
    const stats = await fs.stat(getCacheDir(cacheId));
    return stats.isDirectory();
  } catch {
    return false;
  }
}
