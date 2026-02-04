import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMetadata, loadCache } from "./index";

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
      if (url.includes("/archives/2/groups/")) {
        // Mock a simple archive with 1 file (ID 10)
        // For fileCount=1, extractFiles just returns [data]
        // But getFileCount(2, 10) expects 1 file from Reference Table
        const fileData = new Uint8Array([1, 2, 3]);
        const container = new Uint8Array(5 + fileData.length);
        container[0] = 0; // No compression
        container[4] = fileData.length;
        container.set(fileData, 5);

        return Promise.resolve({
          ok: true,
          arrayBuffer: async () => await Promise.resolve(container.buffer),
        });
      }
      if (url.includes("/archives/")) {
        // Fallback for other indices like 5, 7, 8
        // Return a valid OSRS container (Compression: 0, Length: 0)
        const container = new Uint8Array([0, 0, 0, 0, 0]);
        return Promise.resolve({
          ok: true,
          arrayBuffer: async () => await Promise.resolve(container.buffer),
        });
      }
      return Promise.reject(new Error("Unknown URL: " + url));
    });

    const result = await loadCache({ game: "oldschool" });
    expect(result.item).toBe(1);
    expect(result.npc).toBe(0);
    expect(result.obj).toBe(0);
    expect(result.map).toBe(1);
  });
});

describe("getMetadata", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("should return detailed metadata including counts", async () => {
    const mockCaches = [
      {
        id: 1,
        scope: "runescape",
        game: "oldschool",
        timestamp: "2023-01-01T00:00:00Z",
        builds: [{ major: 227 }],
        sources: ["OpenRS2 Archive"],
      },
    ];

    const mockTable = new Uint8Array([5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Empty table
    const mockContainer = new Uint8Array(5 + mockTable.length);
    mockContainer[4] = mockTable.length;
    mockContainer.set(mockTable, 5);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes("caches.json")) {
        return Promise.resolve({
          ok: true,
          json: async () => await Promise.resolve(mockCaches),
        });
      }
      return Promise.resolve({
        ok: true,
        arrayBuffer: async () => await Promise.resolve(mockContainer.buffer),
      });
    });

    const metadata = await getMetadata({ game: "oldschool" });
    expect(metadata.id).toBe(1);
    expect(metadata.builds[0].major).toBe(227);
    expect(metadata.timestamp).toBe("2023-01-01T00:00:00Z");
    expect(metadata.source).toBe("OpenRS2 Archive");
    expect(metadata.counts.item).toBe(0);
  });
});