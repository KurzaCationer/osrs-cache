import { describe, expect, it } from "vitest";
import { Item, NPC, Obj } from "@abextm/cache2";
import { OpenRS2Client } from "./openrs2-client";
import { ReferenceTable } from "./reference-table";
import { decompress } from "./compression";
import { Cache } from "./index";
import type { CacheProvider, CacheVersion, IndexData, ArchiveData as Cache2ArchiveData } from "@abextm/cache2";
import { ArchiveData } from "@abextm/cache2";

class OpenRS2CacheProvider implements CacheProvider {
  private tables = new Map<number, ReferenceTable>();
  private archives = new Map<number, Map<number, Cache2ArchiveData>>();

  constructor(
    private client: OpenRS2Client,
    private scope: string,
    private id: number,
  ) {}

  async getIndex(index: number): Promise<IndexData | undefined> {
    if (!this.tables.has(index)) {
      const rawData = await this.client.getGroup(this.scope, this.id, 255, index);
      const decompressed = decompress(new Uint8Array(rawData));
      const table = ReferenceTable.decode(decompressed);
      this.tables.set(index, table);
      
      const indexArchives = new Map<number, Cache2ArchiveData>();
      for (const [archiveId, ref] of table.archives) {
        const ad = new ArchiveData(index, archiveId);
        ad.crc = ref.crc;
        ad.revision = ref.revision;
        ad.namehash = ref.nameHash;
        for (const file of ref.files.values()) {
          // @ts-ignore - addFile is internal but we need it
          ad.addFile(file.id, file.nameHash);
        }
        indexArchives.set(archiveId, ad);
      }
      this.archives.set(index, indexArchives);
    }
    
    const table = this.tables.get(index)!;
    return {
      id: index,
      revision: table.revision,
      crc: 0,
      named: table.named,
    };
  }

  async getArchive(index: number, archive: number): Promise<Cache2ArchiveData | undefined> {
    await this.getIndex(index);
    const ad = this.archives.get(index)?.get(archive);
    if (!ad) return undefined;
    
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!ad.compressedData) {
      try {
        const buffer = await this.client.getGroup(this.scope, this.id, index, archive);
        ad.compressedData = new Uint8Array(buffer);
      } catch {
        return undefined;
      }
    }
    return ad;
  }

  getArchiveByName(index: number, name: string | number): Cache2ArchiveData | undefined {
    return undefined;
  }

  async getArchives(index: number): Promise<Array<number> | undefined> {
    await this.getIndex(index);
    return Array.from(this.archives.get(index)!.keys());
  }

  async getVersion(index: number): Promise<CacheVersion> {
    const table = await this.getIndex(index);
    return { era: "osrs", indexRevision: table?.revision ?? 0 };
  }
}

describe("Cache content comparison with cache2", () => {
  it("should match Item definitions with cache2", async () => {
    const client = new OpenRS2Client();
    const latest = await client.getLatestCache("oldschool");
    const provider = new OpenRS2CacheProvider(client, latest.scope, latest.id);
    const ourCache = await Cache.load({ game: "oldschool" });

    // Sample items to compare
    const sampleIds = [0, 4151, 1042, 20997, 11802]; // Tool Leprechaun (as item?), Whip, Blue Partyhat, Twisted Bow, AGS
    
    const ourItems = await ourCache.getAssets('item');
    
    for (const id of sampleIds) {
      const ours = ourItems.find(i => i.id === id);
      const theirs = await Item.load(provider, id);
      
      if (!theirs) {
        expect(ours).toBeUndefined();
        continue;
      }

      expect(ours, `Item ${id} mismatch`).toBeDefined();
      expect(ours.name).toBe(theirs.name);
      expect(ours.price).toBe(theirs.price);
      expect(ours.isStackable).toBe(theirs.isStackable);
      expect(ours.isMembers).toBe(theirs.isMembers);
      expect(ours.inventoryModel).toBe(theirs.inventoryModel);
    }
  }, 120000);

  it("should match NPC definitions with cache2", async () => {
    const client = new OpenRS2Client();
    const latest = await client.getLatestCache("oldschool");
    const provider = new OpenRS2CacheProvider(client, latest.scope, latest.id);
    const ourCache = await Cache.load({ game: "oldschool" });

    const sampleIds = [0, 1, 2, 2042, 3127]; // Tool Leprechaun, Molanisk, Aberrant Spectre, Zulrah, Jad
    
    const ourNpcs = await ourCache.getAssets('npc');
    
    for (const id of sampleIds) {
      const ours = ourNpcs.find(n => n.id === id);
      const theirs = await NPC.load(provider, id);
      
      if (!theirs) {
        expect(ours).toBeUndefined();
        continue;
      }

      expect(ours, `NPC ${id} mismatch`).toBeDefined();
      expect(ours.name).toBe(theirs.name);
      expect(ours.combatLevel).toBe(theirs.combatLevel);
      expect(ours.size).toBe(theirs.size);
      expect(ours.standingAnimation).toBe(theirs.standingAnimation);
      expect(ours.walkingAnimation).toBe(theirs.walkingAnimation);
      expect(ours.category).toBe(theirs.category);
      expect(Array.from(ours.models)).toEqual(Array.from(theirs.models));
      expect(ours.isVisible).toBe(theirs.isVisible);
      
      // Compare actions
      for (let i = 0; i < 5; i++) {
        expect(ours.actions[i]).toBe(theirs.actions[i] === 'Hidden' ? null : theirs.actions[i]);
      }
    }
  }, 120000);

  it("should match Object definitions with cache2", async () => {
    const client = new OpenRS2Client();
    const latest = await client.getLatestCache("oldschool");
    const provider = new OpenRS2CacheProvider(client, latest.scope, latest.id);
    const ourCache = await Cache.load({ game: "oldschool" });

    const sampleIds = [1, 10, 15, 3192]; // Crate, Lever, Gate, etc.
    
    const ourObjs = await ourCache.getAssets('obj');
    
    for (const id of sampleIds) {
      const ours = ourObjs.find(o => o.id === id);
      const theirs = await Obj.load(provider, id);
      
      if (!theirs) {
        expect(ours).toBeUndefined();
        continue;
      }

      expect(ours, `Object ${id} mismatch`).toBeDefined();
      expect(ours.name).toBe(theirs.name);
      if (theirs.models) {
        expect(ours.models).toEqual(theirs.models);
      } else {
        expect(ours.models).toEqual([]);
      }
      expect(ours.isSolid).toBe(theirs.clipType !== 0); // isSolid was defaulted to true, clipType 0 means not solid
      expect(ours.isInteractable).toBe(theirs.actions.some(a => a !== null));
      
      for (let i = 0; i < 5; i++) {
        expect(ours.actions[i]).toBe(theirs.actions[i]);
      }
    }
  }, 120000);
});
