import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadCache } from "./index";

describe("loadCache", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("should load the latest cache and return asset counts", async () => {
    const mockCaches = [
      {
        id: 1,
        scope: "runescape",
        game: "oldschool",
        timestamp: "2023-01-01T00:00:00Z",
      },
    ];

    // Minimal Reference Table binary for Index 2 (Protocol 5, no flags, 1 archive: ID 10 with 1 file: ID 0)
    // [5] protocol
    // [0] flags
    // [0, 1] archive count
    // [0, 10] archive ID delta
    // [0, 0, 0, 0] CRC
    // [0, 0, 0, 0] Revision
    // [0, 1] file count for archive 0
    // [0, 0] file ID delta for archive 0
    const mockTable = new Uint8Array([
      5, 
      0, 
      0, 1, 
      0, 10, 
      0, 0, 0, 0, 
      0, 0, 0, 0, 
      0, 1, 
      0, 0
    ]);
    
    // Wrap in OSRS container (Compression: None [0], Length: 18)
    const mockContainer = new Uint8Array(5 + mockTable.length);
    mockContainer[0] = 0;
    mockContainer[1] = 0; mockContainer[2] = 0; mockContainer[3] = 0; mockContainer[4] = 18;
    mockContainer.set(mockTable, 5);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes("caches.json")) {
        return Promise.resolve({
          ok: true,
          json: async () => await Promise.resolve(mockCaches),
        });
      }
      if (url.includes("/archives/255/groups/")) {
        return Promise.resolve({
          ok: true,
          arrayBuffer: async () => await Promise.resolve(mockContainer.buffer),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    const result = await loadCache({ game: "oldschool" });
    expect(result.items).toBe(1); // Our mock has 1 file in archive 10
    expect(result.npcs).toBe(0);
    expect(result.objects).toBe(0);
    expect(result.maps).toBe(1); // Our mock has 1 archive in index 5 (because we reused mockContainer)
  });
});
