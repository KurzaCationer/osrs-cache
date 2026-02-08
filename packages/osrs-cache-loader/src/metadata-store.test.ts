import { beforeEach, describe, expect, it, vi } from "vitest";
import { MetadataStore } from "./metadata-store";
import fs from "fs/promises";
import path from "path";
import { getMetadataPath } from "./paths";

describe("MetadataStore", () => {
  let store: MetadataStore;

  beforeEach(() => {
    store = new MetadataStore();
    vi.mock("fs/promises");
  });

  it("should return empty metadata if file does not exist", async () => {
    (fs.readFile as any).mockRejectedValue(new Error("File not found"));
    const metadata = await store.load();
    expect(metadata.games).toEqual({});
  });

  it("should load metadata from disk", async () => {
    const mockData = {
      games: {
        oldschool: {
          latestCacheId: 123,
          lastCheckedAt: 1000,
          cache: { id: 123, game: "oldschool" }
        }
      }
    };
    (fs.readFile as any).mockResolvedValue(JSON.stringify(mockData));
    
    const metadata = await store.load();
    expect(metadata).toEqual(mockData);
  });

  it("should save metadata to disk", async () => {
    const mockData = {
      games: {
        oldschool: {
          latestCacheId: 123,
          lastCheckedAt: 1000,
          cache: { id: 123, game: "oldschool" } as any
        }
      }
    };
    
    await store.save(mockData);
    
    expect(fs.mkdir).toHaveBeenCalled();
    expect(fs.writeFile).toHaveBeenCalledWith(
      getMetadataPath(),
      JSON.stringify(mockData, null, 2)
    );
  });
});
