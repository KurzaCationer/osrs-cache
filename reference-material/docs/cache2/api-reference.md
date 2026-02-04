---
title: Cache2 API Reference
description: Documentation for the @abextm/cache2 library for reading OSRS caches.
source: https://github.com/abextm/cache2
---

# @abextm/cache2

`cache2` is a TypeScript library for reading Old School RuneScape (OSRS) cache files. It supports both Disk (DAT2) and FlatCache formats.

## Installation

```bash
pnpm add @abextm/cache2
```

## Basic Usage (Node.js)

To load a cache from a local directory in Node.js:

```typescript
import { loadCache, Item } from '@abextm/cache2/node';

async function example() {
    const cache = await loadCache('./path/to/cache');
    
    // Load a single item by ID
    const twistedBow = await Item.load(cache, 20997);
    console.log(twistedBow?.name); // "Twisted bow"

    // Load all items
    const allItems = await Item.all(cache);
    console.log(`Loaded ${allItems.length} items`);
}
```

## Core Concepts

### CacheProvider

The `CacheProvider` is the main interface for interacting with the cache. It provides methods to retrieve indices and archives.

- `getIndex(index: number)`: Returns metadata about an index.
- `getArchive(index: number, archive: number)`: Returns `ArchiveData`.
- `getArchiveByName(index: number, name: string | number)`: Returns `ArchiveData` by name hash.
- `getArchives(index: number)`: Returns a list of archive IDs in an index.
- `getVersion(index: number)`: Returns the cache version/revision.

### Reader

The `Reader` class is a wrapper around `DataView` providing helper methods for reading OSRS-specific data types.

- `u8()`, `u16()`, `u24()`, `i32()`: Standard unsigned/signed integers.
- `u8o16()`: OSRS Smart (unsigned byte or short).
- `u32o16()`: OSRS BigSmart (unsigned short or int).
- `string()`: Null-terminated CP1252 string.
- `params()`: Decodes a parameter map.

### Loadable

Most data structures in `cache2` extend the `Loadable` class, which provides standardized loading logic.

- `PerFileLoadable`: For configs stored as multiple files within a single archive (e.g., Items, NPCs).
- `PerArchiveLoadable`: For configs where each ID is its own archive (e.g., Animations).
- `NamedPerArchiveLoadable`: For archives that can be looked up by name (e.g., Sprites).

## Data Loaders

The library includes loaders for various OSRS data types. Each loader has a `load(cache, id)` and `all(cache)` static method.

| Loader | Index | Archive | Description |
| :--- | :--- | :--- | :--- |
| `Item` | 2 | 10 | Item configurations |
| `NPC` | 2 | 9 | NPC configurations |
| `Obj` | 2 | 6 | Object (scenery) configurations |
| `Enum` | 2 | 8 | Key-value mappings |
| `Struct` | 2 | 34 | Structured data |
| `Param` | 2 | 11 | Parameter definitions |
| `Sprite` | 8 | - | Sprite images (Named) |
| `Animation` | 2 | 12 | Animation sequences |
| `HealthBar` | 2 | 33 | Health bar configs |
| `Hitsplat` | 2 | 32 | Hitsplat configs |
| `Underlay` | 2 | 1 | Map underlay configs |
| `DBRow` | 2 | 38 | Database row configs |
| `WorldEntity` | 2 | 72 | World entity (dynamic object) configs |
| `GameVal` | 24 | - | Game value configs |

### Example: Loading NPCs

```typescript
import { NPC } from '@abextm/cache2';

const zulrah = await NPC.load(cache, 2042);
console.log(zulrah?.name); // "Zulrah"
console.log(zulrah?.actions); // [ 'Examine', null, null, null, null ]
```

### Example: Loading Sprites

Sprites are often looked up by name hash.

```typescript
import { Sprites } from '@abextm/cache2';

// Load the logo sprite by name
const logo = await Sprites.loadByName(cache, "logo");
if (logo) {
    const imageData = logo.sprites[0].asImageData();
    // Use imageData in a canvas or save as PNG
}
```

### Example: Using Enums

Enums provide key-value lookups, often used for mapping item IDs to names or other properties.

```typescript
import { Enum } from '@abextm/cache2';

const itemEnum = await Enum.load(cache, 10);
if (itemEnum) {
    const value = itemEnum.get(4151); // Get value for Abyssal Whip
    console.log(value);
}
```

## Decryption

Some archives in the OSRS cache (especially maps) are encrypted using XTEA. `cache2` provides an `XTEAKeyManager` to handle decryption.

```typescript
import { XTEAKeyManager } from '@abextm/cache2';

const keys = new XTEAKeyManager();
// Load keys from a JSON object (compatible with OpenRS2, RuneLite, etc.)
keys.loadKeys(xteaJson);

const archive = await cache.getArchive(5, 123);
if (archive) {
    const error = keys.tryDecrypt(archive);
    if (!error) {
        const data = archive.getFiles();
        // Archive is now decrypted and files are accessible
    }
}
```

## Type Definitions

`cache2` uses "NewTypes" (branded types) to provide type safety for IDs.

- `ItemID`, `NPCID`, `ObjID`, `SpriteID`, etc.
- `HSL`, `RGB` for colors.
- `WearPos` for equipment slots.

```typescript
import { ItemID, WearPos } from '@abextm/cache2';

const id = 4151 as ItemID;
console.log(WearPos.Weapon); // 3
```

## Implementation Deep Dive

This section details the internal logic of `cache2`, useful if you are building your own implementation based on this library.

### Archive Data Structure

An OSRS archive consists of a container with metadata, followed by compressed and potentially encrypted data.

1.  **Header (5 bytes):**
    -   Byte 0: Compression Type (`0` = None, `1` = BZ2, `2` = GZIP).
    -   Bytes 1-4: Compressed Size (Int32).
2.  **Payload:**
    -   The compressed data.
    -   If compressed, followed by 4 bytes of Decompressed Size (Int32).
3.  **Revision (Optional, 2 bytes):**
    -   The version of the archive.

### Decryption & Decompression Pipeline

The `ArchiveData.getDecryptedData()` method follows this sequence:

1.  **Extract Crypted Blob:** Identifies the encrypted portion of the payload (the payload minus the 5-byte header).
2.  **XTEA Decrypt:** If a key is provided, decrypts the blob using the XTEA algorithm.
3.  **Decompress:**
    -   **BZ2:** Note that OSRS BZ2 headers are missing the "BZh" signature. `cache2` prepends it or handles the raw stream.
    -   **GZIP:** Standard gunzip.
4.  **Extract Files:** If the archive contains multiple files, it uses the **Archive Footer** logic.

### Archive Footer & Chunking

When an archive contains multiple files, the files are concatenated, and a footer is appended to the end of the decompressed data.

**Footer Structure:**
-   **Chunk Counts (1 byte):** The number of chunks each file is split into.
-   **Size Table:** `(numChunks * fileCount * 4)` bytes. Contains the size of each chunk for each file as Int32 values.

**Extraction Logic:**
1.  Read `numChunks` from the last byte.
2.  Calculate the start of the size table: `offset = totalLength - 1 - (numChunks * fileCount * 4)`.
3.  Iterate through chunks and files to reassemble the `Uint8Array` for each file.

### Name Hashing

OSRS uses a custom hashing algorithm for strings (e.g., for archive names):

```typescript
function hash(name: string): number {
    let bytes = new TextEncoder().encode(name);
    let h = 0;
    for (let v of bytes) {
        h = ~~((31 * h) + (v & 0xFF));
    }
    return h;
}
```

### Reader Helper Methods

If implementing your own `Reader`, ensure you support these OSRS-specific types:

-   **Smart (u8o16):**
    -   If first byte < 128: Return 1 byte.
    -   Else: Return 2 bytes (big-endian) minus 0x8000.
-   **BigSmart (u32o16):**
    -   If first byte has 0x80 bit set: Return 4 bytes (big-endian) AND 0x7FFFFFFF.
    -   Else: Return 2 bytes.

