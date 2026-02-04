import type { OpenRS2Cache } from "./types";

export class OpenRS2Client {
  private baseUrl: string;

  constructor(baseUrl: string = "https://archive.openrs2.org") {
    this.baseUrl = baseUrl;
  }

  async listCaches(): Promise<Array<OpenRS2Cache>> {
    const response = await fetch(`${this.baseUrl}/caches.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch caches from OpenRS2: ${response.statusText}`);
    }
    return response.json() as Promise<Array<OpenRS2Cache>>;
  }

  async getLatestCache(game: string = "oldschool"): Promise<OpenRS2Cache> {
    const caches = await this.listCaches();
    const gameCaches = caches
      .filter((c) => c.game === game)
      .sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeB - timeA;
      });

    if (gameCaches.length === 0) {
      throw new Error(`No caches found for game: ${game}`);
    }

    return gameCaches[0];
  }

  async getArchiveMetadata(scope: string, id: number, index: number): Promise<ArrayBuffer> {
    const response = await fetch(
      `${this.baseUrl}/caches/${scope}/${id}/archives/255/groups/${index}.dat`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch archive metadata from OpenRS2: ${response.statusText}`);
    }
    return response.arrayBuffer();
  }

  async getArchive(scope: string, id: number, index: number, archive: number): Promise<ArrayBuffer> {
    const response = await fetch(
      `${this.baseUrl}/caches/${scope}/${id}/archives/${index}/groups/${archive}.dat`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch archive from OpenRS2: ${response.statusText}`);
    }
    return response.arrayBuffer();
  }
}