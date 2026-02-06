import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { getAssetsByType } from "./index";
import fs from "fs/promises";
import path from "path";
import os from "os";

let tempDir: string;

vi.mock('./paths', () => ({
  getCacheDir: vi.fn(() => tempDir),
  cacheExistsOnDisk: vi.fn(async () => false)
}));

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'osrs-cache-getassets-test-'));
  global.fetch = vi.fn();
});

afterEach(async () => {
  await fs.rm(tempDir, { recursive: true, force: true });
});

describe("getAssets integration", () => {
  const mockCaches = [{ id: 1, scope: "runescape", game: "oldschool", timestamp: "2023-01-01T00:00:00Z" }];

  const fallbackTable = new Uint8Array([5, 0, 0, 0]);
  const fallbackContainer = new Uint8Array(5 + fallbackTable.length);
  fallbackContainer[4] = fallbackTable.length;
  fallbackContainer.set(fallbackTable, 5);

  const mockFallbackResponse = {
    ok: true,
    arrayBuffer: async () => await Promise.resolve(fallbackContainer.buffer),
  };

  it("should return decoded Enums", async () => {
    // Index 2, Archive 8 (Enum), File 0
    const mockTable = new Uint8Array([5, 0, 0, 1, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]);
    const mockRefContainer = new Uint8Array(5 + mockTable.length);
    mockRefContainer[4] = mockTable.length;
    mockRefContainer.set(mockTable, 5);

    // Enum Data: Opcode 1 (KeyType) = 's' (115)
    const enumData = new Uint8Array([1, 115, 0]);
    const mockEnumContainer = new Uint8Array(5 + enumData.length);
    mockEnumContainer[4] = enumData.length;
    mockEnumContainer.set(enumData, 5);

    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes("caches.json")) return Promise.resolve({ ok: true, json: async () => mockCaches });
      if (url.includes("/archives/255/groups/2")) return Promise.resolve({ ok: true, arrayBuffer: async () => mockRefContainer.buffer });
      if (url.includes("/archives/2/groups/8")) return Promise.resolve({ ok: true, arrayBuffer: async () => mockEnumContainer.buffer });
      return Promise.resolve(mockFallbackResponse);
    });

    const assets = await getAssetsByType('enum', { game: "oldschool" });
    expect(assets.length).toBeGreaterThan(0);
    // 115 is 's'
    expect(assets[0]).toHaveProperty('keyTypeChar', 115);
    expect(assets[0]).not.toHaveProperty('status', 'Encoded');
  });

  it("should return decoded Structs", async () => {
    // Index 2, Archive 34 (Struct)
    const mockTable = new Uint8Array([5, 0, 0, 1, 0, 34, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]);
    const mockRefContainer = new Uint8Array(5 + mockTable.length);
    mockRefContainer[4] = mockTable.length;
    mockRefContainer.set(mockTable, 5);

    // Struct Data: Empty (just 0, 0 for filter pass)
    const structData = new Uint8Array([0, 0]);
    const mockStructContainer = new Uint8Array(5 + structData.length);
    mockStructContainer[4] = structData.length;
    mockStructContainer.set(structData, 5);

    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes("caches.json")) return Promise.resolve({ ok: true, json: async () => mockCaches });
      if (url.includes("/archives/255/groups/2")) return Promise.resolve({ ok: true, arrayBuffer: async () => mockRefContainer.buffer });
      if (url.includes("/archives/2/groups/34")) return Promise.resolve({ ok: true, arrayBuffer: async () => mockStructContainer.buffer });
      return Promise.resolve(mockFallbackResponse);
    });

    const assets = await getAssetsByType('struct', { game: "oldschool" });
    expect(assets.length).toBeGreaterThan(0);
    expect(assets[0]).toHaveProperty('params');
    expect(assets[0]).not.toHaveProperty('status', 'Encoded');
  });

  it("should return decoded Params", async () => {
    // Index 2, Archive 11 (Param)
    const mockTable = new Uint8Array([5, 0, 0, 1, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]);
    const mockRefContainer = new Uint8Array(5 + mockTable.length);
    mockRefContainer[4] = mockTable.length;
    mockRefContainer.set(mockTable, 5);

    // Param Data: Opcode 1 (Type) = 'i' (105)
    const paramData = new Uint8Array([1, 105, 0]);
    const mockParamContainer = new Uint8Array(5 + paramData.length);
    mockParamContainer[4] = paramData.length;
    mockParamContainer.set(paramData, 5);

    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes("caches.json")) return Promise.resolve({ ok: true, json: async () => mockCaches });
      if (url.includes("/archives/255/groups/2")) return Promise.resolve({ ok: true, arrayBuffer: async () => mockRefContainer.buffer });
      if (url.includes("/archives/2/groups/11")) return Promise.resolve({ ok: true, arrayBuffer: async () => mockParamContainer.buffer });
      return Promise.resolve(mockFallbackResponse);
    });

    const assets = await getAssetsByType('param', { game: "oldschool" });
    expect(assets.length).toBeGreaterThan(0);
    // 105 is 'i'
    expect(assets[0]).toHaveProperty('type', 105);
    expect(assets[0]).not.toHaveProperty('status', 'Encoded');
  });

  it("should return decoded Underlays", async () => {
    // Index 2, Archive 1 (Underlay)
    const mockTable = new Uint8Array([5, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]);
    const mockRefContainer = new Uint8Array(5 + mockTable.length);
    mockRefContainer[4] = mockTable.length;
    mockRefContainer.set(mockTable, 5);

    // Underlay Data: Opcode 1 (Color) = 1234
    const underlayData = new Uint8Array([1, 0, 0, 255, 0]); // Color 255
    const mockUnderlayContainer = new Uint8Array(5 + underlayData.length);
    mockUnderlayContainer[4] = underlayData.length;
    mockUnderlayContainer.set(underlayData, 5);

    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes("caches.json")) return Promise.resolve({ ok: true, json: async () => mockCaches });
      if (url.includes("/archives/255/groups/2")) return Promise.resolve({ ok: true, arrayBuffer: async () => mockRefContainer.buffer });
      if (url.includes("/archives/2/groups/1")) return Promise.resolve({ ok: true, arrayBuffer: async () => mockUnderlayContainer.buffer });
      return Promise.resolve(mockFallbackResponse);
    });

    const assets = await getAssetsByType('underlay', { game: "oldschool" });
    expect(assets.length).toBeGreaterThan(0);
    expect(assets[0]).toHaveProperty('rgb');
    expect(assets[0]).not.toHaveProperty('status', 'Encoded');
  });

  it("should return decoded Animations", async () => {
    // Index 2, Archive 12 (Animation)
    const mockTable = new Uint8Array([5, 0, 0, 1, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]);
    const mockRefContainer = new Uint8Array(5 + mockTable.length);
    mockRefContainer[4] = mockTable.length;
    mockRefContainer.set(mockTable, 5);

    // Animation Data: [0, 0] (Empty/Default)
    const animData = new Uint8Array([0, 0]); 
    const mockAnimContainer = new Uint8Array(5 + animData.length);
    mockAnimContainer[4] = animData.length;
    mockAnimContainer.set(animData, 5);

    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes("caches.json")) return Promise.resolve({ ok: true, json: async () => mockCaches });
      if (url.includes("/archives/255/groups/2")) return Promise.resolve({ ok: true, arrayBuffer: async () => mockRefContainer.buffer });
      if (url.includes("/archives/2/groups/12")) return Promise.resolve({ ok: true, arrayBuffer: async () => mockAnimContainer.buffer });
      return Promise.resolve(mockFallbackResponse);
    });

    const assets = await getAssetsByType('animation', { game: "oldschool" });
    expect(assets.length).toBeGreaterThan(0);
    // Priority default is 5
    expect(assets[0]).toHaveProperty('priority', 5);
    expect(assets[0]).not.toHaveProperty('status', 'Encoded');
  });

  it("should return decoded Items (Regression)", async () => {
    // Index 2, Archive 10 (Item)
    const mockTable = new Uint8Array([5, 0, 0, 1, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]);
    const mockRefContainer = new Uint8Array(5 + mockTable.length);
    mockRefContainer[4] = mockTable.length;
    mockRefContainer.set(mockTable, 5);

    // Item Data: Opcode 2 (Name) = "Test Item"
    // 2, "Test Item" (string null terminated)
    const nameBytes = new TextEncoder().encode("Test Item");
    const itemData = new Uint8Array(2 + nameBytes.length);
    itemData[0] = 2; // Opcode 2
    itemData.set(nameBytes, 1);
    itemData[itemData.length - 1] = 0; // Null terminator

    const mockItemContainer = new Uint8Array(5 + itemData.length);
    mockItemContainer[4] = itemData.length;
    mockItemContainer.set(itemData, 5);

    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes("caches.json")) return Promise.resolve({ ok: true, json: async () => mockCaches });
      if (url.includes("/archives/255/groups/2")) return Promise.resolve({ ok: true, arrayBuffer: async () => mockRefContainer.buffer });
      if (url.includes("/archives/2/groups/10")) return Promise.resolve({ ok: true, arrayBuffer: async () => mockItemContainer.buffer });
      return Promise.resolve(mockFallbackResponse);
    });

    const assets = await getAssetsByType('item', { game: "oldschool" });
    expect(assets.length).toBeGreaterThan(0);
    expect(assets[0]).toHaveProperty('name', 'Test Item');
  });
});
