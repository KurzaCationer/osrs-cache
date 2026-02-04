# Asset Mapping Research

Based on the `cache2` source code, here is how asset categories map to the OSRS cache structure and how their counts should be derived.

## Counting Methodology

1.  **Per-Archive Assets (Index-based count):**
    These assets are stored with one asset per archive. The total count is the number of archives present in the index.
    *   **Count Source:** Number of archives in the specific Index (read from Index 255, Group <index_id>).

2.  **Per-File Assets (Archive-based count):**
    These assets are stored as multiple files within a single archive. The total count is the number of files within that specific archive.
    *   **Count Source:** Number of files in Index 2, Archive <archive_id>.

## Mapping Table

| Category | Index | Archive (if applicable) | Counting Method |
| :--- | :--- | :--- | :--- |
| **Underlays** | 2 | 1 | Per-File |
| **Identikit** | 2 | 3 | Per-File |
| **Overlays** | 2 | 4 | Per-File |
| **Objects** | 2 | 6 | Per-File |
| **Enums** | 2 | 8 | Per-File |
| **NPCs** | 2 | 9 | Per-File |
| **Items** | 2 | 10 | Per-File |
| **Params** | 2 | 11 | Per-File |
| **Animations** | 2 | 12 | Per-File |
| **Hitsplats** | 2 | 32 | Per-File |
| **Health Bars** | 2 | 33 | Per-File |
| **Structs** | 2 | 34 | Per-File |
| **DBRows** | 2 | 38 | Per-File |
| **Maps** | 5 | N/A | Per-Archive |
| **Models** | 7 | N/A | Per-Archive |
| **Sprites** | 8 | N/A | Per-Archive |

## Implementation Strategy for Loader

To accurately report these counts without downloading the entire cache:
1.  Fetch the **Master Index (Index 255)** for the target cache.
2.  Parse the group descriptors for the relevant indices (2, 5, 7, 8).
3.  For Index 2, fetch the **Index 2 Descriptor** (Index 255, Group 2) to see how many files are in each archive (6, 9, 10, etc.).
4.  For Indices 5, 7, and 8, the archive count in their respective descriptors (Index 255, Group 5/7/8) provides the total asset count.
