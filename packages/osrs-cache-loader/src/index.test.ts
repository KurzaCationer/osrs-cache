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
        game: "osrs",
        timestamp: "2023-01-01T00:00:00Z",
        item_count: 100,
        npc_count: 50,
        object_count: 200,
      },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => await Promise.resolve(mockCaches),
    });

    const result = await loadCache({ game: "osrs" });
    expect(result.items).toBe(100);
    expect(result.npcs).toBe(50);
    expect(result.objects).toBe(200);
    expect(result.maps).toBeGreaterThan(0);
    expect(result.audio).toBeGreaterThan(0);
  });
});
