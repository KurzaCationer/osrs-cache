import fs from 'fs/promises';
import { getMetadataPath } from './paths';
import type { OpenRS2Cache } from './types';

export interface GameMetadata {
  latestCacheId: number;
  lastCheckedAt: number;
  cache: OpenRS2Cache;
}

export interface Metadata {
  games: Record<string, GameMetadata>;
}

export class MetadataStore {
  private cache: Metadata | null = null;

  async load(): Promise<Metadata> {
    if (this.cache) return this.cache;

    try {
      const data = await fs.readFile(getMetadataPath(), 'utf-8');
      this.cache = JSON.parse(data);
    } catch {
      this.cache = { games: {} };
    }

    return this.cache!;
  }

  async save(metadata: Metadata): Promise<void> {
    this.cache = metadata;
    const dir = (await import('path')).dirname(getMetadataPath());
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(getMetadataPath(), JSON.stringify(metadata, null, 2));
  }

  async getGameMetadata(game: string): Promise<GameMetadata | null> {
    const metadata = await this.load();
    return metadata.games[game] || null;
  }

  async setGameMetadata(game: string, data: GameMetadata): Promise<void> {
    const metadata = await this.load();
    metadata.games[game] = data;
    await this.save(metadata);
  }
}
