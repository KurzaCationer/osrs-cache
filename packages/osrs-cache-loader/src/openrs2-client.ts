import type { OpenRS2Cache, XTEAKey } from "./types";

/**
 * Custom error class for OpenRS2 API errors.
 */
export class OpenRS2Error extends Error {
  constructor(public statusCode: number, message: string) {
    super(`OpenRS2 Error (${statusCode}): ${message}`);
    this.name = "OpenRS2Error";
  }
}

/**
 * Client for interacting with the OpenRS2 Archive API.
 */
export class OpenRS2Client {
  private baseUrl: string;

  constructor(baseUrl: string = "https://archive.openrs2.org") {
    this.baseUrl = baseUrl;
  }

  private async fetch(endpoint: string): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new OpenRS2Error(response.status, response.statusText);
    }
    return response;
  }

  /**
   * Lists all available caches.
   */
  async listCaches(): Promise<Array<OpenRS2Cache>> {
    const response = await this.fetch("/caches.json");
    return response.json() as Promise<Array<OpenRS2Cache>>;
  }

  /**
   * Gets the latest cache for a specific game (e.g., 'oldschool').
   * @param game The game identifier.
   */
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
      throw new OpenRS2Error(404, `No caches found for game: ${game}`);
    }

    return gameCaches[0];
  }

  /**
   * Fetches the XTEA keys for a specific cache.
   * @param scope The cache scope (e.g., 'runescape').
   * @param id The cache ID.
   */
  async getXTEAKeys(scope: string, id: number): Promise<Array<XTEAKey>> {
    const response = await this.fetch(`/caches/${scope}/${id}/keys.json`);
    return response.json() as Promise<Array<XTEAKey>>;
  }

  /**
   * Fetches a single group file from an archive.
   * @param scope The cache scope.
   * @param id The cache ID.
   * @param archive The archive ID.
   * @param group The group ID.
   */
  async getGroup(scope: string, id: number, archive: number, group: number): Promise<ArrayBuffer> {
    const response = await this.fetch(`/caches/${scope}/${id}/archives/${archive}/groups/${group}.dat`);
    return response.arrayBuffer();
  }

  /**
   * @deprecated Use getGroup instead.
   */
  async getArchive(scope: string, id: number, index: number, archive: number): Promise<ArrayBuffer> {
    return this.getGroup(scope, id, index, archive);
  }

  /**
   * @deprecated Use getGroup(scope, id, 255, index) instead.
   */
  async getArchiveMetadata(scope: string, id: number, index: number): Promise<ArrayBuffer> {
    return this.getGroup(scope, id, 255, index);
  }
}
