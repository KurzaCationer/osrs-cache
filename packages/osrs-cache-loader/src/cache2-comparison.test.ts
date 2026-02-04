import { describe, expect, it } from "vitest";
import { Animation, ArchiveData, DBRow, Enum, HealthBar, Hitsplat, Item, NPC, Obj, Param, Struct, Underlay } from "@abextm/cache2";
import { OpenRS2Client } from "./openrs2-client";

import { ReferenceTable } from "./reference-table";
import { decompress } from "./compression";
import { Cache } from "./index";
import type { CacheProvider, CacheVersion, IndexData } from "@abextm/cache2";

class OpenRS2CacheProvider implements CacheProvider {
  private tables = new Map<number, ReferenceTable>();
  private archives = new Map<number, Map<number, ArchiveData>>();

  constructor(
    private client: OpenRS2Client,
    private scope: string,
    private id: number,
  ) {}

  async getIndex(index: number): Promise<IndexData | undefined> {
    if (!this.tables.has(index)) {
      const rawData = await this.client.getArchiveMetadata(this.scope, this.id, index);
      const decompressed = decompress(new Uint8Array(rawData));
      const table = ReferenceTable.decode(decompressed);
      this.tables.set(index, table);
      
      const indexArchives = new Map<number, ArchiveData>();
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

  async getArchive(index: number, archive: number): Promise<ArchiveData | undefined> {
    await this.getIndex(index);
    const ad = this.archives.get(index)?.get(archive);
    if (!ad) return undefined;
    
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!ad.compressedData) {
      const url = `https://archive.openrs2.org/caches/${this.scope}/${this.id}/archives/${index}/groups/${archive}.dat`;
      const response = await fetch(url);
      if (!response.ok) return undefined;
      ad.compressedData = new Uint8Array(await response.arrayBuffer());
    }
    return ad;
  }

  getArchiveByName(index: number, name: string | number): ArchiveData | undefined { // eslint-disable-line @typescript-eslint/no-unused-vars
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

describe("Cache counts comparison with cache2", () => {
  it("should match all asset counts with cache2", async () => {
    const client = new OpenRS2Client();
    const latest = await client.getLatestCache("oldschool");
    
    const ourCache = await Cache.load({ game: "oldschool" });
    const ourCounts = await ourCache.getAssetCounts();

    // Debug Structs (Index 2, Archive 34)
    // @ts-ignore - accessing private tables for debug
    const structRef = ourCache.tables.get(2)?.archives.get(34);
    if (structRef) {
      const ids = Array.from(structRef.files.keys()).sort((a, b) => a - b);
      console.log(`Structs Debug: Count=${structRef.files.size}, MaxID=${structRef.maxFileId}, First 5 IDs=${ids.slice(0, 5)}, Last 5 IDs=${ids.slice(-5)}`);
    }

    const provider = new OpenRS2CacheProvider(client, latest.scope, latest.id);

    const getCache2FileCount = async (index: number, archive: number) => {
      const ad = await provider.getArchive(index, archive);
      return ad?.getFiles().size ?? 0;
    };

    const getCache2ArchiveCount = async (index: number) => {
      const archives = await provider.getArchives(index);
      return archives?.length ?? 0;
    };

    const cache2Counts = {
      items: (await Item.all(provider)).length,
      npcs: (await NPC.all(provider)).length,
      objects: (await Obj.all(provider)).length,
      maps: await getCache2ArchiveCount(5),
      animations: (await Animation.all(provider)).length,
      enums: (await Enum.all(provider)).length,
      sprites: await getCache2ArchiveCount(8),
      models: await getCache2ArchiveCount(7),
      structs: (await Struct.all(provider)).length,
      underlays: (await Underlay.all(provider)).length,
      overlays: await getCache2FileCount(2, 4),
      identikits: await getCache2FileCount(2, 3),
      params: (await Param.all(provider)).length,
      hitsplats: (await Hitsplat.all(provider)).length,
      healthBars: (await HealthBar.all(provider)).length,
      dbRows: (await DBRow.all(provider)).length,
    };

    console.log("Comparison Results:", {
      category: "Category",
      ours: "Ours",
      cache2: "Cache2"
    });
    for (const key of Object.keys(ourCounts)) {
      console.log({
        category: key,
        ours: ourCounts[key as keyof typeof ourCounts],
        cache2: cache2Counts[key as keyof typeof cache2Counts]
      });
    }

    expect(ourCounts).toEqual(cache2Counts);
  }, 120000); // 120s timeout for full comparison
});