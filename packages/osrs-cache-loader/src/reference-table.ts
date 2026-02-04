import { Reader } from "./reader";

export class FileReference {
  constructor(public id: number, public nameHash = -1) {}
}

export class ArchiveReference {
  public files: Map<number, FileReference> = new Map();
  public maxFileId = -1;

  constructor(
    public id: number,
    public nameHash = -1,
    public crc = 0,
    public revision = 0,
  ) {}

  addFile(id: number, nameHash = -1) {
    this.files.set(id, new FileReference(id, nameHash));
    this.maxFileId = Math.max(this.maxFileId, id);
  }
}

export class ReferenceTable {
  public protocol = 0;
  public revision = 0;
  public named = false;
  public archives: Map<number, ArchiveReference> = new Map();
  public maxArchiveId = -1;

  static decode(data: ArrayBuffer | Uint8Array): ReferenceTable {
    const reader = new Reader(data);
    const table = new ReferenceTable();

    table.protocol = reader.u8();
    if (table.protocol < 5 || table.protocol > 7) {
      throw new Error(`Unsupported Reference Table protocol: ${table.protocol}`);
    }

    if (table.protocol >= 6) {
      table.revision = reader.u32();
    }

    const flags = reader.u8();
    table.named = (flags & 0x01) !== 0;
    const usesWhirlpool = (flags & 0x02) !== 0;
    const unknownFlag4 = (flags & 0x04) !== 0;
    const unknownFlag8 = (flags & 0x08) !== 0;

    const archiveCount = table.protocol >= 7 ? reader.smart32() : reader.u16();

    const archiveIds = new Array(archiveCount);
    let lastArchiveId = 0;
    for (let i = 0; i < archiveCount; i++) {
      lastArchiveId += table.protocol >= 7 ? reader.smart32() : reader.u16();
      archiveIds[i] = lastArchiveId;
      table.archives.set(archiveIds[i], new ArchiveReference(archiveIds[i]));
    }
    table.maxArchiveId = lastArchiveId;

    if (table.named) {
      for (let i = 0; i < archiveCount; i++) {
        table.archives.get(archiveIds[i])!.nameHash = reader.i32();
      }
    }

    for (let i = 0; i < archiveCount; i++) {
      table.archives.get(archiveIds[i])!.crc = reader.i32();
    }

    if (unknownFlag8) {
      // Extra 4 bytes per archive
      for (let i = 0; i < archiveCount; i++) {
        reader.u32();
      }
    }

    if (usesWhirlpool) {
      for (let i = 0; i < archiveCount; i++) {
        reader.bytes(64);
      }
    }

    if (unknownFlag4) {
      // Extra 4 bytes per archive
      for (let i = 0; i < archiveCount; i++) {
        reader.u32();
        reader.u32();
      }
    }

    for (let i = 0; i < archiveCount; i++) {
      table.archives.get(archiveIds[i])!.revision = reader.i32();
    }

    const fileCounts = new Array(archiveCount);
    for (let i = 0; i < archiveCount; i++) {
      fileCounts[i] = table.protocol >= 7 ? reader.smart32() : reader.u16();
    }

    for (let i = 0; i < archiveCount; i++) {
      const archiveId = archiveIds[i];
      const archive = table.archives.get(archiveId)!;
      const fileCount = fileCounts[i];
      let lastFileId = 0;
      for (let j = 0; j < fileCount; j++) {
        lastFileId += table.protocol >= 7 ? reader.smart32() : reader.u16();
        archive.addFile(lastFileId);
      }
    }

    if (table.named) {
      for (let i = 0; i < archiveCount; i++) {
        const archiveId = archiveIds[i];
        const archive = table.archives.get(archiveId)!;
        for (const fileId of Array.from(archive.files.keys())) {
          archive.files.get(fileId)!.nameHash = reader.i32();
        }
      }
    }

    return table;
  }
}