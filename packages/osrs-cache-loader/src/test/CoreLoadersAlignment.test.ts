import { describe, it, beforeAll } from "vitest";
import { OpenRS2Client } from "../openrs2-client";
import { OpenRS2CacheProvider } from "../cache/OpenRS2Cache";
import { AlignmentTester } from "./AlignmentUtils";
import { Item, NPC, Obj } from "../cache/loaders";
import * as cache2 from "@abextm/cache2";

describe("Core Loaders Alignment", () => {
  let provider: OpenRS2CacheProvider;
  let cache2Provider: cache2.CacheProvider;

  beforeAll(async () => {
    const client = new OpenRS2Client();
    const metadata = await client.getLatestCache("oldschool");
    provider = new OpenRS2CacheProvider(metadata, client);

    // Using the same metadata for cache2
    // cache2 doesn't have an OpenRS2 provider, so we'd normally use DiskCache
    // But since we want to align, let's use a mock provider for cache2 that 
    // uses our client to fetch data, OR we just use our loaders and compare 
    // with cache2's logic if we can.
    
    // Actually, cache2-ts has a way to load from a FileProvider.
    // Let's implement a simple bridge.
    const fileProvider: cache2.FileProvider = {
        async getFile(name: string): Promise<Uint8Array | undefined> {
            // This is for main_file_cache.dat2 etc.
            // OpenRS2 doesn't easily give these.
            return undefined;
        }
    };

    // Since cache2 doesn't have OpenRS2 provider, and we want to align with ITS logic,
    // we can manually decode using cache2's classes.
  });

  it("should align Item definitions", async () => {
    const archive = await provider.getArchive(2, 10);
    if (!archive) throw new Error("Item archive not found");

    const expected = new Map<number, any>();
    const actual = new Map<number, any>();

    const version = await provider.getVersion(2);
    
    // Test first 100 items for speed
    const files = Array.from(archive.getFiles().values()).slice(0, 100);

    for (const file of files) {
        // cache2 decoding
        const c2Reader = new cache2.Reader(file.data, version as any);
        const exp = cache2.Item.decode(c2Reader, file.id as any);
        expected.set(file.id, { ...exp, params: Object.fromEntries(exp.params) });
        
        const ourReader = new (await import("../cache/Reader")).Reader(file.data, version);
        const act = Item.decode(ourReader, file.id as any);
        actual.set(file.id, { ...act, params: Object.fromEntries(act.params) });
    }

    AlignmentTester.compare("Items", expected, actual);
  }, 30000);

  it("should align NPC definitions", async () => {
    const archive = await provider.getArchive(2, 9);
    if (!archive) throw new Error("NPC archive not found");

    const expected = new Map<number, any>();
    const actual = new Map<number, any>();

    const version = await provider.getVersion(2);
    const files = Array.from(archive.getFiles().values()).slice(0, 100);

    for (const file of files) {
        const c2Reader = new cache2.Reader(file.data, version as any);
        const exp = cache2.NPC.decode(c2Reader, file.id as any);
        expected.set(file.id, { ...exp, params: Object.fromEntries(exp.params) });

        const ourReader = new (await import("../cache/Reader")).Reader(file.data, version);
        const act = NPC.decode(ourReader, file.id as any);
        actual.set(file.id, { ...act, params: Object.fromEntries(act.params) });
    }

    AlignmentTester.compare("NPCs", expected, actual);
  }, 30000);

  it("should align Object definitions", async () => {
    const archive = await provider.getArchive(2, 6);
    if (!archive) throw new Error("Object archive not found");

    const expected = new Map<number, any>();
    const actual = new Map<number, any>();

    const version = await provider.getVersion(2);
    const files = Array.from(archive.getFiles().values()).slice(0, 100);

    for (const file of files) {
        const c2Reader = new cache2.Reader(file.data, version as any);
        const exp = cache2.Obj.decode(c2Reader, file.id as any);
        expected.set(file.id, { ...exp, params: Object.fromEntries(exp.params) });

        const ourReader = new (await import("../cache/Reader")).Reader(file.data, version);
        const act = Obj.decode(ourReader, file.id as any);
        actual.set(file.id, { ...act, params: Object.fromEntries(act.params) });
    }

    AlignmentTester.compare("Objects", expected, actual);
  }, 30000);
});
