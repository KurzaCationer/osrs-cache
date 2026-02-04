import { beforeEach, describe, expect, it, vi } from "vitest";
import { OpenRS2Client } from "./openrs2-client";

describe("OpenRS2Client", () => {
  let client: OpenRS2Client;

  beforeEach(() => {
    client = new OpenRS2Client();
    global.fetch = vi.fn();
  });

  it("should fetch a list of caches", async () => {
    const mockCaches = [{ id: 1, scope: "runescape", game: "osrs" }];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => await Promise.resolve(mockCaches),
    });

    const caches = await client.listCaches();
    expect(caches).toEqual(mockCaches);
    expect(global.fetch).toHaveBeenCalledWith("https://archive.openrs2.org/api/caches.json");
  });

  it("should get the latest cache for osrs", async () => {
    const mockCaches = [
      { id: 1, game: "osrs", timestamp: "2023-01-01T00:00:00Z" },
      { id: 2, game: "osrs", timestamp: "2023-01-02T00:00:00Z" },
      { id: 3, game: "rs2", timestamp: "2023-01-03T00:00:00Z" },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => await Promise.resolve(mockCaches),
    });

    const latest = await client.getLatestCache("osrs");
    expect(latest.id).toBe(2);
  });

  it("should throw if no caches found for game", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => await Promise.resolve([]),
    });

    await expect(client.getLatestCache("osrs")).rejects.toThrow("No caches found for game: osrs");
  });
});