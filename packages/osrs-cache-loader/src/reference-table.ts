import { Reader } from './reader'
import type {
  ArchiveReference as IArchiveReference,
  FileReference as IFileReference,
} from './types'

/**
 * Represents a reference to a file within an archive.
 */
export class FileReference implements IFileReference {
  /**
   * Creates a new FileReference.
   * @param id The file ID.
   * @param nameHash The name hash of the file.
   */
  constructor(
    public id: number,
    public nameHash = -1,
  ) {}
}

/**
 * Represents a reference to an archive within an index.
 */
export class ArchiveReference implements IArchiveReference {
  /** Map of file IDs to their references. */
  public files: Map<number, FileReference> = new Map()
  /** The maximum file ID present in this archive. */
  public maxFileId = -1

  /**
   * Creates a new ArchiveReference.
   * @param id The archive ID.
   * @param nameHash The name hash of the archive.
   * @param crc The CRC32 checksum.
   * @param revision The revision number.
   */
  constructor(
    public id: number,
    public nameHash = -1,
    public crc = 0,
    public revision = 0,
  ) {}

  /**
   * Adds a file reference to this archive.
   * @param id The file ID.
   * @param nameHash The name hash of the file.
   */
  addFile(id: number, nameHash = -1) {
    this.files.set(id, new FileReference(id, nameHash))
    this.maxFileId = Math.max(this.maxFileId, id)
  }
}

/**
 * Flags used in the OSRS Reference Table.
 */
enum ReferenceTableFlags {
  /** Archives and files are indexed by name hash. */
  NAMED = 0x01,
  /** Archives include Whirlpool hashes (for data integrity). */
  USES_WHIRLPOOL = 0x02,
  /** Extra 8 bytes of data per archive (purpose unknown). */
  UNKNOWN_4 = 0x04,
  /** Extra 4 bytes of data per archive (purpose unknown). */
  UNKNOWN_8 = 0x08,
}

/**
 * Represents a reference table for a cache index.
 */
export class ReferenceTable {
  /** The protocol version of the reference table. */
  public protocol = 0
  /** The revision of the reference table. */
  public revision = 0
  /** Whether the archives and files are named. */
  public named = false
  /** Map of archive IDs to their references. */
  public archives: Map<number, ArchiveReference> = new Map()
  /** The maximum archive ID present in this index. */
  public maxArchiveId = -1

  /**
   * Decodes a raw reference table buffer.
   * @param data The raw buffer data.
   * @returns The decoded ReferenceTable.
   * @throws Error if the protocol version is unsupported.
   */
  static decode(data: ArrayBuffer | Uint8Array): ReferenceTable {
    const reader = new Reader(data)
    const table = new ReferenceTable()

    table.protocol = reader.u8()
    if (table.protocol < 5 || table.protocol > 7) {
      throw new Error(`Unsupported Reference Table protocol: ${table.protocol}`)
    }

    if (table.protocol >= 6) {
      table.revision = reader.u32()
    }

    const flags = reader.u8()
    table.named = (flags & ReferenceTableFlags.NAMED) !== 0
    const usesWhirlpool = (flags & ReferenceTableFlags.USES_WHIRLPOOL) !== 0
    const hasUnknownFlag4 = (flags & ReferenceTableFlags.UNKNOWN_4) !== 0
    const hasUnknownFlag8 = (flags & ReferenceTableFlags.UNKNOWN_8) !== 0

    const archiveCount = table.protocol >= 7 ? reader.bigSmart() : reader.u16()

    const archiveIds = new Array(archiveCount)
    let lastArchiveId = 0
    for (let i = 0; i < archiveCount; i++) {
      lastArchiveId += table.protocol >= 7 ? reader.bigSmart() : reader.u16()
      archiveIds[i] = lastArchiveId
      table.archives.set(archiveIds[i], new ArchiveReference(archiveIds[i]))
    }
    table.maxArchiveId = lastArchiveId

    // Load Archive Name Hashes
    if (table.named) {
      for (let i = 0; i < archiveCount; i++) {
        table.archives.get(archiveIds[i])!.nameHash = reader.i32()
      }
    }

    // Load Archive CRCs
    for (let i = 0; i < archiveCount; i++) {
      table.archives.get(archiveIds[i])!.crc = reader.i32()
    }

    // Load Extra/Unknown Data
    if (hasUnknownFlag8) {
      for (let i = 0; i < archiveCount; i++) {
        reader.u32()
      }
    }

    // Load Whirlpool Hashes
    if (usesWhirlpool) {
      for (let i = 0; i < archiveCount; i++) {
        reader.bytes(64)
      }
    }

    // Load Extra/Unknown Data
    if (hasUnknownFlag4) {
      for (let i = 0; i < archiveCount; i++) {
        reader.u32()
        reader.u32()
      }
    }

    // Load Archive Revisions
    for (let i = 0; i < archiveCount; i++) {
      table.archives.get(archiveIds[i])!.revision = reader.i32()
    }

    // Load File Counts
    const fileCounts = new Array(archiveCount)
    for (let i = 0; i < archiveCount; i++) {
      fileCounts[i] = table.protocol >= 7 ? reader.bigSmart() : reader.u16()
    }

    // Load File IDs
    for (let i = 0; i < archiveCount; i++) {
      const archiveId = archiveIds[i]
      const archive = table.archives.get(archiveId)!
      const fileCount = fileCounts[i]
      let lastFileId = 0
      for (let j = 0; j < fileCount; j++) {
        lastFileId += table.protocol >= 7 ? reader.bigSmart() : reader.u16()
        archive.addFile(lastFileId)
      }
    }

    // Load File Name Hashes
    if (table.named) {
      for (let i = 0; i < archiveCount; i++) {
        const archiveId = archiveIds[i]
        const archive = table.archives.get(archiveId)!
        for (const fileId of Array.from(archive.files.keys())) {
          archive.files.get(fileId)!.nameHash = reader.i32()
        }
      }
    }

    return table
  }
}
