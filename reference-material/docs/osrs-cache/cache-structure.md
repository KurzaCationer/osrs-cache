---
name: OSRS Cache Structure
description: Detailed mapping of OSRS cache indices, archives, and asset types, including counting methodologies.
---

# OSRS Cache Structure

This document provides a comprehensive mapping of asset categories to the OSRS cache structure and details how their counts are derived.

## Counting Methodology

Assets in the OSRS cache are primarily organized in two ways:

1.  **Per-Archive Assets (Index-based count):**
    These assets are stored with one asset per archive. The total count is the number of archives present in the index.
    *   **Count Source:** Number of archives in the specific Index (read from Index 255, Group `<index_id>`).

2.  **Per-File Assets (Archive-based count):**
    These assets are stored as multiple files within a single archive. The total count is the number of files within that specific archive.
    *   **Count Source:** Number of files in Index 2, Archive `<archive_id>`.

## Asset Mapping Table

| Asset Type | Index | Archive (if applicable) | Counting Method | cache2 Loader |
| :--- | :--- | :--- | :--- | :--- |
| **Underlays** | 2 | 1 | Per-File | Underlay |
| **Identikits** | 2 | 3 | Per-File | - (KitID) |
| **Overlays** | 2 | 4 | Per-File | - |
| **Objects** | 2 | 6 | Per-File | Obj |
| **Enums** | 2 | 8 | Per-File | Enum |
| **NPCs** | 2 | 9 | Per-File | NPC |
| **Items** | 2 | 10 | Per-File | Item |
| **Params** | 2 | 11 | Per-File | Param |
| **Animations** | 2 | 12 | Per-File | Animation |
| **SpotAnims** | 2 | 13 | Per-File | - |
| **Inventories** | 2 | 14 | Per-File | - |
| **Hitsplats** | 2 | 32 | Per-File | Hitsplat |
| **Health Bars** | 2 | 33 | Per-File | HealthBar |
| **Structs** | 2 | 34 | Per-File | Struct |
| **DBRows** | 2 | 38 | Per-File | DBRow |
| **DBTables** | 2 | 39 | Per-File | - |
| **Varbits** | 2 | 69 | Per-File | - (VarbitID) |
| **World Entities**| 2 | 72 | Per-File | WorldEntity |
| **Maps** | 5 | - | Per-Archive | - |
| **Models** | 7 | - | Per-Archive | - |
| **Sprites** | 8 | - | Per-Archive | Sprite |
| **Textures** | 9 | - | Per-Archive | - (TextureID) |
| **Fonts** | 13 | - | Per-Archive | - (FontID) |
| **DBTableIndex** | 21 | - | Per-Archive | - |
| **GameVal** | 24 | - | Per-Archive | GameVal |

## Implementation Strategy for Loader

To accurately report these counts without downloading the entire cache:

1.  Fetch the **Master Index (Index 255)** for the target cache.
2.  Parse the group descriptors for the relevant indices (e.g., 2, 5, 7, 8).
3.  For Index 2, fetch the **Index 2 Descriptor** (Index 255, Group 2) to see how many files are in each archive (6, 9, 10, etc.).
4.  For Indices 5, 7, 8, etc., the archive count in their respective descriptors (Index 255, Group `<id>`) provides the total asset count.
